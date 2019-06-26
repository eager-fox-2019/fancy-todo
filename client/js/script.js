const url= 'http://localhost:3000'
const err = function(jqXHR, textStatus) {
  console.log ('eror nihhh')
  console.log(textStatus);
}


function onSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      localStorage.clear()
      signOut()
    });
  }

  function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
      url : `${url}/users/login/google`,
      method : 'POST',
      data : {
        idToken :id_token
      }
    })
    .done(response=> {
      localStorage.setItem('token',`${response.token}`)
      signIn()
      console.log (response,'ini response')
    })
    .fail(err)
  }

  

  function signIn() {
    $('#main').show()
    getData()
    $('.add-task-form').hide()
    $('#home').hide()
    $('#signout-link').show()
    $('#google-button').hide()
    $('#signout-link').show()
    $('#regist-button').hide()
    $('#login-button').hide()
    $('#edit-form').hide()

    $('#register-form').hide()
    $('#login-form').hide()
    // $('#detailed').toggle()
  }

  function signOut() {
    $('#main').hide()
    $('#signout-link').hide()
    $('#google-button').show()
    $('#home').show()
    $('#regist-button').show()
    $('#login-button').show()
  }
  
  function getData(){
    $.ajax({
      url: `${url}/todos/findAll`,
      method : "GET",
      headers : {
        token : localStorage.getItem('token')
      }
    })
    .done(response=> {
      if (response.length === 0) {
        console.log ('kosoonggg')
        $("#all-todo").empty()
        $("#all-todo").append(`
        <div class="card mt-3 tab-card">
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active p-3" id="none" role="tabpanel" aria-labelledby="one-tab">
            <h5 class="card-title"> there is no task for now </h5>
            <hr>
            </div>
        </div>
    </div>
        `)}
      else {

        $('#all-todo').empty()
        $.each(response,(i,each)=>{
          console.log (each)
          $('#all-todo').append(`
          <div class="card mt-3 tab-card">
              <div class="tab-content" id="myTabContent">
                  <div class="tab-pane fade show active p-3" id="${each._id}" role="tabpanel" aria-labelledby="one-tab">
                  <h5 class="card-title"><a href="#" onclick="showDetil('${each._id}')">${each.name}</a></h5>
                  <hr>
                  <p class="card-text">${each.description} </p>
                  <p class="card-text">Deadline <br> ${moment(each.dueDate).format('MMMM Do YYYY')}</p>
                  <input type="checkbox" id="check-box" onclick="updateStatus('${each._id}','${each.status}')"> ${each.status} <br>
             
                  </div>
              </div>
          </div>
          `)
          // <input type="checkbox"> ${each.status} <br>
          // <p> status : <br>${each.status}</p>
          // <p> due Date : <br>${moment(each.dueDate).endOf('day').fromNow()}</p>
      })
      }
    })
    .fail (err)
  }

  function showDetil (id) {
    $('#detailed').show()
    getDetail(id)
  }

  function getDetail(id) {
    console.log('hasil detailnuya')
    $.ajax({
      url : `${url}/todos/findOne/${id}`,
      method : 'GET',
      headers : {
        token : localStorage.getItem('token')
      }
    })
    .done(response=> {
      console.log (response),'ini response lohh'
      $('#detailed').empty()
      $('#detailed').append(`
      <div class="card mt-3 tab-card">
              <div class="tab-content" id="myTabContent">
                  <div class="tab-pane fade show active p-3" id="${response._id}" role="tabpanel" aria-labelledby="one-tab">
                  <h5 class="card-title"><a href="#" onclick="getDetail('${response._id}')">${response.name}</a></h5>
                  <p class="card-text">${response.description} </p>
                  <p class="card-text">${moment(response.dueDate).endOf('day').fromNow()}</p>
                  <a href="#" class="btn btn-primary" onclick="remove('${response._id}')">delete</a>
                  <a href="#" class="btn btn-primary" onclick="$('#edit-form').toggle()">edit</a>              
                  </div>
              </div>
          </div>
          <div id="edit-form">
                  <form>
                      <div class="form-group">
                          <label for="name">Title :</label>
                          <input type="text" class="form-control" id="edit-name">
                      </div>
                      <div class="form-group">
                          <label for="description">Description :</label>
                          <input type="text" class="form-control" id="edit-description">
                      </div>
                      <div class="form-group">
                          <label for="dueDate">Due Date :</label>
                          <input type="date" class="form-control" id="edit-dueDate">
                      </div>
                          <button type="submit" class="btn btn-primary" onclick="edit('${response._id}')"> Submit</button>
                  </form>
          </div>
      `)
      $('#edit-form').hide()
    })
    .fail(err)
  }

  function addData () {
    $.ajax({
      url : `${url}/todos/add`,
      method : `POST`,
      headers : {
        token : localStorage.getItem("token")
      },
      data : {
        name : $('#todo-name').val(),
        description : $('#todo-description').val(),
        status : `uncomplete`,
        dueDate : $('#todo-dueDate').val()
      }
    })
    .done (response => {
      console.log (response)
      signIn()
    })
    .fail (err)
  }

  function remove (taskId) {
    console.log ('mau diremove nihh')
    $.ajax({
      url : `${url}/todos/remove/${taskId}`,
      method : 'DELETE',
      headers : {
        token : localStorage.getItem("token")
      }
    })
    .done(response=> {
      console.log (response)
      signIn()
      $('#detailed').empty()
    })
    .fail(err)
  }

  function edit (taskId) {
    console.log ('mau diedit nihh')
    $('#edit-form').toggle()
    $.ajax({
      url : `${url}/todos/update/${taskId}`,
      method : 'PATCH',
      headers : {
        token : localStorage.getItem("token")
      },
      data : {
        name : $('#edit-name').val() ,
        description : $('#edit-description').val(),
        dueDate : $('#edit-dueDate').val()
      }
    })
    .done(response=> {
      console.log (response)
      signIn()
      $('#detailed').hide()
    })
    .fail(err)
  }

  function updateStatus (taskId,status) {
    console.log (taskId,status)
    if(status === 'completed') {
      updateStatus = 'uncompleted'
    }
    else {
      updateStatus = 'completed'
    }
    $.ajax({
      url : `${url}/todos/update/${taskId}`,
      method : 'PATCH',
      headers : {
        token : localStorage.getItem("token")
      },
      data : {
        status : updateStatus
      }
    })
    .done(response=> {
      console.log (response)
      signIn()
      // $('#detailed').hide()
    })
    .fail(err)
  }

  function addTask() {
    $('.add-task-form').toggle()
  }

  function takeData() {
    $().val()
  }