var editTodoId = ''
var deleteTodoId = ''
var showTipsYoutube = ''
var statusTodo = ''
var userId = ''

function onSignIn(googleUser) {
  const idToken = googleUser.getAuthResponse().id_token;
  $.ajax({
    url: `http://localhost:3333/users/loginGoogle`,
    method: `POST`,
    headers: {
      token: idToken
    }
  })
    .done(function (response) {
      localStorage.setItem('token', response.token)
      todoList()
      $("#col-todo-append").show()
      $("#add-form").show()
      $("#register-form").hide()
      $("#login-form").hide()
      $('#register').hide()
      $('#login').hide()
      $('#logout').show()
    })
    .fail(function (jqXHR, textStatus) {
      console.log(jqXHR.responseText, '====');
    })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token')
    }
  });
}

function signUpUser(email, password) {
  $.ajax({
    url: `http://localhost:3333/users/register`,
    method: `POST`,
    data: { email, password }
  })
    .done(function (response) {
      console.log(response);
      $("#register-form").hide()
      $("#login-form").show()

    })
    .fail(function (jqXHR, textStatus) {
      console.log(textStatus);
    })
}

function signin(email, password) {
  $.ajax({
    url: `http://localhost:3333/users/login`,
    method: `POST`,
    data: { email, password }
  })
    .done(function (response) {
      console.log(response);
      localStorage.setItem('token', response.token)
      todoList()
      $("#col-todo-append").show()
      $("#add-form").show()
      $("#register-form").hide()
      $("#login-form").hide()
      $('#register').hide()
      $('#login').hide()
      $('#logout').show()
    })
    .fail(function (jqXHR, textStatus) {
      console.log(jqXHR.responseText);
    })
}

function todoList() {
  $.ajax({
    url: `http://localhost:3333/todos`,
    method: `GET`,
    headers: { token: localStorage.getItem('token') }
  })
    .done(function (response) {
      response.forEach(el => {

        if (el.status === "false") {
          console.log('---ini false----')
          $('#col-todo-append').append(`
          <br>
          <div class="card">  
          <div class="card-header bg-danger">
          <h5 class="card-title">${el.name}</h5>
          </div>
  
            <div class="card-body" >
            <p class="card-text"> ${el.description} </p>
            <p class="card-text"><small class="text-muted">Deadline is  ${new Date(el.dueDate).toLocaleDateString()}</small></p>
            <button id="edit-${el._id}"  type="submit" class="btn btn-primary">Edit</button>
            <button id="delete-${el._id}" type="submit" class="btn btn-primary">Delete</button>
            <button id="showTips-${el._id}" type="submit" class="btn btn-primary">Show Tips</button>
            <button id="status-${el._id}" type="submit" class="btn btn-danger">UnFinish</button>
            </div>
           </div>`);
        } else {
          console.log('---ini true---')
          $('#col-todo-append').append(`
          <br>
          <div class="card">  
          <div class="card-header bg-success">
          <h5 class="card-title">${el.name}</h5>
          </div>
  
            <div class="card-body" >
            <p class="card-text"> ${el.description} </p>
            <p class="card-text"><small class="text-muted">Deadline is  ${new Date(el.dueDate).toLocaleDateString()}</small></p>
            <button id="edit-${el._id}"  type="submit" class="btn btn-primary">Edit</button>
            <button id="delete-${el._id}" type="submit" class="btn btn-primary">Delete</button>
            <button id="showTips-${el._id}" type="submit" class="btn btn-primary">Show Tips</button>
            <button id="status-${el._id}" type="submit" class="btn btn-success">Finish</button>
            </div>
           </div>`);
        }

        $(`#edit-${el._id}`).on('click', function () {
          $(`#title-todo`).empty()
          $(`#title-todo`).append(`<h2>Edit Todo</h2>`)
          $("#edit-button").show()
          $("#add-button").hide()
          editTodoId = el._id
          $('#add-TodoName-from').val(el.name)
          $('#add-TodoDescription-form').val(el.description)
          $("#player").hide()

          console.log(el._id)
        })

        $(`#delete-${el._id}`).on('click', function () {
          deleteTodoId = el._id
          $('#col-todo-append').empty()
          deleteTodo()
          console.log(el._id)
        })

        $(`#showTips-${el._id}`).on('click', function () {
          showTipsYoutube = el.name
          $('#player').show()
          showTips()
        })

        $(`#status-${el._id}`).on('click', function () {

          statusTodo = el._id
          editstatusTodo(el.status)
          $('#col-todo-append').empty()
        })
      });

      $("#register-form").hide()
      $("#login-form").hide()
      $('#register').hide()
      $('#login').hide()
      $('#logout').show()
    })
    .fail(function (err) {
      console.log(err)
    })

}

