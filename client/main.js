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
var tempUsers = []
var tempProjects = []

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

function emptyLogReg() {
  $('#nameregister').val('')
  $('#emailregister').val('')
  $('#passwordregister').val('')
  $('#emaillogin').val('')
  $('#passwordlogin').val('')
}

function emptyNewTodo() {
  $('#newTodoTitle').val('')
  $('#newTodoDesc').val('')
  $('#newTodoDuedate').val('')
}

function emptyNewProject() {
  $('#newProjectTitle').val('')
  $('#newProjectDesc').val('')
  $('#newProjectDuedate').val('')
  $('#selectListNewUsers').empty()
  $('#newProjectAddedUsers').empty()
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
    statusCode: {
      500: function () {
        window.location = './http-500.html'
      }
    }
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
    statusCode: {
      500: function () {
        window.location = './http-500.html'
      }
    }
  })
    .done((data) => {
      localStorage.setItem('access-token', data['access-token'])
      localStorage.setItem('_id', data['_id'])
      localStorage.setItem('name', data['name'])
      localStorage.setItem('email', data['email'])
      $('#profileName').text('Halo, ' + data['name'])
      showMessage(`Hai ${data.name}, kamu berhasil login`, 'success')
      console.log("success login", data)
      // $('#namaUser').text(data.name)
      getAllTodos()
      getAllProjects()
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
  if (!localStorage.getItem('access-token')) {
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
        if (data.newPass) {
          showMessage('Hurry up change your password now, your password is ' + data.newPass, 'info')
        }
        // signedInviaGoogle = true
        localStorage.setItem('access-token', data['access-token'])
        localStorage.setItem('_id', data['_id'])
        localStorage.setItem('name', data['name'])
        localStorage.setItem('email', data['email'])
        $('#profileName').text('Halo, ' + data['name'])
        showMessage(`Hai ${data.name}, kamu berhasil login`, 'success')
        getAllTodos()
        getAllProjects()
        $("#TodoLists").show()
        $("#login-register-form").hide()
      })
      .fail((err) => {
        showMessage(err.responseJSON.message, 'error')
      })
  }
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
  let project = $('#newTodoProject').val()
  let obj = {
    title: $('#newTodoTitle').val(),
    description: $('#newTodoDesc').val(),
    duedate: $('#newTodoDuedate').val()
  }
  if(project)
    obj.project = project
  $.ajax({
    url: `${baseURL}/todo`,
    method: 'POST',
    // crossDomain: true, // kalau error HTTP 405 Method not Allowed
    headers: { 'access-token': localStorage.getItem('access-token') },
    data: obj,
    statusCode: {
      500: function () {
        window.location = './http-500.html'
      }
    }
  })
    .done(function (todo) {
      $('#nav-todos-tab').tab('show')
      console.log(todo)
      showMessage(`<p>
        <strong>${todo.title}</strong> created successfully
        </p>`, 'success')
      $('#newTodoModal').modal('hide')
      emptyNewTodo()
      getAllTodos()
    })
    .fail((err) => {
      console.log(err)
      showMessage(err.responseJSON.message, 'error')
    })
}

function addNewProject() {
  event.preventDefault()
  let selecteds = $('#newProjectAddedUsers :checkbox:not(:disabled)').map(function() {
    return this.value;
  }).get()
  console.log(selecteds)
  let user = [...tempUsers.filter(obj => selecteds.includes(obj.email))]
  user = user.map(obj => obj._id)
  $.ajax({
    url: `${baseURL}/project`,
    method: 'POST',
    // crossDomain: true, // kalau error HTTP 405 Method not Allowed
    headers: { 'access-token': localStorage.getItem('access-token') },
    data: {
      user,
      title: $('#newProjectTitle').val(),
      description: $('#newProjectDesc').val(),
      duedate: $('#newProjectDuedate').val()
    },
    dataType: "json",
    statusCode: {
      500: function () {
        window.location = './http-500.html'
      }
    }
  })
    .done(function (project) {
      $('#nav-projects-tab').tab('show')
      showMessage(`<p>
        <strong>${project.title}</strong> created successfully
        </p>`, 'success')
      $('#newProjectModal').modal('hide')
      emptyNewProject()
      getAllProjects()
    })
    .fail((err) => {
      console.log(err)
      showMessage(err.responseJSON.message, 'error')
    })
}
// function getAllTodos() {
//   let selected = $('#filterTodosByStatus').val()
//   let searchText = $('#searchTodosText').val()
//   let query = ""
//   if (selected != "all status") {
//     query += `?status=${selected}`
//   }
//   if (searchText) {
//     if (query)
//       query += `&title=${searchText}`
//     else
//       query += `?title=${searchText}`
//   }

