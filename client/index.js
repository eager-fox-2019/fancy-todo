const baseURL = 'http://35.240.135.47'
M.AutoInit();
var chipInstance = M.Chips.getInstance($(".chips"));


var GoogleAuth;
function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile()
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
    console.log(profile)

    $.ajax({
        url: `${baseURL}/googleSignin`,
        type: 'POST',
        data: {
            token: id_token,
        }
    })
        .then((response) => {
            console.log(response)
            localStorage.setItem('token', response.token)
            signedIn()
            token = localStorage.getItem('token')
            populate()
        })
        .catch((err) => {
            console.log(err)
        })
}


let token = null
let authenticated = null

let globalData = {
    raw: [],
    filter: null,
    projectFilter: null,
    filterred: []
}

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, { hoverEnabled: true });
});

// $('#icon_prefix').keyup(function (event) {
//     // Number 13 is the "Enter" key on the keyboard
//     console.log('hi')

//     if (event.keyCode === 13) {
//         // Cancel the default action, if needed
//         event.preventDefault();
//         // Trigger the button element with a click
//         $('#add_todo').click()
//         // addTodo()
//     }
// });

function addTodo() {
    let title = $('#icon_prefix').val()
   if(title){
       $.ajax({
           url: `${baseURL}/todo`,
           type: 'POST',
           headers: {
               token: token
           },
           data: {
               title: title,
               ProjectId: globalData.projectFilter
           }
       })
           .done(data => {
               console.log('addtodo')
               console.log(data)
               console.log(data.status, 'dari addtodo status')
               globalData.raw.push(data)
               if (globalData.filter) {
                   globalData.filter = null
                   $('#hovrbttn').val('')
                   populate()
               } else {
                   $("#your-list").append( //sort by created date the latest
                       `
                       <div id=${data._id}  class="collection-item col s11">${data.title}</div>
                       
                       <label class='col s1'>
                           <input type="checkbox" />
                           <span></span>
                       </label>
                       `
                   )
               }
               $('#icon_prefix').val('')
           })
           .fail(function (jqXHR, textStatus) {
               console.log('request failed', textStatus)
           })
   }
}
function getTodo(id) {
    $.ajax({
        url: `${baseURL}/todo/${id}`,
        type: 'GET',
        headers: {
            token: token
        }
    })
        .done((data) => {
            let check = ''
            let checkReminder= ''
            if (data.due_date) {
                var date = data.due_date.slice(0, 10)
            } else {
                var date = null
            }
            if (data.status === true) {
                check = 'checked="checked"'
            }
            if(data.reminder){
                checkReminder = 'checked'
            }
            let title= ''
            if(data.ProjectId){
                title = 'project: ' + data.ProjectId.title
            }
            $('#todo-details').html(
                `<div style='color:#9e9e9e'>${title}</div>
                <span class="card-title">${data.title}</span>
         <div class="divider"></div>
        <form action="#" style='color:#9e9e9e'>
            <p>
                <label>
                    <input type="checkbox" class="filled-in" ${check}/>
                    <span>Done</span>
                </label>
            </p>
            <br>
            <div>Due date:</div> <input id= "due_date" value="${date}" type="date" class="datepicker">
            <br>
            <div>Reminder:</div>   
            <br>
            <div class="switch">
            <label class ="reminder2">
                Off
                <input type="checkbox" ${checkReminder} class ="reminder">
                <span class="lever" ></span>
                On
            </label>
            </div>
            <br>
            <div class='row'>
            <button id=BTN${data._id} class="update-todo btn waves-effect waves-light" type="submit" name="action" >Update</button>
            <button id=DEL${data._id} class="delete-todo red lighten-1 btn waves-effect waves-light" name="action">Delete</button>    
            </div>
            </form>`)
            $('.update-todo').click(function () {
                event.preventDefault();
                // console.log('updateTodo');
                let id = this.id.slice(3)
                updateTodo(id)
            })
            $('.delete-todo').click(function () {
                event.preventDefault()
                let idDelete = this.id.slice(3)
                deleteTodo(idDelete)
            })
            console.log(data)
        })
        .fail(function (jqXHR, textStatus) {
            console.log('request failed', textStatus)
        })
}
function deleteTodo(idDelete) {
    $.ajax({
        url: `${baseURL}/todo/${idDelete}`,
        type: 'DELETE',
        headers: {
            token: token
        }
    })
        .done((data) => {
            console.log(data)
            populate()
            $("#todo-details").html(
                `<span class="card-title">Quote of the day</span>
                <div style='color:#9e9e9e'>
                    Nothing worth having comes easy
                    <br>
                    <br>
                    &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp-anonymous-

                </div>`
            )
        })
        .fail(function (jqXHR, textStatus) {
            console.log('request failed', textStatus)
        })

}
function filterProject(input){
    console.log(input)
    globalData.filterred = []
    globalData.filter = null
    globalData.projectFilter = input
    $.ajax({
        url:`${baseURL}/grouping/${input}`,
        type: 'GET',
        headers:{
            token:token
        }
    })
    .done((data)=>{
        $('.contributors').empty()
        $('#your-list-title').hide()
        $('.contributors').html(`<div class='col s12'><h5 class='col'style='padding-left:10px'>Project: ${data.title}</h5></div>

        <div class='col s12' style='padding-left:15px; padding-bottom:10px'>${data.description}</div>
        `)
        $('.contributors').append('<div class="col s12 tag"></div>')


        for(let i = 0; i < data.UserIds.length; i++){
            $('.tag').append(
                `<div class="chip">
                ${data.UserIds[i].name}
                </div>`
            )
        }        

        $('.contributors').append('<div class="divider"></div>')
    })
    
    populate()

}
function populate() {
    console.log('hello dari index.js, function populate')
    console.log(token)
    $("#your-list").empty()
    $('#projects').empty()
    $.ajax({
        url:`${baseURL}/grouping`,
        type: 'GET',
        headers:{
            token:token
        }
    })
    .done((data)=>{
        for(let i = 0 ; i < data.length; i++){
            $('#projects').append(`
            <li><a href="#!" onclick='filterProject("${data[i]._id}")' class="waves-effect">${data[i].title} </a></li>            
            `)
        }
        console.log(data)
    })
    .fail(function (jqXHR, textStatus) {
        // console.log(jqXHR)
        console.log('request failed', textStatus)
    })
    $.ajax({
        url: `${baseURL}/todo`,
        type: 'GET',
        headers: {
            token: token
        }
    })
        .done(( data ) => {
            let checked = ''
            globalData.raw = data
            globalData.filterred = []
            if (globalData.filter) {
                $('#your-list-title').html(`Your list: ${globalData.filter}`)
                globalData.filterred = globalData.raw.filter((item) => {
                    // console.log(item, '<-- item')
                    // console.log(globalData.filter, '<-- filter')
                    // console.log(globalData)
                    // console.log(item.title, '<-- title')
                    return item.title.includes(globalData.filter)
                })
                // console.log('ada data filter', globalData.filterred)
            }else if(globalData.projectFilter){
                for(let i = 0 ; i < globalData.raw.length; i++){
                    if(globalData.raw[i].ProjectId === globalData.projectFilter){
                        globalData.filterred.push(globalData.raw[i])
                    }
                }
            } else {
                $('#your-list-title').html('Your List')
                globalData.filterred = globalData.raw
            }
            // console.log(globalData.filterred, '<-ke2')
            for (let i = 0; i < globalData.filterred.length; i++) {
                if (globalData.filterred[i].status) {
                    checked = 'checked="checked"'
                } else {
                    checked = ''
                }
                
                // console.log(globalData.filterred[i])
                $("#your-list").append( //sort by created date the latest
                    `
                        <div id=${globalData.filterred[i]._id}  class="collection-item col s11">${globalData.filterred[i].title}</div>
                        
                        <label class='col s1'>
                            <input type="checkbox" ${checked} />
                            <span></span>
                        </label>
                        `
                )
            }
            // console.log(data)
        })
        .fail(function (jqXHR, textStatus) {
            // console.log(jqXHR)
            console.log('request failed', textStatus)
        })
}

