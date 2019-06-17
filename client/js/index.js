const baseURL = 'http://localhost:3000'

$(document).ready(function(){
    initListener()
    checkSignIn()
})

function checkSignIn(){
    if(localStorage.getItem('token')){
        $('#firstPage').hide()
        $('#secondPage').show()
        $('#thirdPage').hide()
        getAllTodos()
    } else {
        $('#firstPage').show()
        $('#secondPage').hide()
        $('#thirdPage').hide()
    }
}

function initListener(){
    event.preventDefault()

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


}

function createTodo(){
    $('#secondPage').hide()
    $('#thirdPage').show()
    $('#createTodo').submit(function(){
        event.preventDefault()
        // console.log($('#todo_date').val())
        $.ajax({
            url : `${baseURL}/todo/add`,
            method : "POST",
            data : {
                description : $('#todo_description').val(),
                dueDate : $('#todo_dueDate').val(),
                status : $('#').val()
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
}

function deleteTodo(id){
    event.preventDefault()
    $.ajax({
        url : `${baseURL}/todo/${id}`,
        method : "DELETE"
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

function updateTodo(id){
    event.preventDefault()
    $.ajax({
        url : `${baseURL}/todo/${id}`,
        method : "PUT"
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
                localStorage.setItem('token', response.token)
                localStorage.setItem('userId', response.userId)
                checkSignIn()
            })
            .fail(function(jqXHR, TextError){
                console.log(jqXHR)
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
                element.dueDate = `${day[new Date(element.dueDate).getDay()]}, ${new Date(element.dueDate).getDate()}/${new Date(element.dueDate).getMonth()+1}/${new Date(element.dueDate).getFullYear()}`
                if(currId === element.userId){
                    $('#todoCard').append(`
                        <div class="col s12 m3">
                            <div class="card blue-grey darken-1">
                                <div class="card-content white-text">
                                <span class="card-title">Todo <small><p>owner : ${element.userId}</p></small></span>
                                
                                <br>
                                <p>${element.description}</p>
                                <br>
                                <small><p>Due : ${element.dueDate}</p></small>
                                <small><p>${element.status}</p></small>
                                </div>
                                <div class="card-action">
                                <a href="#" class="btn-flat" id="updateTodo_${i}">UPDATE</a>
                                <a href="#" class="btn-flat" id="deleteTodo_${i}">DELETE</a>
                                </div>
                            </div>
                        </div>
                    `)                    
                } else {
                    $('#todoCard').append(`
                        <div class="col s12 m3">
                            <div class="card blue-grey darken-1">
                                <div class="card-content white-text">
                                <span class="card-title">Todo <small><p>owner : ${element.userId}</p></small></span>
                                
                                <br>
                                <p>${element.description}</p>
                                <br>
                                <small><p>Due : ${element.dueDate}</p></small>
                                <small><p>${element.status}</p></small>
                                </div>
                                <div class="card-action">
                                <a href="#" class="btn-flat disabled" id="updateTodo_${i}">UPDATE</a>
                                <a href="#" class="btn-flat disabled" id="deleteTodo_${i}">DELETE</a>
                                </div>
                            </div>
                        </div>
                    `)                    
                }
                $(`#updateTodo_${i}`).click(updateTodo(element.userId))
                $(`#deleteTodo_${i}`).click(deleteTodo(element.userId))
            });
            
        })
        .fail(function(jqXHR, TextError){
            console.log(jqXHR)
        })
}
