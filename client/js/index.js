let url = "http://localhost:3000"
$.ajaxSetup({
    traditional: true
})
let users = []
let todoArr = []
$(document).ready(function () {
    $('.ui.form').form({
        fields: {
            email: {
                identifier: 'email',
                rules: [{
                        type: 'empty',
                        prompt: 'Please enter your e-mail'
                    },
                    {
                        type: 'email',
                        prompt: 'Please enter a valid e-mail'
                    }
                ]
            },
            password: {
                identifier: 'password',
                rules: [{
                        type: 'empty',
                        prompt: 'Please enter your password'
                    },
                    {
                        type: 'length[6]',
                        prompt: 'Your password must be at least 6 characters'
                    }
                ]
            }
        }
    });
    checkLogin()
    renderGsignIn()
    console.log(todoArr);
});

function login(email, password) {
    $("#errMessage").hide()
    $.ajax({
        url: `${url}/login`,
        method: "POST",
        data: {
            email,
            password
        },
        statusCode: {
            200: function (user) {
                localStorage.setItem("token", user.token)
                localStorage.setItem("email", user.email)
                localStorage.setItem("id", user.id)
                $(".ui.form").removeClass("loading")
                checkLogin()
                Swal.fire(
                    'Hello!',
                    'Welcome Back!',
                    'success'
                )
            },
            404: function (err) {
                console.log(err);
                $(".ui.form").removeClass("loading")
                $("#errMessage").show()
                $("#errMessageText").empty()
                $("#errMessageText").append(
                    `<div class="header">
                invalid email / password
            </div>
            <p>Please check your email / password</p>`
                )
            },
            400: function (err) {
                console.log(err);
                $(".ui.form").removeClass("loading")
                $("#errMessage").show()
                $("#errMessageText").empty()
                $("#errMessageText").append(
                    `<div class="header">
                invalid email / password
            </div>
            <p>Please check your email / password</p>`
                )
            },
            500: function (err) {
                console.log(err);
                $(".ui.form").removeClass("loading")
                $("#errMessage").show()
                $("#errMessageText").empty()
                $("#errMessageText").append(
                    `<div class="header">
                invalid email / password
            </div>
            <p>Please check your email / password</p>`
                )
            }
        }
    })
}

function register(email, password) {
    $("#errMessage").hide()
    $.ajax({
        url: `${url}/register`,
        method: "POST",
        data: {
            email,
            password
        },
        statusCode: {
            200: function (user) {
                login(email, password)
            },
            201: function (err) {
                console.log(err);
            },
            404: function (err) {
                console.log(err);
                checkLogin()
            },
            400: function (err) {
                console.log(err);
                let errObj = JSON.parse(err.responseText);
                console.log(errObj);
                let errMsg = Object.values(errObj)
                $(".ui.form").removeClass("loading")
                $("#errMessage").show()
                $("#errMessageText").empty()
                $("#errMessageText").append(
                    `<div class="header">
                <ul id="errText"></ul>
            </div>
            <p>Please check your email / password</p>`
                )
                console.log(errMsg);
                errMsg.forEach(errors => {
                    $("#errText").append(
                        `<li>${Object.values(errors)}</li>`)
                })
            },
            500: function (err) {
                console.log(err);
            }
        }
    })
}

$('.ui.form').submit(function (event) {
    event.preventDefault()
    console.log($("#btnSubmit").html());
    if ($("#btnSubmit").html() === "Login") {
        $(".ui.form").addClass("loading")
        let email = $(this).serializeArray()[0].value
        let password = $(this).serializeArray()[1].value
        login(email, password)
    } else {
        $(".ui.form").addClass("loading")
        let email = $(this).serializeArray()[0].value
        let password = $(this).serializeArray()[1].value
        register(email, password)
    }
})

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: `${url}/google`,
        method: 'POST',
        data: {
            googleToken: id_token
        },
        statusCode: {
            200: function (user) {
                console.log(user);
                localStorage.setItem("token", user.token)
                localStorage.setItem("email", user.email)
                localStorage.setItem("id", user.id)
                $(".ui.form").removeClass("loading")
                checkLogin()
                Swal.fire(
                    'Hello!',
                    'Welcome Back!',
                    'success'
                )
            },
            400: function (err) {
                console.log(err);
            },
            404: function (err) {
                console.log(err);
            },
            500: function (err) {
                console.log(err);
            }
        }
    })
}

