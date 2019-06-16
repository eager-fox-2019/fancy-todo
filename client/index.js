const baseUrl = 'http://localhost:3000/api';

// Format form inputs to json-like
function format(form) {
  let out = {};
  $(form).serializeArray().forEach(x => {
    out[x.name] = x.value
  });
  return out
}

//------ user detail -----------
function populateUser(){
  $('#editUserForm').hide();
  $('#theUser').empty()
  $('#theUser').append('Loading user...')

  $.ajax({
    method: "GET",
    url: `${baseUrl}/users/current`,
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
  .done(user => {
    $('#theUser').empty()
    let htmlUser = `<h2>${user.name}\'s Todo List</h2>
    <div id="editDeleteUserLinks">
    <a href="#" onclick="showEditUserForm()">edit user info</a>
    </div>
    `
    $('#theUser').append(htmlUser)
  
  })
  .fail(err => {
    console.log(err)
  })
}

function showEditUserForm(){
  $('#editUserForm').show();
  $('#editDeleteUserLinks').hide();
}

function hideEditUserForm(){
  $('#editUserForm').hide();
  $('#editDeleteUserLinks').show();
}

function deleteUser(){
  $.ajax({
      method: "DELETE",
      url: `${baseUrl}/users/delete`,
      headers: {
        access_token: localStorage.getItem('access_token')
      }
    })
    .done(user => {
      logout()
    })
    .fail(err => {
      console.log(err)
    })
}

// --------- sign in sign out pages ----------
function showSignIn(){
  $('#outside').hide();
  $('#inside').show();

  $('#addTodoForm').hide();
  $('#showAddTodoFormButton').show();

  let today = getDateInFormat(new Date())
  $('#todoDueDate').attr("min",today)
  $('#todoDueDate').attr("value",today)

  populateTodo()
  populateUser()
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
    accessToken(result.token)
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
  FB.getLoginStatus(res => {
    if(res.status == 'connected'){
      FB.logout(res => {
        console.log("FB user signed out.")
        checkLoginState()
      })
    }
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
  if(response.status == 'connected'){
    console.log(response.authResponse.userID)
    let inputName = response.authResponse.userID
    let inputEmail = inputName+"@facebook.com"
    let inputPassword = inputName

    //var accessToken = response.authResponse.accessToken

    $.ajax({
      method: "POST",
      url: `${baseUrl}/users/fblogin`,
      data: {
        name: inputName,
        email: inputEmail,
        password: inputPassword
      }
    })
    .done((result) => {
      clearForms()
      accessToken(result.token)
      showSignIn()

    })
    .fail(err => {
      console.log(err)
    })
    // showSignIn()
  } else {
    showSignOut()
  }
}


//-----------------------------------------------------

$(document).ready(() => {
  $('#editUserForm').submit (event => {
    event.preventDefault()

    // console.log("editUserForm event submit")

    let name = $(`#editUserForm input[name='name']`).val()
    let password = $(`#editUserForm input[name='password']`).val()

    $.ajax({
      method: "PATCH",
      url: `${baseUrl}/users/update`,
      headers: {
        access_token: localStorage.getItem('access_token')
      },
      data: {
        name: name,
        password: password
      }
    })
    .done(user => {
      populateUser()
      hideEditUserForm()
    })
    .fail(err => {
      console.log(err)
    })

  })
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
      populateTodo()
      hideAddTodoForm()
    })
    .fail(err => {
      console.log(err)
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
      console.log(err)
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
      console.log(err)
    })
  })

  // ------success register--------
  $('#successRegisterReturnButton').on('click', function() {
    $('#reg-message').hide()
    $('#front-forms').show()
    $('.otherLogins').show()
  })

});