const baseUrl = 'http://localhost:3000/api';

// Format form inputs to json-like
function format(form) {
  let out = {};
  $(form).serializeArray().forEach(x => {
    out[x.name] = x.value
  });
  return out
}

// --------- sign in sign out pages ----------
function showSignIn(){
  $('#outside').hide();
  $('#inside').show();

  $('#addTodoForm').hide();
  $('#showAddTodoFormButton').show();

  populateTodo()
}

function showSignOut(){
  $('#outside').show();
  $('#inside').hide();
  clearForms();
}

function clearForms(){
  $('#loginEmail').val('')
  $('#loginPassword').val('')
  $('#registrationEmail').val('')
  $('#registrationPassword').val('')
}

// <| ------- google sign-in -------|>

function accessToken(token) {
  localStorage.setItem('access_token', token)
}

function onSignIn(googleUser) {
  console.log("client google onSignIn")
  const idToken = googleUser.getAuthResponse().id_token
  $.ajax({
    method: "POST",
    url:`${baseUrl}/users/googleSignin`,
    data: { idToken }
  })
  .done((result) => {
    localStorage.setItem('access_token', result.token)
    console.log('Success signed in with google')
    showSignIn()

  })
  .fail((err) => {
    console.log(err.responseJSON.message)
  })
}

// logout
function logout() {
  //app logout
  localStorage.clear()

  //google logout
  let auth2 = gapi.auth2.getAuthInstance();
  auth2
    .signOut()
    .then(() => {
      console.log('Google user signed out.')
     });

  //fb logout
  FB.logout(res => {
    console.log('FB user signed out.')
  })

  showSignOut()
}
//---------- FB sign in ----------

// FB.Event.subscribe('auth.authResponseChange', function(response) {
//     console.log('The status of the session changed to: '+response.status);
//     let fbLoggedin = (response.status == 'connected')
// });

function checkLoginState(){
  FB.getLoginStatus(res => {
    statusChangeCallback(res)
  })
}

function statusChangeCallback(response){
  console.log(response)
  if(response.status == 'connected'){
    console.log(FB)
    // accessToken(result)
    showSignIn()
  }
}

// --------- todo form ---------------
function addTodoForm(){
  $('#addTodoForm').show();
  $('#showAddTodoFormButton').hide();
}

function hideAddTodoForm(){
  $('#addTodoForm').hide();
  $('#showAddTodoFormButton').show();
}
//------------ populate todo list ----------

