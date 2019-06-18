const baseUrl = 'http://localhost:3100/api'
$(document).ready(function () {
    if (localStorage.getItem('token')) {
        fetchUserProfile(localStorage.getItem('email'))
        fetchMainContent()
        $('#buttonLogin').hide()
        $("body").css({
            "background-image": "url('./img/doodles.png')",
            "background-size": "250px"
        })
    }
})

function formatDate(date){
    let monthlib = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "October", "November", "December"]
    let daylib = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let year = date.getFullYear()
    let month = monthlib[date.getMonth()]
    let dayStr = daylib[date.getDay()]
    let dayInt = date.getDate()
    return `${dayStr}, ${month} ${dayInt} ${year}`
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
            url: `${baseUrl}/user/googlelogin`,
            type : 'post',
            dataType : 'json',
            data : {
                token : id_token
            }
        })
        .done((gotData, textStatus, xhr) => {
            // login(profile.getEmail(), "asdasd123")
            console.log(gotData);
            localStorage.setItem('token', gotData.token)
            localStorage.setItem('email', gotData.userProfile.email)
            localStorage.setItem('UserId', gotData.userProfile._id)
            $('#buttonLogin').hide()
            fetchUserProfile(gotData.userProfile.email)
            fetchMainContent()
            $("body").css({
                "background-image": "url('./img/doodles.png')",
                "background-size": "250px"
            })
        })
        .fail((gotData, textStatus, xhr) => {
            console.log(gotData);
            
            // let fullName = profile.getName().split(" ")
            // let firstName = fullName[0]
            // let lastName = fullName[1]
            // let email = profile.getEmail()
            // let password = "asdasd123"
            // let confirmpassword = "asdasd123"
            // let avatar = profile.getImageUrl()
            // register(firstName, lastName, email, password, confirmpassword, avatar)
            // sleep(1000);
            // login(profile.getEmail(), "asdasd123")

        })
}

function generateLogin() {
    $('#row1').empty()
    $('#row1').html(`
    <div class="col-md-4 offset-md-4">
    <div class="d-flex justify-content-center h-100">
        <div id="cardLogin" class="card">
            <div class="card-header">
                <h3>Sign In</h3>
            </div>
            <div class="card-body">
                <form onsubmit="login($('#email').val(),$('#password').val())">
                  
                    <div class="input-group form-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                        </div>
                        <input id="email" type="text" class="form-control" placeholder="email">
                    </div>
                    <div class="input-group form-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-key"></i></span>
                        </div>
                        <input id="password" type="password" class="form-control" placeholder="password">
                    </div>
                    <div class="form-group">
                        <input id="loginBtn"  type="submit" value="Login" class="btn float-left login_btn">
                    </div>
                    <div class="g-signin2 d-flex justify-content-end" data-width="100" data-onsuccess="onSignIn"></div>
                </form>
                <div class="justify-content-center">
                </br>
                <p class="text-center" id="errMsg" ></p>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="https://apis.google.com/js/platform.js" async defer></script>
    `)
}

function generateRegister() {
    $('#row1').empty()
    $('#row1').html(`
    <div class="col-md-4 offset-md-4">
    <div class="d-flex justify-content-center h-100">
        <div id="cardLogin" class="card">
            <div class="card-header">
                <h3>Sign Up</h3>
            </div>
            <div class="card-body">
                <form onsubmit="register($('#firstName').val(),$('#lastName').val(),$('#email').val(),$('#password').val(),$('#confirmpassword').val())">
                <p class="text-center" id="errMsgRg" ></p>
                    <div class="input-group form-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-user"></i></span>
                        </div>
                        <input id="firstName" type="text" class="form-control" placeholder="First Name">
                    </div>
                    <div class="input-group form-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-user"></i></span>
                        </div>
                        <input id="lastName" type="text" class="form-control" placeholder="Last Name">
                    </div>
                    <div class="input-group form-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                        </div>
                        <input id="email" type="email" class="form-control" placeholder="email">
                    </div>
                    <div class="input-group form-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-key"></i></span>
                        </div>
                        <input id="password" type="password" class="form-control" placeholder="Password">
                    </div>
                    <div class="input-group form-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-key"></i></span>
                        </div>
                        <input id="confirmpassword" type="password" class="form-control" placeholder="Confirm Password">
                    </div>
                    <div class="form-group">
                        <input type="submit" value="Register" class="btn btn-block login_btn">
                    </div>
                    
                </form>
                
            </div>
        </div>
    </div>
</div>
    `)
    $('.card').height(420)
}

