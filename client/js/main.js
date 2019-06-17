let baseUrl = 'http://localhost:3000'

function onSignIn(googleUser){
    var id_token = googleUser.getAuthResponse().id_token
    console.log(id_token);
    
    $.ajax({
        url: `${baseUrl}/users/tokensignin`,
        method: "POST",
        data: {
            id_token : id_token
        },
        success: function(data){
            $("#loginForm").hide()
            $("#navbar").show()
            $("#logoutbtn").show()
            localStorage.setItem('token', data.accessToken)
            
        },
        error: function(err){
            console.log(err);  
        }
    })  
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    // $("#logoutbtn").hide()

    localStorage.clear()
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

function showTodo(){
    $.ajax({
        method: "GET",
        url: `${baseUrl}/todos`,
        headers:{
            token : localStorage.getItem('token')
        }
    })
    .done(function(resp){
        $("#todolist").empty()
        resp.forEach(data => {
            $("#todolist").append(`
            <a href="#" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${data.name} <span id="${data._id}" class="badge badge-pill badge-warning">${(data.status == false ? 'set to complete': 'completed')}</span></h5>
                <div class="d-flex flex-column">
                    <small>${moment(data.createdAt).startOf('hour').fromNow()}</small>
                    <div d-flex flex-row>
                       <span class="deleteTodo" id="${data._id}"> <i class="fa fa-lg fa-trash trash-icon" aria-hidden="true"></i> </span>| 
                       <span class="editTodo" id="${data._id}" data-toggle="modal" data-target="#editTodoModal" data-whatever="@mdo"><i class="fa fa-lg fa-pencil pencil-icon" aria-hidden="true"></i></span> 
                    </div>
                </div>
            </div>
            <div class="d-flex flex-column"> 
                <p class="mb-1">${data.description}</p>
                <span class="speakTodo" id="${data._id}" onclick='responsiveVoice.speak("${data.description}");'> <i class="fa fa-volume-up fa-lg volume-icon" aria-hidden="true"></i> </span>
                <small>${(moment(data.due_date).endOf('day').fromNow() === undefined ? 'expired' : moment(data.due_date).endOf('day').fromNow())}</small>
            </div>
        </a>
            `)
        });
        deleteTodos()
        editTodos()
        updateStatusTodo()
    })
    .fail(function(err){
        console.log(err);
        
    })
}


function updateStatusTodo(){
    $('.badge-warning').click(function(){
        swal.fire({
            title: 'Are you sure?',
            text: "Your todo will be set to complete",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, I already done!'
        })
        .then((result) => {
            if (result.value) {
                updatestatus(this.id)
            }else{
                swal.fire({
                    title: "cancel todo",
                    type: "success"
                });
                }            
        });
    })
}

function updatestatus(id){
    $.ajax({
        method: "PATCH",
        url: `${baseUrl}/todos/${id}`,
        headers:{
            token : localStorage.getItem('token')
        },
        data: {
            id
        }
    })
    .done(function(todo){
        Swal.fire(
            'Completed!',
            'Your todo is now completed.',
            'success'
        )
        showTodo()
    })
    .fail(function(err){
        console.log(err);
        
    })
}

function deleteTodos(){
    $('.deleteTodo').on("click",function () {
        event.preventDefault()
        
        swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })
        .then((result) => {
            if (result.value) {
                removeTodo(this.id)
            }else{
                swal.fire({
                    title: "cancel remove todo",
                    type: "success"
                });
            }            
        });
    })
    
}
function removeTodo(id){
    $.ajax({
        method: "DELETE",
        url: `${baseUrl}/todos/${id}`,
        headers:{
            token : localStorage.getItem('token')
        },
        data: {
            id
        }
    })
    .done(function(todo){
        Swal.fire(
            'Deleted!',
            'Your todo has been deleted.',
            'success'
        )
        showTodo()
    })
    .fail(function(err){
        console.log(err);
        
    })
}

function editTodos(){
    $('.editTodo').on("click",function () {
        event.preventDefault()
        $.ajax({
            method: "GET",
            url: `${baseUrl}/todos/${this.id}`,
            headers:{
                token : localStorage.getItem('token')
            }
        })
        .done(function(data){
            let now = new Date(data.due_date)
            $('#title1').val(data.name)
            $('#description1').val(data.description)
            $('#duedate1').val(now.getFullYear()+"-"+("0" + (now.getMonth() + 1)).slice(-2)+"-"+("0" + now.getDate()).slice(-2))    
            $('#uid').val(data._id)
        })
        .fail(function(err){
            console.log(err);
            
        })
    })
}


