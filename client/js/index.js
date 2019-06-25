const baseUrl= 'http://localhost:3000'

function isLoggedIn () {
  if (localStorage.token) {
    hasToken()
  } else {
    noToken()
  }
}

function hasToken(){
    $('#loginPage').hide()
    $('#content').show()
    $('#rowAddTask').hide()
    $('#rowHistory').hide()
    $('#rowDeadline').hide()
    $('#today').empty()
    $('#today').append(`${getFormatDate(new Date())}`)
    $('#loggedName').empty()
    $('#loggedName').append(`Welcome, ${localStorage.firstName}`)
    fetchPending()
    fetchInprogress()
    fetchComplete()
}

function noToken(){
    $('#today').empty()
    $('#loggedName').empty()
    $('#loginPage').show()
    $('#login').show()
    $('#register').hide()
    $('#content').hide()
}

function register(newUser){
    $.ajax({
        url: `${baseUrl}/users/register`,
        method: 'post',
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

function login (loginOption) {
    $.ajax({
      url: `${baseUrl}/users/login`,
      method: 'post',
      dataType: 'json',
      data: loginOption
    })
    .done(function(Data){
    console.log(Data)
    localStorage.setItem('token', Data.token)
    localStorage.setItem('firstName', Data.firstName)
    localStorage.setItem('lastName', Data.lastName)
    localStorage.setItem('userId', Data.userId)
    hasToken()
    })
    .fail(function(error){
    console.log(error)
    })
  }

function onSignIn(googleUser) {
  console.log('masuk google sign in')
    const idToken= googleUser.getAuthResponse().id_token
     $.ajax({
        url: `${baseUrl}/users/loginGoogle`,
        method: 'post',
        dataType: 'json',
        data:{idToken}
     })
     .done(function(Data){
       console.log(Data)
       localStorage.setItem('token', Data.token)
       localStorage.setItem('firstName', Data.firstName)
       localStorage.setItem('lastName', Data.lastName)
       localStorage.setItem('userId', Data.id)
       hasToken()
     })
     .fail(function(err){
      console.log(err)
  
     })
  }

function logout() {
    Swal.fire({
      title: 'Are you sure to sign out?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        localStorage.removeItem('token')
        localStorage.removeItem('firstName')
        localStorage.removeItem('lastName')
        localStorage.removeItem('userId')
        noToken()
        isLoggedIn()
        //sign out google
        const auth2 = gapi.auth2.getAuthInstance();
  
        auth2.signOut()
        .then(function(){
          console.log('User signed out')
           noToken()
           isLoggedIn()
        })
        .catch(function(err){
          console.log(err)
        })
        
      }
    })
    
  }

function getFormatDate(data){
  if(data == null){
    return "Haven't Done"
  }else{
    let date= new Date(data)
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
  } 
}


function addTask(newTask){
  if(new Date(newTask.dueDate)< new Date()== true){
    Swal.fire({
      type: "error",
      title: "Check Your Date!",
      text: 'Due Date minimal tomorrow.',
      showConfirmButton: false,
    })
    console.log('lebih kecil')
  }else{
    $.ajax({
      url: `${baseUrl}/todos`,
      method: 'post',
      dataType: 'json',
      data:newTask,
      headers: {
        token: localStorage.token
      }
  })
  .done(function(todo){
    console.log(todo);
    fetchPending()
    location.href = "#dataPending";
    $('#rowAddTask').hide()
    $('#rowHistory').hide()
    $('#rowDeadline').hide()
    $('#titleDataTask').show()
    $('#dataTask').show()
  })
  .fail(function(error){
    console.log('masuk error')
    console.log(error)
  })
  }
   
}

function removeTask(id, name){
  Swal.fire({
    title: 'Delete this task?',
    text: name,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  })
  .then((result) => {
    if(result.value){
      $.ajax({
        url: `${baseUrl}/todos/${id}`,
        method: 'delete',
        headers: {
          token: localStorage.token
        }
      })
      .done(function(todo){
        console.log(todo)
        fetchPending()
        fetchInprogress()
        fetchComplete()
      })
      .fail(function(error){
        console.log('masuk error')
        console.log(error)
      })
      Swal.fire(
        'Deleted!',
        'Your task has been deleted.',
        'success'
      )
    }
  })
}

function updateInprogress(id){
  $.ajax({
    url: `${baseUrl}/todos/${id}/in progress`,
    method: 'patch',
    headers: {
      token: localStorage.token
    }
  })
  .done(function(todo){
    console.log(todo)
    Swal.fire(
      'Updated!',
      'Your task now is in progress.',
      'success'
    )
    fetchPending()
    fetchInprogress()
  })
  .fail(function(error){
    console.log('masuk error')
    console.log(error)
  })
}

function updateComplete(id){
  $.ajax({
    url: `${baseUrl}/todos/${id}`,
    method: 'patch',
    headers: {
      token: localStorage.token
    }
  })
  .done(function(todo){
    console.log(todo)
    Swal.fire(
      'Updated!',
      'Your task have been done.',
      'success'
    )
    fetchInprogress()
    fetchComplete()
  })
  .fail(function(error){
    console.log('masuk error')
    console.log(error)
  })
}

function fetchDetails(id){
  console.log('masuk fetchdetails')
  event.preventDefault()
  Swal.fire({
    position: 'center',
    showConfirmButton: false
  })
  $.ajax({
    url: `${baseUrl}/todos/details/${id}`,
    method: 'get',
    headers: {
      token: localStorage.token
    }
  })
  .done(({todo}) => {
    console.log(todo)
    Swal.fire({
      html: `
      <div class="row" style="height:350px">
        <div class="col s12">
            <center>
              <h2>Detail Task</h2>
            </center>
            <div class="row">
              <div class="col s12">
                <div class="card">
                <span class="card-title">${todo.name}</span>
                  <div class="row card-content" style="text-align:left">
                    <div class="col s6">
                      <h6>Type: ${todo.type}</h6>
                      <h6>Due Date: ${getFormatDate(todo.dueDate)}</h6>
                      <h6>Status: ${todo.status}</h6>
                      <h6>End Date: ${getFormatDate(todo.endDate)}</h6>
                      <p>Description: ${todo.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      `
    })
  })
  .fail(function(error){
      console.log('masuk error')
      console.log(error)
    })
}

function fetchPending(){
  console.log('masuk fetch pending')
  $('#dataPending').empty()
  $.ajax({
      url: `${baseUrl}/todos/pending`,
      method: 'get',
      dataType: 'json',
      headers: {
        token: localStorage.token
      }
  })
  .done(function(data){
    console.log('fetchpending')
    console.log(data.todos)
    let todos= data.todos
    if(todos.length > 0){
      todos.forEach(todo => {
        if(todo.type== 'mandatory'){
          $('#dataPending').append(`
          <div class="row">
          <div class="col s12">
          <div class="card horizontal" style="height: 200px">
            <div class="card-stacked red lighten-4">
              <div class="card-action">
                <i class="fas fa-exclamation-triangle"><span>${todo.name}</span></i>
              </div>
               <div class="card-content">
                  <p>${todo.type}<p>
                  <p>Due Date: ${getFormatDate(todo.dueDate)}<p>
                  <p>Status: ${todo.status}<p>
                  <a class="waves-effect waves-light btn-small teal modal-trigger" onclick="fetchDetails('${todo._id}')">Detail</a>
                  <a class="waves-effect waves-light btn-small teal modal-trigger" onclick="updateInprogress('${todo._id}')" style="margin-left: 50px">In Progress</a>
                </div>
            </div>
            <div class="card-image">
              <a onclick="removeTask('${todo._id}', '${todo.name}')" class="btn-small transparent" style="position:absolute;; font-size:10px; color: red; top: 3px; right:3px; height:30px">
                <i class="fas fa-times"></i>
              </a>
            </div>
          </div>
        </div>
          `)
        }else{
          $('#dataPending').append(`
          <div class="row">
          <div class="col s12">
          <div class="card horizontal" style="height: 200px;">
            <div class="card-stacked green lighten-4">
              <div class="card-action">
              <i class="fas fa-filter"><span>${todo.name}</span></i>
              </div>
              <div class="card-content">
                  <p>${todo.type}<p>
                  <p>Due Date: ${getFormatDate(todo.dueDate)}<p>
                  <p>Status: ${todo.status}<p>
                  <a class="waves-effect waves-light btn-small teal modal-trigger" onclick="fetchDetails('${todo._id}')" style="width: 100px">Detail</a>
                  <a class="waves-effect waves-light btn-small teal modal-trigger" onclick="updateInprogress('${todo._id}')" style="margin-left: 50px">In Progress</a>
              </div>
            </div>
            <div class="card-image">
              <a onclick="removeTask('${todo._id}', '${todo.name}')" class="btn-small transparent" style="position:absolute;; font-size:10px; color: red; top: 3px; right:3px; height:30px">
                <i class="fas fa-times"></i>
              </a>
            </div>
          </div>
        </div>
        `)
        }
      });
    }else{
      $('#dataPending').append(`
      <div style="margin-left: 40px; margin-top: 100px">
        <div class="col s3 animated fadeIn">
          <div class="card horizontal" style="height: 100px; width:300px">
            <div class="card-stacked">
              <div class="card-content">
                <center>
                <h5>No Pending Task</h5>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
      `)
    }
  })
  .fail(function(error){
    console.log('masuk error')
    console.log(error)
  })
}

function fetchInprogress(){
  console.log('masuk fetch inprogress')
  $('#dataInprogress').empty()
  $.ajax({
      url: `${baseUrl}/todos/in progress`,
      method: 'get',
      dataType: 'json',
      headers: {
        token: localStorage.token
      }
  })
  .done(function(data){
    console.log('fetch inprogress')
    console.log(data.todos)
    let todos= data.todos
    if(todos.length > 0){
      todos.forEach(todo => {
        if(todo.type== 'mandatory'){
          $('#dataInprogress').append(`
          <div class="row">
          <div class="col s12">
          <div class="card horizontal" style="height: 200px">
            <div class="card-stacked red lighten-4">
              <div class="card-action">
                <i class="fas fa-exclamation-triangle"><span>${todo.name}</span></i>
              </div>
               <div class="card-content">
                  <p>${todo.type}<p>
                  <p>Due Date: ${getFormatDate(todo.dueDate)}<p>
                  <p>Status: ${todo.status}<p>
                  <a class="waves-effect waves-light btn-small teal modal-trigger" onclick="fetchDetails('${todo._id}')" style="width: 100px">Detail</a>
                  <a class="waves-effect waves-light btn-small teal modal-trigger" onclick="updateComplete('${todo._id}')" style="margin-left: 50px">Done</a>
                </div>
            </div>
            <div class="card-image">
                <a onclick="removeTask('${todo._id}', '${todo.name}')" class="btn-small transparent" style="position:absolute;; font-size:10px; color: red; top: 3px; right:3px; height:30px">
                  <i class="fas fa-times"></i>
                </a>
              </div>
          </div>
        </div>
          `)
        }else{
          $('#dataInprogress').append(`
          <div class="row">
          <div class="col s12">
          <div class="card horizontal" style="height: 200px;">
            <div class="card-stacked green lighten-4">
              <div class="card-action">
              <i class="fas fa-filter"><span>${todo.name}</span></i>
              </div>
              <div class="card-content">
                  <p>${todo.type}<p>
                  <p>Due Date: ${getFormatDate(todo.dueDate)}<p>
                  <p>Status: ${todo.status}<p>
                  <a class="waves-effect waves-light btn-small teal modal-trigger" onclick="fetchDetails('${todo._id}')" style="width: 100px">Detail</a>
                  <a class="waves-effect waves-light btn-small teal modal-trigger" onclick="updateComplete('${todo._id}')" style="margin-left: 50px">Done</a>
              </div>
            </div>
            <div class="card-image">
                <a onclick="removeTask('${todo._id}', '${todo.name}')" class="btn-small transparent" style="position:absolute;; font-size:10px; color: red; top: 3px; right:3px; height:30px">
                  <i class="fas fa-times"></i>
                </a>
              </div>
          </div>
        </div>
        `)
        }
      });
    }else{
      $('#dataInprogress').append(`
      <div style="margin-left: 40px; margin-top: 100px">
        <div class="col s3 animated fadeIn">
          <div class="card horizontal" style="height: 100px; width:300px">
            <div class="card-stacked">
              <div class="card-content">
                <center>
                <h5>No In Progress Task</h5>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
      `)
    }
  })
  .fail(function(error){
    console.log('masuk error')
    console.log(error)
  })
}

function fetchComplete(){
  console.log('masuk fetch complete')
  $('#dataComplete').empty()
  $.ajax({
      url: `${baseUrl}/todos/Done`,
      method: 'get',
      dataType: 'json',
      headers: {
        token: localStorage.token
      }
  })
  .done(function(data){
    console.log('fetch fetch complete')
    console.log(data.todos)
    let todos= data.todos
    if(todos.length > 0){
      todos.forEach(todo => {
        if(todo.type== 'mandatory'){
          $('#dataComplete').append(`
          <div class="row">
          <div class="col s12">
          <div class="card horizontal" style="height: 200px">
            <div class="card-stacked red lighten-4">
              <div class="card-action">
                <i class="fas fa-exclamation-triangle"><span>${todo.name}</span></i>
              </div>
               <div class="card-content">
                  <p>${todo.type}<p>
                  <p>Due Date:${getFormatDate(todo.dueDate)}<p>
                  <p>Status: ${todo.status}<p>
                  <a class="waves-effect waves-light btn-small teal modal-trigger" onclick="fetchDetails('${todo._id}')" style="width: 100px">Detail</a>
                </div>
            </div>
              <div class="card-image">
                <a onclick="removeTask('${todo._id}', '${todo.name}')" class="btn-small transparent" style="position:absolute;; font-size:10px; color: red; top: 3px; right:3px; height:30px">
                  <i class="fas fa-times"></i>
                </a>
              </div>
          </div>
        </div>
          `)
        }else{
          $('#dataComplete').append(`
          <div class="row">
          <div class="col s12">
          <div class="card horizontal" style="height: 200px;">
            <div class="card-stacked green lighten-4">
              <div class="card-action">
              <i class="fas fa-filter"><span>${todo.name}</span></i>
              </div>
              <div class="card-content">
                  <p>${todo.type}<p>
                  <p>Due Date: ${todo.dueDate}<p>
                  <p>Status: ${todo.status}<p>
                  <a class="waves-effect waves-light btn-small teal modal-trigger" onclick="fetchDetails('${todo._id}')" style="width: 100px">Detail</a>
              </div>
            </div>
            <div class="card-image">
              <a onclick="removeTask('${todo._id}', '${todo.name}')" class="btn-small transparent" style="position:absolute;; font-size:10px; color: red; top: 3px; right:3px; height:30px">
                <i class="fas fa-times"></i>
              </a>
          </div>
          </div>
        </div>
        `)
        }
      });
    }else{
      $('#dataComplete').append(`
      <div style="margin-left: 40px; margin-top: 100px">
        <div class="col s3 animated fadeIn">
          <div class="card horizontal" style="height: 100px; width:300px">
            <div class="card-stacked">
              <div class="card-content">
                <center>
                <h5>No Complete Task</h5>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
      `)
    }
  })
  .fail(function(error){
    console.log('masuk error')
    console.log(error)
  })
}

function fetchHistory(){
  console.log('masuk fetch history')
    $.ajax({
      url: `${baseUrl}/todos`,
      method: 'get',
      dataType: 'json',
      headers: {
        token: localStorage.token
      }
    })
    .done(function(data){
      console.log(data)
      let todos= data.todos
      if(todos.length>0){
        todos.forEach(todo => {
          if(todo.type== 'mandatory'){
            $('#dataHistory').append(`
              <div class="row" style="height:100px;">
              <div class="col s12" >
              <h5 class="header">${todo.name}</h5>
              <div class="card horizontal">
                <div class="card-stacked red lighten-4">
                  <div class="card-content">
                  <i class="fas fa-exclamation-triangle"><span> ${todo.type}</span></i>
                    <p>Due Date: ${getFormatDate(todo.dueDate)}</p>
                    <p>Status: ${todo.status}</p>
                    <p>End Date: ${getFormatDate(todo.endDate)}<p>
                    <p>${todo.description}</p>
                  </div>
                </div>
              </div>
              <div class="card-image">
                <a onclick="removeTask('${todo._id}', '${todo.name}')" class="btn-small transparent" style="position:absolute;; font-size:10px; color: red; top: 3px; right:3px; height:30px">
                  <i class="fas fa-times"></i>
                </a>
            </div>
            </div>
            </div>
            `)
          }else{
            $('#dataHistory').append(`
            <div class="row" style="height:100px;">
              <div class="col s12" >
              <h5 class="header">${todo.name}</h5>
              <div class="card horizontal">
                <div class="card-stacked green lighten-4">
                  <div class="card-content">
                  <i class="fas fa-filter"><span> ${todo.type}</span></i>
                    <p>Due Date: ${getFormatDate(todo.dueDate)}</p>
                    <p>Status: ${todo.status}</p>
                    <p>End Date: ${getFormatDate(todo.endDate)}<p>
                    <p>${todo.description}</p>
                  </div>
                </div>
              </div>
              <div class="card-image">
                <a onclick="removeTask('${todo._id}', '${todo.name}')" class="btn-small transparent" style="position:absolute;; font-size:10px; color: red; top: 3px; right:3px; height:30px">
                  <i class="fas fa-times"></i>
                </a>
            </div>
            </div>
            </div>
          `)
          }
        });
      }else{
        $('#dataHistory').append(`
        <div style="margin-left:400px; margin-top:120px">
          <div class="col s6 animated fadeIn">
            <div class="card horizontal">
              <div class="card-stacked">
                <div class="card-content">
                  <center>
                    <h5>No History Task</h5>
                  </center>
                </div>
              </div>
            </div>
          </div>
        </div>
        `)
      }
    })
    .fail(function(error){
      console.log('masuk error')
      console.log(error)
    })
}

function fetchDeadline(){
  console.log('masuk fetch deadline')
    $.ajax({
      url: `${baseUrl}/todos/status/deadline`,
      method: 'get',
      dataType: 'json',
      headers: {
        token: localStorage.token
      }
    })
    .done(function(data){
      console.log(data.data.length)
      let todos= data.data
      if(todos.length>0){
        todos.forEach(todo => {
          if(todo.type== 'mandatory'){
            $('#dataDeadline').append(`
              <div class="row" style="height:100px;">
              <div class="col s12" >
              <h5 class="header">${todo.name}</h5>
              <div class="card horizontal">
                <div class="card-stacked red lighten-4">
                  <div class="card-content">
                  <i class="fas fa-exclamation-triangle"><span> ${todo.type}</span></i>
                    <p>Due Date: ${getFormatDate(todo.dueDate)}</p>
                    <p>Status: ${todo.status}</p>
                    <p>End Date: ${getFormatDate(todo.endDate)}<p>
                    <p>${todo.description}</p>
                  </div>
                </div>
              </div>
            </div>
            </div>
            `)
          }else{
            $('#dataDeadline').append(`
            <div class="row" style="height:100px;">
              <div class="col s12" >
              <h5 class="header">${todo.name}</h5>
              <div class="card horizontal">
                <div class="card-stacked green lighten-4">
                  <div class="card-content">
                  <i class="fas fa-filter"><span> ${todo.type}</span></i>
                    <p>Due Date: ${getFormatDate(todo.dueDate)}</p>
                    <p>Status: ${todo.status}</p>
                    <p>End Date: ${getFormatDate(todo.endDate)}<p>
                    <p>${todo.description}</p>
                  </div>
                </div>
              </div>
            </div>
            </div>
          `)
          }
        });
      }else{
        $('#dataDeadline').append(`
        <div style="margin-left:400px; margin-top:120px">
          <div class="col s6 animated fadeIn">
            <div class="card horizontal">
              <div class="card-stacked">
                <div class="card-content">
                  <center>
                    <h5>No Dealine Task for Tommorow</h5>
                  </center>
                </div>
              </div>
            </div>
          </div>
        </div>
        `)
      }
    })
    .fail(function(error){
      console.log('masuk error')
      console.log(error)
    })
}


$(document).ready(function() {
    console.log('ready!')

    isLoggedIn()
    // hasToken()

    $('#register').submit(function (event) {
      event.preventDefault()
      let newUser = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        email: $('#emailRegis').val(),
        password: $('#passwordRegis').val()
      }
      console.log(newUser, 'new User')
       register(newUser)
    })
  
    $('#login').submit(function (event) {
      event.preventDefault()
      let loginOption = {
        email: $('#email').val(),
        password: $('#password').val()
      }
      console.log('masuk login')
      console.log( $('#email').val())
       login(loginOption)
    })
  
    $('#toRegister').click(function(){
      event.preventDefault()
      $('#login').hide()
      $('#register').show()
    })
  
    $('#toLogin').click(function() {
      event.preventDefault()
      $('#login').show()
      $('#register').hide()
    })
  
  
    $('#logout').click(function() {
      event.preventDefault()
      logout()
    })

    $('#toAdd').click(function(){
        $('#rowAddTask').show()
        $('#rowHistory').hide()
        $('#rowDeadline').hide()
        $('#titleDataTask').hide()
        $('#dataTask').hide()
        
        
    })

    $('#formAddTask').submit(function(event){
      event.preventDefault()
        let newTask={
          title: $('#title').val(),
          description: $('#description').val(),
          dueDate: $('#dueDate').val(),
          type:$('#type').val(),
        }
  
        addTask(newTask)      
    })

    $('#toHistory').click(function(){
      $('#rowAddTask').hide()
      $('#rowHistory').show()
      $('#rowDeadline').hide()
      $('#titleDataTask').hide()
      $('#dataTask').hide()

      fetchHistory()
  })
  $('#toDeadline').click(function(){
    $('#rowAddTask').hide()
    $('#rowHistory').hide()
    $('#rowDeadline').show()
    $('#titleDataTask').hide()
    $('#dataTask').hide()

    fetchDeadline()
  })

  $('#toHome').click(function(){
    $('#rowAddTask').hide()
    $('#rowHistory').hide()
    $('#rowDeadline').hide()
    $('#titleDataTask').show()
    $('#dataTask').show()
      fetchPending()
      fetchInprogress()
      fetchComplete()
  })

  });

