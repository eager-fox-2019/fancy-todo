var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
var idUpdate = null

function deleteproject(id){
    $.ajax({
        url:`http://localhost:3000/projects/${id}`,
        method:'DELETE',
        beforeSend:function(xhr){xhr.setRequestHeader('access-token', localStorage.getItem('token'));},
    })
    .done((response) => {
        if(response){
            Swal.fire({
                type:'success',
                title:'The Project Has been Deleted',
            })
            getProject()
        }
    })
    .fail(function(jqXHR,textStatus){
        const errMsg = jqXHR.responseJSON.message.split(':')
        console.log(errMsg)
        Swal.fire({
            type:'error',
            title:'Failed',
            text:errMsg[0],
        })
    })
}


function joinproject(id){
    console.log('join project ===== ',id);
    $.ajax({
        url:`http://localhost:3000/projects/join/${id}`,
        method:'PUT',
        beforeSend:function(xhr){xhr.setRequestHeader('access-token', localStorage.getItem('token'));},
    })
    .done((response) => {
        console.log(response)
        invitation()
    })
    .fail(function(jqXHR,textStatus){
        const errMsg = jqXHR.responseJSON.message.split(':')
        console.log(errMsg)
        Swal.fire({
            type:'error',
            title:'Failed',
            text:errMsg[0],
        })
    })
}

function declineproject(id){
    console.log('decline project ===== ',id);
    $.ajax({
        url:`http://localhost:3000/projects/decline/${id}`,
        method:'PUT',
        beforeSend:function(xhr){xhr.setRequestHeader('access-token', localStorage.getItem('token'));},
    })
    .done((response) => {
        console.log(response)
        invitation()
    })
    .fail(function(jqXHR,textStatus){
        const errMsg = jqXHR.responseJSON.message.split(':')
        console.log(errMsg)
        Swal.fire({
            type:'error',
            title:'Failed',
            text:errMsg[0],
        })
    })
}

function invitation(){
    console.log('yeayy')
    $('#task-2').hide()
    $('#project-form').hide()
    $('.project').hide()
    $("#user-invitation").show()
    $.ajax({
        url:`http://localhost:3000/projects/pending`,
        method:'GET',
        beforeSend:function(xhr){xhr.setRequestHeader('access-token', localStorage.getItem('token'));},
    })
    .done((response) => {
        $("#invite-collection").html('')
        if(response){
            console.log(response)
            for(let invitation of response){
            console.log(invitation.name)
            $("#invite-collection").append(`<li class="collection-item"><div>An invitation from ${invitation.name}<a href="#!" onclick="joinproject('${invitation._id}')" class="secondary-content"><i class="material-icons icon-blue">check</i></a><a href="#!" onclick="declineproject('${invitation._id}')" class="secondary-content"><i class="material-icons icon-blue">close</i></a></div></li>`)
            }
        }
    })
    .fail(function(jqXHR,textStatus){
        const errMsg = jqXHR.responseJSON.message.split(':')
        console.log(errMsg)
        Swal.fire({
            type:'error',
            title:'Failed Invite Member',
            text:errMsg[0],
        })
    })
}

$("#invite-project").submit(function(){
    event.preventDefault()
    const email = $('#member').val()
    console.log(email)
    $('#member').val('')
    const idproject = localStorage.getItem('idproject')
    localStorage.removeItem('idproject')
    $.ajax({
        url:`http://localhost:3000/projects/invite/${idproject}`,
        method:'PUT',
        data: {
            email:email
        },
        beforeSend:function(xhr){xhr.setRequestHeader('access-token', localStorage.getItem('token'));},
    })
    .done((response) => {
        if(response){
            Swal.fire({
                type:'success',
                title:`Invitation Send to ${email}`,
                text:`please wait for user to accept`,
            })
        }
    })
    .fail(function(jqXHR,textStatus){
        const errMsg = jqXHR.responseJSON.message.split(':')
        console.log(errMsg)
        Swal.fire({
            type:'error',
            title:'Failed Invite Member',
            text:errMsg[0],
        })
    })
})

function resetProject(){
    localStorage.removeItem('idproject');
}

function setProject(id){
    console.log('setproject =====',id)
    localStorage.setItem('idproject', id);
}

