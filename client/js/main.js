/* ================ REGISTER FUNCTION ================== */
$('#signupNav').click(function() {
  // event.preventDefault()
  // $('#logreg-forms .form-signin').toggle(); // display:block or none
  // $('#logreg-forms').show()
  // $('#signinForm').hide()
  // $("#signupForm").show()
  // console.log('test')
  showSignup()
  // $('#logreg-forms .form-signup').show(); // display:block or none
})

$('.form-signup').submit(function () {
  event.preventDefault()
  let email = $('#signupEmail').val()
  let password = $('#signupPass').val()
  
  $.ajax({
    method: "POST",
    url: "http://localhost:3000/user/signup",
    data: {
      email: email,
      password: password
    }
  })
    .done(function () {
      // alert('success')
      Swal.fire({
        type: 'success',
        title: 'Successfully registered'
      }
      )
      showSignin()
    })
    .fail(function(err) {
      let msg = err.responseJSON.message.split(':')

      msg.splice(0,1)
      Swal.fire({
        type: 'error',
        title: `${msg[1]}`,
        text: `Please sign up with another email.`
      })
    })
})


$('#homeNav').click(function(){
  showMain()
})

$(document).ready(function() {
  $('#logreg-forms').hide()
})

/* ========================= LOGIN FUNCTION  =======================================*/

// normal login
$('#signinNav').click( function() {
  showSignin()
})

$('#signupButton').click(function() {
  showSignup()
})

$('#signinForm').submit(function() {
  event.preventDefault()
  let email = $('#signinEmail').val()
  let password = $('#signinPass').val()

  $.ajax({
    method: "POST",
    url: "http://localhost:3000/user/signin",
    data: {
      email : email,
      password: password
    }
  })
    .done(function(user) {
      // console.log(token)
      localStorage.setItem('accessToken', user.accessToken)
      swal.fire({
        type: 'success',
        title: 'Successfully signed in!'
      })
      showLoggedIn()
      showMain()
    })
    .fail(function(err) {
      swal.fire({
        type: 'error',
        title: 'username/password incorrect'
      })
    })
})