$(document).ready(function(){
    console.log('local:');
    console.log(localStorage.getItem("token"));
    
    if (localStorage.getItem("token") !== null) {
        $('#navbar').show()
        $('#todolist').show()
        $('#modalCreate').show()
        $("#loginForm").hide()
        $("#regisForm").hide()
        showTodo()
    } else {
        $('#navbar').hide()
        $('#todolist').hide()
        $('#modalCreate').hide()
        $("#loginForm").show()
        $("#regisForm").hide()
    }

    $('#searching').keypress(function(){
        event.preventDefault()
        let search = $('#searching').val()
        console.log(search);
        
        $.ajax({
            method: "GET",
            url: `${baseUrl}/todos/search/${search}`,
            headers:{
                token : localStorage.getItem('token')
            }
        })
        .done(resp => {
            $('#searching').val('')
            console.log(resp, '====')
            $('#todolist').empty()
            resp.forEach(data => {
                $("#todolist").append(`
                <a href="#" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${data.name} <span id="${data._id}" class="badge badge-pill badge-warning">${(data.status == false ? 'set to complete': 'completed')}</span></h5>
                    <div class="d-flex flex-column">
                        <small>${moment(data.createdAt).startOf('hour').fromNow()}</small>
                        <div d-flex flex-row>
                           <span class="deleteTodo" id="${data._id}"> <i class="fa fa-lg fa-trash trash-icon" aria-hidden="true"></i> </span>| 
                           <span class="editTodo" id="${data._id}" data-toggle="modal" data-target="#editTodoModal" data-whatever="@mdo"><i class="fa fa-lg fa-pencil pencil-icon" aria-hidden="true"></i></span> 
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-column"> 
                    <p class="mb-1">${data.description}</p>
                    <small>${(moment(data.due_date).endOf('day').fromNow() === undefined ? 'expired' : moment(data.due_date).endOf('day').fromNow())}</small>
                </div>
            </a>
                `)
            });
        })
        .fail((jqXHR, textStatus) => {
            console.log(textStatus)
            swal({
                icon: "../assets/shock.gif",
                title: "Internal Server Error"
            })
        })
    })



    $("#login").click(function (e) { 
        e.preventDefault();
        let email = $('#email').val()
        let password = $('#password').val()

        if (email != '' && password != '') {
            $.ajax({
                    method: "POST",
                    url: `${baseUrl}/users/login`,
                    data: {
                        email,
                        password
                    }
                })
                .done(resp => {
                    swal.fire({
                        type: "success",
                        title: "Success Login!"
                    })
                    localStorage.setItem("token", resp.token)
                    $("#loginForm").hide()
                    $("#navbar").show()
                    $('#todolist').show()
                    showTodo()
                    $('#modalCreate').show()
                    
                })
                .fail((jqXHR, textStatus) => {
                    console.log(textStatus)
                    swal.fire({
                        type: "error",
                        title: "Email/Password Wrong"
                    })
                })
        } else {
            swal.fire({
                type: "error",
                title: "Email/Password cannot be empty"
            })
        }
        
    });

    $("#regisButton").click(function (e) { 
        e.preventDefault();
        $("#loginForm").hide()
        $("#regisForm").show()
    });

    $("#register").click(function(e){
        let username = $('Username1').val()
        let email = $('#Email1').val()
        let password = $('#Password1').val()

        if (email != '' && password != '' && username != '') {
            $.ajax({
                    method: "POST",
                    url: `${baseUrl}/users/register`,
                    data: {
                        username,
                        email,
                        password
                    }
                })
                .done(resp => {
                    swal.fire({
                        type: "success",
                        title: "Success Register, Please Login"
                    })
                    $('#regisform').hide()
                    $('#loginform').show()

                })
                .fail((jqXHR, textStatus) => {
                    console.log(textStatus)
                    swal.fire({
                        type: "error",
                        title: "Email Already Used"
                    })
                    $('#regisform').show()
                })
        } else {
            swal.fire({
                type: "error",
                title: "Email/Password cannot be empty"
            })
            $('#regisform').show()
        }
    })
//logout
    $('#logoutbtn').click(function () {
        event.preventDefault()
        swal.fire({
            title: 'Are you sure?',
            text: "Your todo is waiting for you",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
            })
            .then((result) => {
                if(result.value){
                    signOut()
                    Swal.fire(
                        "You're logging out..!!",
                        'success'
                    )
                    $('#navbar').hide()
                    $('#todolist').hide()
                    $('#modalCreate').hide()
                    // $('#loginform').show()
                    window.location.href = 'http://localhost:8080/'
                }else{
                    Swal.fire(
                        "Yes, play again",
                        'success'
                    )
                }
                    
                    
            });
    })
    //create
    $('#submitAdd').click(function () {
        event.preventDefault()
        let name = $('#title').val()
        let desc = $('#description').val()
        let due_date = $('#duedate').val()
       
        if (name != '' && desc != '' && due_date != '') {
            $.ajax({
                    method: "POST",
                    url: `${baseUrl}/todos/`,
                    headers:{
                        token : localStorage.getItem('token')
                    },
                    data: {
                        name,
                        desc,
                        due_date
                    }
                })
                .done(resp => {
                    $('#addTodoModal').modal('hide')
                    swal.fire({
                        type: "success",
                        title: "todo is in your list now"
                    })
                    showTodo()
                    $('#title').val('')
                    $('#description').val('')
                    $('#duedate').val('')

                })
                .fail((jqXHR, textStatus) => {
                    console.log(textStatus)
                    swal.fire({
                        type: "error",
                        title: "something wrong"
                    })
                })
        } else {
            swal.fire({
                type: "error",
                title: "please complete the form"
            })
        }
    })
//update
$('#submitEdit').click(function(){
    let name = $('#title1').val()
    let desc = $('#description1').val()
    let due_date = $('#duedate1').val()
    let id = $('#uid').val()

    $.ajax({
        method: "PUT",
        url: `${baseUrl}/todos/${id}`,
        headers:{
            token : localStorage.getItem('token')
        },
        data: {
            id,
            name,
            desc,
            due_date
        }
    })
    .done(function(){  
        $('#editTodoModal').modal('hide')
        swal.fire({
            type: "success",
            title: "todo is changing"
        })
        showTodo()
    })
    .fail(function(err){
        console.log(err);        
    })
})
    
})