//   $.ajax({
//     url: `${baseURL}/todo/${query}`,
//     method: 'GET',
//     headers: { 'access-token': localStorage.getItem('access-token') },
//     // statusCode: {
//     //   500: function () {
//     //     window.location = './http-500.html'
//     //   }
//     // }
//   })
//     .done(todos => {
//       $('#resultTodos').empty()
//       for (let todo of todos) {
//         console.log(todo)
//         let badge, color, options
//         if (todo.status === 'unfinished')
//           badge = 'warning'
//         else
//           badge = 'success'
//         if (new Date(todo.duedate) > new Date())
//           color = 'primary'
//         else
//           color = 'danger'
//         if (todo.status === 'unfinished') {
//           options = `<option value="unfinished" selected>Unfinished</option>
//           <option value="finished">Finished</option>`
//         }
//         else {
//           options = `<option value="unfinished">Unfinished</option>
//           <option value="finished" selected>Finished</option>`
//         }
//         $('#resultTodos').append(`
//         <div id="show-${todo._id}" class="card">
//           <div class="card-body">
//             <h3 class="card-title text-center" style="font-family: 'Changa One', cursive;">${todo.title}</h3>
//             <div class="row">
//               <p class="col-sm-4">Description</p>
//               <h5 class="col-sm-8">${todo.description}</h5>
//             </div>
//             <div class="row">
//               <p class="col-sm-4">Status</p>
//               <div class="col-sm-8">
//                 <a onclick="$('#filterTodosByStatus').val('${todo.status}'); getAllTodos()" href="#" class="badge badge-${badge}">${todo.status}</a>
//               </div>

//             </div>
//             <div class="row">
//               <p class="col-sm-4">Due Date</p>
//               <h5 class="text-${color} col-sm-8">${moment(todo.duedate).fromNow()}</h5>
//             </div>
//           </div>
//           <div class="card-footer">
//             <div class="row justify-content-between mx-2">
//               <button onclick="$('#show-${todo._id}').hide(); $('#edit-${todo._id}').show()" class="btn btn-success">Edit</button>
//               <button onclick="deleteTodo('${todo._id}')" class="btn btn-danger">Delete</button>
//             </div>
//           </div>
//         </div>
//         <div id="edit-${todo._id}" class="card" style="display: none;">
//           <form onsubmit=updateTodo('${todo._id}','${todo.user}')>
//             <div class="card-body">
//               <div class="form-group row">
//                 <label for="todo-form-title-${todo._id}" class="col-sm-4 col-form-label">Title</label>
//                 <div class="col-sm-8">
//                   <input id="todo-form-title-${todo._id}" class="form-control" type="text" value="${todo.title}">
//                 </div>
//               </div>
//               <div class="form-group row">
//                 <label for="todo-form-description-${todo._id}" class="col-sm-4 col-form-label">Description</label>
//                 <div class="col-sm-8">
//                   <textarea id="todo-form-description-${todo._id}" class="form-control" rows="1">${todo.description}</textarea>
//                 </div>
//               </div>
//               <div class="form-group row">
//                 <label for="todo-form-status-${todo._id}" class="col-sm-4 col-form-label">Status</label>
//                 <div class="col-sm-8">
//                   <select id="todo-form-status-${todo._id}" class="form-control">
//                     ${options}
//                   </select>
//                 </div>
//               </div>
//               <div class="form-group row">
//                 <label for="todo-form-duedate-${todo._id}" class="col-sm-4 col-form-label">Due Date</label>
//                 <div class="col-sm-8">
//                   <input id="todo-form-duedate-${todo._id}" class="form-control" type="datetime-local" value="${moment(todo.duedate).format().slice(0, 16)}">
//                 </div>

