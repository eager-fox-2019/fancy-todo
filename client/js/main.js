let baseUrl = 'http://localhost:3000'

function newTodo(){
    let data = {
        name : $('#todo-name').val(),
        description : $('#todo-desc').val(),
        dueDate : $('#todo-date').val()
    }
    $.ajax({
        method: "POST",
        url: `${baseUrl}/todos`,
        headers: {
            token: localStorage.getItem('token')
        },
        data: data
    })
    .done(resp => {
        console.log(resp, 'add todo')
        swal({
            icon: "success",
            text: "Success Add Todo"
        })
        todo()
        $('#todo-name').val(''),
        $('#todo-desc').val(''),
        $('#todo-date').val('')
    })
    .fail((jqXHR, textStatus) => {
        console.log(textStatus)
        swal({
            icon: "warning",
            text: "Cannot Get Todos"
        })
    })
}

function onSignIn(googleUser) {
    var idToken = googleUser.getAuthResponse().id_token;

    $.ajax({
            method: "POST",
            url: `${baseUrl}/users/googlesignin`,
            data: {
                idToken
            }
        })
        .done(resp => {
            swal({
                icon: "success",
                text: "Success Login!"
            })
            $('#loginform').hide()
            $('.nb').show()
            $('#main').show()
            $('#user').append(`
                <b style="color: white">${resp.userName}</b>
            `)

            localStorage.setItem("token", resp.token)
            localStorage.setItem("userName", resp.userName)
        })
        .fail((jqXHR, textStatus) => {
            console.log(textStatus)
            swal({
                icon: "warning",
                text: "Email/Password Wrong"
            })
        })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();

    $('.nb').hide()
    $('#clickhere').show()
    $('#main').hide()

    localStorage.clear()
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

function todo() {
    $.ajax({
            method: "GET",
            url: `${baseUrl}/todos`,
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done(resp => {
            console.log(resp)
            $('#todolist').empty()
            resp.forEach(resp => {
                let date = resp.dueDate.substr(0, 10).split('-').reverse().join('-')
                $('#todolist').append(`
                <div class="card" style="width: 15rem; height:16rem; margin-right:15px; margin-top:15px; color: black; text-align: center">
                    <div class="card-body">
                    <h5 class="card-title"><b>${resp.name}</b></h5>
                    <h6 class="card-subtitle mb-2">===========</h6>
                    <p class="card-text">Status: ${resp.status}</p>
                    <p class="card-text">Due Date: ${date}</p>
                    <button type="button" class="btn btn-outline-primary" style="margin-bottom:10px;" onclick="detailtodo('${resp.name}','${resp.description}','${resp.status}','${date}')">Detail</button><br>
                    <button type="button" class="btn btn-outline-warning" style="margin-right:5px;">Edit</button>
                    <button type="button" class="btn btn-outline-danger">Delete</button>
                    </div>
                </div>
                `)
            });
        })
        .fail((jqXHR, textStatus) => {
            console.log(textStatus)
            swal({
                icon: "warning",
                text: "Cannot Get Todos"
            })
        })
}

function detailtodo(title, desc, status, date) {
    swal({
        title: title,
        text: `

        Description: 
        
        ${desc}

        Status: ${status}

        Due Date: ${date}
        `
    })
}

$(document).ready(function () {
    if (localStorage.token) {
        $('#regisform').hide()
        $('#loginform').hide()
        $('#clickhere').hide()
        $('.nb').show()
        $('#main').show()
        todo()
    } else {
        $('#regisform').hide()
        $('#loginform').hide()
        $('#clickhere').show()
        $('.nb').hide()
        $('#main').hide()
    }
})

$('#regisbtn').click(function () {
    event.preventDefault()
    let userName = $('#regisuser').val()
    let email = $('#regisemail').val()
    let password = $('#regispassword').val()

    if (email != '' && password != '' && userName != '') {
        $.ajax({
                method: "POST",
                url: `${baseUrl}/users/signup`,
                data: {
                    userName,
                    email,
                    password
                }
            })
            .done(resp => {
                swal({
                    icon: "success",
                    text: "Success Register, Please Login"
                })
                $('#regisform').hide()
                $('#loginform').show()

                $('#regisuser').val('')
                $('#regisemail').val('')
                $('#regispassword').val('')
                $('#loginemail').val('')
                $('#loginpassword').val('')
            })
            .fail((jqXHR, textStatus) => {
                console.log(textStatus)
                swal({
                    icon: "warning",
                    text: "Email Already Used"
                })
            })
    } else {
        swal({
            text: "Email/Password cannot be empty"
        })
    }
})

$('#loginbtn').click(function () {
    event.preventDefault()
    let email = $('#loginemail').val()
    let password = $('#loginpassword').val()

    if (email != '' && password != '') {
        $.ajax({
                method: "POST",
                url: `${baseUrl}/users/signin`,
                data: {
                    email,
                    password
                }
            })
            .done(resp => {
                swal({
                    icon: "success",
                    text: "Success Login!"
                })
                $('#user').append(`
                    <b style="color: white">${resp.userName}</b>
                `)
                $('#loginform').hide()
                $('.nb').show()
                $('#main').show()

                $('#regisuser').val('')
                $('#regisemail').val('')
                $('#regispassword').val('')
                $('#loginemail').val('')
                $('#loginpassword').val('')

                localStorage.setItem("token", resp.token)
                localStorage.setItem("userName", resp.userName)
            })
            .fail((jqXHR, textStatus) => {
                console.log(textStatus)
                swal({
                    icon: "warning",
                    text: "Email/Password Wrong"
                })
            })
    } else {
        swal({
            text: "Email/Password cannot be empty"
        })
    }
})

$('#clickhere').click(function () {
    event.preventDefault()
    $('#regisform').hide()
    $('#clickhere').hide()
    $('#loginform').show()
})

$('#formcancelregis').click(function () {
    event.preventDefault()
    $('#regisform').hide()
    $('#clickhere').show()
})

$('#formcancellogin').click(function () {
    event.preventDefault()
    $('#clickhere').show()
    $('#loginform').hide()
})

$('#toRegis').click(function () {
    event.preventDefault()
    $('#regisform').show()
    $('#loginform').hide()
})

$('#toLogin').click(function () {
    event.preventDefault()
    $('#regisform').hide()
    $('#loginform').show()
})

$('#logoutbtn').click(function () {
    event.preventDefault()
    swal({
            title: "Are you sure?",
            text: "We gonna miss you",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                signOut()
                swal("You'r Logout!, We will miss you!", {
                    icon: "success",
                });
            } else {
                swal({
                    icon: "data:image/png;base64,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",
                    text: "Please, Don't do that again!"
                });
            }
        });
})