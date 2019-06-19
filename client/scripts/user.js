//Google Sign In
function onSignIn(user) {
  const token = user.getAuthResponse().id_token
  $.ajax({
    method: 'POST',
    url: `${srvUrl}/api/user/glogin`,
    headers: { token: token }
  })
  .done(data => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('name', data.name)
    loadTodoPage()
  })
  .fail(err => {
    console.log(err)
    $('#message').append(`
      <div class="alert alert-warning text-center" role="alert">
        Google authentication error
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `)
  })
}

//Normal Sign In
function login() {
  const email = $("#email-login").val()
  const password = $("#password-login").val()
  $.ajax({
    method: 'POST',
    url: `${srvUrl}/api/user/login`,
    data: {
      email: email,
      password: password
    },
    dataType: "json"
  })
  .done(data => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('name', data.name)
    $("#message").empty()
    $("#password-login").val('')
    loadTodoPage()
  })
  .fail(err => {
    $('#message').append(`
      <div class="alert alert-warning text-center" role="alert">
        ${err.responseJSON.message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `)
  })
}

//Normal register
function register() {
  $.ajax({
    method: 'POST',
    url: `${srvUrl}/api/user/register`,
    data: {
      name: $('#name-register').val(),
      email: $('#email-register').val(),
      password: $('#password-register').val()
    },
    dataType: 'json'
  })
  .done(user => {
    $('#message').append(`
      <div class="alert alert-success text-center" role="alert">
        Registration for ${user.name} Success. Please login
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `)
    loadLoginPage()
  })
  .fail(err => {
    $('#message').append(`
      <div class="alert alert-warning text-center" role="alert">
        ${err.responseJSON.message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `)
  })
}

function logout() {
  gapi.auth2.getAuthInstance().signOut()
  .then(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    loadLoginPage();
  })
  
}