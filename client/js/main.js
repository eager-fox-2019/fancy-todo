const taskHtml = `
<div id='todo-main'>
  <div id='add-task-bar' class='container'>
    <form onsubmit='addNewTask(this)' class="form-group">
      <h3 for="add_task">What need to be done?</h3>
      <input type="text" class="form-control" id="add_task-title" aria-describedby="full_name_help" name='title' placeholder="Add Title">
      <textarea type="text" class="form-control" id="add_task-note" aria-describedby="full_name_help" name='note' placeholder="Add notes"></textarea>
      <small id="full_name_help" class="form-text text-muted">Explain more detail in notes</small>
      <div class="form-group row">
        <label for="add_task-due_date" class="col-2 col-form-label">Due Date</label>
        <div class="col-10">
          <input class="form-control" type="date" value="" id="add_task-due_date">
        </div>
      </div>
      <input type='submit' class='btn btn-primary' placeholder="Submit">
    </form>
  </div>
  <div id="calendar-content" class='container'>
    <h3>Calendar</h3>
    <div id="calendar1">
      <!-- calendar -->
    </div>
  </div>
  <div id='tasks-cards' class='container'>
    <h3>Task List</h3>
    <nav>
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a class="nav-task nav-item nav-link active" id="nav-all-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">All Task</a>
        <a class="nav-task nav-item nav-link" id="task-true" data-toggle="tab"  aria-selected="false">Completed Task</a>
        <a class="nav-task nav-item nav-link" id="task-false" data-toggle="tab"  aria-selected="false">Uncompleted Task</a>
      </div>
    </nav>
 
    <div class="tab-content" id="nav-tabContent">
      <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-all-tab">
        <div class="accordion" id="all-task-accordion">
          <!-- Get all Task -->

        </div>  
      </div>
    </div> 
  </div>
</div>
`
const loginHtml = `
<div id='login-page'>
  <form action='' method='POST'>
    <div class="form-group">
      <label for="input_username">Username</label>
      <input type="text" class="form-control" id="input_username" placeholder="Username">
    </div>
    <div class="form-group">
      <label for="input_password">Password</label>
      <input type="password" class="form-control" id="input_password" placeholder="Password">
    </div>
    <p><small>Don't have account? Register <a href='' onclick='loadRegisterPage()'>here</a></small></p>
    <button type="submit" onclick="defaultLogin()" class="btn btn-primary my-2">Submit</button>
    <p><small>Or Sign in with google</small></p>
    <div class="g-signin2" data-onsuccess="onSignIn"></div>
  </form>
</div>
`
const registerHtml = `
<form>
  <div class="form-group">
    <label for="input_full_name">Full Name</label>
    <input type="text" class="form-control" id="input_full_name" aria-describedby="full_name_help" placeholder="Enter Your Name">
    <small id="full_name_help" class="form-text text-muted">Please input your full name.</small>
  </div>
  <div class="form-group">
    <label for="input_username">Username</label>
    <input type="text" class="form-control" id="input_username" placeholder="Username">
  </div>
  <div class="form-group">
    <label for="input_password">Password</label>
    <input type="password" class="form-control" id="input_password" placeholder="Password">
  </div>
  <div class="form-group">
    <label for="input_email">Email</label>
    <input type="email" class="form-control" id="input_email" placeholder="Email">
  </div>
  <button type="submit" onclick="register()" class="btn btn-primary">Submit</button>
</form>
`

const url_server = 'http://localhost:3000' // GCS 35.198.211.11:80 / localhost:3000

$(document).ready(function(){
  checkToken()
  var $btns = $('.nav-task').click(function() {
    if (this.id == 'nav-all-tab') {
      $('#all-task-accordion > div').fadeIn(450);
    } else {
      var $el = $('.' + this.id).fadeIn(450);
      $('#all-task-accordion > div').not($el).hide();
    }
    $btns.removeClass('active');
    $(this).addClass('active');
  })
});