$("#toggle").click(function (event) {
    event.preventDefault()
    toggleBtn()
})

function addNewTodo() {
    let newTodo = $("#addTodoInput").val()
    todoArr.push(newTodo)
    $("#listNewTodo").empty()
    todoArr.forEach((todo, index) => {
        $("#listNewTodo").append(
            `<div class="item">
                <div class="left aligned content">
                    <a><i class="ui red delete icon" onclick="removeNewTodo(${index})"></i></a>
                    ${todo}
                </div>
            </div>`
        )
    })
    $("#addTodoInput").val("")
    console.log(todoArr);
}

function saveNewTodo() {
    let members = $("#dropdownUsersModal").val()
    let title = $("#newProjectName").val()
    let deadline = $("#newProjectDeadline").datepicker('getDate')
    console.log(deadline);
    console.log(title);
    console.log(todoArr);
    console.log(members);
    if (typeof members === String) {
        members = [members]
    }
    if (members.length === 0) {
        members = []
    }
    let send = {
        title: title,
        todos: todoArr,
        members: members,
        deadline: deadline
    }
    console.log(send);
    $.ajax({
        url: `${url}/projects`,
        method: "POST",
        data: send,
        headers: {
            token: localStorage.getItem('token')
        },
        statusCode: {
            200: function (project) {
                console.log('success save');
                console.log(project);
                getProjects()
                todoArr = []
            },
            500: function (err) {
                console.log(err);
            }
        }
    })
}

function removeNewTodo(index) {
    todoArr.splice(index, 1)
    $("#listNewTodo").empty()
    todoArr.forEach((todo, index) => {
        $("#listNewTodo").append(
            `<div class="item">
                <div class="left aligned content">
                    <a><i class="ui red delete icon" onclick="removeNewTodo(${index})"></i></a>
                    ${todo}
                </div>
            </div>`
        )
    })
    console.log(todoArr);
}

function getUsers() {
    $.ajax({
        url: `${url}/users`,
        method: "GET",
        headers: {
            token: localStorage.getItem('token')
        },
        statusCode: {
            200: function (data) {
                users = data
                console.log(users);
                $("#dropdownUsers").empty()
                $("#dropdownUsers").append(
                    `<option value="">Select Members</option>`
                )
                $("#dropdownUsersModal").empty()
                $("#dropdownUsersModal").append(
                    `<option value="">Select Members</option>`
                )
                users.forEach(user => {
                    $("#dropdownUsers").append(
                        `<option value="${user._id}">${user.email}</option>`
                    )
                    $("#dropdownUsersModal").append(
                        `<option value="${user._id}">${user.email}</option>`
                    )
                })
            },
            404: function (err) {
                console.log(err);
            },
            500: function (err) {
                console.log(err);
            }
        }
    })
}

function removeMember(projectId, memberId) {
    console.log(memberId);
    console.log(projectId);
    $.ajax({
        url: `${url}/projects/${projectId}/members/${memberId}`,
        method: `DELETE`,
        headers: {
            token: localStorage.getItem("token")
        },
        statusCode: {
            200: function () {
                getProjectDetail(projectId)
            },
            400: function (err) {
                console.log(err);
            },
            500: function (err) {
                console.log(err);
            },
            404: function (err) {
                console.log(err);
            }
        }
    })
}



function toggleBtn() {
    if ($("#btnSubmit").html() === "Login") {
        $("#errMessage").hide()
        $("#btnSubmit").html("Register")
        $("#toggle").html("Login")
        $("#toggleText").html("Already registered?")
    } else {
        $("#errMessage").hide()
        $("#btnSubmit").html("Login")
        $("#toggle").html("Register")
        $("#toggleText").html("New to us?")
    }
}

