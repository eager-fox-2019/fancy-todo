// dummy
// localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndpbGRhbiIsImVtYWlsIjoid2lsZGFuQGVtYWlsLmNvbSIsImlkIjoiNWQwNGYzNDczYTA1YWYyMzE1OGNmZGUyIiwiaWF0IjoxNTYwNjA1Nzc2fQ.CdZFn-M60gYdwkz0Tu-Hrm_RyHzqpSmsFTrc1is8MOw")
// localStorage.setItem("userId", "5d04fd6211ee05277de042e9")

// dummy
function loginCheck(){
    // $('#nav-login').hide()
    //     $('#nav-home').show()
    //     $('#loginBar').hide()
    //     $('#registerBar').hide()
    //     $('#nav-register').hide()
    //     $('#nav-out').show()
        // showAllTodo()
        console.log('running..')
        if(localStorage.getItem("token")){
            $('#nav-login').hide()
            $('#nav-home').show()
            $('#loginBar').hide()
            $('#registerBar').hide()
            $('#nav-register').hide()
            $('#nav-out').show()
            $('#totoBar').show()
            showAllTodo()
            // showAllTodo()
            // loginCheck()
            
            
        }else{
            $('#nav-home').hide()
            $('#loginBar').hide()
            $('#registerBar').show()
            $('#totoBar').hide()
            $('#nav-register').hide()
            $('#nav-out').show()
            $('#editBar').hide()
        }
}

$(document).ready(function(){
   loginCheck()
   
})

$('#nav-home').click(function(){
    loginCheck()
    showAllTodo()
    $('#list').show()
})

$('#nav-login').click(function(){
    $('#loginBar').show()
    $('#registerBar').hide()
    $('#nav-register').show()
    $('#nav-login').hide()
    // showAllTodo() 
})

$('#nav-register').click(function(){
    $('#loginBar').hide()
    $('#registerBar').show()
    $('#nav-register').hide()
    $('#nav-login').show()
})

$('#form-register').click(function(event){
    event.preventDefault()
    $.ajax({
        url : 'http://localhost:3000/user/signup',
        type : 'POST',
        data : {
            email : $('#input-email').val(),
            password : $('#input-password').val()
        }
    })
    .done(createdUser => {
        $('#input-email').val('')
        $('#input-password').val('')
        console.log($('#input-email').val(''))
        console.log($('#input-password').val(''))
        console.log(createdUser, 'user yang sudah dibuat')
        Swal.fire({
            type:'success',
            title: "Register Success",
            text:createdUser.msg
        })
    })
    // .fail(function(jqXHR,textStatus){
    //     const errMsg = jqXHR.responseJSON.message.split(':')
    //     Swal.fire({
    //         type:'error',
    //         title:'Failed to register',
    //         text:errMsg[2],
    //     })
    // })
})

$('#form-login').click(function(){
    console.log('login..')
    showAllTodo()
    // console.log(decode, 'ini apa')
    $.ajax({
        url : 'http://localhost:3000/user/signin',
        type : 'post',
        dataTypes : 'json',
        data : {
            email : $('#login-email').val(),
            password : $('#login-password').val()
        }
    })
    .done(logedIn => {
        localStorage.setItem("token", logedIn.token)
        loginCheck()
        showAllTodo()
        $('#totoBar').show()
        $('#loginBar').hide()
        $('#input-email').val('')
        $('#input-password').val('')
        console.log(logedIn, 'ini apa')
        Swal.fire({
            type:'success',
            title: "Login Success",
            text:logedIn.msg
        })
    })
    .fail(() => {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: '<a href>You input wrong combination of email and password</a>'
          })
    })
})