//               </div>
//             </div>
//             <div class="card-footer">
//               <div class="row justify-content-between mx-2">
//                 <button type="submit" class="btn btn-primary">Submit</button>
//                 <button onclick="event.preventDefault(); $('#show-${todo._id}').show(); $('#edit-${todo._id}').hide()" class="btn btn-secondary">Cancel</button>
//               </div>
//             </div>
//           </form>
//         </div>
//         `)
//       }
//     })
//     .fail((err) => {
//       console.log(err)
//       showMessage(err.responseJSON.message, 'error')
//     })
// }

// function updateTodo(todoId, userId) {
//   event.preventDefault()
//   let title = $(`#todo-form-title-${todoId}`).val()
//   let description = $(`#todo-form-description-${todoId}`).val()
//   let status = $(`#todo-form-status-${todoId}`).val()
//   let duedate = $(`#todo-form-duedate-${todoId}`).val()
//   $.ajax({
//     url: `${baseURL}/todo/${todoId}`,
//     method: 'PUT',
//     headers: { 'access-token': localStorage.getItem('access-token') },
//     data: {
//       user: userId,
//       title,
//       description,
//       status,
//       duedate,
//     },
//     // statusCode: {
//     //   500: function () {
//     //     window.location = './http-500.html'
//     //   }
//     // }
//   })
//     .done(todo => {
//       showMessage(`<p>
//       <strong>${todo.title}</strong> updated successfully
//       </p>`, 'success')
//       // dontRefresh()
//       getAllTodos()
//       $('#editTodoForm').hide()
//     })
//     .fail((err) => {
//       console.log(err)
//       showMessage(err.responseJSON.message, 'error')
//     })
// }

// function editTodo(todo) {
//   event.preventDefault()
//   todo = JSON.parse(todo)
// $('#editTodoForm').show()
// $('#selectedTitle').val(todo.title)
// $('#selectedDescription').val(todo.description)
// $('#selectedStatus').val(todo.status)
// todo.duedate = moment(todo.duedate).format().slice(0, 16)
// $('#selectedDueDate').val(todo.duedate)
//   // console.log(typeof todo._id)
//   // $('#editTodoForm').attr("onsubmit", `updateTodo('${todo._id}','${todo.user}')`)
// }

function getAllTodos(todoId) {
  let selected = $('#filterTodosByStatus').val()
  let searchText = $('#searchTodosText').val()
  let query = ""
  if(todoId){
    query += `?_id=${todoId}`
  }
  else {
    if (selected != "all status") {
      query += `?status=${selected}`
    }
    if (searchText) {
      if (query)
        query += `&title=${searchText}`
      else
        query += `?title=${searchText}`
    }
  }
  console.log(query)
  $.ajax({
    url: `${baseURL}/todo/${query}`,
    method: 'GET',
    headers: { 'access-token': localStorage.getItem('access-token') },
    statusCode: {
      500: function () {
        window.location = './http-500.html'
      }
    }
  })
    .done(todos => {
      $('#resultTodos').empty()
      for (let todo of todos) {
        let badge, color, projectTitle = ''
        if (todo.status === 'unfinished')
          badge = 'warning'
        else
          badge = 'success'
        if (new Date(todo.duedate) > new Date())
          color = 'primary'
        else
          color = 'danger'
        if(todo.project)
          projectTitle = todo.project.title
        $('#resultTodos').append(`
        <div class="card">
          <div class="card-body">
            <h3 class="card-title text-center" style="font-family: 'Changa One', cursive;">${todo.title}</h3>
            <div class="row">
              <p class="col-sm-4">Project</p>
              <h5 class="col-sm-8">${projectTitle}</h5>
            </div>
            <div class="row">
              <p class="col-sm-4">Description</p>
              <h5 class="col-sm-8">${todo.description}</h5>
            </div>
            <div class="row">
              <p class="col-sm-4">Status</p>
              <div class="col-sm-8">
                <a onclick="$('#filterTodosByStatus').val('${todo.status}'); getAllTodos()" href="#" class="badge badge-${badge}">${todo.status}</a>
              </div>
              
            </div>
            <div class="row">
              <p class="col-sm-4">Due Date</p>
              <h5 class="text-${color} col-sm-8">${moment(todo.duedate).fromNow()}</h5>
            </div>
          </div>
          <div class="card-footer">
            <div class="row justify-content-between mx-2">
              <button onclick=showModalEditTodo('${JSON.stringify(todo)}') class="btn btn-success" data-toggle="modal"
              data-target="#editTodoModal">Edit</button>
              <button onclick="deleteTodo('${todo._id}')" class="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
        `)
      }
    })
    .fail((err) => {
      console.log(err)
      showMessage(err.responseJSON.message, 'error')
    })
}