function getProjects() {
    console.log('masuk ke getProjects');
    $.ajax({
        url: `${url}/projects`,
        method: "GET",
        headers: {
            token: localStorage.getItem("token")
        },
        statusCode: {
            200: function (projects) {
                console.log(projects);
                $("#noProjects").hide()
                $("#noMember").hide()
                $("#ownedItem").empty()
                if (projects.project_owned.length === 0) {
                    $("#noProjects").show()
                } else {
                    $("#noProjects").hide()
                    projects.project_owned.forEach(project => {
                        $("#ownedItem").append(
                            `<div class="item" style="margin-bottom: 20px">
                                <div class="content">
                                    <a class="header" onclick="getProjectDetail('${project._id}')">${project.title}</a>
                                    <div class="description">
                                        <div class="ui red progress" data-value="${project.progress}" data-total="${project.todos.length}" id="progressOwned${project._id}"
                                            style="margin-top: 10px">
                                            <div class="bar">
                                                <div class="progress"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="extra">
                                        <span class="extraItem">
                                            <i class="clock icon"></i>
                                            Due ${moment(project.deadline).endOf('day').fromNow()}
                                        </span>
                                        <span class="extraItem">
                                            <i class="user icon"></i>
                                            ${project.members.length} Members
                                        </span>
                                    </div>
                                </div>
                            </div>`
                        )
                        $(`#progressOwned${project._id}`)
                            .progress({
                                label: 'ratio',
                                text: {
                                    ratio: '{value} of {total} Task Done'
                                }
                            });
                    })
                }
                $("#memberItem").empty()
                if (projects.project_member.length === 0) {
                    $("#noMember").show()
                } else {
                    $("#noMember").hide()
                    projects.project_member.forEach(project => {
                        $("#memberItem").append(
                            `<div class="item" style="margin-bottom: 20px">
                                <div class="content">
                                    <a class="header" onclick="getProjectDetail('${project._id}')">${project.title}</a>
                                    <div class="description">
                                        <div class="ui red progress" data-value="${project.progress}" data-total="${project.todos.length}" id="progressMember${project._id}"
                                            style="margin-top: 10px">
                                            <div class="bar">
                                                <div class="progress"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="extra">
                                        <span class="extraItem">
                                            <i class="clock icon"></i>
                                            Due ${moment(project.deadline).endOf('day').fromNow()}
                                        </span>
                                        <span class="extraItem">
                                            <i class="user icon"></i>
                                            ${project.members.length} Members
                                        </span>
                                        <span class="extraItem right floated">
                                            Owner: ${project.owner.email}
                                        </span>
                                    </div>
                                </div>
                            </div>`
                        )
                        $(`#progressMember${project._id}`)
                            .progress({
                                label: 'ratio',
                                text: {
                                    ratio: '{value} of {total} Task Done'
                                }
                            });
                    })
                }
            },
            404: function (err) {
                console.log(err);
            },
            400: function (err) {
                console.log(err);
            },
            500: function (err) {
                console.log(err);
            }
        }
    })
}