function addTodo(nameTodo, descriptionTodo, deadlineTodo, ) {
  $.ajax({
    url: `http://localhost:3333/todos`,
    method: 'POST',
    data: { name: nameTodo, description: descriptionTodo, dueDate: deadlineTodo },
    headers: { token: localStorage.getItem('token') }
  })
    .done((response) => {
      todoList()

      console.log(response);
    })
    .fail(function (jqXHR, textStatus) {
      console.log(textStatus);
    })
}

function editTodo(nameTodo, descriptionTodo, deadlineTodo) {
  $.ajax({
    url: `http://localhost:3333/todos/${editTodoId}`,
    method: 'PATCH',
    data: { name: nameTodo, description: descriptionTodo, dueDate: deadlineTodo },
    headers: { token: localStorage.getItem('token') }
  })
    .done((response) => {
      todoList()
      $("#edit-button").hide()
      $("#add-button").show()
      console.log(response);
    })
    .fail(function (jqXHR, textStatus) {
      console.log(textStatus);
    })
}

function editstatusTodo(data) {
  let newStatus = ''
  if (data === "true") {
    newStatus = 'false'
  } else {
    newStatus = 'true'
  }
  $.ajax({
    url: `http://localhost:3333/todos/${statusTodo}`,
    method: 'PATCH',
    data: { status: newStatus },
    headers: { token: localStorage.getItem('token') }
  })
    .done((response) => {
      todoList()
      console.log(response);
    })
    .fail(function (jqXHR, textStatus) {
      console.log(textStatus);
    })
}

function deleteTodo() {
  $.ajax({
    url: `http://localhost:3333/todos/${deleteTodoId}`,
    method: 'DELETE',
    headers: { token: localStorage.getItem('token') }
  })
    .done((response) => {
      todoList()
      console.log(response);
    })
    .fail(function (jqXHR, textStatus) {
      console.log(textStatus);
    })
}

//!show Tips
function showTips() {
  $.ajax({
    url: `http://localhost:3333/todos/showTips?title=${showTipsYoutube}`,
    method: 'GET',
    headers: { token: localStorage.getItem('token') }
  })
    .done((response) => {
      // todoList()
      $('#player').append(`
      <div class="text-center ">
      <h2 class="font-weight-bold">
        ${response.title}
      </h2>
    </div>
    <iframe width="650" height="400" src="https://www.youtube.com/embed/${response.url}">
    </iframe>`)
      console.log(response);
    })
    .fail(function (jqXHR, textStatus) {
      console.log(textStatus);
    })
}

function clearForm() {
  $('#add-TodoName-from').val('')
  $('#add-TodoDescription-form').val('')
}

$(document).ready(function () {
  $("#register-form").hide()
  $("#login-form").show()


  if (localStorage.getItem('token')) {
    $("#register-form").hide()
    $("#login-form").hide()
    $("#edit-button").hide()
    $('#register').hide()
    $('#login').hide()
    $('#logout').show()
    todoList()
  } else {
    $("#col-todo-append").hide()
    $("#add-form").hide()
    $('#logout').hide()
    $('#register').show()
    $('#login').show()
  }

  $("#register").on('click', function () {
    $("#login-form").hide()
    $("#register-form").show()
  })

  $("#login").on('click', function () {
    $("#register-form").hide()
    $("#login-form").show()
  })

  $(".goToSignIn").on('click', function () {
    $("#register-form").hide()
    $("#login-form").hide()

  })

  $("#logout").on('click', function () {
    localStorage.removeItem('token')
    signOut()
    $("#register-form").hide()
    $("#login-form").show()
    $("#col-todo-append").hide()
    $("#add-form").hide()
    $('#logout').hide()
    $('#register').show()
    $('#login').show()
  })

  $("#register-form").submit(function (e) {
    e.preventDefault()
    const emailUser = $("#register-form-email").val()
    const passwordUser = $("#register-form-password").val()

    signUpUser(emailUser, passwordUser)
  })

  $("#login-form").submit(function (e) {
    e.preventDefault()
    const emailUser = $("#login-form-email").val()
    const passwordUser = $("#login-form-password").val()

    signin(emailUser, passwordUser)
  })

  $('#add-button').on('click', function (e) {
    e.preventDefault()
    const addTodoName = $('#add-TodoName-from').val()
    const addTodoDescription = $('#add-TodoDescription-form').val()
    const deadlineTodo = $('#add-TodoDeadline-form').val()

    $('#col-todo-append').empty()
    clearForm()
    addTodo(addTodoName, addTodoDescription, deadlineTodo)
  })

  $('#edit-button').on('click', function (e) {
    e.preventDefault()
    const addTodoName = $('#add-TodoName-from').val()
    const addTodoDescription = $('#add-TodoDescription-form').val()
    const deadlineTodo = $('#add-TodoDeadline-form').val()
    $(`#title-todo`).empty()
    $(`#title-todo`).append(`<H4>Add Todo</H4>`)
    $('#col-todo-append').empty()
    clearForm()
    editTodo(addTodoName, addTodoDescription, deadlineTodo)

  })
})