function getAllProjects() {
  let selected = $('#filterProjectsByStatus').val()
  let searchText = $('#searchProjectsText').val()
  let query = ""
  if (selected != "all status") {
    query += `?status=${selected}`
  }
  if (searchText) {
    if (query)
      query += `&title=${searchText}`
    else
      query += `?title=${searchText}`
  }
  $.ajax({
    url: `${baseURL}/project/${query}`,
    method: 'GET',
    headers: { 'access-token': localStorage.getItem('access-token') },
    statusCode: {
      500: function () {
        window.location = './http-500.html'
      }
    }
  })
    .done(projects => {
      $('#resultProjects').empty()
      tempProjects = [...projects]
      for (let project of projects) {
        let badge, color, emails = '', todosTitle = ''
        if (project.status === 'unfinished')
          badge = 'warning'
        else
          badge = 'success'
        if (new Date(project.duedate) > new Date())
          color = 'primary'
        else
          color = 'danger'
        for (let user of project.user) {
          if(user.email !== localStorage.getItem('email')) {
            emails += `<button class="list-group-item list-group-item-action">${user.email}</button>`
          }
        }
        for (let todo of project.todo) {
          let color
          if(todo.status === 'unfinished')
            color = 'warning'
          else
            color = 'success'
          todosTitle += `<button onclick="$('#nav-todos-tab').tab('show'); getAllTodos('${todo._id}');" class="list-group-item list-group-item-action bg-${color}">${todo.title}</button>`
        }

        $('#resultProjects').append(`
        <div class="card">
          <div class="card-body">
            <h3 class="card-title text-center" style="font-family: 'Changa One', cursive;">${project.title}</h3>
            <div class="row">
              <p class="col-sm-4">Members</p>
              <div class="overflow-auto col-sm-8" style="height: 200px">
                <div class="list-group">
                  <button class="list-group-item list-group-item-action bg-info active">
                    ${localStorage.getItem('email')}
                  </button>
                  ${emails}
                </div>
              </div>
            </div>
            <div class="row">
              <p class="col-sm-4">Todos</p>
              <div class="overflow-auto col-sm-8" style="height: 200px">
                <div class="list-group">
                  ${todosTitle}
                </div>
              </div>
            </div>
            <div class="row">
              <p class="col-sm-4">Description</p>
              <h5 class="col-sm-8">${project.description}</h5>
            </div>
            <div class="row">
              <p class="col-sm-4">Status</p>
              <div class="col-sm-8">
                <a onclick="$('#filterProjectsByStatus').val('${project.status}'); getAllProjects()" href="#" class="badge badge-${badge}">${project.status}</a>
              </div>
              
            </div>
            <div class="row">
              <p class="col-sm-4">Due Date</p>
              <h5 class="text-${color} col-sm-8">${moment(project.duedate).fromNow()}</h5>
            </div>
          </div>
          <div class="card-footer">
            <div class="row justify-content-between mx-2">
              <button onclick=showModalEditProject('${JSON.stringify(project)}') class="btn btn-success" data-toggle="modal"
              data-target="#editProjectModal">Edit</button>
              <button onclick="deleteProject('${project._id}')" class="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
        `)
      }
    })
    .fail((err) => {
      console.log(err)
      showMessage(err.responseJSON.message, 'error')
    })
}

function updateTodo(todoId, userId) {
  event.preventDefault()
  let obj = { user: userId }
  obj.project = $('#editTodoProject').val()
  obj.title = $('#editTodoTitle').val()
  obj.description = $('#editTodoDesc').val()
  obj.status = $('#editTodoStatus').val()
  obj.duedate = $('#editTodoDuedate').val()
  console.log(obj)
  $.ajax({
    url: `${baseURL}/todo/${todoId}`,
    method: 'PUT',
    headers: { 'access-token': localStorage.getItem('access-token') },
    data: obj,
    statusCode: {
      500: function () {
        window.location = './http-500.html'
      }
    }
  })
    .done(todo => {
      $('#editTodoModal').modal('hide')
      console.log(todo)
      showMessage(`<p>
      <strong>${todo.title}</strong> updated successfully
      </p>`, 'success')
      // dontRefresh()
      getAllTodos()
    })
    .fail((err) => {
      console.log(err)
      showMessage(err.responseJSON.message, 'error')
    })
}

