function showLogin() {
  $('#login-page').show()
}

function showRegister() {
  $('#register-page').html(
      ` <div class="d-flex justify-content-center" style="width:800px; margin:10px auto;">
            <img src="https://cdn4.iconfinder.com/data/icons/ios-web-user-interface-multi-circle-flat-vol-4/512/Check_check_marks_list_checklist_documents_todo_list-512.png" alt="logo Todoz" style="width:100px">
        </div>
      <hr>
      <div class="d-flex justify-content-center mb-5" style="width:500px; margin:10px auto;">
          <form style="width: 100%">
            <p style="font-weight: bold; text-align: center;">Sign up with your email</p> 
            <div class="form-group">
              <input type="email" class="form-control rounded-0" id="register-email" aria-describedby="emailHelp" placeholder="Email address">
            </div>
            <div class="form-group">
              <input type="email" class="form-control rounded-0" id="register-email-confirm" placeholder="Confirm email address">
            </div>
            <div class="form-group">
              <input type="text" class="form-control rounded-0" id="register-name" placeholder="Your name">
            </div>
            <div class="form-group">
              <input type="password" class="form-control rounded-0" id="register-pass" placeholder="Password">
            </div>
            <button onclick="register()" type="submit" class="btn btn-info rounded-pill" style="width:100%; height: 50px; font-weight:bold;">SIGN UP</button>
          </form>
        </div>
        <hr style="border: 1px solid rgb(153, 150, 150); width:500px">
        <div class="d-flex justify-content-center" style="width:500px; margin:50px auto;">
          <form style="width: 100%">
            <h5 style="text-align: center; font-weight:bold; "> 
              Don't have an account?
            </h5>
            <div class="form-group mt-4">
              <button onclick="initial()" type="submit" class="btn btn btn-outline-secondary rounded-pill" style="width:100%; height: 50px; font-weight:bold;">LOGIN</button>
            </div>
          </form>  
        </div>`
  )
}

function showNavbar() {
  $('#navbar').html(`
  <nav class="navbar navbar-expand-lg navbar-light" style="background-color:#CFEEF6">
    <a onclick="initial()" class="navbar-brand" href="#">
    <img style="height:50px" src= "https://cdn4.iconfinder.com/data/icons/ios-web-user-interface-multi-circle-flat-vol-4/512/Check_check_marks_list_checklist_documents_todo_list-512.png">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <h4><a onclick="initial()" class="nav-link" href="#">Todo</a></h4>
        </li>
        <li class="nav-item">
          <h4><a onclick="projectTrigger()" class="nav-link" href="#">Project</a></h4>
        </li>
      </ul>
      <a onclick="logout()" class="nav-link" href="#" style="color:black">Log out</a>
    </div>
  </nav>
  `)
}

function showMainTodo() {
  $('#main-todo').html(
    `
    <div class="row">
      <div class="col-6 overflow-auto" style="max-height:80vh">
      <div class="row p-2">
        <div class="col-2">
          <button type="button" class="btn btn-info rounded-pill" data-toggle="modal" data-target="#exampleModal"> + Todo</button>
        </div>
        <div class="col-10 p-1">
            <h3 style="font-weight:bold; text-align:center"> Todo List </h3>
        </div>
      </div>
        <ul id="list-todo" class="list-group list-group-flush"></ul>
      </div>
      <div class="col-6">
        <div class="col-12 p-1 mt-2">
            <h3 style="font-weight:bold; text-align:center"> Todo Description </h3>
        </div>
        <div class="mt-3" id="description-todo"> </div
      </div>
    </div>
    `
  )
  showTodo()
}

function showTodo() {
  fetchTodo()
  .then(({ data }) =>{
    data.forEach(el => {
      $('#list-todo').append(`
        <li class="list-group-item">
        <h5>
          <a href="#" onclick="showDescriptionTodo('${el._id}','${el.title}','${el.description}','${el.due_date}','${el.dayLeft}')" >
          ${el.title}
          </a>
        </h5>
        </li>
    `)
    });
  })
  .catch(err =>{
    showError(err)
  })
}

