function loadLoginPage() {
  $('#main-page').html(`
  <div class="container d-none d-flex flex-column min-vh-100 " id="login-page">
    <div class="row min-vh-100 justify-content-center align-items-center">
      <div class="col-4 border p-3">
        <h2 class="text-center">Log in</h2>
        <hr>
        <div id="g-signin2"></div>
        <h5 class="text-center text-secondary mt-2">OR</h5>
        <form onsubmit="login()">
          <div class="form-group">
            <label form="email-login">Email address:</label>
            <input type="email" class="form-control" id="email-login">
          </div>
          <div class="form-group">
            <label for="password-login">Password:</label>
            <input type="password" class="form-control" id="password-login">
          </div>
          <div class="clearfix">
            <button type="submit" class="btn btn-primary float-right">Submit</button>
          </div>
        </form>
        <p class="mt-2">Don't have an account? Create one <a href="#" onclick="loadRegisterPage()">here</a></p>
      </div>
    </div>
  </div>
  `);

  //Load Google Sign In button dynamically
  gapi.signin2.render("g-signin2", {
    scope: "profile email",
    longtitle: true,
    theme: "light",
    onsuccess: onSignIn
  });
}

function loadRegisterPage() {
  $('#main-page').html(`
  <div class="container d-none d-flex flex-column min-vh-100 " id="login-page">
    <div class="row min-vh-100 justify-content-center align-items-center">
      <div class="col-4 border p-3">
        <h2 class="text-center">Register</h2>
        <hr>
        <div id="g-signin2"></div>
        <h5 class="text-center text-secondary mt-2">OR</h5>
        <form onsubmit="register()">
          <div class="form-group">
            <label form="name-register">Name:</label>
            <input type="text" class="form-control" id="name-register">
          </div>
          <div class="form-group">
            <label form="email-register">Email address:</label>
            <input type="email" class="form-control" id="email-register">
          </div>
          <div class="form-group">
            <label for="password-register">Password:</label>
            <input type="password" class="form-control" id="password-register">
          </div>
          <div class="clearfix">
            <button type="submit" class="btn btn-primary float-right">Register</button>
          </div>
        </form>
        <p class="mt-2">Have an account? Log In <a href="#" onclick="loadLoginPage()">here</a></p>
      </div>
    </div>
  </div>
  `);

  //Load Google Sign In button dynamically
  gapi.signin2.render("g-signin2", {
    scope: "profile email",
    longtitle: true,
    theme: "light",
    onsuccess: onSignIn
  });
}

function loadTodoPage() {
  $("#main-page").html(`
  <nav class="navbar navbar-expand-sm bg-info navbar-dark">
    <h1 class="navbar-brand">Todo App</h1>
    <a class="nav-link text-light ml-auto" href="#" onclick="logout()">Logout</a>
    <span class="navbar-text" id="user-logon">${localStorage.getItem('name')}</user>
  </nav>

  <div class="container-fluid mt-2" id="main-page">
    <div class="row">
      <div class="col">
        <h3>Add New Task</h2>
          <hr>
      </div>
  
      <div class="col">
        <h3>Not Completed</h3>
          <hr>
      </div>
  
      <div class="col">
        <h3>Completed</h3>
          <hr>
      </div>
    </div>
    
    <div class="row">
      <div class="col">
        <form onsubmit="addTask()">
          <div class="form-group">
            <label for="task-name">Title:</label>
            <input type="text" class="form-control" id="task-name">
          </div>
          <div class="form-group">
            <label for="task-description">Description:</label>
            <textarea class="form-control" rows="5" id="task-description"></textarea>
          </div>
          <div class="clearfix">
            <button type="submit" class="btn btn-primary float-right">Submit</button>
          </div>
        </form>
      </div>
      <div class="col" id="list-task-not-completed"></div>
      <div class="col" id="list-task-completed"></div>
    </div>
  </div>
  `)

  //Init gapi for dynamic page
  gapi.load("auth2", () => gapi.auth2.init())

  //List task
  listTask('Not Completed')
  listTask('Completed')
}