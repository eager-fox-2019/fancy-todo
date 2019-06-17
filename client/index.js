
// $(document).ready(function(){
//     var token = localStorage.getItem("jwt")
//     if(token){
//         getAllTodo()        

//     }
// })

function generateLogin(){
    $(".userNav").empty()
    $(".userNav").append(`
    <form for="loginUser">
    <input type="text" name="username" id="loginUsername" placeholder="username">
    <input type="password" name="password" id="loginPassword" placeholder="password">
    <button type="submit" onclick="login()">Login</button>
    </form>`)
}

function generateRegister(){
    $(".userNav").empty()
    $(".userNav").append(`
    <form for="registerUser">
    <input type="text" name="username" id="usernameInput" placeholder="username">
    <input type="text" name="email" id="emailInput" placeholder="email">
    <input type="password" name="password" id="passwordInput" placeholder="password">
    <button type="submit" onclick="register()">Register</button>
    </form>`)
}


function sortTodo(task){
    var checkbox = "<input type='checkbox' value='done'>"
    if(task.status){
        checkbox = "<input type='checkbox' value='done' checked>"
    }
    var list = `
    <li>
    <span class="handle ui-sortable-handle">
        <i class="fa fa-ellipsis-v"></i>
        <i class="fa fa-ellipsis-v"></i>
    </span>
    ${checkbox}
    <span class="text">${task.task}</span>
    <small class="label label-danger"><i class="fa fa-clock-o"></i> ${task.type}</small>
    <div class="tools">
        <i class="fa fa-edit" onclick="generateEditTodo(this,'${task._id}', '${task.task}', '${task.type}', '${task.time}', '${task.status}')"></i>
        <i class="fa fa-trash-o" onclick="removeTodo(this, '${task._id}')"></i>
    </div>
    </li>`
    var date = new Date(task.time)
    var time = date.getHours()
    if(time < 12){
        $("#todoListMorning").append(list)
    }else if(time < 18){
        $("#todoListAfternoon").append(list)
    }else if(time < 24){
        $("#todoListEvening").append(list)
    }
}

function getAllTodo(username){
    $.ajax({
        type: "get",
        url: "http://localhost:3000/todo/all",
        headers:{
            token: localStorage.getItem("jwt")
        }
    })
    .done(todo =>{
        $(".userNav").empty()
        $(".userNav").append(`
        <span>${username}</span><button onclick="signOut();">Sign out</button>`)
        $.each(todo, function(i, task){
            sortTodo(task)        
        })
    })
    .fail(err =>{
        swal("Oops", err.responseJSON, "error")
    })
}

function signOut() {
    localStorage.setItem("jwt", "")

    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        $("#todoListMorning").empty()
        $("#todoListAfternoon").empty()
        $("#todoListEvening").empty()
        $(".userNav").empty()
        $(".userNav").append(`
        <div class="g-signin2" data-onsuccess="onSignIn" style="float: right; margin-top: 8px;"></div> 
                <button id= "loginButton" onclick="generateLogin()">Login</button>
                <button id= "registerButton" onclick="generateRegister()">Register</button> `) // Google signin button not appearing after signing out(line 93)
    });
}

function register(){
    event.preventDefault()
    var username = $("#usernameInput").val()
    var email = $("#emailInput").val()
    var password = $("#passwordInput").val()
    $.ajax({
        url: "http://localhost:3000/user/register",
        type: "post",
        dataType: "json",
        data: {
            username: username,
            email: email,
            password: password
        }
    })
    .done(userInfo =>{
        $(".userNav").empty()
        $(".userNav").append(`
        <div class="g-signin2" data-onsuccess="onSignIn" style="float: right; margin-top: 8px;"></div>
                <button id= "loginButton" onclick="generateLogin()">Login</button>
                <button id= "registerButton" onclick="generateRegister()">Register</button>                
        </span>`)                                                                                       // same problem, google signin not appearing
         swal("Success", `User ${userInfo.username} successfully registered, please login again`, "success")
    })
    .fail(err =>{
        swal("Oops, That's an Error!", err.responseJSON, "error")
    })
}

function login(){
    event.preventDefault()
    var username = $("#loginUsername").val()
    var password = $("#loginPassword").val()
    $.ajax({
        type: "post",
        url: "http://localhost:3000/user/login",
        dataType: "json",
        data: {
            username: username,
            password: password
        }
    })
    .done(token =>{
        localStorage.setItem("jwt", token.access_token)
        getAllTodo(username)
    })
    .fail(err =>{
        swal("Oops, That's an Error!", err.responseJSON, "error")
    })
}

function onSignIn(googleUser){
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        type: "post",
        url: "http://localhost:3000/user/googlesignin",
        dataType: "json",
        data: {
            idtoken : id_token
        }
    })
    .done(token =>{
        localStorage.setItem("jwt", token.access_token)
        getAllTodo(token.username)
    })
    .fail(err =>{
        swal("Oops, That's an Error!", err.responseJSON, "error")
    })
}



function createTodo(){
    event.preventDefault()
    
    var task = $("#taskInput").val()
    var time = $("#time").val()
    var type = $("#typeInput").val()
    $.ajax({
        type:"post",
        url:"http://localhost:3000/todo/create",
        data:{
            task: task,
            time: time,
            type: type
        },
        headers:{
            token: localStorage.getItem("jwt")
        },
        dataType: "json"
    })
    .done(created =>{
        $("#createTodo").empty()
        sortTodo(created)
    })
    .fail(err =>{
        swal("Oops, That's an Error!", err.responseJSON, "error")
    })
}