function logout() {
    event.preventDefault()

        console.log('User signed out.')
        localStorage.clear();
        sessionStorage.clear()
        $('#row2').empty()
        $('#buttonLogin').show()
        $('#navbarLoginLogout').html(`
         <li class="nav-item active">
            <a onclick="generateLogin()" id="buttonLogin" class="nav-link" href="#">Login <span
            class="sr-only">(current)</span></a>
        </li>
         `)
        $("body").css({
            "background": "linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3)), url('https://images.unsplash.com/photo-1532618500676-2e0cbf7ba8b8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1414&q=80') no-repeat center center fixed",
            "-webkit-background-size": "cover",
            "-moz-background-size": "cover",
            "background-size": "cover",
            "-o-background-size": "cover",
        })

        $('#row1').html(`
         <div class="col-md-7">
             </div>
             <div id="registerText" class="col-md-5">
                 <h1>Organize life</h1>
                 <h1>Then Go <span>Enjoy</span> It .....</h1>
                 <p>Life can feel overwhelming, but it doesn’t have to. Todoist lets you keep track of everything in one
                     place, so you can get it all done and enjoy more peace of mind along the way.</p>
                 <button onclick="generateRegister()" type="button" class="btn btn-lg"
                     style="background-color:#F19137">Get Started - It's Free</button>
             </div>
         `)
   

         if(gapi.auth2 !== undefined){
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
            console.log('User signed out.');
            });
        }

}

function login(email, password) {
    event.preventDefault()
    $.ajax({
            url: `${baseUrl}/user/login`,
            type: 'post',
            dataType: 'json',
            data: {
                email: email,
                password: password
            }
        })
        .done((gotData) => {
            console.log(gotData);
            localStorage.setItem('token', gotData.token)
            localStorage.setItem('email', gotData.userProfile.email)
            localStorage.setItem('UserId', gotData.userProfile._id)
            $('#buttonLogin').hide()
            fetchUserProfile(gotData.userProfile.email)
            fetchMainContent()
            $("body").css({
                "background-image": "url('./img/doodles.png')",
                "background-size": "250px"
            })

        })
        .fail((gotData) => {
            console.log(gotData);
            $('#errMsg').html(`</br><h6 class="text-center" style="color:red";>${gotData.responseJSON.message}</h6>`)

        })

}

function fetchUserProfile(email) {
    let rndBackgroundProfile = getRandomIntInclusive(1,11)
    let TodayConvert = formatDate(new Date())
    $.ajax({
            url: `${baseUrl}/user/${email}`,
            type: 'get',
            dataType: 'json'
        })
        .done((gotData) => {
            // var profile = googleUser.getBasicProfile();
            $('#row1').html(`
        <div class="col-md-12 position-sticky" style="height: 200px;">
                <div id="userProfile" class="row" style="height: 100%;background-image: url('./img/${rndBackgroundProfile}.png');">
                    <div class="col-md-3 col-3">
                        <img id="profilePic"
                            src="${gotData.avatar}"
                            class="rounded-circle  d-block" alt="...">
                    </div>
                    <div class="col-md-9 col-9">
                        <h1 id="userFullname" class="display-4 font-weight-bold profileTextShaddow">${gotData.first_name} ${gotData.last_name}</h1>
                        <h5 id="userEmail" class="font-weight-bold profileTextShaddow">${gotData.email}</h5>
                        <h1 id="nextBackground" onclick="fetchUserProfile('${gotData.email}')" class="font-weight-bold text-right profileTextShaddow"><i class="fas fa-angle-double-right"></i></h1>
                        <h5 id="todayDate" class="align-bottom font-weight-bold text-right profileTextShaddow">${TodayConvert} </h5>
                    </div>
                </div>
            </div>
        `)
            $('#navbarLoginLogout').html(`
        <li class="nav-item active">
            <a onclick="logout()" id="buttonLogout" class="nav-link" href="#" >Logout <span
            class="sr-only">(current)</span></a>
        </li>
        `)
        })
        .fail((gotData) => {
            console.log(gotData);

        })

}