function getProjectDetail(projectId) {
    console.log(projectId);
    $("#detail").show()
    $("#owned").hide()
    $("#member").hide()
    $.ajax({
        url: `${url}/projects/${projectId}`,
        method: "GET",
        headers: {
            token: localStorage.getItem("token")
        },
        statusCode: {
            200: function (projects) {
                projects.role = 'member'
                if (projects.owner._id === localStorage.getItem('id')) {
                    projects.role = 'owner'
                }
                console.log(projects);
                console.log(projects.role);
                console.log(projects.deadline);
                $("#projectDetailName").html(`${projects.title}`)
                $("#projectDetailDuedate").html(`Due ${moment(projects.deadline).endOf('day').fromNow()}`)
                $("#todoItems").empty()
                projects.todos.forEach(todo => {
                    $("#todoItems").append(
                        `<div class="ui clearing attached segment">
                            <div class="item">
                                <div id="showItem${todo._id}">
                                    <div class="ui checkbox" id="todo${todo._id}checkbox">
                                        <input name="test" type="checkbox" id="todo${todo._id}">
                                        <label>${todo.name}</label>
                                    </div>
                                    <div class="ui right floated buttons">
                                        <div class="ui mini blue icon button" onclick="editTodo('${todo._id}')" ><i class="ui edit icon"></i></div>
                                        <div class="ui mini red icon button" onclick="deleteTodo('${projects._id}', '${todo._id}')"><i class="ui trash icon"></i></div>
                                    </div>
                                </div>
                                <div id="showEditItem${todo._id}">
                                    <div class="ui input">
                                        <input type="text" placeholder="Edit..." value="${todo.name}" id="editTodoField${todo._id}">
                                    </div>
                                    <div class="ui right floated buttons">
                                        <div class="ui mini green icon button" onclick="editTodoName('${projects._id}', '${todo._id}')"><i class="ui save icon"></i></div>
                                        <div class="ui mini orange icon button" onclick="$('#showItem${todo._id}').show(); $('#showEditItem${todo._id}').hide()"><i class="ui cancel icon"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>`
                    )
                    $(`#showEditItem${todo._id}`).hide()
                    if (todo.status) {
                        $(`#todo${todo._id}`).attr('checked', 'checked')
                    }
                    $(`#todo${todo._id}checkbox`).checkbox({
                        onChecked: function () {
                            $.ajax({
                                url: `${url}/projects/${projects._id}/todos/${todo._id}/toggle`,
                                method: "PATCH",
                                headers: {
                                    token: localStorage.getItem('token')
                                },
                                statusCode: {
                                    200: function () {
                                        getProjectDetail(projects._id)
                                        getProjects()
                                    }
                                }
                            })
                        },
                        onUnchecked: function () {
                            console.log('unchecked');
                            $.ajax({
                                url: `${url}/projects/${projects._id}/todos/${todo._id}/toggle`,
                                method: "PATCH",
                                headers: {
                                    token: localStorage.getItem('token')
                                },
                                statusCode: {
                                    200: function () {
                                        getProjectDetail(projects._id)
                                        getProjects()
                                    }
                                }
                            })
                        }
                    })
                })
                if (projects.role === 'owner') {
                    $("#todoItems").append(
                        `<div class="ui bottom clearing attached segment">
                            <div class="ui right floated buttons">
                                <button class="ui small green button" onclick="showAddTodoSingle('${projects._id}')">Add Todo</button>
                                <button class="ui small blue button" onclick="showEditModal('${projects.title}','${projects.deadline}','${projects._id}')">Edit Project</button>
                                <button class="ui small red button" onclick="deleteProject('${projects._id}')">Delete Project</button>
                            </div>
                        </div>`
                    )
                } else {
                    $("#todoItems").append(
                        `<div class="ui bottom clearing attached segment">
                            <div class="ui right floated buttons">
                                <button class="ui small green button" onclick="showAddTodoSingle('${projects._id}')">Add Todo</button>
                            </div>
                        </div>`
                    )
                }
                $("#progressContainer").empty()
                $("#progressContainer").append(
                    `<div class="ui red progress" data-value="${projects.progress}" data-total="${projects.todos.length}" id="detailProgress${projects._id}"
                        style="margin-top: 10px">
                        <div class="bar">
                            <div class="progress"></div>
                        </div>
                        <div class="label">${projects.progress} of ${projects.todos.length} Task Done</div>
                    </div>`
                )
                $("#memberListProject").empty()
                $("#dropdownUsersProject").empty()
                projects.members.forEach(member => {
                    $("#memberListProject").append(
                        `<div class="item">
                            <img class="ui avatar image"
                                src="https://semantic-ui.com/images/avatar/small/daniel.jpg">
                            <div class="content">
                                <a class="header">${member.email}</a>
                                <a onclick="removeMember('${projects._id}', '${member._id}')">
                                    <i class="ui red delete icon"></i>Delete
                                </a>
                            </div>
                        </div>`
                    )
                })
                $("#btnAddMember").remove()
                $("#memberContainer").append(
                    `<div class="ui bottom attached clearing segment" id="btnAddMember">
                        <div class="ui right floated blue button" onclick="addMemberToProject('${projects._id}')">
                            <i class="ui add icon"></i>
                            Add Members
                        </div>
                    </div>`
                )
                $(`#detailProgress${projects._id}`)
                    .progress({
                        label: 'ratio',
                        text: {
                            ratio: '{value} of {total} Task Done'
                        }
                    });
            },
            404: function (err) {
                console.log(err);
            },
            400: function (err) {
                console.log(err);
            },
            500: function (err) {
                console.log(err);
            }
        }
    })
}