function updateProject(projectId, userId) {
  event.preventDefault()
  let selecteds = $('#editProjectAddedUsers :checkbox:not(:disabled)').map(function() {
    return this.value;
  }).get()
  console.log(selecteds)
  let user = [...tempUsers.filter(obj => selecteds.includes(obj.email))]
  user = user.map(obj => obj._id)
  let obj = { user }
  obj.todo = $('#editProjectTodos').val()
  obj.title = $('#editProjectTitle').val()
  obj.description = $('#editProjectDesc').val()
  obj.status = $('#editProjectStatus').val()
  obj.duedate = $('#editProjectDuedate').val()
  console.log(obj)
  $.ajax({
    url: `${baseURL}/project/${projectId}`,
    method: 'PUT',
    headers: { 'access-token': localStorage.getItem('access-token') },
    data: obj,
    dataType: 'json'
    statusCode: {
      500: function () {
        window.location = './http-500.html'
      }
    }
  })
    .done(project => {
      $('#editProjectModal').modal('hide')
      console.log(project)
      showMessage(`<p>
      <strong>${project.title}</strong> updated successfully
      </p>`, 'success')
      // dontRefresh()
      getAllProjects()
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
    statusCode: {
      500: function () {
        window.location = './http-500.html'
      }
    }
  })
    .done(todo => {
      showMessage(`<p>
      <strong>${todo.title}</strong> deleted successfully
      </p>`, 'success')
      // dontRefresh()
      getAllTodos()
    })
    .fail((err) => {
      console.log(err)
      showMessage(err.responseJSON.message, 'error')
    })
}

function deleteProject(projectId) {
  event.preventDefault()
  console.log(projectId)
  $.ajax({
    url: `${baseURL}/project/${projectId}`,
    method: 'DELETE',
    headers: { 'access-token': localStorage.getItem('access-token') },
    statusCode: {
      500: function () {
        window.location = './http-500.html'
      }
    }
  })
    .done(project => {
      showMessage(`<p>
      <strong>${project.title}</strong> deleted successfully
      </p>`, 'success')
      // dontRefresh()
      getAllProjects()
    })
    .fail((err) => {
      console.log(err)
      showMessage(err.responseJSON.message, 'error')
    })
}

function addNewUser() {
  let selected = $('#selectNewUser').val()
  if(tempUsers.find(obj => obj.email === selected)) {
    $(`#selectListNewUsers option[value="${selected}"]`).remove()
    $('#selectNewUser').val('')
    $('#newProjectAddedUsers').append(`
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="${selected}" id="${selected}">
      <label class="form-check-label" for="${selected}">
        ${selected}
      </label>
    </div>
    `)
  }
  else
    showMessage("User doesn't exist", 'error')
}

function removeNewUsers() {
  let selecteds = $('#newProjectAddedUsers :checkbox:checked').map(function() {
    return this.value;
}).get()
  $('#newProjectAddedUsers :checkbox:checked').closest('.form-check').remove()
  for (let selected of selecteds) {
    $('#selectListNewUsers').append(`
      <option value="${selected}">
    `)
  }
  // $(`#selectListNewUsers option[value="${selected}"]`).remove()
  // $('#selectUser').val('')
  // $('#newProjectAddedUsers').append(`
  // <div class="form-check">
  //   <input class="form-check-input" type="checkbox" value="${selected}" id="defaultCheck1">
  //   <label class="form-check-label" for="defaultCheck1">
  //     ${selected}
  //   </label>
  // </div>
  // `)
}

function addEditUser(userFromTemp) {
  let selected = userFromTemp || $('#selectEditUser').val()
  if(tempUsers.find(obj => obj.email === selected)) {
    $(`#selectListEditUsers option[value="${selected}"]`).remove()
    $('#selectEditUser').val('')
    $('#editProjectAddedUsers').append(`
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="${selected}" id="${selected}">
      <label class="form-check-label" for="${selected}">
        ${selected}
      </label>
    </div>
    `)
  }
  else
    showMessage("User doesn't exist", 'error')
}