function getProject(){
    $.ajax({
        url:`http://localhost:3000/projects`,
        method:'GET',
        beforeSend:function(xhr){
            xhr.setRequestHeader('access-token', localStorage.getItem('token'));
        },
    })
    .done((response) => {
        console.log(response)
        const d = new Date();
        const month = monthNames[d.getMonth()]
        const day = d.getDate()
        const year = d.getFullYear()
        $("#project-list").html('')
        for(let project of response){
            $("#project-list").append(`<div class="card project" style="width: 205%;">
            <div class="card-image">
                <div class="title" style="height:120px;width:100%;background-color:#eceff1;">
                    <div id="card-header-1" style="padding-top:1%; padding-left:2%;">
                        <h5 style="color:black">${project.name}</h5>
                        <h7 style="color:black">${month} ${day}, ${year}</h7>
                        <a style="left:75%;" class="waves-effect waves-light btn-small blue-grey lighten-2" onclick="deleteproject('${project._id}')">delete</a>
                    </div>
                </div>
                <a data-target="modal3"
                class="modal-trigger btn-floating halfway-fab waves-effect waves-light orange left"><i
                class="material-icons" onclick="setProject('${project._id}')">people</i></a>
                <a data-target="modal1"
                class="modal-trigger btn-floating halfway-fab waves-effect waves-light orange"><i
                class="material-icons" onclick="setProject('${project._id}')">add</i></a>
            </div>
            <div id="task">
                <ul id="todo-list-${project.name}" class="collection">
                </ul>
            </div>
        </div>`)
        }
        for(let project of response){
            let selector = "#todo-list-" + `${project.name}`
            console.log("ini selector =====",selector);
            $(selector).html(``)
            for(let todo of project.todoList){
                const due = new Date(todo.dueDate);
                const created = new Date(todo.createdAt);
                const difference = getDateDiff(`${created.getDate()}-${created.getMonth()}-${created.getFullYear()}`, `${due.getDate()}-${due.getMonth()}-${due.getFullYear()}`);
                $(selector).append(`<li class="collection-item">
                <p>
                <label> 
                    <span class="right" style="font-family: Arial, Helvetica, sans-serif"><b>${difference} Days Remaining</b></span>
                    <br>
                    <h4>${todo.title}</h4>
                    <span style="font-size:14px;">
                    ${todo.description}
                    </span>
                    <br>
                </label>
                <br>
                <span class="new badge left blue darken-1" data-badge-caption="">${todo.category}</span>
            </p>
        </li>`)
            // <div class="button-position">
            // <a data-target="modal2" class="modal-trigger waves-effect waves-light btn-small orange right" onclick="updateTodo('${todo._id}')">Edit</a>
            // <a class="waves-effect waves-light btn-small orange right" onclick="finishTodo('${todo._id}')" style="margin-right:5%;">Finish</a>
            // </div>
            console.log("todonya =====",todo);  
            console.log("title todonya =====",todo.title)
            }
        }
    })
    .fail((jqXHR,textStatus) => {
        console.log(textStatus);
    })
}

$("#project-form").submit(function(){
    event.preventDefault()
    let project = $('#project').val()
    $('#project').val('')
    $.ajax({
        url:`http://localhost:3000/projects`,
        method:'POST',
        data:{
            name:project.replace(/\s+/g, '-')
        },
        beforeSend:function(xhr){
            xhr.setRequestHeader('access-token', localStorage.getItem('token'));
            $("#loading").show()
        },
    })
    .done((response) => {
        if(response){
            Swal.fire({
                type:'success',
                title:"Successfully Create Project",
                text:`project ${response.name} has been created`
            })
            $("#loading").hide()
            getProject()
        }
    })
    .fail((jqXHR,textStatus) => {
        console.log(textStatus);
    })
})

$("#todo-button").click(function(){
    $("#user-invitation").hide()
    $('#task-2').show()
    $('#project-form').hide()
    $('.project').hide()
    getTodo()
})

$("#project-button").click(function(){
    $("#user-invitation").hide()
    $('#task-2').hide()
    $('#project-form').show()
    $('.project').show()
    getProject()
})

