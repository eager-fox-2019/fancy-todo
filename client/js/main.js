/* ================ REGISTER FUNCTION ================== */

$('#registerNav').click(function() {
  // event.preventDefault()
  // $('#logreg-forms .form-signin').toggle(); // display:block or none
  $('#logreg-forms').show()
  $('#signinForm').hide()
  $("#signupForm").show()
  console.log('test')
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
})


$('#homeNav').click(function(){
  showMain()
})

$(document).ready(function() {
  $('#logreg-forms').hide()
})

/* ========================= LOGIN FUNCTION  =======================================*/

// normal login
$('#loginNav').click( function() {
  showSignin()
})

$('#signupButton').click(function() {
  showSignup()
})

$('#signinForm').submit(function() {
  event.preventDefault()
  let email = $('#signinEmail').val()
  let password = $('#signinPass').val()

  // console.log(email, password)
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
    // console.log(element.id);
    auth2.attachClickHandler(element, {},
        function(googleUser) {
          const idToken = googleUser.getAuthResponse().id_token
          // console.log(idToken)
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
  $('#logreg-forms').hide()
  $('#todolist').show()
  showTodos()
}

function showSignin() {
  $('#todolist').hide()
  $('#logreg-forms').show()
  $('#signinForm').show()
  $("#signupForm").hide()
}

function showSignup() {
  $('#todolist').hide()
  $('#logreg-forms').show()
  $('#signinForm').hide()
  $("#signupForm").show()
}

function emptyTodo() {
  $('#task').val('')
  $('#description').val('')
  $('#time').val('') 
  $('#calendar').val('')
}

/*======================= SIGN OUT FUNCTION ===========================*/
$('#signoutNav').click(function () {
  localStorage.removeItem('accessToken')
  $('#accordion').empty()
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
      // console.log(newTask)

      let length = $('.list-group-item').length
      // console.log('ACCORDION =====')

      $('#accordion').append(`<div class="panel panel-default list-group-item">
      <div class="panel-heading">
          <h4 class="panel-title">
            <a data-toggle="collapse" data-parent="#accordion" href="#collapse${length+1}">
            ${newTask.task}</a>
          </h4>
          <div class="taskDetail">
            <div class="taskDate">
              <p><span style="color:green">Due Date: </span>${newTask.dueDate}</p>
              <p><span style="color:green">Time: </span>${newTask.time}</p>
            </div>
            <div class ="taskIcon">
            <a href="#"><img src="img/delete.svg" class="deleteImg"></a>
            <a href="#"><img src="img/checked.svg" class="checkedImg"></a>
            </div>
          </div>
        </div>
        <div id="collapse${length+1}" class="panel-collapse collapse in">
          <div class="panel-body">${newTask.description}</div>
        </div>
      </div>`)

      emptyTodo()
    })
    .fail(function(err) {
      // if(err.)
      if(err.status === 401) {
        Swal.fire({
          title: 'Sorry! You must sign in before procceeding',
          // text: "Already have an account? Sign in to procceed",
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
      // console.log(list)
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
              <p><span style="color:green">Due Date: </span>${list[i].dueDate}</p>
              <p><span style="color:green">Time: </span>${list[i].time}</p>
            </div>
            <div class ="taskIcon">
            <a href="#"><img src="img/delete.svg" class="deleteImg"></a>
            <a href="#"><img src="img/checked.svg" class="checkedImg"></a>
            </div>
          </div>
        </div>
        <div id="collapse${i+1}" class="panel-collapse collapse in">
          <div class="panel-body">${description}</div>
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

$('#accordion').on('click', '.deleteImg', function() {
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
      let value = $(this).parent()

      let dates = value[0].nextSibling.parentElement.parentElement.firstElementChild.innerText.split(' ')

      let task = value[0].offsetParent.firstElementChild.firstElementChild.innerText
      let dueDate = dates[2].slice(0,10)
      let time = dates[3]

      let token = localStorage.getItem('accessToken')

      $.ajax({
        method: "DELETE",
        url: "http://localhost:3000/todo/delete",
        data: {
          task: task,
          dueDate: dueDate,
          time: time
        },
        headers: {
          accesstoken: token 
        }
      })
        .done(function() {
          $('#accordion').empty()
          showMain()
        })
        .fail(function(err) {
          console.log('error')
        })
    }
  })
  
})

//check Todo

$('#accordion').on('click', '.checkedImg', function() {
  // console.log('test')
  let value = $(this).parent()

  let dates = value[0].nextSibling.parentElement.parentElement.firstElementChild.innerText.split(' ')

  let task = value[0].offsetParent.firstElementChild.firstElementChild.innerText
  let dueDate = dates[2].slice(0,10)
  let time = dates[3]

  let token = localStorage.getItem('accessToken')

  $.ajax({
    method: "PATCH",
    url: "http://localhost:3000/todo/checked",
    data: {
      task: task,
      dueDate: dueDate,
      time: time
    },
    headers: {
      accesstoken: token
    }
  })
    .done(function(updated) {
      console.log(updated)
    })
    .fail(function(err) {
      console.log(err)
    })

})