// google login
var startApp = function() {
  gapi.load('auth2', function(){
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
      client_id: '10161067710-5vlu9nls5863cc78l5mtsj2a6qjddv9k.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      // Request scopes in addition to 'profile' and 'email'
      //scope: 'additional_scope'
    });
    attachSignin(document.getElementById('googleSignin'));
  });
}

  function attachSignin(element) {
  
    auth2.attachClickHandler(element, {},
        function(googleUser) {
          const idToken = googleUser.getAuthResponse().id_token
         
          $.ajax({
            method: "POST",
            url: 'http://localhost:3000/user/googlesign',
            data: { idToken }
          })
            .done(function(data) {
              localStorage.setItem('accessToken', data.accessToken)
              swal.fire({
                type: 'success',
                title: 'Successfully signed in!'
              })
              showLoggedIn()
              showMain()
            })
            .fail(function(err) {
              // console.log(err.responseJSON.message)
              console.log(err)
            })

        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

startApp()

/*============================ DISPLAY FUNCTIONS ==========================*/
function showMain() {
  $('#accordion').empty()
  $('#accordionChecked').empty()
  $('#logreg-forms').hide()
  $('#todolist').fadeIn(200)
  $('#checkedList').fadeIn(200)
  showTodos()
  showChecked()
}

function showSignin() {
  $('#signinEmail').val('')
  $('#signinPass').val('')
  $('#todolist').hide()
  $('#checkedList').hide()
  $('#logreg-forms').fadeIn(200)
  $('#signinForm').show()
  $("#signupForm").hide()
}

function showSignup() {
  $('#signupEmail').val('')
  $('#signupPass').val('')
  $('#todolist').hide()
  $('#checkedList').hide()
  $('#logreg-forms').fadeIn(200)
  $('#signinForm').hide()
  $("#signupForm").show()
}

function emptyTodo() {
  $('#task').val('')
  $('#description').val('')
  $('#time').val('') 
  $('#calendar').val('')
}

function showLoggedIn() {
  $('#signupNav').hide()
  $('#signinNav').hide()
  $('#signoutNav').show()
}

function showLoggedOut() {
  $('#signupNav').show()
  $('#signinNav').show()
  $('#signoutNav').hide()
}

let signinToken = localStorage.getItem('accessToken')

if(signinToken) {
  showLoggedIn()
}
else{
  showLoggedOut()
}

/*======================= SIGN OUT FUNCTION ===========================*/
$('#signoutNav').click(function () {
  localStorage.removeItem('accessToken')
  $('#accordion').empty()
  $('#accordionChecked').empty()
  showLoggedOut()
  Swal.fire({
    type: 'success',
    title: 'Successfully signed out'
  })
})

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

/*========================== TODO LIST FUNCTION ==========================*/

//Add todo
$('#todoForm').submit(function() {
  event.preventDefault()

  let task = $('#task').val()
  let description = $('#description').val()
  let time = $('#time').val()
  let date;

  if ($('#todayDate').is(":checked")) {
    let temp = new Date()
    date = temp.toISOString().substr(0,10)
  }
  else {
    date = $('#calendar').val()
  }

  let token = localStorage.getItem('accessToken')
  
  if($('#addImg').val()) {
    var reader = new FileReader();
      reader.onload = function (e) {
        let img = e.target.result
          let split = img.split(',')

          split[0] = ""
          let imgUrl = split.join(',')
        
          // let token = localStorage.getItem('accessToken')
          $.ajax({
            method: "POST",
            url: "http://localhost:3000/todo/upload",
            data: {
              imgUrl: imgUrl
            },
            headers: {
              accesstoken: token
            }
          })
            .then(function(imgurLink) {
              $.ajax({
                  method: "POST",
                  url: "http://localhost:3000/todo/add",
                  data: {
                    task: task,
                    description: description,
                    dueDate: date,
                    time: time,
                    image: imgurLink
                  },
                  headers: {
                    accesstoken: token
                  }
                })
                  .done(function(newTask) {
                    Swal.fire({
                      type: 'success',
                      title: 'Successfully added task',
                    })
                    let length = $('.list-group-item').length
                    $('#accordion').append(`<div class="panel panel-default list-group-item">
                    <div class="panel-heading">
                        <h4 class="panel-title">
                          <a data-toggle="collapse" data-parent="#accordion" href="#collapse${length+1}">
                          ${newTask.task}</a>
                        </h4>
                        <div class="taskDetail">
                          <div class="taskDate">
                            <p><img src="img/calendar.svg" class="dateImg"> ${newTask.dueDate}</p>
                            <p><img src="img/time.svg" class="dateImg"> ${newTask.time}</p>
                          </div>
                          <div class ="taskIcon">
                          <a href="#" onclick="deleteTodo('${newTask._id}')"><img src="img/delete.svg" class="deleteImg"></a>
                          <a href="#" onclick="checkedTodo('${newTask._id}')"><img src="img/checked.svg" class="checkedImg"></a>
                          </div>
                        </div>
                      </div>
                      <div id="collapse${length+1}" class="panel-collapse collapse in">
                        <div class="panel-body">${newTask.description} <img src="${imgurLink}"></div>
                        <a href="#" class="editTodo">Edit Todo</a>
                      </div>
                    </div>`)
              
                    emptyTodo()
                  })
                  .fail(function(err) {
                    // if(err.)
                    if(err.status === 401) {
                      Swal.fire({
                        title: 'Sorry! You must sign in before procceeding',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sign in'
                      }).then((result) => {
                        if (result.value) {
                          showSignin()
                        }
                      }) 
                    }
                  })
            })
            .fail(function(err) {
              Swal.fire({
                title: 'Sorry! You must sign in before procceeding',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sign in'
              }).then((result) => {
                if (result.value) {
                  showSignin()
                }
              }) 
            })
          }

          let temp = $('#addImg')[0]
          reader.readAsDataURL(temp.files[0]);
    } else {
      if ($('#todayDate').is(":checked")) {
        let temp = new Date()
        date = temp.toISOString().substr(0,10)
      }
      else {
        date = $('#calendar').val()
      }

      let token = localStorage.getItem('accessToken')
  
      $.ajax({
        method: "POST",
        url: "http://localhost:3000/todo/add",
        data: {
          task: task,
          description: description,
          dueDate: date,
          time: time
        },
        headers: {
          accesstoken: token
        }
      })
        .done(function(newTask) {
          let length = $('.list-group-item').length
          Swal.fire({
            type: 'success',
            title: 'Successfully added task',
          })

          $('#accordion').append(`<div class="panel panel-default list-group-item">
          <div class="panel-heading">
              <h4 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse${length+1}">
                ${newTask.task}</a>
              </h4>
              <div class="taskDetail">
                <div class="taskDate">
                  <p><img src="img/calendar.svg" class="dateImg"> ${newTask.dueDate}</p>
                  <p><img src="img/time.svg" class="dateImg"> ${newTask.time}</p>
                </div>
                <div class ="taskIcon">
                <a href="#" onclick="deleteTodo('${newTask._id}')"><img src="img/delete.svg" class="deleteImg"></a>
                <a href="#" onclick="checkedTodo('${newTask._id}')"><img src="img/checked.svg" class="checkedImg"></a>
                </div>
              </div>
            </div>
            <div id="collapse${length+1}" class="panel-collapse collapse in">
              <div class="panel-body">${newTask.description}</div>
              <a href="#" class="editTodo">Edit Todo</a>
            </div>
          </div>`)

          emptyTodo()
        })
        .fail(function(err) {
          if(err.status === 401) {
            Swal.fire({
              title: 'Sorry! You must sign in before procceeding',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sign in'
            }).then((result) => {
              if (result.value) {
                showSignin()
              }
            }) 
          }
        })
    }
})


// show todos
showTodos()
function showTodos() {
  let token = localStorage.getItem('accessToken')
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/todo/findtodos",
    headers: {
      accesstoken: token
    }
  })
    .done(function(list) {
      let listTodos = ""

      for(let i = 0; i <= list.length-1; i++) {
        let description = list[i].description
        
        if(list[i].description === ""){
          description = "no description was given."
        }

        listTodos += `<div class="panel panel-default list-group-item">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" data-parent="#accordion" href="#collapse${i+1}">
            ${list[i].task}</a>
          </h4>
          <div class="taskDetail">
            <div class="taskDate">
              <p><img src="img/calendar.svg" class="dateImg"> ${list[i].dueDate}</p>
              <p><img src="img/time.svg" class="dateImg"> ${list[i].time}</p>
            </div>
            <div class ="taskIcon">
            <a href="#" onclick="deleteTodo('${list[i]._id}')"><img src="img/delete.svg" class="deleteImg"></a>
            <a href="#" onclick="checkedTodo('${list[i]._id}')"><img src="img/checked.svg" class="checkedImg"></a>
            </div>
          </div>
        </div>
        <div id="collapse${i+1}" class="panel-collapse collapse in">
          <div class="panel-body">${description}</div>
          <a href="#" class="editTodo" onclick="editTodo('${list[i]._id}')">Edit Todo</a>
        </div>
      </div>`
      }

      $('#accordion').append(listTodos)
    })
    .catch(function(err){
      console.log(err)
    })
}

//delete todo

function deleteTodo(taskId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      let token = localStorage.getItem('accessToken')

      $.ajax({
        method: "DELETE",
        url: `http://localhost:3000/todo/delete/${taskId}`,
        headers: {
          accesstoken: token 
        }
      })
        .done(function(data) {
          $('#accordion').empty()
          $('#accordionChecked').empty()
          showChecked()
          showMain()
        })
        .fail(function(err) {
          console.log(err)
        })
    }
  })
}