$("#update-todo").submit(function(){
    event.preventDefault()
    console.log(idUpdate)
    const title = $('#todo-title-1').val()
    const description = $('#description-1').val()
    const dueDate = $('#due-date-1').val()
    const category =  $('#todo-category-1').val()
    $('#todo-title-1').val('')
    $('#description-1').val('')
    $('#due-date-1').val('')
    $('#todo-category-1').val('')
    $.ajax({
        url:`http://localhost:3000/todos/${idUpdate}`,
        method:'PUT',
        data: {
            title,
            description,
            category,
            dueDate,
        },
        beforeSend:function(xhr){xhr.setRequestHeader('access-token', localStorage.getItem('token'));},
    })
    .done(function(response){
        Swal.fire({
            type:'success',
            title:"Successfully Update",
            text:response.message
        })
        // getProject()
        getTodo()
        getFinishTodo() 
    })
    .fail(function(jqXHR,textStatus){
        const errMsg = jqXHR.responseJSON.message.split(':')
        console.log(errMsg)
        Swal.fire({
            type:'error',
            title:'Failed to Create Todo',
            text:errMsg[2],
        })
    })
})

function updateTodo(id){
    idUpdate = id
    // console.log('ini id update bro ====', idUpdate)
    $.ajax({
        url:`http://localhost:3000/todos/${id}`,
        method:'GET',
        beforeSend:function(xhr){xhr.setRequestHeader('access-token', localStorage.getItem('token'));},
    })
    .done(function(response){
        $('#todo-title-1').val(`${response.title}`)
        $('#description-1').val(`${response.description}`)
        $('#due-date-1').val(`${response.dueDate}`)
        $("#todo-category-1").val(`${response.category}`).prop('selected', true);
    })
    .fail(function(jqXHR,textStatus){
        console.log('request failed', textStatus)
    })
}

function finishTodo(id){
    $.ajax({
        url:`http://localhost:3000/todos/finish/${id}`,
        method:'PATCH',
        beforeSend:function(xhr){xhr.setRequestHeader('access-token', localStorage.getItem('token'));},
    })
    .done(function(response){
        console.log(response)
        getTodo()
        getFinishTodo()
        if(response){
            Swal.fire({
                type:'success',
                title: `success finished task`,
                text:`${response.todo.title} has been on Finished Task List`
            })
        }
    })
    .fail(function(jqXHR,textStatus){
        console.log('request failed', textStatus)
    })
}

function unfinishTodo(id){
    $.ajax({
        url:`http://localhost:3000/todos/unfinish/${id}`,
        method:'PATCH',
        beforeSend:function(xhr){xhr.setRequestHeader('access-token', localStorage.getItem('token'));},
    })
    .done(function(response){
        console.log("unfinish ===> ",response)
        getTodo()
        getFinishTodo()
        if(response){
            Swal.fire({
                type:'success',
                title: `success unfinished task`,
                text:`${response.todo.title} back on Task List`
            })
        }
    })
    .fail(function(jqXHR,textStatus){
        console.log('request failed', textStatus)
    })
}

function deleteTodo(id){
    $.ajax({
        url:`http://localhost:3000/todos/${id}`,
        method:'DELETE',
        beforeSend:function(xhr){xhr.setRequestHeader('access-token', localStorage.getItem('token'));},
    })
    .done(function(response){
        if(response){
            Swal.fire({
                type:'success',
                title: `success deleted task`,
                text:`${response.message}`
            })
            // getProject()
            getFinishTodo()
        }
    })
    .fail(function(jqXHR,textStatus){
        console.log('request failed', textStatus)
    })
}

function getFinishTodo(){
    $.ajax({
        url:`http://localhost:3000/todos/finish`,
        method:'GET',
        beforeSend:function(xhr){xhr.setRequestHeader('access-token', localStorage.getItem('token'));},
    })
    .done(function(response){
        if(response){
            $("#finished-task").html('')
            for(let todo of response){
            $("#finished-task").append(`<li class="collection-item"><div><p class="finished-task">${todo.title}<br><a href="#" class="secondary-content right" onclick="unfinishTodo('${todo._id}')"><i class="material-icons icon-blue">cancel</i></a><a href="#" class="secondary-content" onclick="deleteTodo('${todo._id}')"><i class="material-icons icon-blue">delete</i></a></p></div></li>`)
                console.log("finished ====>",todo)
            }
        }
    })
    .fail(function(jqXHR,textStatus){
        console.log('request failed', textStatus)
    })
}

