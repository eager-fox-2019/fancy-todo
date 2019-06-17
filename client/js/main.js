const baseUrl= 'http://localhost:3000'

function isLoggedIn () {
  if (localStorage.token) {
    hasLogin()
  } else {
    hasLogout()
  }
}

function register (newUser) {
  $.ajax({
    url: `${baseUrl}/users/register`,
    type: 'post',
    dataType: 'json',
    data: newUser
  })
    .done(function(success){
        console.log(success)
        let loginOption = {
          email : newUser.email,
          password: newUser.password
        }
        login(loginOption)
      })
    .fail(function(error){
        console.log(error)
    })
}

function hasLogin () {
  $('#loginForm').hide()
  $('#registerForm').hide()
  $('#loggedEmail').empty()
  $('#loggedEmail').append(`${localStorage.name}`)
  fetchTodo()
  fetchProject()
  $('#main').fadeIn()
  $('#personal').show()
  $('#project').hide()
}

function login (loginOption) {
  $.ajax({
    url: `${baseUrl}/users/login`,
    type: 'post',
    dataType: 'json',
    data: loginOption
  })
    .done(function(Data){
      console.log(Data)
      localStorage.setItem('token', Data.token)
      localStorage.setItem('name', Data.name)
      localStorage.setItem('email', Data.email)
      localStorage.setItem('userId', Data.id)
      hasLogin()
    })
    .fail(function(error){
      console.log(error)
    })
}

function hasLogout () {
  $('#loggedEmail').empty()
  $('#main').hide()
  $('#registerForm').hide()
  $('#loginForm').fadeIn()
}

function logout() {
  Swal.fire({
    title: 'Where are u going?',
    // text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Gotta go!'
  }).then((result) => {
    if (result.value) {
      localStorage.removeItem('token')
      localStorage.removeItem('name')
      localStorage.removeItem('email')
      localStorage.removeItem('userId')
      Swal.fire({
        position: 'center',
        title: `See u soon..`,
        showConfirmButton: false,
        timer: 1000
      })
      const auth2 = gapi.auth2.getAuthInstance();

      auth2.signOut()
      .then(function(){
        console.log('User signed out')
         hasLogout()
      })
      .catch(function(err){
        console.log(err)
      })
      hasLogout()
    }
  })
}

function onSignIn(googleUser) {

  const idToken= googleUser.getAuthResponse().id_token

   $.ajax({
      url: `${baseUrl}/users/loginGoogle`,
      type: 'post',
      dataType: 'json',
      data:{idToken}
   })
   .done(function(Data){
     console.log(Data)
     localStorage.setItem('token', Data.token)
     localStorage.setItem('name', Data.name)
     localStorage.setItem('email', Data.email)
     localStorage.setItem('userId', Data.id)
     hasLogin()
   })

   .fail(function(err){
    console.log(err)

   })

}

function fetchTodo () {
  $('#todoList').empty()
  $.ajax({
    url: `${baseUrl}/todos`,
    method: 'get',
    headers: {
      token: localStorage.token
    }
  })
  .done(response => {
    if (response.length === 0) {
      $('#todoList').append(`
        <h5>There's no task..</h5>
        <span>Make some task first</span>
      `)
    }
    console.log(response)
    response.forEach(todo => {
      console.log('masuk')
      if (todo.status === 'undone') {
        $('#todoList').append(`
        <div class="col s3">
          <div class="card" style="padding:5px">
            <span>Due: ${todo.dueDate}</span>
            <div class="card-action">
              <h5>${todo.title}</h5>
              <h6>${todo.status}</h6>
              <a onclick="fetchDetail('${todo._id}')" class="waves-effect waves-light btn-small">Detail</a>
              <a onclick="deleteTask('${todo._id}')" class="waves-effect waves-light red btn-small"><i class="fas fa-trash-alt"></i></a>
            </div>
          </div>
        </div>
        `)
      } else {
        $('#todoList').append(`
        <div class="col s3">
          <div class="card" style="padding:5px">
            <span>Due: ${todo.dueDate}</span>
            <div class="card-action">
              <h5>${todo.title}</h5>
              <h6>${todo.status}</h6>
              <a onclick="fetchDetail2('${todo._id}')" class="waves-effect waves-light btn-small">Detail</a>
              <a onclick="deleteTask('${todo._id}')" class="waves-effect waves-light red btn-small"><i class="fas fa-trash-alt"></i></a>
            </div>
          </div>
        </div>
        `)
      }
    })
  })
  .fail((jxHQR,status)=>{
    console.log(status);
  })
}

