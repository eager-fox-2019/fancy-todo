function showAlert(message) {
    $('#notification').show();
    $('#notification__content').text(message);

    setTimeout(function(){ 
        $('#notification').hide();
    }, 5000);
}

function initiateLoading() { $(".lds-ellipsis").show() }

function stopLoading() { $(".lds-ellipsis").hide() }

function login(email, password) {
    $.ajax({
        url: `35.247.175.185/api/users/signin`,
        method: `POST`,
        data: {
            email,
            password
        }
    })
    .done(function(response) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('name', response.name)
        localStorage.setItem('id', response.id)

        renderLoggedInPage()
    })
    .fail(function(jqXHR, textStatus) {
        showAlert(jqXHR.responseJSON)
    })
}

function register(email,name,password) {
    $.ajax({
        url: `http://localhost:3000/api/users/signup`,
        method: `POST`,
        data: {
            email,
            name,
            password
        }
    })
    .done(function(response) {
        $("#register__page").hide()
        $("#login__page").show()
    })
    .fail(function(jqXHR, textStatus) {
        showAlert(jqXHR.responseJSON.msg)
    })
}

function dateFormat(date) {
    let today = new Date(date);
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    
    today = `${yyyy}-${mm}-${dd}`;
    
    return today
}

function fetchTodo() {
    $.ajax({
        url: `35.247.175.185/api/todos`,
        method: `GET`,
        headers: {
            token: localStorage.token,
            projectId: localStorage.projectId,
            id: localStorage.id
        }
    })
    .done(function(response) {
        $(".project .count-task").text(`You have ${response.countActive} task(s) to go`)

        $("#member__card-container > li").remove()
        response.todosObj.forEach(todo => {
            let dateDiff = parseInt((new Date(todo.due_date) - new Date)/(24*3600*1000))+1
            $("#member__card-container").append(
                `
                <li class="item">
                    <div class="body">
                        <div class="content">
                            <div class="name">
                                <div id="todo-checklist" class="check-container">
                                    <input 
                                        type="checkbox" 
                                        onchange="changeStatus('${todo._id}',${todo.status})"
                                        ${todo.status ? 'checked' : ""}
                                    >
                                    <span class="checkmark"></span>
                                </div>
                                <div id="todo-title" class="title ${todo.status ? 'completed': ''}">
                                    <div data-name="${todo.name}">${todo.name}</div>
                                    <div class="remain-day">${dateDiff} days remaining</div>
                                </div>
                            </div>
                            <div class="action">
                                <div
                                    class="edit-btn" 
                                    data-id="${todo._id}" 
                                    data-toggle="modal" 
                                    data-target="#editTodoModal" 
                                    onclick="editTodo('${todo._id}', '${todo.name}', '${todo.description}', '${todo.due_date}')"
                                ><i class="far fa-edit"></i></div>
                                <div
                                    class="delete-btn"
                                    data-id="${todo._id}" 
                                    onclick="confirmDelete('${todo._id}')"
                                ><i class="far fa-trash-alt"></i></div>
                            </div>
                        </div>
                    </div>
                </li>
                `
            )
        });
    })
    .fail(function(jqXHR, textStatus) {
        showAlert(jqXHR.responseJSON.msg)
    })
}

function clearTodoInputForm() {
    $("#todo__name").val('')
    $("#todo__description").val('')
    $("#todo__due_date").val('')
}

function clearEditTodoInputForm() {
    $("#edit-todo__name").val('')
    $("#edit-todo__description").val('')
    $("#edit-todo__due_date").val('')
}

function editTodo(id, name, desc, due_date) {
    $("#edit-todo__name").val(name)
    $("#edit-todo__description").val(desc)
    $("#edit-todo__due_date").val(dateFormat(due_date));
    $("#edit-todo__id").val(id)
}

function deleteTodo(todoId) {
    const id = todoId

    $.ajax({
        url: `35.247.175.185/api/todos/${id}`,
        method: `DELETE`,
        headers: {
            token: localStorage.token
        }
    })
    .done(function(response) {
        if(response) {
            fetchTodo()
        }
    })
    .fail(function(jqXHR, textStatus) {
        showAlert(jqXHR.responseJSON.msg)
    })
}

function goToHome() {
    fetchProject()
    $("#project__page").show()
    $("#todo__page").hide()
    $("#navbar__back-btn").hide()
    $("#navbar__project-name").text('')

    localStorage.removeItem('projectId')
    localStorage.removeItem('projectName')
}