function generateFormTodo(){
    $("#createTodo").append(`
    <form for="createTodo" id="todoForm">
            <input type="text" id="taskInput" placeholder="Task">
            <input type="text" id="time" placeholder="Time(24hr format eg: 04:20)">
            <select name="typeList" id="typeInput">
                <option value="education">Education</option>
                <option value="recreational">Recreational</option>
                <option value="relaxation">Relaxation</option>
                <option value="music">Music</option>
                <option value="social">Social</option>
                <option value="diy">DIY</option>
                <option value="charity">Charity</option>
                <option value="cooking">Cooking</option>
                <option value="busywork">Busywork</option>
                <option value="others">Others</option>
            </select>
            <button type="submit" onclick="createTodo()">Submit</button>
            <button onclick="bored()">Bored?</button>
        </form>`) // Time input field(line 204) works only on the first time, user will have to input manually on the second try.. 
        var timepicker = new TimePicker('time', {
            lang: 'en',
            theme: 'dark'
          });
          timepicker.on('change', function(evt) {
            
            var value = (evt.hour || '00') + ':' + (evt.minute || '00');
            evt.element.value = value;
          
          });
}

function bored(){
    var type = $("#typeInput").val()
    event.preventDefault()
    $.ajax({
        type: "get",
        url: `http://localhost:3000/todo/bored?type=${type}`,
        headers:{
            token: localStorage.getItem("jwt")
        },
        dataType: "json"
    })
    .done(activity =>{
        $("#taskInput").val(activity.activity)
    })
    .fail(err =>{
        swal("Oops, That's an Error!", err.responseJSON, "error")
    })
}

function generateEditTodo(cur, id, task, type, time, status){
    var checkbox = "<input type='checkbox' value='done' id='statusInput'>"
    if(status === "true"){
        checkbox = "<input type='checkbox' value='done' id='statusInput' checked>"
    }
    var selected = [
        ["education", '<option value="education" selected>Education</option>'],
        ["recreational", '<option value="recreational" selected>Recreational</option>'],
        ["relaxation", '<option value="relaxation" selected>Relaxation</option>'],
        ["music", '<option value="music" selected>Music</option>'],
        ["social", '<option value="social" selected>Social</option>'],
        ["diy", '<option value="diy" selected>DIY</option>'],
        ["charity", '<option value="charity" selected>Charity</option>'],
        ["cooking", '<option value="cooking" selected>Cooking</option>'],
        ["busywork", '<option value="busywork" selected>Busywork</option>'],
        ["others", '<option value="others" selected>Others</option>']
    ]
    var optionsArr = [
        '<option value="education">Education</option>',
        '<option value="recreational">Recreational</option>',
        '<option value="relaxation">Relaxation</option>',
        '<option value="music">Music</option>',
        '<option value="social">Social</option>',
        '<option value="diy">DIY</option>',
        '<option value="charity">Charity</option>',
        '<option value="cooking">Cooking</option>',
        '<option value="busywork">Busywork</option>',
        '<option value="others">Others</option>'
    ]
    for(var i = 0; i < selected.length; i++){
        if(type === selected[i][0]){
            optionsArr.splice(i, 1, selected[i][1])
            break;
        }
    }
    var options = optionsArr.join("\n")
    
    var parent = $(cur).parent().parent()
    $(parent).empty()
    $(parent).append(`
    <span class="handle ui-sortable-handle">
    <i class="fa fa-ellipsis-v"></i>
    <i class="fa fa-ellipsis-v"></i>
    </span>
    <form for="createTodo" id="editForm">
    ${checkbox}
    <input type="text" id="taskEdit" value="${task}">
    <input type="text" id="timeEdit" value="${time}">
    <select name="typeList" id="typeEdit">
        ${options}
    </select>
    <button type="submit" onclick="editTodo(this, '${id}')">Submit</button>
</form>`)

}

function editTodo(cur, id){
    var parent = $(cur).parent().parent()
    event.preventDefault()
    var newTask = $("#taskEdit").val()
    var newTime = $("#timeEdit").val()
    var newType = $("#typeEdit").val()
    var newStatus = $("#statusInput:checked").val()
    var status = false
    var checkbox = '<input type="checkbox" value="done">'
    if(newStatus){
        status = true
        checkbox = '<input type="checkbox" value="done" checked>'
    }
    $.ajax({
        type: "put",
        url: `http://localhost:3000/todo/update?id=${id}`,
        data:{
            task: newTask,
            time: newTime,
            type: newType,
            status: status
        },
        headers:{
            token: localStorage.getItem("jwt")
        }
    })
    .done(updated =>{
        $(parent).empty()
        $(parent).append(`
        <span class="handle ui-sortable-handle">
                    <i class="fa fa-ellipsis-v"></i>
                    <i class="fa fa-ellipsis-v"></i>
                </span>
                ${checkbox}
                <span class="text">${updated.task}</span>
                <small class="label label-danger"><i class="fa fa-clock-o"></i> ${updated.type}</small>
                <div class="tools">
                    <i class="fa fa-edit" onclick="generateEditTodo(this,'${updated._id}', '${updated.task}', '${updated.type}', '${updated.time}', '${updated.status}')"></i>
                    <i class="fa fa-trash-o" onclick="removeTodo(this, '${updated._id}')"></i>
                </div>
        `)
    })
    .fail(err =>{
        swal("Oops, That's an Error!", err.responseJSON, "error")
    })
    
}

function removeTodo(cur, id){
    var parent = $(cur).parent().parent()
    
    $.ajax({
        type: "delete",
        url: `http://localhost:3000/todo/delete?id=${id}`,
        headers:{
            token: localStorage.getItem("jwt")
        },
        dataType: "json"
    })
    .done(removed =>{
        $(parent).remove()
    })
    .fail(err =>{
        swal("Oops, That's an Error!", err.responseJSON, "error")
    })
}