function fetchMainContent(filter) {
    $.ajax({
        url: `${baseUrl}/todo`,
        type: 'get',
        dataType: 'json',
        headers: {
            'token': localStorage.getItem('token')
        }
    })
    .done((gotData) => {
    let importantTodo = 0
    let todayTodo = 0
    let todayDueDate = 0
    let filterTodo = filter || "all"
    $('#row2').html(`
    <div id="sideBarMenu" class="col-md-4  bg-light" ></div>
    <div id="MainTodo" class="col-md-8  bg-white" ></div>
    `)
    $('#MainTodo').append(`
    <div  id="addNewButton"  class="card">
        <div class="card-body" style="width: 100%;">
            <div class="row ">
                <div id="buttonAddNewTodoXL" class="col-sm-1">
                    <h3><i onclick="generateAddNewTodo()" class="fas fa-plus"></i></h3>
                </div>
                <div id="todoSingle" class="col-sm-11 ">
                    <p class="card-text text-center"> <span><i id="buttonAddNewTodoSM" onclick="generateAddNewTodo()" class="fas fa-plus"></i> </span> &nbsp Add New Task</p>
                </div>
            </div>
        </div>
    </div>
    `)

    $.each(gotData, function (i, dataa) {
        let today = new Date().getDate()
        console.log(today);
        
        let dueDateConvert = formatDate(new Date(dataa.dueDate))
        let TodoCreatedAtConvert = formatDate(new Date(dataa.createdAt))
        let cross = ''
        let doneStatus = ""
        let importantStatus = ""
        let dueDateColor = ''
        if (dataa.status == false) {
            doneStatus = "color: #000000;"

        }
        if (dataa.status == true) {
            doneStatus = "color: #F19137;"
            cross = "text-decoration: line-through;"
        }
        if (dataa.importantStatus == false) {
            importantStatus = "color: #000000;"
        }
        if (dataa.importantStatus == true) {
            importantStatus = "color: #F19137;"
            importantTodo += 1
        }
        if (dataa.dueDate.substring(8, 10) == today) {
            todayDueDate += 1
            dueDateColor= "color: #F19137;"
        }

        if (filterTodo === "all") {
            if (true) {
                $('#MainTodo').append(`
                <div id="${dataa._id}card" class="card">
                    <div class="card-body" style="width: 100%;">
                        <div class="row">
                            <div id="checkListDekstop" class="col-md-1">
                                <h3 ><i onclick="updateDoneStatus('${dataa._id}')" style="${doneStatus}" class="far fa-check-circle"></i></h3>
                            </div>
                            <div id="todoSingle" class="col-md-8 ">
                                <p class="card-text" style="${cross}" style="${cross}">${dataa.name}</p>
                                <p  style="${dueDateColor}" class="card-text"><small>Due Date : ${dueDateConvert}</small></p>
                            </div>
                            <div id="todoAttr" class="col-md-3 ">
                                <h3>
                                <i id="checkListPhone" onclick="updateDoneStatus('${dataa._id}')" style="${doneStatus}" class="far fa-check-circle"></i>
                                <i onclick="editTodo('${dataa._id}')" class="far fa-edit"></i>
                                <i id="${dataa._id}" onclick="showDetails('${dataa._id}')" class="fas fa-info"></i>
                                <i style="${importantStatus}" class="fas fa-star"></i>
                                <i onclick="deleteTodo('${dataa._id}')"class="fas fa-trash-alt"></i>
                                </h3>
                            </div>
                            <div id="${dataa._id}Details" style="display:none;" class="row">
                                <div class="col-md-12 offset-md-2 ">
                                    <p class="card-text todoDescription"> Description : ${dataa.description}</p>
                                    <p class="card-text todoDescription"> Task Created At : ${TodoCreatedAtConvert}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `)
            }
        }

        if (filterTodo === "important") {
            if (dataa.importantStatus === true) {
                $('#MainTodo').append(`
                <div id="${dataa._id}card" class="card">
                    <div class="card-body" style="width: 100%;">
                        <div class="row">
                            <div id="checkListDekstop" class="col-md-1">
                                <h3 ><i onclick="updateDoneStatus('${dataa._id}')" style="${doneStatus}" class="far fa-check-circle"></i></h3>
                            </div>
                            <div id="todoSingle" class="col-md-8 ">
                                <p class="card-text" style="${cross}">${dataa.name}</p>
                                <p class="card-text"><small class="text-muted">Due Date : ${dueDateConvert}</small></p>
                            </div>
                            <div id="todoAttr" class="col-md-3 ">
                                <h3>
                                <i id="checkListPhone" onclick="updateDoneStatus('${dataa._id}')" style="${doneStatus}" class="far fa-check-circle"></i>
                                <i onclick="editTodo('${dataa._id}')" class="far fa-edit"></i>
                                <i id="${dataa._id}" onclick="showDetails('${dataa._id}')" class="fas fa-info"></i>
                                <i style="${importantStatus}" class="fas fa-star"></i>
                                <i onclick="deleteTodo('${dataa._id}')"class="fas fa-trash-alt"></i>
                                </h3>
                            </div>
                            <div id="${dataa._id}Details" style="display:none;" class="row">
                                <div class="col-md-12 offset-md-2 ">
                                    <p class="card-text todoDescription"> Description : ${dataa.description}</p>
                                    <p class="card-text todoDescription"> Task Created At : ${TodoCreatedAtConvert}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `)
            }
        }

        if (filterTodo === "today") {
            if (dataa.dueDate.substring(8, 10) == today) {
                $('#MainTodo').append(`
                <div id="${dataa._id}card" class="card">
                    <div class="card-body" style="width: 100%;">
                        <div class="row">
                            <div id="checkListDekstop" class="col-md-1">
                                <h3 ><i onclick="updateDoneStatus('${dataa._id}')" style="${doneStatus}" class="far fa-check-circle"></i></h3>
                            </div>
                            <div id="todoSingle" class="col-md-8 ">
                                <p class="card-text" style="${cross}">${dataa.name}</p>
                                <p class="card-text"><small class="text-muted">Due Date : ${dueDateConvert}</small></p>
                            </div>
                            <div id="todoAttr" class="col-md-3 ">
                            <h3>
                            <i id="checkListPhone" onclick="updateDoneStatus('${dataa._id}')" style="${doneStatus}" class="far fa-check-circle"></i>
                            <i onclick="editTodo('${dataa._id}')" class="far fa-edit"></i>
                            <i id="${dataa._id}" onclick="showDetails('${dataa._id}')" class="fas fa-info"></i>
                            <i style="${importantStatus}" class="fas fa-star"></i>
                            <i onclick="deleteTodo('${dataa._id}')"class="fas fa-trash-alt"></i>
                            </h3>
                            </div>
                            <div id="${dataa._id}Details" style="display:none;" class="row">
                            <div class="col-md-12 offset-md-2 ">
                                <p class="card-text todoDescription"> Description : ${dataa.description}</p>
                                <p class="card-text todoDescription"> Task Created At : ${TodoCreatedAtConvert}</p>
                            </div>
                        </div>
                    </div>
                </div>
                `)
            }
        }

    })
        
        $('#sideBarMenu').append(`
        <div class="list-group ">
            <a onclick="fetchMainContent('all')" href="#"
                class="bg-light list-group-item list-group-item-action d-flex justify-content-between align-items-center">Todo
                <span class="badge badge-pill">${gotData.length}</span></a>
            <a onclick="fetchMainContent('today')" href="#"
                class="bg-light list-group-item list-group-item-action d-flex justify-content-between align-items-center">Today
                <span class="badge  badge-pill">${todayDueDate}</span>
            </a>
            <a onclick="fetchMainContent('important')" href="#"
                class="bg-light list-group-item list-group-item-action d-flex justify-content-between align-items-center">Important
                <span class="badge  badge-pill">${importantTodo}</span>
            </a>
        </div>
        `)

        })
        .fail((gotData) => {
            console.log(gotData);
        })

}

