const baseUrl = 'http://localhost:3000/'

function accessToken(token) {
  localStorage.setItem('token', token)
}

function getUserId(id) {
  localStorage.setItem('user_id', id)
}

$('#notification').hide()

function notif(message) {
  $('#notification').show()
  $('#isi-notif').text(message)
}

function emptyNotif() {
  $('#notification').hide()
}

// function 


$('#loginPage').show()
$('#inside').hide()
// $('#inside').show()
// $('#loginPage').hide()

$('#add-edit-page').hide()
$('#edit-form').hide()
$('#register').hide()
$('#register-text').hide()
$('#register-alert').hide()

function openRegister() {
  $('#register').show()
  $('#login').hide()
  $('#login-text').hide()
  $('#register-text').show()
}

function openLogin() {
  $('#register').hide()
  $('#login').show()
  $('#login-text').show()
  $('#register-text').hide()
}


// -------------------------- FACEBOOK SIGN IN -------------------------

window.fbAsyncInit = function() {
  FB.init({
    appId      : '442103826367894',
    cookie     : true,
    xfbml      : true,
    version    : 'v3.3'
  });
    
  FB.getLoginStatus(response => {
    statusChangeCallback(response)
  })
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var finished_rendering = function() {
  console.log("finished rendering plugins");
  $('#spinner').hide()
}
FB.Event.subscribe('xfbml.render', finished_rendering);

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

 function statusChangeCallback(response) {
   if(response.status === 'connected') {
    FB.api('/me?fields=name,email', function(response){
      if(response && !response.error){
        $('#userEmail').text(response.email)
        $.ajax({
          method: "POST",
          url: `${baseUrl}api/users/facebookSignin`,
          data: {
            email: response.email
          },
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .done(result => {
          $('#loginPage').hide()
          $('#inside').show()
          accessToken(result)
          getUserId(result._id)
        })
        .fail(err => {
          notif(err.responseJSON.message)
        })
      }
    })
    $('#loginPage').hide()
    $('#inside').show()
   }
 }

 function facebookLogin() {
   FB.getLoginStatus(response => {
     statusChangeCallback(response)
   })
 }


 // ==============================================================


$('#register').submit((event) => {
  event.preventDefault()
  let inputEmail = $('#registerEmail').val()
  let inputPassword = $('#registerPassword').val()
  $.ajax({ 
    method: "POST",
    url: `${baseUrl}api/users/register`,
    data: {
      email: inputEmail,
      password: inputPassword
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })
  .done((result) => {
    $('#register').hide()
    $('#register-text').hide()
    $('#register-alert').show()
    openLogin()
    $('#fail-alert').hide()
  })
  .fail(err => {
    let error = err.responseJSON.message.split(':')[2]
    $('#fail-alert').append(error)
  })
})

$('#login').submit(() => {
  $('#userEmail').text('')  
  event.preventDefault()
  let inputEmail = $('#loginEmail').val()
  let inputPassword = $('#loginPassword').val()
  $.ajax({
    method: "POST",
    url: `${baseUrl}api/users/login`,
    data: {
      email: inputEmail,
      password: inputPassword
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })
  .done((result) => {
    getAllTodos()
    $('#loginPage').hide()
    $('#inside').show()
    $('#userEmail').text(inputEmail)
    getUserId(result.user._id)
    accessToken(result.token)
  })
  .fail(err => {
    $('#register-alert').text(err.responseJSON.message)
    $('#register-alert').show()
  })
})

function getAllTodos() {
  $('#todo-table-container').empty()
  $('#todo-updatedStatus-container').empty()
  $.ajax({
    method: 'GET',
    url: `${baseUrl}api/todos`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
  .done(todos => {
    for(let i = 0; i < todos.length; i++) {
      if(!todos[i].status) {
        let result = `
        <div class="todo">
          <div>
            <a class="btn" data-toggle="collapse" href="#description${i}" role="button" aria-expanded="false" aria-controls="collapseExample" style="color:black">
            ${todos[i].name}
            </a>
            <div class="collapse" id="description${i}">
              <div class="card card-body">
                <p class="desc-item">${todos[i].description}</p>
              </div>
            </div>
          </div>
          <div class="todo-item">${new Date(todos[i].due_date).toDateString()}</div>
          <div class="${todos[i].status} todo-item"></div>
          <div class="todo-item"><button href="#" onclick="deleteTodo('${todos[i]._id}')" class="btn btn-outline-danger">Delete</button>  <button href="#" class="btn btn-outline-primary" onclick="editTodo('${todos[i]._id}')">Edit</button> <button href="#" class="btn btn-outline-success" onclick="statusUpdate('${todos[i]._id}')">Done</button></div>
          
        </div>
        `
        $('#todo-table-container').append(result)
      } else {
        let result = `
        <div class="todo todo-updated">
          <div>
            <a class="btn" data-toggle="collapse" href="#description${i}" role="button" aria-expanded="false" aria-controls="collapseExample" style="color:black">
            ${todos[i].name}
            </a>
            <div class="collapse" id="description${i}">
              <div class="card card-body">
                <p class="desc-item">${todos[i].description}</p>
              </div>
            </div>
          </div>
          <div class="${todos[i].status} todo-item"></div>
          <div class="todo-item"><button href="#" onclick="deleteTodo('${todos[i]._id}')" class="btn btn-outline-danger">Delete</button></div>
        </div>
        `
        $('#todo-updatedStatus-container').append(result)
      }
    }
    // console.log(result)
  })
  .fail(err => {
    notif(err.responseJSON.message)
  })
}

function statusUpdate(id) {
  $.ajax({
    method: "PATCH",
    url: `${baseUrl}api/todos/status/${id}`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
  .done(() => {
    getAllTodos()
    notif('Status updated !')
  })
  .fail(err => {
    notif(err.responseJSON.message)
  })
}



function deleteTodo(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      $.ajax({
        method: "DELETE",
        url: `${baseUrl}api/todos/${id}`,
        headers: {
          token: localStorage.getItem('token')
        }
      })
      .done(() => {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        $('#todo-table-container').empty()
        getAllTodos()
      })
      .fail(err => {
        notif(err.responseJSON.message)
      })
    }
  })
}

function goBack() {
  $('#inside').show()
  $('#edit-form').hide()
  $('#add-edit-page').hide()
  localStorage.removeItem('edit_id')
}

function editTodo(id) {
  $.ajax({
    method: 'GET',
    url:`${baseUrl}api/todos/${id}`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
  .done(todo => {
    let result = `
    <fieldset class="fieldset">
    <!-- Form Name -->
    <legend id="edit-name">Edit</legend>
    <a href="#" onclick="goBack()">Back</a>
    
    <!-- Text input-->
    <div class="form-group">
      <label class="col-md-4 control-label" for="name">Name</label>  
      <div class="col-md-4">
      <input id="edit-todo-name" name="name" type="text" placeholder="name" class="form-control input-md" value="${todo.name}">
        
      </div>
    </div>
    
    <!-- Text input-->
    <div class="form-group">
      <label class="col-md-4 control-label" for="description">Description</label>  
      <div class="col-md-4">
      <input id="edit-description" name="description" type="text" placeholder="description" class="form-control input-md" value="${todo.description}">
        
      </div>
    </div>
    
    <!-- Text input-->
    <div class="form-group">
      <label class="col-md-4 control-label" for="date">Due Date</label>  
      <div class="col-md-4">
      <input id="edit-date" name="date" type="text" placeholder="due_date" class="form-control input-md" value="${new Date(todo.due_date).toDateString()}">
      <span class="help-block">format: dd-mm-yy</span>  
      </div>
    </div>
    
    <!-- Multiple Checkboxes (inline) -->
    </fieldset>`  
    localStorage.setItem('edit_id', id)
    $('#edit-form').empty()
    $('#edit-form').append(result)
    $('#inside').hide()
    $('#add-edit-page').show()
    $('#edit-form').show()
  })
  .fail(err => {
    notif(err.responseJSON.message)
  })
}

$('#edit-form-container').submit((event) => {
  event.preventDefault()
  let inputName = $('#edit-todo-name').val()
  let inputDesc = $('#edit-description').val()
  let inputDate = $('#edit-date').val()
  let inputStatus = $('#checkboxex-0').val()
  if(inputStatus) {
    inputStatus = true
  } else {
    inputStatus = false
  }
  $.ajax({
    method: "PATCH",
    url: `${baseUrl}api/todos/${localStorage.getItem('edit_id')}`,
    data: {
      name: inputName,
      description: inputDesc,
      date: inputDate,
      status: inputStatus
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })
  .done(result => {
    $('#todo-table-container').empty()
    getAllTodos()
    goBack()
    notif('Your Todo successfully edited !')
  })
  .fail(err => {
    notif(err.responseJSON.message)
  })
})

// create new todo

$('#add-form').submit((event) => {
  event.preventDefault()
  let inputName = $('#create-name').val()
  let inputDesc = $('#create-description').val()
  let inputDate = $('#create-date').val()
  $.ajax({
    method: "POST",
    url: `${baseUrl}api/todos/`,
    data: {
      name: inputName,
      description: inputDesc,
      date: inputDate
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })
  .done((todo) => {
    $('#todo-table-container').empty()
    getAllTodos()
    notif(`Created a new todo ${inputName}`)
  })
  .fail(err => {
    notif(err.responseJSON.message)
  })
})



function signOut() {

  FB.logout(function(response) {
    console.log('sukses logout')
  })
  $('#loginPage').show()
  $('#inside').hide()
  $('#userEmail').val('')
  localStorage.clear()
}