function updateTodo(id) {
    let status = 0
    if ($('.filled-in').is(":checked")) {
        status = 1
    } else {
        status = 0
    }
    let due_date = $('#due_date').val()
    console.log(due_date)
    console.log(typeof due_date)
    let reminder = null
    console.log($('.reminder').is(":checked"), 'asdf')
    if ($('.reminder').is(":checked") == true) {
        console.log(due_date, 'hello dari reminder')
        
        if (due_date) {
            console.log(due_date, '<---')
            due_date = new Date(due_date)
            reminder = new Date(due_date)
            reminder.setDate(due_date.getDate() - 1)
            console.log(reminder)
        }
    }
    $.ajax({
        url: `${baseURL}/todo/${id}`,
        type: 'PATCH',
        data: {
            due_date: due_date,
            reminder: reminder,
            status: status
        },
        headers: {
            token: token
        }
    })
        .done(( data ) => {
            populate()
            console.log(data)

        })
        .fail(function (jqXHR, textStatus) {
            console.log('request failed', textStatus)
        })
}
function showSignIn() {
    event.preventDefault()
    $('#landing-page').hide()
    $('#signup-page').hide()
    $('#signin-page').show()
    $('#main-page').hide()
}
function showSignUp() {
    event.preventDefault()
    $('#landing-page').hide()
    $('#signup-page').show()
    $('#signin-page').hide()
    $('#main-page').hide()
}
function signedIn() {
    $('#landing-page').hide()
    $('#signup-page').hide()
    $('#signin-page').hide()
    $('#main-page').show()
}
function signOut() {
    event.preventDefault()
    localStorage.removeItem('token')
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    $('#landing-page').show()
    $('#signup-page').hide()
    $('#signin-page').hide()
    $('#main-page').hide()
}
function signIn() {
    email = $('#emailSignIn').val()
    password = $('#passwordSignIn').val()
    console.log(email, "usernameSignIn")
    console.log(password, "password")
    $.ajax({
        url: `${baseURL}/signin`,
        type: 'POST',
        data: {
            email: email,
            password: password,
        }
    })
        .done((response) => {
            console.log('hello, berhasil signin')
            console.log(response.data)
            console.log(response.token)
            localStorage.setItem('token', response.token)
            signedIn()
            token = localStorage.getItem('token')
            populate()
            $('#errorSignin').html('')

        })
        .fail(function (jqXHR, textStatus) {
            $('#errorSignin').html('wrong email/password')
            console.log('request failed', textStatus)
        })
}
function authentication(){
    $.ajax({
        url: `${baseURL}/authentication`,
        type: 'GET',
        headers:{token:token}
    })
    .done((response)=>{
        authentication = response
    })
    .fail(function(jqXHR, textStatus){
       
        console.log('request failed', textStatus)
    })
}