function renderLoggedInPage() {
    if(localStorage.token) {
        $("#login__page").hide()
        $("#register__page").hide()
        $("#todo__page").hide()
        $("#project__page").show()
        $("#navbar").show()
        $("#footer").show()

        $("#navbar__group-active").text(localStorage.project)
        
        $("#navbar__userlogin").text(`${localStorage.name}`)
        $('.greetings .name').text(`Hello, ${localStorage.name}`)

        localStorage.removeItem('projectName')
        localStorage.removeItem('projectId')

        fetchProject()
        getLocation()
    }else {
        $("#login__page").show()
        $("#register__page").hide()
        $("#todo__page").hide()
        $("#project__page").hide()
        $("#navbar").hide()
        $("#footer").hide()
    }
}

function onSignIn(googleUser) {
    const token = googleUser.getAuthResponse().id_token;

    $.ajax({
        url: `35.247.175.185/api/users/googlesignin`,
        method: `POST`,
        headers: {
            token
        }
    })
    .done(function(response) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('name', response.name)
        localStorage.setItem('id', response.id)
        renderLoggedInPage()
    })
    .fail(function(jqXHR, textStatus) {
        showAlert(jqXHR.responseJSON.msg)
    })
}

function signOut() {
    // var auth2 = gapi.auth2.getAuthInstance();

    // auth2.signOut().then(function () {
        localStorage.clear()
        renderLoggedInPage()
    // });
}

function confirmDelete(id) {
    Swal.fire({
        title: 'Delete this todo?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
            deleteTodo(id)

            Swal.fire(
                'Deleted!',
                'Your todo has been deleted.',
                'success'
            )
        }
      })
}

function changeStatus(id, status) {
    let newStatus = !status

    $.ajax({
        url: `http://localhost:3000/api/todos/${id}`,
        method: `PATCH`,
        data: {
            status: newStatus
        },
        headers: {
            token: localStorage.token
        }
    })
    .done(function(response) {
        fetchTodo()
        showAlert('Status changed!')
    })
    .fail(function(jqXHR, textStatus) {
        showAlert(jqXHR.responseJSON.msg)
    })
}

function generateRandomActivity() {
    initiateLoading()

    $.ajax({
        url: `35.247.175.185/api/opens/bored`,
        method: `GET`,
        headers: {
            token: localStorage.token
        }
    })
    .done(function(response) {
        $("#todo__name").val(response)
        stopLoading()
    })
    .fail(function(jqXHR, textStatus) {
        stopLoading()
        showAlert(jqXHR.responseJSON.msg)
    })
}

function createProject() {
    const name = $("#projectNameVal").val()
    const userId = localStorage.id

    $.ajax({
        url: `http://localhost:3000/api/projects`,
        method: `POST`,
        data: {
            name,
            userId
        },
        headers: {
            token: localStorage.token
        }
    })
    .done(function(response) {
        showAlert('Project has been created!')
        $("#projectNameVal").val('')
        $("#formCreateProject").hide()
        fetchProject()
    })
    .fail(function(jqXHR, textStatus) {
        showAlert('Failed to create project')
        $("#projectNameVal").val('')
        $("#formCreateProject").hide()
    })
}

function enterProject(projectId, projectName) {
    localStorage.projectId = projectId
    localStorage.projectName = projectName

    $("#editProject__name").val(projectName)
    $("#navbar__back-btn").show()
    $("#project__page").hide()
    $("#todo__page").show()
    $(".project .name").text(projectName)
    $(".project .count-task").text(projectName)
    fetchTodo()
    fetchProjectMember()
}

function deleteProject(projectId) {
    $.ajax({
        url: `http://localhost:3000/api/projects/${projectId}`,
        method: 'DELETE',
        headers: {
            token: localStorage.token
        }
    })
    .done(function(deleted) {
        fetchProject()
        showAlert('Success delete project')
    })
    .fail(function(err) {
        showAlert('Failed to delete project')
    })
}

function generateTodayDate() {
    const day = moment().format("dddd, Do")
    const month = moment().format("MMMM")
    $("#day").text(day)
    $("#month").text(month)
}

function addMember() {
    const userEmail = $("#newMemberEmail").val()

    $.ajax({
        url: `35.247.175.185/api/projects/${localStorage.projectId}`,
        method: `POST`,
        data: {
            userEmail
        },
        headers: {
            token: localStorage.token
        }
    })
}

function removeMember(userId) {
    $.ajax({
        url: `35.247.175.185/api/projects/${userId}/removeMember`,
        method: `PATCH`,
        headers: {
            token: localStorage.token,
            projectId: localStorage.projectId
        }
    })
    .done(function(userDeleted) {
        showAlert(`${userDeleted} has been removed`)
        fetchProjectMember()
    })
    .fail(function(jqXHR, textStatus) {
        showAlert('Failed to delete member')
    })
}