function removeEditUsers() {
  let selecteds = $('#editProjectAddedUsers :checkbox:checked').map(function() {
    return this.value;
}).get()
  $('#editProjectAddedUsers :checkbox:checked').closest('.form-check').remove()
  for (let selected of selecteds) {
    $('#selectListEditUsers').append(`
      <option value="${selected}">
    `)
  }
  // $(`#selectListUsers option[value="${selected}"]`).remove()
  // $('#selectUser').val('')
  // $('#newProjectAddedUsers').append(`
  // <div class="form-check">
  //   <input class="form-check-input" type="checkbox" value="${selected}" id="defaultCheck1">
  //   <label class="form-check-label" for="defaultCheck1">
  //     ${selected}
  //   </label>
  // </div>
  // `)
}

function showModalNewTodo() {
  $('#newTodoDuedate').val(moment().add(1, 'days').format().slice(0, 16))
  $('#newTodoProject').empty()
  tempProjects.forEach(project => {
    $('#newTodoProject').append(`
      <option value="${project._id}">${project.title}</option>
    `)
  })
}

function showModalEditTodo(todo) {
  todo = JSON.parse(todo)
  $('#editTodoProject').empty()
  tempProjects.forEach(project => {
    let selected = ''
    if(todo.project) {
      if(project._id === todo.project._id)
        selected = ' selected'
    }
    $('#editTodoProject').append(`
      <option value="${project._id}"${selected}>${project.title}</option>
    `)
  })
  $('#editTodoTitle').val(todo.title)
  $('#editTodoDesc').val(todo.description)
  $('#editTodoStatus').val(todo.status)
  todo.duedate = moment(todo.duedate).format().slice(0, 16)
  $('#editTodoDuedate').val(todo.duedate)
  // console.log(typeof todo._id)
  $('#editTodoForm').attr("onsubmit", `updateTodo('${todo._id}','${todo.user}')`)
}


function showModalNewProject() {
  listAllUsers()
  $('#newProjectAddedUsers').append(`
  <div class="form-check">
  <input class="form-check-input" type="checkbox" value="${localStorage.getItem('email')}" id="${localStorage.getItem('email')}" disabled>
  <label id="yourEmail" class="form-check-label" for="${localStorage.getItem('email')}">
  ${localStorage.getItem('email')}
  </label>
  </div>
  `)
  $('#yourEmail').text('(You) ' + localStorage.getItem('email'))
  $('#newProjectDuedate').val(moment().add(1, 'days').format().slice(0, 16))
}

function showModalEditProject(project) {
  console.log(project.user)
  listAllUsers(project.user)
  project = JSON.parse(project)
  $('#editProjectTitle').val(project.title)
  $('#editProjectDesc').val(project.description)
  $('#editProjectStatus').val(project.status)
  project.duedate = moment(project.duedate).format().slice(0, 16)
  $('#editProjectDuedate').val(project.duedate)
  // console.log(typeof project._id)
  $('#editProjectForm').attr("onsubmit", `updateProject('${project._id}','${project.user}')`)
}

function listAllUsers(projectUsers) {
  $.ajax({
    url: `${baseURL}/user`,
    method: 'GET',
    headers: { 'access-token': localStorage.getItem('access-token') },
    statusCode: {
      500: function () {
        window.location = './http-500.html'
      }
    }
  })
    .done(users => {
      if(projectUsers)
        tempUsers = [...projectUsers]
      else
        tempUsers = [...users]
      console.log(tempUsers)
      for (let user of tempUsers) {
        if(user.email !== localStorage.getItem('email')) {
          $('#selectListNewUsers').append(`
            <option value="${user.email}">
          `)
          $('#selectListEditUsers').append(`
            <option value="${user.email}">
          `)
        }
      }
    })
    .fail((err) => {
      console.log(err)
      showMessage(err.responseJSON.message, 'error')
    })
}

$(document).ready(() => {
  if (localStorage.hasOwnProperty('access-token')) {
    $('#profileName').text('Halo, ' + localStorage.getItem('name'))
    $("#TodoLists").show()
    getAllTodos()
    getAllProjects()
  }
  else {
    $("#login-register-form").show()
  }
})