function populateTodo(){
  $('#theTodoList').empty()
  $('#theTodoList').append("Loading todo list...")
  $.ajax({
    method: "GET",
    url: `${baseUrl}/todos`,
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
  .done(todoList => {
    $('#theTodoList').empty()
    todoList.forEach(todo => {
      appendTodo(todo)
    })
  })
  .fail(err => {
    console.log(err)
  })
}

// -------------- appending todo ---------
function getDateInFormat(date){
  let yyyy = new Date(date).getFullYear()
  let mm = new Date(date).getMonth()+1
  if (mm<10) mm = '0'+mm
  let dd = new Date(date).getDate()
  if (dd<10) dd = '0'+dd
  let dateYYYYMMDD = yyyy+'-'+mm+'-'+dd
  return dateYYYYMMDD
}

function appendTodoEditForm(todo){
  let htmlTodoEditForm = `
  <div id="editTodoForm${todo._id}" class="editTodoForm">
    <form id="editTodo${todo._id}" class="form1" action="/" method="PATCH" autocomplete="off">
      <div class="form1title">Edit a Todo</div>
      <input class="input1" type="text" value="${todo.name}" name="name">
      <br>
      <input class="input1" type="text" value="${todo.description}" name="description">
      <br>`

  let htmlStatusRadioButtons = `<label>Status:</label><br>`
  if(todo.status == "done"){
    htmlStatusRadioButtons +=
    `<input class="" type="radio" name="status" value="not done"> Not done<br>
      <input class="" type="radio" name="status" value="in progress"> In progress<br>
      <input class="" type="radio" name="status" value="done" checked> Done<br>`

  } else if (todo.status == "in progress"){
    htmlStatusRadioButtons +=
    `<input class="" type="radio" name="status" value="not done"> Not done<br>
      <input class="" type="radio" name="status" value="in progress" checked> In progress<br>
      <input class="" type="radio" name="status" value="done"> Done<br>`

  } else { //todo.status == 'not done'
    htmlStatusRadioButtons +=
    `<input class="" type="radio" name="status" value="not done" checked> Not done<br>
      <input class="" type="radio" name="status" value="in progress"> In progress<br>
      <input class="" type="radio" name="status" value="done"> Done<br>`

  }
      
  htmlTodoEditForm += htmlStatusRadioButtons

  let dateYYYYMMDD = getDateInFormat(todo.dueDate)
  
  htmlTodoEditForm +=
  `<input class="input1" type="Date" value="${dateYYYYMMDD}" name="dueDate">
      <br>
      <a href="#" onclick="hideEditTodoForm('${todo._id}')">cancel edit</a>|
      <a href="#" onclick="editTodo('${todo.owner},${todo._id}')">update todo</a>
    </form>
  </div>`
  $('#theTodoList').append(htmlTodoEditForm)
}

function appendTodo(todo){
  let htmlTodo = `
  <div id="nonEditTodoDiv${todo._id}">
    <ul>
      <li>Name: ${todo.name}</li>
      <li>Description: ${todo.description}</li>
      <li>Status: ${todo.status}</li>
      <li>Due Date: ${new Date(todo.dueDate).toDateString()}</li>
      <li><a href="#" onclick="showEditTodoForm('${todo._id}')">edit</a>|
      <a href="#" onclick="delTodo('${todo.owner},${todo._id}')">delete</a></li>
    </ul>
  </div>
`
  $('#theTodoList').append(htmlTodo)
  appendTodoEditForm(todo)
  $('.editTodoForm').hide()
}

// ---------- editing a todo -------------
function showEditTodoForm(todoId){
  $(`#nonEditTodoDiv${todoId}`).hide()
  $(`#editTodoForm${todoId}`).show()
}

function hideEditTodoForm(todoId){
  $(`#editTodoForm${todoId}`).hide()
  $(`#nonEditTodoDiv${todoId}`).show()
}

function editTodo(strInput){
  let [userId, todoId] = strInput.split(',')

  let name = $(`#editTodo${todoId} input[name='name']`).val()
  let description = $(`#editTodo${todoId} input[name='description']`).val()
  let status = $(`#editTodo${todoId} input[name='status']:checked`).val()
  let dueDate = $(`#editTodo${todoId} input[name='dueDate']`).val()
  // console.log("editform input values:")
  // console.log(name,description,status,dueDate)

  $.ajax({
      method: "PATCH",
      url: `${baseUrl}/todos/update/${userId}/${todoId}`,
      headers: {
        access_token: localStorage.getItem('access_token')
      },
      data: {
        name: name,
        description: description,
        status: status,
        dueDate: dueDate
      }
    })
    .done(result => {
      console.log("updated a todo", result)
      populateTodo()
    })
    .fail(err => {
      console.log(err)
    })

}

// --------- deleting a todo -----------
function delTodo(strInput){
  let [userId, todoId] = strInput.split(',')
  $.ajax({
      method: "DELETE",
      url: `${baseUrl}/todos/del/${userId}/${todoId}`,
      headers: {
        access_token: localStorage.getItem('access_token')
      }
    })
    .done(result => {
      console.log("deleted a todo", result)
      populateTodo()
    })
    .fail(err => {
      console.log(err)
    })
}

//-----------------------------------------------------

$(document).ready(() => {
  // api/todos/add
  $('#addTodoForm').submit( event => {
    event.preventDefault()
    let todoName = $('#todoName').val()
    let todoDesc = $('#todoDescription').val()
    let todoDueDate = $('#todoDueDate').val()
    console.log("input for todo:",todoName,todoDesc,todoDueDate)
    $.ajax({
      method: "POST",
      url: `${baseUrl}/todos/add`,
      headers: {
        access_token: localStorage.getItem('access_token')
      },
      data: {
        name: todoName,
        description: todoDesc,
        dueDate: todoDueDate
      }
    })
    .done(result => {
      appendTodo(result)
      hideAddTodoForm()
    })
    .fail(err => {
      console.log(err.responseJSON.message)
    })
  })

  // --------- sign in --------- 
  $('#login-form').submit( event => {
    event.preventDefault()
    let inputEmail = $('#loginEmail').val()
    let inputPassword = $('#loginPassword').val()
    $.ajax({
      method: "POST",
      url: `${baseUrl}/users/login`,
      data: {
        email: inputEmail,
        password: inputPassword
      }
    })
    .done((result) => {
      clearForms()
      accessToken(result)
      showSignIn()

    })
    .fail(err => {
      console.log(err.responseJSON.message)
    })
  })

  // -------- Register ------------
  $('#register-form').submit( event => {
    event.preventDefault()
    let inputEmail = $('#registrationEmail').val()
    let inputPassword = $('#registrationPassword').val()
    console.log('masuk')
    $.ajax({ 
      method: "POST",
      url: `${baseUrl}/users/register`,
      data: {
        email: inputEmail,
        password: inputPassword
      }
    })
    .done((result) => {
      $('#front-forms').hide()
      $('.otherLogins').hide()
      clearForms()
      $('#reg-message').show()
    })
    .fail(err => {
      console.log(err.responseJSON.message)
    })
  })

  // ------success register--------
  $('#successRegisterReturnButton').on('click', function() {
    $('#reg-message').hide()
    $('#front-forms').show()
    $('.otherLogins').show()
  })

});