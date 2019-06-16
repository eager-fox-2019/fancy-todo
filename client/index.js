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
    })
    .fail(err => {
      console.log(err)
    })
}

// -------------- appending todo ---------
function appendTodo(todo){
  let htmlTodo = `<ul>
    <li>Name: ${todo.name}</li>
    <li>Description: ${todo.description}</li>
    <li>Status: ${todo.status}</li>
    <li>Due Date: ${new Date(todo.dueDate).toDateString()}</li>
    <li><button type="submit" onclick="delTodo('${todo.owner},${todo._id}')">delete</button></li>
  </ul>`
  $('#theTodoList').append(htmlTodo)
}

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