function showDescriptionTodo(id,title,description,due_date,dayLeft) {
  event.preventDefault()
  $('#description-todo').html(`
  <div class="card text-center">
    <div class="card-header">
      ${title}
    </div>
    <div class="card-body">
      <p class="card-title">${description}</p>
    </div>
    <div class="card-footer text-muted">
      due date: ${due_date} | ${dayLeft} days left
    </div>
    <div class="card-footer text-muted">
    <a data-toggle="modal" data-target="#update-todo" onclick="showUpdateTodo('${id}','${title}','${description}','${due_date}')" href="#">Update</a> | <a onclick="deleteTodo('${id}')" style="color:red" href="#">Delete</a>
    </div>
  </div>
  `)
}

function showUpdateTodo(id,title,description,due_date) {
  $('#update-todo-page').html(

    `
    <div class="modal fade mt-3" id="update-todo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header bg-info">
              <h5 class="modal-title" id="exampleModalLabel">Update Todo</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="title-update-todo">Title</label>
                  <input value="${title}" type="text" class="form-control" id="title-update-todo" placeholder="input title">
                </div>
                <div class="form-group">
                  <label for="description-update-todo">Description</label>
                  <textarea  class="form-control" id="description-update-todo" rows="3">${description}</textarea>
                </div>
                <div class="form-group">
                  <label for="due-date-update-todo">Due Date</label>
                  <input type="date" id="due-date-update-todo">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button onclick="updateTodo('${id}')" type="button" class="btn btn-primary" data-dismiss="modal">Update</button>
            </div>
            
          </div>
        </div>
      </div>
    `
  )
}

function showMainProject() {
  $('#main-project').html(`
  <div class="row">
      <div class="col-4  overflow-auto" style="max-height:80vh">
        <div class="row p-2">
          <div class="col-3">
            <button onclick="showCreateProject()" type="button" class="btn btn-primary rounded-pill" data-toggle="modal" data-target="#create-project"> + Project </button>
          </div>
          <div class="col-9">
            <div>
              <h3 style="font-weight:bold; text-align:center"> Project List </h3>
            </div>
          </div>
        </div>
        <ul id="list-project" class="list-group list-group-flush"></ul>
      </div>
      <div class="col-6 mt-2">
          <div>
            <h3 style="font-weight:bold; text-align:center"> Todo List </h3>
          </div>
          <div id="detail-project"></div>
      </div>
      <div class="col-2 mt-2">
        <div>
          <h3 style="font-weight:bold; text-align:center"> Member List </h3>
        </div>
        <ul id="list-member" class="list-group list-group-flush"></ul>
      </div>
    </div>
    
  `)
  showProject()
}

function showProject() {
  fetchProject()
  .then(({ data }) =>{
    data.forEach(el => {
      $('#list-project').append(`
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <h5>
            <a href="#" onclick="showDetailProject('${el._id}')">
            ${el.title}
            </a>
          </h5>
          <span class="badge badge-danger badge-pill" align="end"> <a onclick="deleteProject('${el._id}')" href="#" style="color:white" > delete </a> </span>
        </li>
    `)
    });
  })
  .catch(err =>{
    showError(err)
  })
}

function showCreateProject() {
  $('#create-project-page').html(
    `
    <div class="modal fade mt-3" id="create-project" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header bg-primary">
              <h5 class="modal-title" id="exampleModalLabel">Create Project</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="title-create-project">Title</label>
                  <input type="text" class="form-control" id="title-create-project" placeholder="input title">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button onclick="createProject()" type="button" class="btn btn-primary" data-dismiss="modal">Create</button>
            </div>
          </div>
        </div>
      </div>
    `
  )
}

function showDetailProject(projectId) {
  closeListMember()
  fetchProjectOne(projectId)
  .then(({ data })=> {
    $('#detail-project').html(
      `
      <div>
        <button onclick="showCreateProjectTodo('${data._id}')"  data-toggle="modal" data-target="#create-project-todo" type="button" class="btn btn-info rounded-pill"> + Todo</button>
      </div>
      `
    )
    data.todos.forEach(el =>{
      $('#detail-project').append(
        `
        <div class="card text-center mt-3">
          <div class="card-header">
            ${el.title}
          </div>
          <div class="card-body">
            <p class="card-title">${el.description}</p>
          </div>
          <div class="card-footer text-muted">
            due date: ${el.due_date} | ${el.dayLeft} days left
          </div>
          <div class="card-footer text-muted">
          <a data-toggle="modal" data-target="#update-project-todo" onclick="showUpdateProjectTodo('${projectId}','${el._id}','${el.title}','${el.description}','${el.due_date}')" href="#">Update</a> | <a onclick="deleteProjectTodo('${el._id}','${data._id}')" style="color:red" href="#">Delete</a>
          </div>
        </div>
        `)
    })
    showListMember(data.members,projectId)
  })
  .catch (err=>{
    showError(err)
  })
}