//check Todo

function checkedTodo(taskId) {
  let token = localStorage.getItem('accessToken')

  $.ajax({
    method: "PATCH",
    url: `http://localhost:3000/todo/checked/${taskId}`,
    headers: {
      accesstoken: token
    }
  })
    .done(function(updated) {
      $('#accordion').empty()
      showTodos()
      $('#accordionChecked').empty()
      showChecked()
      Swal.fire({
        type: 'success',
        title: 'Added to your finished tasks'
      })
    })
    .fail(function(err) {
      console.log(err)
    })
}

showChecked()
function showChecked() {
  let token = localStorage.getItem('accessToken')
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/todo/findtodos/checked",
    headers: {
      accessToken: token
    }
  })
    .then(list => {
      let listTasks = ''

      for(let i=0; i<=list.length-1;i++) {
        listTasks += `<div class="panel panel-default list-group-item">
        <div class="panel-heading">
          <h4 class="panel-title">
            <a>
            ${list[i].task}</a>
          </h4>
          <div class="taskDetail">
            <div class="taskDate">
              <p><img src="img/calendar.svg" class="dateImg"> ${list[i].dueDate}</p>
              <p><img src="img/time.svg" class="dateImg"> ${list[i].time}</p>
            </div>
            <div class ="taskIcon">
            <a href="#" onclick="deleteTodo('${list[i]._id}')"><img src="img/delete.svg" class="deleteImg"></a>
            </div>
          </div>
        </div>
      </div>`
      }

      $('#accordionChecked').append(listTasks)
    })
}

function editTodo(taskId) {
  let token = localStorage.getItem('accessToken')
  $.ajax({
    method: "GET",
    url: `http://localhost:3000/todo/findone/${taskId}`,
    headers: {  
      accesstoken: token
    }
  })
    .done(function(foundTask) {
      Swal.fire({
        title: 'Edit Task',
        html:
          `
          —————————————————————————
          <form class="editForm">
              <h4>Task</h4>
              <input type="text" id="editTask" style="padding:5px;width:70%;"value="${foundTask.task}">
              <br><br>
              <h4>Description</h4>
              <textarea rows="4" cols="30" style="padding:10px;" id="editDesc" wrap="physical">${foundTask.description}</textarea>
              <br><br>
              <div style="display:flex;justify-content:space-evenly;">
                <h4>Date</h4>
                <input type="date" id="editDate" value="${foundTask.dueDate}" style="padding:5px;">
                <h4>Time</h4>
                <input type="time" id="editTime" value="${foundTask.time}" style="padding:5px;">
              </div>

          </form>
          
          `,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
          return new Promise((resolve, reject) => {
            resolve({
              task: $('#editTask').val(),
              description: $('#editDesc').val(),
              dueDate: $('#editDate').val(),
              time: $('#editTime').val()
            })
          })
        }
      })
      .then((data) => {
        let edit = data.value

        $.ajax({
          method: "PATCH",
          url: `http://localhost:3000/todo/update/${taskId}`,
          headers: {
            accesstoken: token
          },
          data: {
            task: edit.task,
            description: edit.description,
            dueDate: edit.dueDate,
            time: edit.time
          }
        })
          .done(function(updatedTask) {
            $('#accordion').empty()
            Swal.fire({
              type: 'success',
              title: 'Successfully edited'
            })
            showMain()     
          })
          .fail(function(err) {
            console.log(err)
          })
      })   
    })
}