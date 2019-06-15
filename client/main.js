// var signedInviaGoogle = false
// var ilang

// function showMessage(text, type) {
//   let message = ''
//   if(typeof text === 'object'){
//     for (const field in text) {
//       message += `<p id="message" class="mb-0">${text[field]}</p>`
//     }
//   }
//   else
//     message = `<p id="message" class="mb-0">${text}</p>`
//   let title = 'Success'
//   if(type == 'error')
//     title = 'Error'
//   $('#app').prepend(`
//     <div id="alert-box" class="alert alert-${type} alert-dismissible fade show" role="alert">
//       <h4 id="message-title" class="alert-heading">${title}</h4>
//       <hr>
//       ${message}
//       <button onclick="clearTimeout(ilang);" type="button" class="close" data-dismiss="alert" aria-label="Close">
//         <span aria-hidden="true">&times;</span>
//       </button>
//     </div>
//   `)
//   ilang = setTimeout(function() {
//     $(".alert").fadeTo(500, 0).slideUp(500, function(){
//         $(this).remove(); 
//     });
//   }, 4000);
// }

var baseURL = `http://localhost:3000`
// var baseURL = `http://35.198.211.20`

function showMessage(text, type) {
  let message = ''
  if (typeof text === 'object') {
    // let i = 1
    for (const field in text) {
      message += '- ' + text[field] + '\n'
    }
  }
  else
    message = text
  if (type == 'error') {
    Swal.fire({
      title: 'Error',
      text: message,
      type: type,
    })
  }
  else if (type == 'info') {
    Swal.fire({
      title: 'Before you continue...',
      text: message,
      type: type,
    })
  }
  else {
    Swal.fire({
      title: message,
      type: type,
      showConfirmButton: false,
      timer: 1500
    })
  }
  // Swal.fire({
  //   // position: 'top-end',
  //   type: type,
  //   title: message,
  //   // showConfirmButton: false,
  //   timer: 3000
  // })
}

// function dontRefresh() {
//   if ($('#filterByStatus').val()) {
//     searchTodos()
//   }
//   else getAllTodos()
// }

function emptyLogReg() {
  $('#nameregister').val('')
  $('#emailregister').val('')
  $('#passwordregister').val('')
  $('#emaillogin').val('')
  $('#passwordlogin').val('')
}

function emptyNewTodo() {
  $('#newTitle').val('')
  $('#newDesc').val('')
  $('#newDuedate').val('')
}

function register() {
  event.preventDefault()
  let name = $('#nameregister').val()
  let email = $('#emailregister').val()
  let password = $('#passwordregister').val()
  emptyLogReg()
  $.ajax({
    url: `${baseURL}/user/register`,
    method: 'POST',
    data: {
      name,
      email,
      password
    },
    // statusCode: {
    //   500: function () {
    //     window.location = './http-500.html'
    //   }
    // }
  })
    .done((data) => {
      showMessage(`Hai ${data.name}, kamu berhasil register, silahkan login dahulu`, 'success')
      console.log("success register", data)
    })
    .fail((err) => {
      console.log(err)
      showMessage(err.responseJSON.message, 'error')
    })
}

function login() {
  event.preventDefault()
  let email = $('#emaillogin').val()
  let password = $('#passwordlogin').val()
  emptyLogReg()
  $.ajax({
    url: `${baseURL}/user/login`,
    method: 'POST',
    data: {
      email,
      password
    },
    // statusCode: {
    //   500: function () {
    //     window.location = './http-500.html'
    //   }
    // }
  })
    .done((data) => {
      localStorage.setItem('access-token', data['access-token'])
      showMessage(`Hai ${data.name}, kamu berhasil login`, 'success')
      console.log("success login", data)
      // $('#namaUser').text(data.name)
      getAllTodos()
      $("#TodoLists").show()
      $("#login-register-form").hide()
    })
    .fail((err) => {
      console.log(err)
      showMessage(err.responseJSON.message, 'error')
    })
}

function onSignIn(googleUser) {
  event.preventDefault()
  emptyLogReg()
  let profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  let id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    url: `${baseURL}/user/signinGoogle`,
    type: 'POST',
    data: {
      id_token
    },
    // statusCode: {
    //   500: function () {
    //     window.location = './http-500.html'
    //   }
    // }
  })
    .done((data) => {
      console.log(data)
      let msg = ''
      if (data.newPass) {
        msg = 'Hurry up change your password now, your password is ' + data.newPass + '\n'
      }
      // signedInviaGoogle = true
      localStorage.setItem('access-token', data['access-token'])
      showMessage(`${msg}Hai ${data.name}, kamu berhasil login`, 'success')
      getAllTodos()
      $("#TodoLists").show()
      $("#login-register-form").hide()
    })
    .fail((err) => {
      showMessage(err.responseJSON.message, 'error')
    })
}

function logout() {
  event.preventDefault()
  localStorage.removeItem('access-token')
  $("#TodoLists").hide()
  $("#login-register-form").show()
  // if (signedInviaGoogle) {
  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    // signedInviaGoogle = false
    console.log('User signed out.');
  })
    .catch(err => {
      console.log(err)
    })
  // }
}