function fetchTodoProject (id) {
  $('#todoList2').empty()
  $.ajax({
    url: `${baseUrl}/projects/${id}/todos`,
    method: 'get',
    headers: {
      token: localStorage.token
    }
  })
  .done(response => {
    console.log(response)
    if (response.length === 0) {
      $('#todoList2').append(`
        <h5>There's no task..</h5>
        <a onclick="deleteProject('${id}')" class="waves-effect waves-light btn-small red">Delete this project</a>
      `)
    }
    response.forEach(todo => {
      console.log('masuk')
      if (todo.status === 'undone') {
        $('#todoList2').append(`
        <div class="col s3">
          <div class="card" style="padding:5px">
            <span>Due: ${todo.dueDate}</span>
            <div class="card-action">
              <h5>${todo.title}</h5>
              <h6>${todo.status}</h6>
              <a onclick="fetchDetail('${todo._id}')" class="waves-effect waves-light btn-small">Detail</a>
              <a onclick="deleteTask('${todo._id}')" class="waves-effect waves-light red btn-small"><i class="fas fa-trash-alt"></i></a>
            </div>
          </div>
        </div>
        `)
      } else {
        $('#todoList2').append(`
        <div class="col s3">
          <div class="card" style="padding:5px">
            <span>Due: ${todo.dueDate}</span>
            <div class="card-action">
              <h5>${todo.title}</h5>
              <h6>${todo.status}</h6>
              <a onclick="fetchDetail2('${todo._id}')" class="waves-effect waves-light btn-small">Detail</a>
              <a onclick="deleteTask('${todo._id}')" class="waves-effect waves-light red btn-small"><i class="fas fa-trash-alt"></i></a>
            </div>
          </div>
        </div>
        `)
      }
    })
  })
  .fail((jxHQR,status)=>{
    console.log(status);
  })
}

function fetchDetail (id) {
  $.ajax({
    url: `${baseUrl}/todos/${id}`,
    method: 'get',
    headers: {
      token: localStorage.token
    }
  })
  .done(todo => {
    console.log(todo)
    Swal.fire({
      title: `${todo.title}`,
      html: `
        <ul class="center">
          <li><h6>Description:</h6><span style="font-size:20px">${todo.description}</span></li>
          <li><h6>Due Date:</h6><span style="font-size:20px">${todo.dueDate}</span></li>
        </ul>
        <h6>Has this task done ?<h6>
      `,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        `It's done!`,
      cancelButtonText:
        'Not yet'
    })
    .then((result) => {
      if (result.value) {
        done(todo._id)
        Swal.fire(
          'Hurray!',
          'Well Done!',
          'success'
        )
      }
    })
  })
  .fail((jxHQR,status)=>{
    console.log(status);
  })
}

function fetchDetail2 (id) {
  $.ajax({
    url: `${baseUrl}/todos/${id}`,
    method: 'get',
    headers: {
      token: localStorage.token
    }
  })
  .done(todo => {
    console.log(todo)
    Swal.fire({
      title: `${todo.title}`,
      html: `
        <ul class="center">
          <li><h6>Description:</h6><span style="font-size:20px">${todo.description}</span></li>
          <li><h6>Due Date:</h6><span style="font-size:20px">${todo.dueDate}</span></li>
        </ul>
        <h6>Has this task done ?<h6>
      `,
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText:
        `Delete This Task`,
      cancelButtonText:
        'Not yet'
    })
    .then((result) => {
      if (result.value) {
        $.ajax({
          url: `${baseUrl}/todos/${id}`,
          method: 'delete',
          headers: {
            token: localStorage.token
          }
        })
        .done(response => {
          console.log(response)
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
            )
          $('todoList').empty()
          fetchTodo()
        })
        .fail((jxHQR,status)=>{
          console.log(status);
        })
      }
    })
  })
  .fail((jxHQR,status)=>{
    console.log(status);
  })
}