function editTodo(id){
    $.ajax({
        url: `${baseUrl}/todo/${id}`,
        type: 'get',
        dataType: 'json',
        headers: {
            'token': localStorage.getItem('token')
        }
    })
    .done((gotData)=>{
        let today = new Date()
        let dueDateTodo = new Date(gotData.dueDate)
        dueDateTodo.setHours(today.getHours()+7)    
        let dueDateShow = dueDateTodo.toISOString().substr(0, 16)
        let checkStat = ""
        if(gotData.status === true){
            checkStat = "checked"
        }
        $(`#${id}card`).html(`
        <div id="todoSingle" class="col-md-12 ">
                <h2>Edit</h2>
            <form onsubmit="updateTodo('${id}')">
                <div class="form-group">
                    <input type="text" value="${gotData.name}" class="form-control form-control-sm" id="taskNameEdit">
                </div>
                <div class="form-group">
                    <input type="datetime-local"  class="form-control form-control-sm" id="taskDueDateEdit">
                </div>
                <div class="form-group">
                    <textarea class="form-control form-control-sm" id="taskDescriptionEdit" rows="2"
                        >${gotData.description}</textarea>
                </div>
                <div class="form-group form-check">
                    <input type="checkbox" class="form-check-input" id="taskImportanStatusEdit" ${checkStat}>
                    <label class="form-check-label" for="taskImportanStatus">Important</label>
                </div>
                <button type="submit" class="btn btn-block" style="background-color: #F19137;">Update</button>
                </form>
        </div>
        `)
         
        $('#taskDueDateEdit').val(dueDateShow.substr(0, 16)) 
        
    })
    .fail((gotData)=>{
        log(gotData)
    })
}