$("#create-todo").submit(function(){
    event.preventDefault()
    const title = $('#todo-title').val()
    const description = $('#description').val()
    const dueDate = $('#due-date').val()
    const category =  $('#todo-category').val()
    $('#todo-title').val('')
    $('#description').val('')
    $('#due-date').val('')
    $('#todo-category').val('')
    if(localStorage.getItem('idproject')){
        console.log('hehe ada id project ni')
        const idproject = localStorage.getItem('idproject')
        localStorage.removeItem('idproject')
        console.log(idproject)
        $.ajax({
            url:`http://localhost:3000/projects/addTodo/${idproject}`,
            method:'PUT',
            data: {
                title,
                description,
                category,
                dueDate,
            },
            beforeSend:function(xhr){xhr.setRequestHeader('access-token', localStorage.getItem('token'));},
        })
        .done(function(response){
            console.log(response)
            Swal.fire({
                type:'success',
                title: "Todo On Project",
                text:response.message
            })
            getProject()
            getTodo()
            getFinishTodo()
        })
        .fail(function(jqXHR,textStatus){
            const errMsg = jqXHR.responseJSON.message.split(':')
            console.log(errMsg)
            Swal.fire({
                type:'error',
                title:'Failed to Create Todo In Project',
                text:errMsg[2],
            })
        })
    }
    else{
        $.ajax({
            url:'http://localhost:3000/todos',
            method:'POST',
            data: {
                title,
                description,
                category,
                dueDate,
            },
            beforeSend:function(xhr){xhr.setRequestHeader('access-token', localStorage.getItem('token'));},
        })
        .done(function(response){
            Swal.fire({
                type:'success',
                title: "Success",
                text:response.message
            })
            getTodo()
            getFinishTodo()
        })
        .fail(function(jqXHR,textStatus){
            const errMsg = jqXHR.responseJSON.message.split(':')
            console.log(errMsg)
            Swal.fire({
                type:'error',
                title:'Failed to Create Todo',
                text:errMsg[2],
            })
        })
    }
})

function getTodo(){
    const d = new Date();
    const month = monthNames[d.getMonth()]
    const day = d.getDate()
    const year = d.getFullYear()
    $('#card-header').html('')
    $('#card-header').append(`<h5 style="color:black">My Tasks</h5>
    <h7 style="color:black">${month} ${day}, ${year}</h7>`)
    $.ajax({
        url:`http://localhost:3000/todos/unfinish`,
        method:'GET',
        beforeSend:function(xhr){xhr.setRequestHeader('access-token', localStorage.getItem('token'));},
    })
    .done(function(response){
        console.log(response)
        $("#todo-list").html(``)
        for(let todo of response){
            console.log(todo)
            const due = new Date(todo.dueDate);
            const created = new Date(todo.createdAt);
            const difference = getDateDiff(`${created.getDate()}-${created.getMonth()}-${created.getFullYear()}`, `${due.getDate()}-${due.getMonth()}-${due.getFullYear()}`);
            $("#todo-list").append(`<li class="collection-item">
            <p>
            <label> 
                <span class="right" style="font-family: Arial, Helvetica, sans-serif"><b>${difference} Days Remaining</b></span>
                <br>
                <h4>${todo.title}</h4>
                <span style="font-size:14px;">
                ${todo.description}
                </span>
                <br>
            </label>
            <br>
            <span class="new badge left blue darken-1" data-badge-caption="">${todo.category}</span>
            <div class="button-position">
            <a data-target="modal2" class="modal-trigger waves-effect waves-light btn-small orange right" onclick="updateTodo('${todo._id}')">Edit</a>
            <a class="waves-effect waves-light btn-small orange right" onclick="finishTodo('${todo._id}')" style="margin-right:5%;">Finish</a>
            </div>
        </p>
    </li>`)
        }
    })
    .fail(function(jqXHR,textStatus){
        console.log('request failed', textStatus)
    })
}

$('#register-form').click(function(event){
    event.preventDefault()
    const email = $('#email-register').val()
    const password = $('#password-register').val()
    const first_name = $('#firstname-register').val()
    const last_name = $('#lastname-register').val()
    $('#email-register').val('')
    $('#password-register').val('')
    $('#firstname-register').val('')
    $('#lastname-register').val('')
    $.ajax({
        url:'http://localhost:3000/register',
        method:'POST',
        data: {
            email:email,
            password:password,
            first_name:first_name,
            last_name:last_name
        }
    })
    .done(function(response){
        Swal.fire({
            type:'success',
            title: "Success",
            text:response.message
        })
    })
    .fail(function(jqXHR,textStatus){
        const errMsg = jqXHR.responseJSON.message.split(':')
        Swal.fire({
            type:'error',
            title:'Failed to register',
            text:errMsg[2],
        })
    })
})