function addProject() { 
    let title = $('#projectName').val()
    let description = $('#description').val()
    let rawContributors = chipInstance.chipsData
    let contributors = rawContributors.map(element=>{
        return element.tag
    })
    console.log(contributors)
    console.log([1,2,3])
    if(title && description){
        $('#errorCreateProject').empty()
        $.ajax({
            url: `${baseURL}/grouping`,
            type: 'POST',
            headers:{token:token},
            data:{
                title, 
                description,
                contributors: JSON.stringify(contributors)
            }
        })
        .done((response)=>{
            console.log(response)
        })
        .fail(function(jqXHR, textStatus){
            console.log('request failed', textStatus)
        })
    }else{
        $('#errorCreateProject').html('<div> Please fill in title and description </div>')
    }

}

$(document).ready(function () {
    $('#formProject').submit(function (event) {
        event.preventDefault()
        addProject()
       
    })


    // $('.chips-placeholder').chips({
    //     placeholder: 'Enter a tag',
    //     secondaryPlaceholder: '+Tag',
    //   });
    if (localStorage.getItem('token')) {
        token = localStorage.getItem('token')
        authentication()
        if(authenticated){
            $('#landing-page').hide()
            $('#signup-page').hide()
            $('#signin-page').hide()
            $('#main-page').show()
            populate()
        }
       
    }
    $('.signupNew').submit(function(e){
        e.preventDefault()
        let name = $('#name').val()
        let email = $('#email').val()
        let password = $('#password').val()
        $.ajax({
            url: `${baseURL}/signup`,
            type: 'POST',
            data: {
                name,
                email,
                password,
            }
        })
            .done((response) => {
                console.log('hello, berhasil signup')
                showSignIn()
                console.log(response.data)
                console.log(response.token)
                
            })
            .fail(function (jqXHR, textStatus) {
                console.log('request failed', textStatus)
            })
    })
    $('#createProject').click(addProject)
    $('root-element').on('click', $('.collection-item'), function () {
        console.log('tes')
    })

    $('#add_todo').click(function () {
        addTodo()
    })

    $("#hovrbttn").focusout(function () {
        $('#hovrbttn').attr('style', 'color:#bf360c')
    });


    $('#your-list').on('click', '.collection-item', function (e) {
        getTodo(this.id)
    });
    function onSignIn(googleUser) {
        var id_token = googleUser.getAuthResponse().id_token;
    }
    $('#signinpage').click(function () {
        showSignIn()
    })
    $('#signinpage2').click(function () {
        showSignIn()
    })

    $('#signuppage').click(function () {
        showSignUp()
    })
    $('#signuppage2').click(function () {
        showSignUp()
    })
    $('#signin').submit(function (event) {
        event.preventDefault()
        signIn()
    })
    $('#signout').click(function () {
        signOut()
    })
    $('#home').click(function(event){
        event.preventDefault()
        globalData.filterred = []
        globalData.projectFilter = null
        $('.contributors').empty()
        $('#your-list-title').show()

        populate()
    })
    $('#search').submit(function (event) {
        event.preventDefault()
        globalData.filterred = []
        globalData.projectFilter = null
        globalData.filter = $('#hovrbttn').val()
        console.log(globalData.filter, '<<===')
        // $('#hovrbttn').val('')
        $('.contributors').empty()
        $('#your-list-title').show()

        populate()
    })
})