function updateTodo(id){
    event.preventDefault()
    var important = false
    if ($('#taskImportanStatus').is(':checked')) {
        important = true
    }
    $.ajax({
        url: `${baseUrl}/todo/${id}`,
        type: 'put',
        dataType: 'json',
        data: {
            name: $('#taskNameEdit').val(),
            description: $('#taskDescriptionEdit').val(),
            status: false,
            dueDate: $('#taskDueDateEdit').val(),
            importantStatus: important
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done((gotData) => {
        fetchMainContent()
    })
    .fail((gotData) => {
        console.log(gotData);

    })

}

function showDetails(id){
    console.log("showDetails");
    
    $(`#${id}`).attr("onclick",`hideDetails("${id}")`)
    $(`#${id}Details`).css("display", "inline");
}

function hideDetails(id){
    console.log("hideDetails");
    $(`#${id}`).attr("onclick",`showDetails("${id}")`)
    $(`#${id}Details`).css("display", "none");
}


function generateAddNewTodo() {
    let today = new Date()
    let tomorrow = new Date()
    tomorrow.setDate(today.getDate()+1)
    tomorrow.setHours(today.getHours()+7)    
    let tomorrowDateOnly = tomorrow.toISOString().substr(0, 16);
    // console.log(tomorrowDateOnly);
    
    $('#addNewButton').css({'height':'270px','background-color':'#ffffff','color':'black'})
    $("#addNewButton").html(`
    <div class="card-body" style="width: 100%;">
    <div class="row">
        <div id="todoSingle" class="col-md-12 ">
            <form onsubmit="addNewTodo()">
                <div class="form-group">
                    <input type="text" placeholder="Task Name" class="form-control form-control-sm" id="taskName">
                </div>
                <div class="form-group">
                    <input type="datetime-local"  class="form-control form-control-sm" id="taskDueDate">
                </div>
                <div class="form-group">
                    <textarea class="form-control form-control-sm" id="taskDescription" rows="2"
                        placeholder="Description"></textarea>
                </div>
                <div class="form-group form-check">
                    <input type="checkbox" class="form-check-input" id="taskImportanStatus">
                    <label class="form-check-label" for="taskImportanStatus">Important</label>
                </div>
                <button type="submit" class="btn btn-block">Create</button>
            </form>
        </div>
    </div>
</div>
    `)
    $('#taskDueDate').val(tomorrowDateOnly)
    // $('#taskDueDate').val(gotData.dueDate.substr(0, 16)) 
    console.log(tomorrowDateOnly);
    
}

function addNewTodo() {
    event.preventDefault()
    var important = false
    if ($('#taskImportanStatus').is(':checked')) {
        important = true
    }
    $.ajax({
            url: `${baseUrl}/todo`,
            type: 'post',
            dataType: 'json',
            data: {
                name: $('#taskName').val(),
                description: $('#taskDescription').val(),
                status: false,
                dueDate: $('#taskDueDate').val(),
                importantStatus: important,
                UserId: localStorage.getItem('UserId')
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done((gotData) => {
            fetchMainContent()
        })
        .fail((gotData) => {
            console.log(gotData);

        })

}

function updateDoneStatus(id) {
    // alert(id)
    $.ajax({
            url: `${baseUrl}/todo/${id}`,
            type: 'put',
            dataType: 'json',
            data: {
                status: true
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done((gotData) => {
            fetchMainContent()
        })
        .fail((gotData) => {
            console.log(gotData);

        })
}

function register(firstName, lastName, email, password, confirmpassword, avatar) {
    event.preventDefault()
    if(password !== confirmpassword){
        $('#errMsgRg').html(`<h6 class="text-center" style="color:red";> Password Not Match !</h6>`)
    } else {
        $.ajax({
            url: `${baseUrl}/user/register`,
            type: 'post',
            dataType: 'json',
            data: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
                avatar: avatar || 'http://nationalminimumwage.co.za/wp-content/uploads/2015/04/default-user-icon-profile.png'
            }
        })
        .done((sucsessRegister) => {
            sleep(1000)
            console.log(sucsessRegister);
            generateLogin()

        })
        .fail((failedRegister) => {
            console.log(failedRegister);
            $('#errMsgRg').html(`<h6 class="text-center" style="color:red";>${failedRegister.responseJSON.errorArr[0].message}</h6>`)
        })
    }
    
    
}

function deleteTodo(id) {
    event.preventDefault()
    $.ajax({
            url: `${baseUrl}/todo/${id}`,
            type: 'delete',
            dataType: 'json',
            data: {
                status: true
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done((gotData) => {
            fetchMainContent()
        })
        .fail((gotData) => {
            console.log(gotData);

        })
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}