$('#login-form').click(function(event){
    event.preventDefault()
    const email = $('#email-login').val()
    const password = $('#password-login').val()
    $('#email-login').val('')
    $('#password-login').val('')
    $.ajax({
        url:'http://localhost:3000/login',
        method:'POST',
        data: {
            email:email,
            password:password
        }
    })
    .done(function(response){
        console.log(response.token)
        Swal.fire({
            type:'success',
            title: "Welcome back to TodoApp",
        })
        localStorage.setItem('token',response.token)
        getTodo()
        getFinishTodo()
        $('.login').hide()
        $('#register-button').hide()
        $('#logout-button').show()
        $('.content-web').show()
        $('#project-form').hide()
    })
    .fail(function(jqXHR,textStatus){
        const errMsg = jqXHR.responseJSON.message.split(':')
        console.log(errMsg);
        Swal.fire({
            type:'error',
            title:'Failed to Login',
            text:errMsg[0],
        })
    })
})

$('#login-button').click(function(){
    $('.register').hide()
    $('.login').show()
    $('#login-button').hide()
    $('#register-button').show()
})

$('#register-button').click(function(){
    $('.register').show()
    $('.login').hide()
    $('#login-button').show()
    $('#register-button').hide()
})

$('#logout-button').click(function(event){
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      localStorage.clear()
      beforeLogin()
      $('.register').show()
      $('#login-button').show()
      $("#loading").hide()
    });
})

function onSignIn(googleUser){
    var id_token = googleUser.getAuthResponse().id_token;
    console.log('saya masuk onsignin')
    axios
      .post('http://localhost:3000/google',{
          token:id_token
      })
      .then(({data}) => {
          if(!localStorage.getItem('token')){
              Swal.fire({
                  type:'success',
                  title: "Welcome back to TodoApp..",
              })
          }
          localStorage.setItem('token',data)
          $('.register').hide()
          $('.login').hide()
          $('#login-button').hide()
          $('#register-button').hide()
          $('#logout-button').show()
          $('.content-web').show()
          $('#project-form').hide()
          $("#loading").hide()
          $("#user-invitation").hide()
          getTodo()
          getFinishTodo()
      })
      .catch((err)=> {
          console.log(err)
      })
  }

function beforeLogin(){
    $('.register').show()
    $('.content-web').hide()
    $('.login').hide()
    $('#register-button').hide()
    $('#logout-button').hide()
    $('#project-form').hide()
    $("#loading").hide()
}

$(document).ready(function(){
    console.log('saya masuk refresh')
    const token = localStorage.getItem('token')
    if(!token){
        console.log('masuk')
        beforeLogin()
    }
    else{
        $('.datepicker').datepicker();
        $('.modal').modal({dismissible: false});
        $('select').formSelect();
        $('.chips-placeholder').chips({
        placeholder: 'Enter a Category',
        secondaryPlaceholder: '+Category',
        });
        $('.login').hide()
        $('.register').hide()
        $('#login-button').hide()
        $('#register-button').hide()
        $('#logout-button').show()
        $('.content-web').show()
        $('#project-form').hide()
        $("#loading").hide()
        $("#user-invitation").hide()
        getTodo()
        getFinishTodo()
    }
  });

$( "input" ).on( "click", function() {
    $( "#log" ).html( $( "input:checked" ).val() + " is checked!" );
});

function getDateDiff(dateOne, dateTwo) {
    if(dateOne.charAt(2)=='-' & dateTwo.charAt(2)=='-'){
        dateOne = new Date(formatDate(dateOne));
        dateTwo = new Date(formatDate(dateTwo));
    }
    else{
        dateOne = new Date(dateOne);
        dateTwo = new Date(dateTwo);            
    }
    let timeDiff = Math.abs(dateOne.getTime() - dateTwo.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    let diffMonths = Math.ceil(diffDays/31);
    let diffYears = Math.ceil(diffMonths/12);

    let message = diffDays 
    return message;
 }

function formatDate(date) {
     return date.split('-').reverse().join('-');
}