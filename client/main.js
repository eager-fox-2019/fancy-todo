let token = localStorage.getItem("token")
const serverUrl = 'http://localhost:3000';
$(document).ready(function(){
    if(token){
        $('#userform').hide()
        $('#loggedUsername').empty()
        $('#loggedUsername').append(`Hi, ${localStorage.getItem("username")}!`)
        $('#outButton').empty()
        let logout = `<a id="logout" class="dropdown-item" href="#" onclick="signoutall()">Log out</a>`
        $('#outButton').append(logout)
        $('#todolist').show()
        updateList()            
    }

    $('#to-register-form').on('click', function(event){
        event.preventDefault()
        console.log("To Register Form")
        $('#login-form').hide()
        $('#register-form').show()
    })

    $('#to-login-form').on('click', function(event){
        event.preventDefault()
        console.log("To Login Form")
        $('#register-form').hide()
        $('#login-form').show()
    })

    $('#register').on('click', function(event){
        event.preventDefault()
        let username = $('#username').val()
        let email = $('#reg-email').val()
        let password = $('#reg-psw').val()        
        $.ajax({
            method: "POST",
            data: {username, email, password},
            url: `${serverUrl}/user/create`
        })
            .done(function(res) {
                console.log("Account created: ", res)
                $('#register-form').hide()
                $('#login-form').show()
            })
            .fail(function(err) {
                console.log(err.responseJSON.message)
            })
            .always(function() {
                console.log("Register Process Finished")
            })
    })

    $('#login').on('click', function(event){
        event.preventDefault()
        let email = $('#log-email').val()
        let password = $('#log-psw').val()
        $.ajax({
            method: "POST",
            data: {email, password},
            url: `${serverUrl}/user/login`
        })
            .done(function(res) {
                $('#outButton').empty()
                $('#loggedUsername').empty()
                localStorage.setItem("token", res.token)
                localStorage.setItem("username", res.username)
                let logout = `<a id="logout" class="dropdown-item" href="#" onclick="signout()">Log out</a>`
                $('#outButton').append(logout)
                $('#userform').hide()
                $('#loggedUsername').append(`Hi, ${res.username}!`)
                $('#todolist').show()
                updateList()                
            })
            .fail(function(err) {
                console.log(err)
            })
            .always(function() {
                console.log("Login Process Finished")
            })
    })

    $('#add-form').on('click', '.addTask', function(event){
        event.preventDefault()
        const name = $("#name").val()
        const description = $("#description").val()
        const due_date = $("#due_date").val()
        $.ajax({
            method: "POST",
            url: `${serverUrl}/todo/create`,
            headers: {token: localStorage.getItem("token")},
            data: {
                name,
                description,
                due_date
            }
        })
            .done(function(res) {
                document.getElementById("add-form").reset(); 
                updateList()
            })
            .fail(function(err) {
                console.log(err)
            })
            .always(function() {
                console.log("Create Task Process Finished")
            })
    })

    $('#list').on('click', '.complete', function(event){
        event.preventDefault()
        let id = $("a").prevObject[0].activeElement.id.slice(9)
        complete(id)
    })

    $('#list').on('click', '.delete', function(event){
        event.preventDefault()
        let id = $("a").prevObject[0].activeElement.id.slice(4)
        deleteTodo(id)
    })

    $('#finished').on('click', '.incomplete', function(event){
        event.preventDefault()
        let id = $("a").prevObject[0].activeElement.id.slice(11)
        incomplete(id)
    })

    $('#finished').on('click', '.delete', function(event){
        event.preventDefault()
        let id = $("a").prevObject[0].activeElement.id.slice(4)
        deleteTodo(id)
    })
})

function signout() {
    event.preventDefault()
    console.log("Google logging out")
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    $('#loggedUsername').empty()
    $('#outButton').empty()
    $('#userform').show()
    $('#login-form').show()
    $('#todolist').hide()
    $('#list').empty()
}

function onSignIn(googleUser) {
    var idToken = googleUser.getAuthResponse().id_token;
    axios.post(`${serverUrl}/user/google`, { idToken:idToken })
        .then(function({ data }) {
            // IMPORTANT! Saves the accessToken from server
            $('#userform').hide()
            $('#outButton').empty()
            $('#loggedUsername').empty()            
            let profile = googleUser.getBasicProfile();
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', profile.getName())
            let logout = `<a id="logout" class="dropdown-item" href="#" onclick="signoutall()">Log out</a>`
            $('#outButton').append(logout)
            $('#loggedUsername').append(`Hi, ${localStorage.getItem("username")}!`)
            $('#todolist').show()
            updateList()  
        })
        .catch(function(err) {
            console.log(err);
        });
}

function googleSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User (Google Account) signed out.');
    });
}

function signoutall() {
    signout()
    googleSignOut()
}

function updateList() {
    $.ajax({
        method: "GET",
        url: `${serverUrl}/todo`,
        headers: { token: localStorage.getItem('token') }
    })
        .done(task => {
            $('#list').empty()
            $('#finished').empty()
            for(let i = 0; i < task.length; i++){
                if(task[i].status){
                    $('#finished').append(`
                    <div class="card" style="width: 100%;">
                        <h5 class="card-header text-center">${task[i].name}</h5>
                        <div class="card-body">
                            Description:
                            <br>${task[i].description}
                            <br>Status: completed
                            <br>Due Date: ${task[i].due_date.slice(0,10)}
                            <div class="text-center">
                                <a href="#" class="btn btn-primary incomplete mt" id="incomplete-${task[i]._id}">Incomplete</a>
                                <a href="#" class="btn btn-danger delete mt" id="del-${task[i]._id}">Delete</a>
                            </div>
                        </div>
                    </div>
                    <br>
                `)
                } else {
                    $('#list').append(`
                        <div class="card" style="width: 100%;">
                            <h5 class="card-header text-center">${task[i].name}</h5>
                            <div class="card-body">
                                Description:
                                <br>${task[i].description}
                                <br>Status: incomplete
                                <br>Due Date: ${task[i].due_date.slice(0,10)}
                                <div class="text-center">
                                    <a href="#" class="btn btn-primary complete mt" id="complete-${task[i]._id}">Completed</a>
                                    <a href="#" class="btn btn-danger delete mt" id="del-${task[i]._id}">Delete</a>
                                </div>
                            </div>
                        </div>
                        <br>
                    `)
                }
            }
        })
        .fail(err=> {
            console.log(err)
        })
        .always(function(){
            console.log("Get Task Finished")
        })
}

function complete(id){
    $.ajax({
        method: "PATCH",
        url: `${serverUrl}/todo/edit/${id}`,
        headers: { token: localStorage.getItem('token') },
        data: {status: true}
    })
        .done(function(res) {
            updateList()                
        })
        .fail(function(err) {
            console.log(err)
        })
        .always(function() {
            console.log("Complete Process Finished")
        })
}

function incomplete(id){
    $.ajax({
        method: "PATCH",
        url: `${serverUrl}/todo/edit/${id}`,
        headers: { token: localStorage.getItem('token') },
        data: {status: false}
    })
        .done(function(res) {
            updateList()                
        })
        .fail(function(err) {
            console.log(err)
        })
        .always(function() {
            console.log("Incomplete Process Finished")
        })
}

function deleteTodo(id){
    $.ajax({
        method: "DELETE",
        url: `${serverUrl}/todo/delete/${id}`,
        headers: { token: localStorage.getItem('token') }
    })
        .done(function(res) {
            updateList()                
        })
        .fail(function(err) {
            console.log(err)
        })
        .always(function() {
            console.log("Delete Process Finished")
        })
}