function addNewTask () {
  $.ajax({
    url: `${baseUrl}/todos`,
    method: 'post',
    data: {
      title: $('#title').val(),
      description: $('#description').val() ,
      dueDate: $('#dueDate').val() 
    },
    headers: {
      token: localStorage.token
    }
  })
  .done(response => {
    console.log(response)
    $('#title').val('')
    $('#description').val('')
    $('#dueDate').val('')
    $('todoList').empty()
    fetchTodo()
  })
  .fail((jxHQR,status)=>{
    console.log(status);
  })
}

function addNewTaskProject (id) {
  $.ajax({
    url: `${baseUrl}/todos`,
    method: 'post',
    data: {
      title: $('#title2').val(),
      description: $('#description2').val() ,
      dueDate: $('#dueDate2').val(),
      projectId: $('#projectId').val() 
    },
    headers: {
      token: localStorage.token
    }
  })
  .done(response => {
    console.log(response)
    $('#title2').val('')
    $('#description2').val('')
    $('#dueDate2').val('')
    $('todoList2').empty()
    fetchTodoProject($('#projectId').val())
  })
  .fail((jxHQR,status)=>{
    console.log(status);
  })
}

function deleteTask (id) {
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
        url: `${baseUrl}/todos/${id}`,
        method: 'delete',
        headers: {
          token: localStorage.token
        }
      })
      .done(response => {
        console.log(response)
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
          )
        $('todoList').empty()
        fetchTodo()
        fetchTodoProject($('#projectId').val())
      })
      .fail((jxHQR,status)=>{
        console.log(status);
      })
    }
  })
}

function deleteProject (id) {
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
        url: `${baseUrl}/projects/${id}`,
        method: 'delete',
        headers: {
          token: localStorage.token
        }
      })
      .done(response => {
        console.log(response)
        Swal.fire(
          'Deleted!',
          'Your project has been deleted.',
          'success'
          )
        $('#project').hide()
        fetchProject()
        fetchTodo()
        $('#personal').show()
      })
      .fail((jxHQR,status)=>{
        console.log(status);
      })
    }
  })
}

function done (id) {
  $.ajax({
    url: `${baseUrl}/todos/${id}`,
    method: 'patch',
    data: {
      status: 'done'
    },
    headers: {
      token: localStorage.token
    }
  })
  .done(response => {
    console.log(response)
    fetchTodo()
    fetchTodoProject($('#projectId').val())
  })
  .fail((jxHQR,status)=>{
    console.log(status);
  })
}

function goToProject(id) {
  event.preventDefault()
  $('#personal').hide()
  $('#project').show()
  console.log(id)
  fetchProjectDetail(id)
}

function fetchProject () {
  $('#projectList').empty()
  $.ajax({
    url: `${baseUrl}/projects`,
    method: 'get',
    headers: {
      token: localStorage.token
    }
  })
  .done(response => {
    console.log(response)
    if (response.length === 0) {
      $('#projectList').append(`
        <h6 style="margin-top:40px">You doesn't have any projects...</h6 style="margin-top:40px">
      `)
    }
    response.forEach(project => {
      $('#projectList').append(`
      <div class="col s12">
        <div class="card">
          <div class="card-content" style="font-size:20px; text-align:left">
            <span>${project.projectName}</span>
            <a onclick="goToProject('${project._id}')" href=""><i class="fas fa-caret-right right" style="font-size:2em; margin-top:-6px"></i></a>
          </div>
        </div>
      </div>
      `)
    })
  })
  .fail((jxHQR,status)=>{
    console.log(status);
  })
}

