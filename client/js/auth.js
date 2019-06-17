function defaultLogin() {
  event.preventDefault()
  let loginUser = {
    username: $('#input_username').val(),
    password: $('#input_password').val(),
  }
  $.ajax({
    url: `${url_server}/user/login`,
    method:'POST',
    data: loginUser
  })
    .done((result) => {
      if (result.token) {
        let token = {
          token: result.token,
          token_type: 'default'
        }
        localStorage.setItem('token', JSON.stringify(token))
        showSuccess(`Welcome ${result.full_name}`)        
        checkToken()
      }
    })
    .fail((err) => {
      showError(err)
    })
}

function register() {
  event.preventDefault()
  let newUser = {
    full_name: $('#input_full_name').val(),
    username: $('#input_username').val(),
    password: $('#input_password').val(),
    email: $('#input_email').val(),
  }
  $.ajax({
    url: `${url_server}/user/register`,
    method: 'POST',
    data: newUser
  })
    .done((result) => {
      showSuccess('Success Register New Account', 'Please sign in to continue using this app')
    })
    .fail((err) => {
      showError(err)      
    })
}

function logout() {
  $.ajax({
    url: `${url_server}/user/logout`,
    method: 'POST',
    headers: {
      token: localStorage.token
    }
  })
    .done((result) => {
      localStorage.removeItem("token");
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
      checkToken()
    })
    .fail((err) => {
      showError(err)
    })
}

function getUserLogin() {  
  $.ajax({
    url: `${url_server}/user/myprofile`,
    method: 'GET',
    headers: {
      token: JSON.parse(localStorage.token).token
    }
  })
    .done((res) => {
      $('#user-bar').append(`
      <a style="color: white">${res.full_name}</a>
      `)
    })
    .fail((err) => {
      console.log(err);
      showError(err)
    })
}

function checkToken() {  
  if (localStorage.token !== undefined) {
    getUserLogin()
    $('#navbar-content').replaceWith(`
    <div class="collapse navbar-collapse" id="navbar-content">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a class="nav-link" href="#add-task-bar">Add Task</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#calendar-content">Calendar</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#tasks-cards">Task List</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" onclick="logout()" href="">LogOut</a>
        </li>
      </ul>
    </div>
    `)
    $('#main-content').html(taskHtml)
    getAllTask()
  } else {
    $('#main-content').html(loginHtml)
  }
}

function loadRegisterPage() {
  event.preventDefault()
  $('#main-content').html(registerHtml)
}

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  axios.post(`${url_server}/user/login`, {
    google_id_token: id_token
  })
    .then(({ data }) => {
      let token = {
        token: data.token,
        token_type: 'google'
      }
      localStorage.setItem('token', JSON.stringify(token))
      showSuccess(`Welcome ${data.full_name}`)
      checkToken()       
    })
    .catch(err => {
      console.log(err);
      showError(err)
    })
}