function addMemberToProject(projectId, memberId) {
    let value = $("#dropdownUsers").val()
    console.log(value);
    $.ajax({
        url: `${url}/projects/${projectId}/members`,
        method: "POST",
        data: {
            members: value
        },
        headers: {
            token: localStorage.getItem('token')
        },
        statusCode: {
            200: function () {
                getProjectDetail(projectId)
            },
            400: function (err) {
                console.log(err);
            },
            404: function (err) {
                console.log(err);
            },
            500: function (err) {
                console.log(err);
            }
        }
    })
}

function showAddTodoSingle(projectId) {
    console.log(projectId);
    $("#todoItems").append(
        `<div class="ui clearing attached segment" id="tempAdd">
            <div class="item">
                <div id="tempAdd">
                    <div class="ui input">
                        <input type="text" placeholder="Add new Todo" value="" id="addNewTodoField">
                    </div>
                    <div class="ui right floated buttons">
                        <div class="ui mini green icon button" onclick="saveNewTodoSingle('${projectId}')"><i class="ui save icon"></i></div>
                        <div class="ui mini red icon button" onclick="$('#tempAdd').remove()"><i class="ui cancel icon"></i></div>
                    </div>
                </div>
            </div>
        </div>`
    )
}

function deleteProject(projectId) {
    console.log(projectId);
    $.ajax({
        url: `${url}/projects/${projectId}`,
        method: "DELETE",
        headers: {
            token: localStorage.getItem("token")
        },
        statusCode: {
            200: function () {
                getProjects()
                $("#homeNav").addClass('active')
                $("#owned").show()
                $("#member").show()
                $("#projectNav").removeClass('active')
                $("#memberNav").removeClass('active')
                $("#detail").hide()
            },
            404: function (err) {
                console.log(err);
            },
            400: function (err) {
                console.log(err);
            },
            500: function (err) {
                console.log(err);
            }
        }
    })
}

function saveNewTodoSingle(projectId) {
    console.log(projectId);
    let value = $("#addNewTodoField").val();
    console.log(value);
    $("#tempAdd").remove()
    $.ajax({
        url: `${url}/projects/${projectId}/todos`,
        method: "POST",
        data: {
            todoName: value
        },
        headers: {
            token: localStorage.getItem('token')
        },
        statusCode: {
            200: function (todo) {
                getProjectDetail(projectId)
            },
            404: function (err) {
                console.log(err);
            },
            400: function (err) {
                console.log(err);
            },
            500: function (err) {
                console.log(err);
            }
        }
    })
}

function editTodoName(projectId, todoId) {
    console.log(todoId);
    console.log(projectId)
    console.log($(`#editTodoField${todoId}`).val());
    let todoName = $(`#editTodoField${todoId}`).val()
    $.ajax({
        url: `${url}/projects/${projectId}/todos/${todoId}`,
        data: {
            todoName
        },
        method: "PATCH",
        headers: {
            token: localStorage.getItem("token")
        },
        statusCode: {
            200: function (todo) {
                getProjectDetail(projectId)
            },
            400: function (err) {
                console.log(err);
            },
            404: function (err) {
                console.log(err);
            },
            500: function (err) {
                console.log(err);
            }
        }
    })
}

function deleteTodo(projectId, todoId) {
    console.log(todoId);
    console.log(projectId);
    $.ajax({
        url: `${url}/projects/${projectId}/todos/${todoId}`,
        method: "DELETE",
        headers: {
            token: localStorage.getItem("token")
        },
        statusCode: {
            200: function (todo) {
                getProjectDetail(projectId)
            },
            400: function (err) {
                console.log(err);
            },
            404: function (err) {
                console.log(err);
            },
            500: function (err) {
                console.log(err);
            }
        }
    })
}

function editTodo(todoId) {
    $(`#showEditItem${todoId}`).show()
    $(`#showItem${todoId}`).hide()
}

$('select.dropdown')
    .dropdown();