function fetchProjectDetail (id) {
  $('#projectName').empty()
  $.ajax({
    url: `${baseUrl}/projects/${id}`,
    method: 'get',
    headers: {
      token: localStorage.token
    }
  })
  .done(response => {
    $('#memberList').empty()
    console.log(response)
    $('#projectName').append(`${response.projectName}`)
    $('#projectId').val(`${response._id}`)
    $('#memberList').append(`
      <div class="card">
      <span>Leader:</span>
      <h6>${response.projectMaker.name}</h6>
      </div>
    `)
    fetchTodoProject(`${response._id}`)
    console.log(response.projectMembers)
    if (response.projectMembers.length === 1) {
      $('#memberList').append(`
          <h6>There are no members<br>in this project...</h6>
        `)
    }
    response.projectMembers.forEach(member => {
      if (member.email !== localStorage.email) {
        $('#memberList').append(`
          <p>${member.name}</p>
          <div class="divider"></div>
        `)
      }
    })
  })
  .fail((jxHQR,status)=>{
    console.log(status);
  })
}

function newProject () {
  Swal.fire({
    title: 'New Project',
    html:`
      <div class="row container">
        <div class="input-field col s12">
          <input id="projectNameInput" placeholder="Project Name" type="text" class="validate">
        </div>
      </div>
    `,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText:
      'Create Project',
    cancelButtonText:
      'Cancel'
  })
  .then(result => {
    console.log($('#projectNameInput').val())
    $.ajax({
      url: `${baseUrl}/projects`,
      method: 'post',
      data: {
        projectName: $('#projectNameInput').val()
      },
      headers: {
        token: localStorage.token
      }
    })
    .done(response => {
      console.log(response)
      $('#projectNameInput').val('')
      fetchProject()
    })
    .fail((jxHQR,status)=>{
      console.log(status);
    })
  })
}

$(document).ready(function() {
  console.log('ready!')
  isLoggedIn()
  $('.datepicker').datepicker();
  $('.modal').modal();

  $('#register').submit(function (event) {
    event.preventDefault()
    let data = $(this).serializeArray()
    let newUser = {
      name: data[0].value,
      email: data[1].value,
      password: data[2].value,
    }
    register(newUser)
  })

  $('#login').submit(function (event) {
    event.preventDefault()
    let data = $(this).serializeArray()
    let loginOption = {
      email: data[0].value,
      password: data[1].value
    }
    login(loginOption)
  })

  $('#toRegister').click(() => {
    event.preventDefault()
    $('#loginForm').hide()
    $('#registerForm').show()
  })

  $('#toLogin').click(() => {
    event.preventDefault()
    $('#registerForm').hide()
    $('#loginForm').show()
  })

  $('#logout').click(() => {
    event.preventDefault()
    logout()
  })

  $('#addNewTask').click(() => {
    event.preventDefault()
    addNewTask()
  })

  $('#addNewTask2').click(() => {
    event.preventDefault()
    addNewTaskProject()
  })

  $('#newProject').click(() => {
    event.preventDefault()
    newProject()
  })

  $('#back').click(() => {
    event.preventDefault()
    $('#project').hide()
    fetchProject()
    fetchTodo()
    $('#personal').show()
  })

  $('#addMembers').click(() => {
    event.preventDefault()
    $.ajax({
      url: `${baseUrl}/users`,
      method: 'get',
      headers: {
        token: localStorage.token
      }
    })
    .done(response => {
      console.log(response)
      // response.forEach(user => {
      //   $('#userList').append(`
      //   <li style="border:1px solid black; margin-bottom: 5px">
      //     <div class="left">
      //       <p>Name :</p>
      //       <p>Email:</p>
      //     </div>
      //     <div class="right">
      //       <a id="invite" class="waves-effect waves-light btn-small right" style="margin-top:20px">Invite</a>                    
      //     </div>
      //   </li>
      //   `)
      // })
    })
  })
})