function fetchProject() {
    $.ajax({
        url: `35.247.175.185/api/projects`,
        method: `GET`,
        headers: {
            token: localStorage.token
        }
    })
    .done(function(projects) {
        $("#group-list li").remove()

        projects.forEach(project => {
            $("#group-list").append(
                `
                <li 
                    class="dropdown-item" 
                >
                    <span 
                        onclick="enterProject('${project._id}', '${project.name}')"
                    >${project.name}</span>
                    <span 
                        class="color-red" 
                        style="float:right;"
                        onclick="deleteProject('${project._id}')"
                    ><i class="fas fa-minus"></i></span>
                </li>
                `
            )
            $("#formCreateProject").hide()
        })
    })
    .fail(function(jqXHR, textStatus) {
        showAlert('Failed to create project')
        $("#projectNameVal").val('')
        $("#formCreateProject").hide()
    })
}

function fetchProjectMember() {
    $.ajax({
        url: `35.247.175.185/api/projects/members`,
        method: `GET`,
        headers: {
            token: localStorage.token,
            projectId: localStorage.projectId
        }
    })
    .done(function(members) {
        $("#project-member > li").remove()
        $("#modal__member-list > li").remove()
        
        if(members.length <= 1) {
            $("#member-container").hide()
        }else{
            $("#member-container").show()

            members.forEach(member => {
                $("#project-member").append(
                    `
                    <li 
                        data-toggle="tooltip" 
                        data-placement="bottom" 
                        title="${member.name}"
                    >
                        ${member.name[0].toUpperCase()}
                    </li>
                    `
                )

                $("#modal__member-list").append(
                    `
                    <li 
                        data-toggle="tooltip" 
                        data-placement="bottom" 
                        title="${member.name}"
                    >
                        
                        ${member.name}
                        <span 
                            class="color-red 
                                pull-right 
                                member-remove-btn"
                            onclick="removeMember('${member._id}')"
                        >remove</span>
                    </li>
                    `
                )
            })
        }
    })
    .fail(function(jqXHR, textStatus) {
        showAlert('Connection error, please refresh')
    })
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCurrentWeather);
    } else {
        showAlert('Geolocation is not supported by this browser.')
    }
}

function getCurrentWeather(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    $.ajax({
        url: `35.247.175.185/api/opens/currentweather`,
        method: `POST`,
        data: {
            lat,
            lng
        }
    })
    .done(function(info) {
        $("#icon div").remove()
        $("#icon").append(
            `
            <div>
                <div class="fs-17">Weather and forecast in ${info.name}, ${info.sys.country}</div>
                <div>
                    <img src="http://openweathermap.org/img/w/${info.weather[0].icon}.png" alt="weather icon">
                    <span>${info.weather[0].description}</span>
                </div>
            </div>
            `
        )
    })
    .fail(function(jqXHR, textStatus) {
        showAlert('Cant get location')
    })
}

function setProjectName(name) {
    const projectId = localStorage.projectId

    $.ajax({
        url: `35.247.175.185/api/projects/${projectId}`,
        method: `PATCH`,
        data: {
            name
        },
        headers: {
            token: localStorage.token
        }
    })
    .done(function(project) {
        $(".project .name").text(project.name)
        localStorage.setItem('projectName', project.name)
        showAlert('Success')
    })
    .fail(function(jqXHR, textStatus) {
        showAlert('Cant rename project, please refresh')
    })
}