function addNewTodo() {
  event.preventDefault()
  let newduedate = new Date($('#newDuedate').val())
  let today = new Date()

  if (newduedate < today) {
    showMessage("Due date cant be the past!!!", 'error')
  }
  else {
    $.ajax({
      url: `${baseURL}/todo`,
      method: 'POST',
      // crossDomain: true, // kalau error HTTP 405 Method not Allowed
      headers: { 'access-token': localStorage.getItem('access-token') },
      data: {
        title: $('#newTitle').val(),
        description: $('#newDesc').val(),
        duedate: newduedate
      },
      // statusCode: {
      //   500: function () {
      //     window.location = './http-500.html'
      //   }
      // }
    })
      .done(function (todo) {
        console.log(todo)
        showMessage(`<p>
          <strong>${todo.title}</strong> created successfully
        </p>`, 'success')
        $("#TodoLists").show()
        $("#createTodo").hide()
        emptyNewTodo()
        getAllTodos()
      })
      .fail(function (jqXHR, textStatus) {
        showMessage('response failed : ' + textStatus, 'error')
      })
  }
}

function getAllTodos() {
  let selected = $('#filterByStatus').val()
  let query = ""
  if (selected != "all status") query = `?status=${selected}`
  $.ajax({
    url: `${baseURL}/todo/${query}`,
    method: 'GET',
    headers: { 'access-token': localStorage.getItem('access-token') },
    // statusCode: {
    //   500: function () {
    //     window.location = './http-500.html'
    //   }
    // }
  })
    .done(todos => {
      $('#results').empty()
      for (let todo of todos) {
        $('#results').append(`
        <div class="card m-2">
          <div class="card-body">
            <p>${todo.title}</p>
            <p>${todo.description}</p>
            <p>${todo.status}</p>
            <p>${todo.duedate.slice(0, 10)}</p>
            <div class="row justify-content-between mx-2">
              <a onclick=editTodo('${JSON.stringify(todo)}')  class="btn btn-success" href="">EDIT</a>
              <a onclick=deleteTodo('${todo._id}') class="btn btn-danger" href="">DELETE</a>
            </div>
          </div>
        </div>`)
      }
    })
    .fail((err) => {
      console.log(err)
      showMessage(err.responseJSON.message, 'error')
    })
}

function editTodo(todo) {
  todo = JSON.parse(todo)
  event.preventDefault()
  $('#editTodoForm').show()
  $('#selectedTitle').val(todo.title)
  $('#selectedDescription').val(todo.description)
  $('#selectedStatus').val(todo.status)
  todo.duedate = todo.duedate.slice(0, 10)
  $('#selectedDueDate').val(todo.duedate)
  console.log(typeof todo._id)
  $('#editTodoForm').attr("onsubmit", `updateTodo('${todo._id}')`)
}

function updateTodo(todoId) {
  event.preventDefault()
  $.ajax({
    url: `${baseURL}/todo/${todoId}`,
    method: 'PUT',
    headers: { 'access-token': localStorage.getItem('access-token') },
    data: {
      title: $('#selectedTitle').val(),
      description: $('#selectedDescription').val(),
      status: $('#selectedStatus').val(),
      duedate: new Date($('#selectedDueDate').val()),
    },
    // statusCode: {
    //   500: function () {
    //     window.location = './http-500.html'
    //   }
    // }
  })
    .done(todo => {
      showMessage(`Update ${todo.title} Berhasil`, 'success')
      // dontRefresh()
      getAllTodos()
      $('#editTodoForm').hide()
    })
    .fail((err) => {
      console.log(err)
      showMessage(err.responseJSON.message, 'error')
    })
}

function deleteTodo(todoId) {
  event.preventDefault()
  console.log(todoId)
  $.ajax({
    url: `${baseURL}/todo/${todoId}`,
    method: 'DELETE',
    headers: { 'access-token': localStorage.getItem('access-token') },
    // statusCode: {
    //   500: function () {
    //     window.location = './http-500.html'
    //   }
    // }
  })
    .done(result => {
      showMessage(`Delete Todo Berhasil`, 'success')
      // dontRefresh()
      getAllTodos()
      $('#editTodoForm').hide()
    })
    .fail((err) => {
      console.log(err)
      showMessage(err.responseJSON.message, 'error')
    })
}

// $("#createTodo").hide()
// $("#TodoLists").hide()
// $("#login-register-form").hide()
$(document).ready(() => {
  $('#pills-register').submit(register)
  $('#pills-login').submit(login)
  $('#createTodoForm').submit(addNewTodo)
  $('#createNewTodo').on('click', function () {
    event.preventDefault()
    $("#TodoLists").hide()
    $("#createTodo").show()
  })
  $('#cancel').on('click', function () {
    event.preventDefault()
    $("#TodoLists").show()
    $("#createTodo").hide()
  })
  $('#filterByStatus').on('change', getAllTodos);
  if (localStorage.hasOwnProperty('access-token')) {
    $("#TodoLists").show()
    getAllTodos()
    // $("#login-register-form").hide()
  }
  else {
    // $("#TodoLists").hide()
    $("#login-register-form").show()
  }
})