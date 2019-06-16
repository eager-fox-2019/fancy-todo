const serverUrl = 'http://localhost:3000';

function login(email, password) {
    $.ajax({
        url: `${serverUrl}/users/login`,
        method: 'POST',
        data: {
            email, password
        }
    })
        .done((loginSuccess) => {
            $('#loading').hide()
            Swal.fire({
                position: 'center',
                type: 'success',
                title: `Welcome ${loginSuccess.name}`,
                showConfirmButton: false,
                timer: 1500
            })
            localStorage.setItem('token', loginSuccess.token)
            localStorage.setItem('id', loginSuccess.id)
            localStorage.setItem('name', loginSuccess.name)
            localStorage.setItem('email', loginSuccess.email)
            userLogin(loginSuccess.name)
            $('#login_email').val('')
            $('#login_password').val('')
            showCreateTodoFrom()
        })
        .fail((jqXHR, textStatus) => {
            $('#loading').hide()
            Swal.fire({
                type: 'error',
                title: `${jqXHR.responseJSON.message}`,
                animation: false,
                customClass: {
                    popup: 'animated tada'
                }
            })
            console.log(textStatus)
        })
}

function register(name, email, password) {
    $.ajax({
        url: `${serverUrl}/users/register`,
        method: 'POST',
        data: {
            name, email, password
        }
    })
        .done((newUser) => {
            login(email, password)
            clearForm()
        })
        .fail((jqXHR, textStatus) => {
            $('#loading').hide()
            Swal.fire({
                type: 'error',
                title: `${jqXHR.responseJSON.message}`,
                animation: false,
                customClass: {
                    popup: 'animated tada'
                }
            })
        })
}


function getMember(projectId) {
    $.ajax({
        url: `${serverUrl}/users`,
        method: 'GET',
    })
        .done((members) => {
            let owner = localStorage.getItem('id')
            let newMembers = members.filter(el => {
                if (el._id !== owner) return el
            })
            newMembers.forEach(element => {
                $('#list_member').append(`
                <li class="collection-item">
                <div>${element.name}<a id="${element._id}" onclick="addMember('${element._id}', '${projectId}', '${element.name}')" href="#!" class="secondary-content"><i id="add_member_done${element._id}" class="material-icons">done</i><i id="add_member_icon${element._id}" class="material-icons">add_circle_outline</i></a></div></li>
            `)
                $(`#add_member_done${element._id}`).hide()

            });
        })
        .fail((jqXHR, textStatus) => {
            $('#loading').hide()
            Swal.fire({
                type: 'error',
                title: `${jqXHR.responseJSON.message}`,
                animation: false,
                customClass: {
                    popup: 'animated tada'
                }
            })
            console.log(textStatus)
        })
}

function clearForm() {
    $('#register_name').val('');
    $('#register_email').val('');
    $('#register_password').val('');
    $('#confirmpassword').val('');
    $('#register_name').focus();
}

function userLogin(userName) {
    $('#login_page').hide()
    $('#content_page').show()
    $('.logout_link').show();
    $('.userprofile').show();
    $('.login_link').hide();
    $('.register_link').hide();
    $('#register_page').hide();
    $('#todo_form').hide();
    $('#listTodo').empty()
    $('.userprofile').empty()
    $('.userprofile').append(`<i class="material-icons left">account_circle</i>${userName}`)
    $('#countMyTodo').empty()
    $('#countProjects').empty()
}

function userLogout() {
    $('#login_page').fadeIn()
    $('#register_page').hide();
    $('#content_page').hide();
    $('#todo_form').hide();
    $('.logout_link').hide();
    $('.userprofile').hide();
    $('.login_link').show();
    $('.register_link').show();
    $('#login_email').focus()
}

function logout() {
    localStorage.clear()
    signOut()
    userLogout()
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

function email_validate() {
    let pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    let email = $('#register_email').val();
    if (email !== '' && !pattern.test(email)) {
        $('#login_email_valid').show()
        $('#login_email_empty').hide()
        $('#register_email').focus()
        $('#register_button').attr('disabled')
    } else
        if (email !== '' && pattern.test(email)) {
            $('#login_email_empty').hide()
            $('#login_email_valid').hide()
            $('#register_button').removeAttr('disabled')
        } else {
            $('#login_email_valid').hide()
            $('#login_email_empty').show()
            $('#register_email').focus()
            $('#register_button').attr('disabled')
        }
}

function onSignIn(googleUser) {
    const idToken = googleUser.getAuthResponse().id_token;
    axios
        .post(`${serverUrl}/googleSignIn`, { idToken })
        .then(({ data }) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('picture', data.picture);
            localStorage.setItem('name', data.name);
            localStorage.setItem('email', data.email);
            localStorage.setItem('id', data.id);
            userLogin(data.name)
            $('#login_email').val('')
            $('#login_password').val('')
            showCreateTodoFrom()
        })
        .catch((err) => {
            Swal.fire({
                type: 'error',
                title: `${err}`,
                animation: false,
                customClass: {
                    popup: 'animated tada'
                }
            })
        });
}