$(document).ready(function() {
    initiateLoading() 
    renderLoggedInPage()

    $("#landing__login-btn").on('click', function() {
        $("#login__page").show()
        $("#landing__page").hide()
    })

    $("#landing__register-btn").on('click', function() {
        $("#login__page").hide()
        $("#landing__page").hide()
        $("#register__page").show()
    })

    $("#init-create").on('click', function() {
        $("#todo___create-btn").show()
        $("#todo___edit-btn").hide()
    })

    $("#initFormCreateProject").hover(function() {
        $("#formCreateProject").show()
    })
    
    $("#createTodoForm").submit(function(e) {
        e.preventDefault();
        
        const name = $("#todo__name").val()
        const description = $("#todo__description").val()
        const due_date = new Date($("#todo__due_date").val())
        const userId = localStorage.id
        const projectId = localStorage.projectId

        $.ajax({
            url: `35.247.175.185/api/todos`,
            method: `POST`,
            data: {
                name, 
                description, 
                due_date, 
                userId, 
                projectId
            },
            headers:{
                token: localStorage.token
            }
        })
        .done(function(response) {
            $('#createTodoModal').modal('hide');
            clearTodoInputForm();
            fetchTodo()
            showAlert('Success create todo')
        })
        .fail(function(jqXHR, textStatus) {
            $('#createTodoModal').modal('hide');

            let message = ''

            for (let key in jqXHR.responseJSON.msg.errors) {
                message+=jqXHR.responseJSON.msg.errors[key].message+'\n'
            }

            showAlert(message)

            fetchTodo()
        })
    })

    $("#editTodoForm").submit(function(e) {
        e.preventDefault();
        
        const id = $("#edit-todo__id").val()
        const name = $("#edit-todo__name").val()
        const description = $("#edit-todo__description").val()
        const due_date = $("#edit-todo__due_date").val()

        $.ajax({
            url: `35.247.175.185/api/todos/${id}`,
            method: `PATCH`,
            data: {
                name, description, due_date
            },
            headers: {
                token: localStorage.token
            }
        })
        .done(function(response) {
            $('#editTodoModal').modal('hide');
            fetchTodo()
        })
        .fail(function(jqXHR, textStatus) {
            $('#editTodoModal').modal('hide');
            let message = ''

            for (let key in jqXHR.responseJSON.msg.errors) {
                message+=jqXHR.responseJSON.msg.errors[key].message+'\n'
            }

            showAlert(message)
            fetchTodo();
        })
    })

    $("#searchTodo").submit(function(e) {
        e.preventDefault()
        initiateLoading()

        const searchTodo = $("#todoSearchValue").val()

        $.ajax({
            url: `35.247.175.185/api/todos/search?name=${searchTodo}`,
            type: `GET`,
            headers: {
                token: localStorage.token,
                id: localStorage.id
            }
        })
        .done(function(todos) {
            $("#member__card-container > li").remove()

            todos.forEach(todo=> {
                let dateDiff = parseInt((new Date(todo.due_date) - new Date)/(24*3600*1000))+1

                $("#member__card-container").append(
                    `
                    <li class="item">
                        <div class="body">
                            <div class="content">
                                <div class="name">
                                    <div id="todo-checklist" class="check-container">
                                        <input 
                                            type="checkbox" 
                                            onchange="changeStatus('${todo._id}',${todo.status})"
                                            ${todo.status ? 'checked' : ""}
                                        >
                                        <span class="checkmark"></span>
                                    </div>
                                    <div id="todo-title" class="title ${todo.status ? 'completed': ''}">
                                        <div data-name="${todo.name}">${todo.name}</div>
                                        <div class="remain-day">${dateDiff} days remaining</div>
                                    </div>
                                </div>
                                <div class="action">
                                    <div
                                        class="edit-btn" 
                                        data-id="${todo._id}" 
                                        data-toggle="modal" 
                                        data-target="#editTodoModal" 
                                        onclick="editTodo('${todo._id}', '${todo.name}', '${todo.description}', '${todo.due_date}')"
                                    ><i class="far fa-edit"></i></div>
                                    <div
                                        class="delete-btn"
                                        data-id="${todo._id}" 
                                        onclick="confirmDelete('${todo._id}')"
                                    ><i class="far fa-trash-alt"></i></div>
                                </div>
                            </div>
                        </div>
                    </li>
                    `
                );
            })

        })
        .fail(function(jqXHR, textStatus) {
            showAlert(jqXHR.responseJSON.msg)
        })
        stopLoading()
    })

    $("#login__form").submit(function(e) {
        e.preventDefault()

        const email = $("#login__email").val()
        const password = $("#login__password").val()

        login(email, password)
    })

    $("#register__form").submit(function(e) {
        e.preventDefault()

        const email = $("#register__email").val()
        const password = $("#register__password").val()
        const name = $("#register__name").val()

        register(email, name, password)
    })

    $("#renameProject__form").submit(function(e) {
        e.preventDefault()

        const projectName = $("#editProject__name").val()

        setProjectName(projectName)
    })

    $('#navbar__logout-btn').on('click', function() {
        localStorage.removeItem('token')
        renderLoggedInPage()
    })

    $('[type="date"]').prop('min', function(){
        return new Date().toJSON().split('T')[0];
    });

    $("#login__register-btn").on('click', function() {
        $("#login__page").hide()
        $("#register__page").show()
    })

    $("#register__login-btn").on('click', function() {
        $("#login__page").show()
        $("#register__page").hide()
    })

    $("#navbar__add-member").on('click', function() {
        const email = $("#newMemberEmail").val()

        $.ajax({
            url: `35.247.175.185/api/projects/${localStorage.projectId}/addMember`,
            type: `PATCH`,
            data: {
                email
            },
            headers: {
                projectId: localStorage.projectId,
                token: localStorage.token,
                id: localStorage.id
            }
        })
        .done(function(project) {
            showAlert('Member successful registered')
            $("#newMemberEmail").val('')
            fetchProjectMember()
        })
        .fail(function(jqXHR, textStatus) {
            showAlert(jqXHR.responseJSON)
        })
    })

    generateTodayDate()
    stopLoading()
})