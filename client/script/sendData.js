function login() {
    event.preventDefault()
    let email = $('#login-email').val()
    let password = $('#login-pass').val()
    Axios.post('/login',{ email, password })
    .then(({ data }) =>{
        localStorage.setItem('token', data.token)
        localStorage.setItem('name', data.name)
        localStorage.setItem('id', data.id)
        initial()
    })
    .catch(err =>{
        showError(err)
    })
}

function register() {
    event.preventDefault()
    let name = $('#register-name').val()
    let email = $('#register-email').val()
    let password = $('#register-pass').val()
    Axios.post('/register',{ name, email, password })
    .then(({ data }) =>{
        localStorage.setItem('token', data.token)
        localStorage.setItem('name', data.name)
        localStorage.setItem('id', data.id)
        initial()
    })
    .catch(err =>{
        showError(err)
    })
}

function createTodo() {
    event.preventDefault()
    let title = $('#title-new-todo').val()
    let description = $('#description-new-todo').val()
    let due_date = $('#due-date-new-todo').val()
    let token = localStorage.getItem('token')
    Axios.post('todos',{ 
        title,
        description,
        due_date
     },
     { headers : { token } })
     .then(data =>{
         initial()
     })
     .catch(err =>{
         showError(err)
     })
}
function updateTodo(id) {
    event.preventDefault()
    let title = $('#title-update-todo').val()
    let description = $('#description-update-todo').val()
    let due_date = $('#due-date-update-todo').val()
    let token = localStorage.getItem('token')
    Axios.put(`/todos/${id}`,{ 
        title,
        description,
        due_date
     }, { headers : { token } })
     .then(data =>{
         initial()
     })
     .catch(err =>{
         showError(err)
     })
}

function deleteTodo(id) {
    event.preventDefault()
    let token = localStorage.getItem('token')
    Axios.delete(`/todos/${id}`,{ headers : { token } })
    .then(data =>{
        initial()
    })
    .catch(err =>{
        showError(err)
    })
}

function createProject() {
    event.preventDefault()
    let title = $('#title-create-project').val()
    let token = localStorage.getItem('token')
    Axios.post('/projects', { title } , { headers : { token } })
    .then(data =>{
        projectTrigger()
    })
    .catch(err =>{
        showError(err)
    })
}

function createProjectTodo(projectId) {
    event.preventDefault()
    let title = $('#title-new-project-todo').val()
    let description = $('#description-new-project-todo').val()
    let due_date = $('#due-date-new-project-todo').val()
    let token = localStorage.getItem('token')
    Axios.post(`/projects/todos/${projectId}`,{ 
        title,
        description,
        due_date,
        projectId
     },
     { headers : { token } })
     .then(({ data })=>{
         projectTrigger()
     })
     .catch(err =>{
         showError(err)
     }) 
}

function deleteProject(projectId) {
    event.preventDefault()
    let token = localStorage.getItem('token')
    Axios.delete(`/projects/${projectId}`, { headers: { token } })
    .then(({ data }) =>{
        projectTrigger()
    })
    .catch(err =>{
        showError(err)
    })
}

function addMember(userId,projectId) {
    $('#loading').html(`
        <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    `)
    let token = localStorage.getItem('token')
    Axios.post(`member/${projectId}`, { 
        userId, 
        status : 'add member'
    }, 
    { headers : { token } } )
    .then(({ data }) =>{
        $('#loading').empty()
        Swal.fire({
            position: 'center',
            type: 'success',
            title: 'Add member succesfully',
            showConfirmButton: false,
            timer: 1500
          })
        projectTrigger()
    })
    .catch(err =>{
        showError(err)
    })
}

function deleteProjectTodo(todoId,projectId) {
    let token = localStorage.getItem('token')
    Axios.delete(`/projects/todos/${projectId}/${todoId}`,{ headers : { token } })
    .then(({ data })=>{
        projectTrigger()
    })
    .catch(err =>{
        showError(err)
    })
}

function updateProjectTodo(projectId,todoId) {
    event.preventDefault()
    let title = $('#title-update-project-todo').val()
    let description = $('#description-update-project-todo').val()
    let due_date = $('#due-date-update-project-todo').val()
    let token = localStorage.getItem('token')
    Axios.put(`/projects/todos/${projectId}/${todoId}`,{ 
        title,
        description,
        due_date
     },
     { headers : { token } })
    .then(data =>{
        projectTrigger()
    })
    .catch(err=>{
        showError(err)
    })
}
function accept(){
    event.preventDefault()
    let searchParams = new URLSearchParams(window.location.search)
    let userId = searchParams.get('userId')
    let projectId = searchParams.get('projectId')
    Axios.put(`projects/member/accept/${projectId}`,{ userId })
    .then(data =>{
        $('#accept-member').hide()
        Swal.fire({
            type: 'success',
            title: 'Thanks for accepting as a member',
            text: "You are now a member of it's project",
            footer: `<a href="${clientUrl}">Go to Todoz app</a>`
          })
    })
    .catch(showError(err))
}
function decline() {
    event.preventDefault()
    Swal.fire({
        type: 'error',
        title: 'Thanks for declining as a member',
        text: "You are not a member of it's project",
        footer: `<a href="${clientUrl}">Go to Todoz app</a>`
      })
    $('#accept-member').hide()
}
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    Axios.post('/google/login',{ id_token })
    .then(({ data }) =>{
        localStorage.setItem('token', data.token)
        localStorage.setItem('name', data.name)
        localStorage.setItem('id', data.id)
        initial()
    })
    .catch(err =>{
        showError(err)
    })
  }