function showCreateProjectTodo(projectId) {
  $('#create-project-todo-page').html(`
  <div class="modal fade mt-3" id="create-project-todo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header bg-info">
              <h5 class="modal-title" id="exampleModalLabel">Create Todo</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="title-new-todo">Title</label>
                  <input type="text" class="form-control" id="title-new-project-todo" placeholder="input title">
                </div>
                <div class="form-group">
                  <label for="description-new-project-todo">Description</label>
                  <textarea class="form-control" id="description-new-project-todo" rows="3"></textarea>
                </div>
                <div class="form-group">
                  <label for="due-date-new-project-todo">Due Date</label>
                  <input type="date" id="due-date-new-project-todo">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button onclick="createProjectTodo('${projectId}')" type="button" class="btn btn-primary" data-dismiss="modal">Create</button>
            </div>
            
          </div>
        </div>
      </div>
  `)
}

function showListMember(members,projectId) {
  $('#list-member').html(
    `
    <div class="mb-2">
      <button onclick="showAddMember('${projectId}')" data-toggle="modal" data-target="#add-member" type="button" class="btn btn-success rounded-pill"> + member</button>
      <br>
      <div id="loading"> </div> 
    </div>
    `
  )
  let userLogin = localStorage.getItem('name')
  members.forEach(el =>{
    if(el.name == userLogin) el.name = 'You'
    $('#list-member').append(`
      <li class="list-group-item">
        ${el.name}
      </li>
  `)
  })
}

function showAddMember(projectId) {
  event.preventDefault()
  $('#add-member-page').html(
    `
    <div class="modal fade mt-3" id="add-member" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header bg-success">
          <h5 class="modal-title" id="exampleModalLabel">Add Member</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <ul id="list-add-member" class="list-group"> </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
    `
  )
  let promiseUser = fetchUser()
  let promiseProject = fetchProjectOne(projectId)
  Promise.all([promiseUser,promiseProject])
  .then(values => {
    let valueUser = values[0].data
    let valueProject = values[1].data.members
    let members = []
    for(let i = 0; i < valueUser.length; i++) {
      let flag = true
      for(let j = 0; j < valueProject.length; j++) {
        if(valueUser[i]._id === valueProject[j]._id) {
          flag = false
        }
      }
      if(flag == true) {
        members.push(valueUser[i])
      }
    }
    members.forEach(el =>{
      $('#list-add-member').append(
        `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${el.name}
          <span class="badge badge-primary badge-pill"> <a onclick="addMember('${el._id}','${projectId}')" href="#" style="color:white" data-dismiss="modal"> add </a> </span>
        </li>
        `
      )
    })
  })
  .catch(err =>{
    showError(err)
  })
}

function showUpdateProjectTodo(projectId,id,title,description,due_date) {
  $('#update-project-todo-page').html(`
  <div class="modal fade mt-3" id="update-project-todo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header bg-info">
              <h5 class="modal-title" id="exampleModalLabel">Update Todo</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="title-update-todo">Title</label>
                  <input type="text" class="form-control" id="title-update-project-todo" placeholder="input title" value="${title}">
                </div>
                <div class="form-group">
                  <label for="description-update-project-todo">Description</label>
                  <textarea class="form-control" id="description-update-project-todo" rows="3">${description}</textarea>
                </div>
                <div class="form-group">
                  <label for="due-date-update-project-todo">Due Date</label>
                  <input type="date" id="due-date-update-project-todo">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button onclick="updateProjectTodo('${projectId}','${id}')" type="button" class="btn btn-primary" data-dismiss="modal">Update</button>
            </div>
          </div>
        </div>
      </div>
  `)
}

function closeLogin() {
  $('#login-page').hide()
}
function closeRegister() {
  $('#register-page').empty()
}
function closeNavbar() {
  $('#navbar').empty()
}
function closeMainTodo() {
  $('#main-todo').empty()
}
function closeMainProject() {
  $('#main-project').empty()
}
function closeListMember() {
  $('#list-member').empty()
}