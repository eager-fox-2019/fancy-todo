const baseURL = 'http://localhost:3000'
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
    $.ajax({
        url: `${baseURL}/todo`,
        type: 'POST',
        headers: {
            token: token
        },
        data: {
            title: title,
            ProjectId: '5d0660bf29ecf137bda9887d'
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
            if (data.due_date) {
                var date = data.due_date.slice(0, 10)
            } else {
                var date = null
            }
            if (data.status === true) {
                check = 'checked="checked"'
            }
            $('#todo-details').html(
                `<span class="card-title">${data.title}</span>
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
                <input type="checkbox" class ="reminder">
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
            if (globalData.filter) {
                $('#your-list-title').html(`Your List: ${globalData.filter}`)
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
    if ($('.reminder').is(":checked")) {
        if (due_date) {
            due_date = new Date(due_date)
            reminder = new Date()
            reminder.setDate(due_date.getDate() - 1)
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
    username = $('#usernameSignIn').val()
    password = $('#passwordSignIn').val()
    console.log(username, "usernameSignIn")
    console.log(password, "password")
    $.ajax({
        url: `${baseURL}/signin`,
        type: 'POST',
        data: {
            username: username,
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

        })
        .fail(function (jqXHR, textStatus) {
            console.log('request failed', textStatus)
        })
}
function addProject() {

}
function addProject() { }
$(document).ready(function () {
    $('#formProject').submit(function (event) {
        event.preventDefault()
        let name = $('#projectName').val()
        let description = $('#description').val()
        let contributors = chipInstance.chipsData
        console.log(chipInstance.chipsData);

    })


    // $('.chips-placeholder').chips({
    //     placeholder: 'Enter a tag',
    //     secondaryPlaceholder: '+Tag',
    //   });
    if (localStorage.getItem('token')) {
        token = localStorage.getItem('token')
        $('#landing-page').hide()
        $('#signup-page').hide()
        $('#signin-page').hide()
        $('#main-page').show()
        populate()
    }
    $('#addProject').click(addProject)
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

    $('#signuppage').click(function () {
        showSignUp()
    })
    $('#signin').submit(function (event) {
        event.preventDefault()
        signIn()
    })
    $('#signout').click(function () {
        signOut()
    })
    $('#search').submit(function (event) {
        event.preventDefault()
        console.log('hai')
        globalData.filterred = []
        globalData.projectFilter = null
        globalData.filter = $('#hovrbttn').val()
        console.log(globalData.filter, '<<===')
        // $('#hovrbttn').val('')
        populate()
    })
})