$('#todo-submit').on('click',function(event){
    event.preventDefault()
    $.ajax({
        url : 'http://localhost:3000/todo/create',
        type : 'post',
        dataTypes : 'json',
        headers : {
            token : localStorage.getItem("token")
        },
        data : {
            title : $('#todo-title').val(),
            description : $('#todo-desc').val(),
            status : 'uncomplete',
            dueDate : $('#todo-date').val()
        }
    })
    .done((addTodo) => {
        $('#todo-title').val(''),
        $('#todo-desc').val(''),
        $('#todo-status').val(''),
        $('#todo-date').val('')
        $('#list').empty()
        console.log(addTodo, 'todo added')
        showAllTodo()
        Swal.fire({
            type:'success',
            title: "Success adding to todo list",
            text:addTodo.msg
        })
    })
    .fail(() =>{
        Swal.fire({
            title: 'Failed to add todo',
            animation: false,
            customClass: {
              popup: 'animated tada'
            }
          })
    })
})

$('#nav-out').click(function(event){
    event.preventDefault()
    localStorage.clear()
    signOut()
    $('#nav-home').hide()
    $('#loginBar').hide()
    $('#registerBar').show()
    $('#totoBar').hide()
    $('#nav-register').hide()
    $('#nav-login').show()
    $('#list').empty()
    $('#editBar').hide()

})

function showAllTodo(){
    $('#editBar').hide()
    $.ajax({
        url : 'http://localhost:3000/todo/search',
        type : 'get',
        dataTypes : 'json',
        headers : {
            token : localStorage.getItem("token")
        },
        data : {
            userId : localStorage.getItem("userId")
        }
    })
    .done(showAll => {
        $('#list').show()
        $("#list").empty()
        console.log('kesini ga ya?')
        $.each(showAll, (i, each) => {
            console.log(each, 'ini each')
            $('#list').append(`
            <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action" style="margin : 20px">
                    <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${each.title}</h5>
                    <small> status : ${each.status}</small>
                    </div>
                    <p class="mb-1">${each.description}</p>
                    <small>due date : ${moment(each.dueDate).startOf('day').fromNow()}</small><br>
                    <button type="button" class="btn btn-danger" onclick="deleteTodo('${each._id}')">Delete</button>
                    <button type="button" class="btn btn-warning"n onclick="showEdit('${each._id}')">Edit</button>
                </a>
            </div>
            `)
        })
    }) 
}

function deleteTodo(todoId){
    console.log('jhere')
    console.log(todoId)
    console.log(localStorage.getItem("token"))
    $("#list").show()
    $.ajax({
        url : `http://localhost:3000/todo/delete/${todoId}`,
        type : 'delete',
        headers : {
            token : localStorage.getItem("token")
        }
    })
    .done(oke => {
        console.log('deleted')
        showAllTodo()
        Swal.fire({
            type:'success',
            title: "Deleted",
            text:oke.msg
        })
    })
    .fail()
}

function showEdit(todoId){
    console.log('edited..')
    // console.log(todoItem, 'item')
    $('#editBar').show()
    $('#list').hide()
    $('#totoBar').hide()
    editTodo(todoId)
}



function editTodo(todoId){
    let msg = 'has been updated'
    $('#btn-edit').on('click', function(){
        $.ajax({
            url : `http://localhost:3000/todo/update/${todoId}`,
            type : 'patch',
            headers : {
                token : localStorage.getItem("token")
            },
            data : {
                title : $('#edit-title').val(),
                description : $('#edit-desc').val(),
                status : $('#edit-status').val(),
                dueDate : $('#edit-date').val()
            }
        })
        .done(edited => {
            // $('#form-edit').append(``)
            console.log($('#edit-status').val(), 'value')
            $('#editBar').hide()
            $('#list').show()
            $('#totoBar').show()
            showAllTodo()
            console.log(msg)
            $('#edit-title').val(''),
            $('#edit-desc').val(''),
            $('#edit-status').val(''),
            $('#edit-date').val('')
        })
        .fail()
    })
}
// google

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token
    $.ajax({
        url : `http://localhost:3000/user/googlesignin`,
        type : 'post',
        data : {
            idToken : id_token
        }
    })
    .done(response => {
        localStorage.setItem("token", `${response.token}`)
        // showAllTodo()
        loginCheck()
        // showAllTodo()
        console.log(response, 'respon nii')
    })
    .fail('err')
  }

  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }