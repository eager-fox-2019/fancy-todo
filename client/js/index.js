const baseURL = 'http://localhost:3000'
let todoId;

$(document).ready(function(){
    initListener()
    checkSignIn()
})

function checkSignIn(){
    if(localStorage.getItem('token')){
        $('#firstPage').hide()
        $('#secondPage').show()
        $('#thirdPage').hide()
        $('#navBar').show()
        $('.mainNav').show()
        $('.crudNav').hide()
        getAllTodos()
    } else {
        $('#navBar').hide()
        $('#firstPage').show()
        $('#secondPage').hide()
        $('#thirdPage').hide()
    }
}

function initListener(){
    
    // event.preventDefault()
    $('#registerPage').hide()
    


    $('#loginForm').submit(function(){
        event.preventDefault()
        let email = $('#login_email').val()
        let password = $('#login_password').val()
        
        login(email, password)
    })

    $('#registerForm').submit(function(event){
        
        event.preventDefault()
        let email = $('#reg_email').val()
        let username = $('#reg_username').val()
        let password = $('#reg_password').val()
        
        // console.log(email, username, password)
        register(email, username, password)
    })


    $('#registerButton').click(function(){
        event.preventDefault()
        $('#registerPage').show()
        $('#loginPage').hide()
    })

    $('#loginButton').click(function(){
        event.preventDefault()
        $('#registerPage').hide()
        $('#loginPage').show()
    })

    $('#addTodoForm').submit(function(event){
        event.preventDefault()
        console.log('masuk create todoSubmit')
        console.log($('#todo_description').val());
        console.log($('#todo_dueDate').val());
        $.ajax({
            url : `${baseURL}/todo/add`,
            method : "POST",
            data : {
                description : $('#todo_description').val(),
                dueDate : $('#todo_dueDate').val(),
                status : false
            },
            headers : {
                access_token : localStorage.getItem('token')
            }
        })
            .done(function(response){
                console.log(response)
                checkSignIn()
            })
            .fail(function(jqXHR, TextError){
                console.log(jqXHR)
                checkSignIn()
            })
    })

    $('#updateTodoForm').submit(function(event){
        event.preventDefault()
        console.log('masuk create todoSubmit')
        console.log($('#todoU_description').val());
        console.log($('#todoU_dueDate').val());    
        
        updateTodoClick()
        
    })

}

function createTodo(){
    console.log('masuk create todo')
    $('#thirdPage').show()
    $('#addTodoForm').show()
    
    $('.mainNav').hide()
    $('.crudNav').show()
    $('#updateTodoForm').hide()
    $('#secondPage').hide()
    $('#thirdPage').show()
    
}

function deleteTodo(id){
    console.log(localStorage.getItem('token'));
    console.log(id)
    $.ajax({
        url : `${baseURL}/todo/${id}`,
        method : "DELETE",
        headers : {
            access_token : localStorage.getItem('token')
        }
    })
        .done(function(response){
            console.log(response)
            checkSignIn()
        })
        .fail(function(jqXHR, TextError){
            console.log(jqXHR)
            checkSignIn()
        })
}

function updateTodo(id, desc, date){
    todoId = id
    $('#updateTodoForm').empty()
    $('#updateTodoForm').append(`
        Due Date :
        <div class='row'>
        <div class='input-field col s12'>
            <input value="${date}" type='date' name='date' id="todoU_dueDate" />
            <label for='date'></label>
        </div>
        </div>

        <div class='row'>
        <div class='input-field col s12'>
            <textarea id="todoU_description" class="validate" type='materialize-textarea' name="description">${desc}</textarea>
            <label class="active" for='description'>Enter your description</label>
        </div>
        </div>
        
        <br />
        <center>
        <div class='row'>
            <button id="createTodoBut" type='submit' name='btn_login' class='col s12 btn btn-large waves-effect indigo'>update todo</button>
        </div>
        <br>
        <br>
        </center>
    `)
    
}

function updateTodoClick(){
    $.ajax({
        url : `${baseURL}/todo/${todoId}`,
        method : "PUT",
        data : {
            description : $('#todoU_description').val(),
            dueDate : $('#todoU_dueDate').val()
        },
        headers : {
            access_token : localStorage.getItem('token')
        }
    })
        .done(function(response){
            console.log(response)
            checkSignIn()
        })
        .fail(function(jqXHR, TextError){
            console.log(jqXHR)
            checkSignIn()
        })
}

function completed(id){
    console.log(id)
    $.ajax({
        url : `${baseURL}/todo/${id}`,
        method : "PUT",
        data : {
            status : true
        },
        headers : {
            access_token : localStorage.getItem('token')
        }
    })
        .done(function(response){
            console.log(response)
            checkSignIn()
        })
        .fail(function(jqXHR, TextError){
            console.log(jqXHR)
            checkSignIn()
        })
}

function onSignIn(googleUser) {

    var id_token = googleUser.getAuthResponse().id_token;

    var profile = googleUser.getBasicProfile();
    // let { getEmail, getName } = profile
    console.log(id_token);
    $.ajax({
        url : `${baseURL}/user/loginGoogle`,
        method : "POST",
        headers : {
            access_token : id_token
        }
    })
        .done(function(response){
            console.log(response)
            localStorage.setItem('token', response.access_token)
            localStorage.setItem('userId', response.userId)
            checkSignIn()
        })
        .fail(function(jqXHR, TextError){
            console.log(jqXHR)
            checkSignIn()
        })

}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        localStorage.clear()
        checkSignIn()
    });
}

function login(email, password){
    
        let user = { email, password }
        $.ajax({
            url : `${baseURL}/user/login`,
            method : 'POST',
            data : user
        })
            .done(function(response){
                localStorage.setItem('token', response.access_token)
                localStorage.setItem('userId', response.userId)
                checkSignIn()
            })
            .fail(function(jqXHR, TextError){
                console.log(jqXHR)
                checkSignIn()
            })
}

function register(email, username, password){
    let user = { email, username, password}
    console.log(user)
    $.ajax({
        url : `${baseURL}/user/register`,
        method : 'POST',
        data : user
    })
        .done(function(response){
            login(email, password)
        })
        .fail(function(jqXHR, TextError){
            console.log(jqXHR)
            checkSignIn()
        })
}

function getAllTodos(){
    $.ajax({
        url : `${baseURL}/todo/readAll`,
        method : 'GET'
    })
        .done(function(response){
            console.log(response)
            $('#todoCard').empty()
            let currId = localStorage.getItem('userId')
            let day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            response.forEach((element, i) => {
                if(element.status === 'true') element.status = 'completed'
                if(element.status === 'false') element.status = 'uncompleted'
                let date = `${day[new Date(element.dueDate).getDay()]}, ${new Date(element.dueDate).getDate()}/${new Date(element.dueDate).getMonth()+1}/${new Date(element.dueDate).getFullYear()}`
                $('#todoCard').append(`
                    <div class="col s12 m3">
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                            <span class="card-title">Todo <small><p>owner : ${element.userId.username}</p></small></span>
                            
                            <br>
                            <p>${element.description}</p>
                            <br>
                            <small><p>Due : ${date}</p></small>
                            <br>
                            <div id="todoStatus-${i}">
                                
                            </div>
                            </div>
                            <div class="card-action" id="action-buttons-${i}">
                            
                            </div>
                        </div>
                    </div>
                `)                    
                $(`#todoStatus-${i}`).empty()
                if(currId == element.userId._id){
                    $(`#action-buttons-${i}`).append(`
                        <a href="#" class="btn-flat" id="updateTodo_${i}">UPDATE</a>
                        <a href="#" class="btn-flat" id="deleteTodo_${i}">DELETE</a>
                    `)
                    if(element.status == 'uncompleted'){
                        $(`#todoStatus-${i}`).append(`
                            <small><p><b style="color:red">${element.status}</b> <button style="float:right;" id="doneBut-${i}"> done ? </button></p></small>
                        `)
                    } else {
                        $(`#todoStatus-${i}`).append(`
                            <small><p><b style="color:lightgreen">${element.status}</b> </p></small>
                        `)
                    }
                } else {
                    if(element.status == 'uncompleted'){
                        $(`#todoStatus-${i}`).append(`
                            <small><p><b style="color:red">${element.status}</b></p></small>
                        `)
                    } else {
                        $(`#todoStatus-${i}`).append(`
                            <small><p><b style="color:lightgreen">${element.status}</b></p></small>
                        `)
                    }
                }

                $(`#doneBut-${i}`).on('click', function(){
                    completed(element._id)
                })
                
                $(`#updateTodo_${i}`).on('click', function(){
                    $('.mainNav').hide()
                    $('.crudNav').show()
                    $('#thirdPage').show()
                    $('#addTodoForm').hide()
                    $('#updateTodoForm').show()
                    $('#secondPage').hide()

                    updateTodo(element._id, element.description, element.dueDate)
                })
                $(`#deleteTodo_${i}`).on('click', function(){
                    deleteTodo(element._id)
                })
            });
            
        })
        .fail(function(jqXHR, TextError){
            console.log(jqXHR)
        })
}