$(function () {
    $('#newProjectDeadline').datepicker({
        minDate: 0
    })
})

function showEditModal(title, deadline, projectId) {
    console.log(deadline);
    $("#modalEditProject").empty()
    $("#modalEditProject").append(
        `<div class="ui icon header">
                <i class="edit icon"></i>
                Edit Project
            </div>
            <div class="content">
                <div class="ui container">
                    <div class="ui form" id="formEditProject">
                        <div class="ui fluid labeled input" style="margin-bottom: 20px">
                            <div class="ui label">
                                Title
                            </div>
                            <input type="text" placeholder="Project Name" id="editProjectName" value="${title}">
                        </div>
                        <div class="ui fluid labeled input" style="margin-bottom: 20px">
                            <div class="ui label">Deadline</div>
                            <input type="text" placeholder="Deadline..." id="editProjectDeadline" value="${deadline}">
                        </div>
                    </div>
                </div>
                <div class="actions">
                    <div class="ui center aligned container">
                        <div class="ui red cancel button">
                            <i class="remove icon"></i>
                            Cancel
                        </div>
                        <div class="ui green ok inverted button" onclick="saveEditProject('${projectId}')">
                            <i class="checkmark icon"></i>
                            Save
                        </div>
                    </div>
                </div>
            </div>`
    )
    $(function () {
        $('#editProjectDeadline').datepicker({
            minDate: 0,
            dateFormat: 'dd/mm/yy',
            defaultDate: new Date(deadline)
        })
    })
    $('#modalEditProject').modal('show')
}

function saveEditProject(projectId) {
    let title = $("#editProjectName").val()
    let deadline = $("#editProjectDeadline").datepicker('getDate')
    console.log(title);
    console.log(deadline);
    $.ajax({
        url: `${url}/projects/${projectId}`,
        method: "PATCH",
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            title,
            deadline
        },
        statusCode: {
            200: function () {
                getProjectDetail(projectId)
                getProjects()
            },
            400: function (err) {
                console.log(err);
            },
            404: function (err) {
                console.log(err);
            },
            500: function (err) {
                console.log(err);
            }
        }
    })
}

function back() {
    $("#detail").hide()
    $("#owned").show()
    $("#member").show()
}

function logout(event) {
    event.preventDefault()
    Swal.fire({
        title: 'Logout?',
        text: "You have to login again after this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, bye'
    }).then(async (result) => {
        if (result.value) {
            localStorage.removeItem("token");
            var auth2 = gapi.auth2.getAuthInstance();
            await auth2.signOut()
            checkLogin()
            Swal.fire(
                'Bye!',
                'Its sad to see you go.',
                'success'
            )
        }
    })
}

function checkLogin() {
    if (localStorage.getItem('token')) {
        $("#loginForm").hide()
        $("#main").show()
        $("#loggedUser").empty()
        $("#loggedUser").append(`${localStorage.getItem('email')}`)
        $("#homeNav").addClass('active')
        $("#owned").show()
        $("#member").show()
        $("#projectNav").removeClass('active')
        $("#memberNav").removeClass('active')
        $("#detail").hide()
        getUsers()
        getProjects()
    } else {
        $("#loginForm").show()
        $("#main").hide();
    }
}

function showContent(event, content) {
    event.preventDefault()
    if (content === 'home') {
        $("#homeNav").addClass('active')
        $("#owned").show()
        $("#member").show()
        $("#projectNav").removeClass('active')
        $("#memberNav").removeClass('active')
        $("#detail").hide()
    } else if (content === "yourProjects") {
        $("#projectNav").addClass('active')
        $("#owned").show()
        $("#member").hide()
        $("#homeNav").removeClass('active')
        $("#memberNav").removeClass('active')
    } else {
        $("#memberNav").addClass('active')
        $("#owned").hide()
        $("#member").show()
        $("#projectNav").removeClass('active')
        $("#homeNav").removeClass('active')
    }
}

function renderGsignIn() {
    gapi.signin2.render('g-signin2', {
        'scope': 'profile email',
        'width': 171,
        'height': 50,
        'longtitle': false,
        'theme': 'light',
        'onsuccess': onSignIn,
        // 'onfailure': onFailure
    });
}