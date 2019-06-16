function showLogin() {
  $('#register-container').hide();
  $('#login-container').show();
  $('#todo-container').hide();
}

function showRegister() {
  $('#register-container').show();
  $('#login-container').hide();
  $('#todo-container').hide();
}

function showMainPage() {
  $('#register-container').hide();
  $('#login-container').hide();
  $('#todo-container').show();
  showTodo()
}

function showAddButton() {
  $('#button-add').show();
  $('#button-edit').hide();
  $('#button-delete').hide();
}

function showEditDeleteButton() {
  $('#button-edit').show();
  $('#button-delete').show();
  $('#button-add').hide();
}

if (localStorage.getItem('token') || localStorage.getItem('githubToken')) {
  showMainPage();
  showAddButton();
} else {
  showLogin();
}

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
};

let requestToken = getUrlParameter('code');


if (requestToken) {
  $.ajax({
      method: 'POST',
      url: `http://localhost:3000/user/oauth`,
      data: {
        requestToken
      }
    })
    .done((response) => {
      localStorage.setItem('githubToken', response.access_token);
      getUserEmail();
    })
    .fail((err) => {
      console.log(err);
    })
}

function getUserEmail() {
  $.ajax({
      url: 'https://api.github.com/user',
      headers: {
        Authorization: "Basic " + btoa('username' + ":" + localStorage.getItem('githubToken'))
      }
    })
    .done((response) => {
      $.ajax({
          method: 'POST',
          url: 'http://localhost:3000/user/login',
          data: {
            name: response.name,
            email: response.email,
            password: '12345',
            githubToken: localStorage.getItem('githubToken')
          }
        })
        .done((response) => {
          localStorage.setItem('token', response);
          showMainPage();
          window.location.href = 'http://localhost:8080';
        })
        .fail((err) => {
          console.log(err);
        })
    })
    .fail((err) => {
      console.log(err);
    })
}

function login() {
  event.preventDefault();

  $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/user/login',
      data: {
        email: $('#login-email').val(),
        password: $('#login-password').val()
      }
    })
    .done((response) => {
      localStorage.setItem('token', response);
      showMainPage();
    })
    .fail((err) => {
      Swal.fire({
        title: 'Email or Password wrong',
        text: 'Please enter correct email/password',
        type: 'error',
        confirmButtonText: 'Continue'
      })
    });
}

function register() {
  event.preventDefault();

  $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/user/register',
      data: {
        firstName: $('#first-name').val(),
        lastName: $('#last-name').val(),
        email: $('#register-email').val(),
        password: $('#register-password').val()
      }
    })
    .done((response) => {
      showLogin();
    })
    .fail((err) => {
      Swal.fire({
        title: err.responseJSON.errors.email.message,
        text: 'Please enter correct email',
        type: 'error',
        confirmButtonText: 'Continue'
      })
      console.log(err);
    })
}

function logout() {
  localStorage.clear();
  $('#register-container').hide();
  $('#login-container').show();
  $('#todo-container').hide();
}

function statusValidation(id, status) {
  $.ajax({
      method: 'PATCH',
      url: `http://localhost:3000/api/todo/update/${id}`,
      data: {
        status
      },
      headers: {
        token: localStorage.getItem('token')
      }
    })
    .done((response) => {
      console.log(response);
    })
    .fail((err) => {
      console.log(err);
    })
}

function showTodo() {
  $('#todo-list').empty();
  $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/api/todo/read/all/',
      headers: {
        token: localStorage.getItem('token')
      }
    })
    .done((response) => {
      for (const todo of response) {
        if (new Date().toISOString() > todo.dueDate && todo.status != 'Expired') {
          statusValidation(todo._id, 'Expired');
          todo.status = 'Expired';
        }

        $('#todo-list').append(`
          <div class="todo">
            <h4 class="todo-name"><a onclick="stageTodo('${todo._id}', '${todo.name}', '${todo.description}', '${todo.dueDate}')">${todo.name}</a></h4>
            <p class="todo-description">${todo.description.substr(0,50)}...</p>
            <p class="todo-status"><span class="todo-bottom-text">Status</span>: ${todo.status}</p>
            <p class="todo-date"><span class="todo-bottom-text">Deadline</span>: ${new Date(todo.dueDate).toString().substr(0,15)}</p>
          </div>
        `)
      }
    })
    .fail((err) => {
      if (err.status == 401) {
        Swal.fire({
          title: 'Unauthenticated',
          text: 'You have to login first',
          type: 'error',
          confirmButtonText: 'Continue'
        })
      } else {
        Swal.fire({
          title: 'Something went wrong',
          text: 'sit tight',
          type: 'error',
          confirmButtonText: 'Continue'
        })
        console.log(err);
      }
    })
}

function addTodo() {

  if ($('#edit-section-name').val().length == 0) {
    Swal.fire({
      title: 'Oops',
      text: 'Title cannot be empty',
      type: 'error',
      confirmButtonText: 'Continue'
    })
  } else {
    $.ajax({
        method: 'POST',
        url: `http://localhost:3000/api/todo/create`,
        data: {
          name: $('#edit-section-name').val(),
          description: $('#edit-section-description').val(),
          status: 'On Going',
          dueDate: $('#due-date').val()
        },
        headers: {
          token: localStorage.getItem('token')
        }
      })
      .done((response) => {
        Swal.fire(
          'Seccesful',
          'New todo is added',
          'success'
        )
        showTodo();
      })
      .fail((err) => {
        if (err.status == 401) {
          Swal.fire({
            title: 'Unauthenticated',
            text: 'You have to login first',
            type: 'error',
            confirmButtonText: 'Continue'
          })
        } else {
          Swal.fire({
            title: 'Something went wrong',
            text: 'sit tight',
            type: 'error',
            confirmButtonText: 'Continue'
          })
          console.log(err);
        }
      })
  }
}

function stageTodo(id, name, description, dueDate) {
  $('#edit-section-id').val(id);
  $('#edit-section-name').val(name);
  $('#edit-section-description').val(description);
  $('#due-date').val(dueDate.substr(0, 10));

  showEditDeleteButton();
}

function editTodo() {
  if ($('#edit-section-name').val().length == 0) {
    Swal.fire({
      title: 'Oops',
      text: 'Title cannot be empty',
      type: 'error',
      confirmButtonText: 'Continue'
    })
  } else {
    $.ajax({
        method: 'PATCH',
        url: `http://localhost:3000/api/todo/update/${$('#edit-section-id').val()}`,
        data: {
          name: $('#edit-section-name').val(),
          description: $('#edit-section-description').val(),
          dueDate: $('#due-date').val()
        },
        headers: {
          token: localStorage.getItem('token')
        }
      })
      .done((response) => {
        Swal.fire(
          'Seccesful',
          'The todo is updated',
          'success'
        )
        showTodo();
      })
      .fail((err) => {
        if (err.status == 401) {
          Swal.fire({
            title: 'Unauthenticated',
            text: 'You have to login first',
            type: 'error',
            confirmButtonText: 'Continue'
          })
        } else {
          Swal.fire({
            title: 'Something went wrong',
            text: 'sit tight',
            type: 'error',
            confirmButtonText: 'Continue'
          })
          console.log(err);
        }
      })
  }
}

function deleteTodo() {
  $.ajax({
      method: 'DELETE',
      url: `http://localhost:3000/api/todo/delete/${$('#edit-section-id').val()}`,
      headers: {
        token: localStorage.getItem('token')
      }
    })
    .done((response) => {
      Swal.fire(
        'Seccesful',
        'The todo is deleted',
        'success'
      )
      showTodo();
    })
    .fail((err) => {
      if (err.status == 401) {
        Swal.fire({
          title: 'Unauthenticated',
          text: 'You have to login first',
          type: 'error',
          confirmButtonText: 'Continue'
        })
      } else {
        Swal.fire({
          title: 'Something went wrong',
          text: 'sit tight',
          type: 'error',
          confirmButtonText: 'Continue'
        })
        console.log(err);
      }
    })
}

function clearEditSection() {
  $('#edit-section-id').val();
  $('#edit-section-name').val('');
  $('#edit-section-description').val('');
  $('#edit-section-due-date').val('');
  showAddButton();
}

function showRepo() {
  $.ajax({
      method: 'GET',
      url: `https://api.github.com/user/repos`,
      headers: {
        Authorization: "Basic " + btoa('username' + ":" + localStorage.getItem('githubToken'))
      }
    })
    .done((response) => {
      $('#repo-list').empty();
      for (let i = 0; i < response.length; i++) {
        $('#repo-list').append(`
          <div class="repo-list-border">
            <a class="repo-list" onclick="appendRepoToTodo('${response[i].html_url}')" href="">${i+1}. ${response[i].name}</a><br>
          </div>
        `);
      }
    })
    .fail((err) => {
      console.log(err);
    })
}

function searchRepo() {
  event.preventDefault();
  $('#repo-list').empty();
  $.ajax({
      method: 'GET',
      url: `https://api.github.com/user/repos`,
      headers: {
        Authorization: "Basic " + btoa('username' + ":" + localStorage.getItem('githubToken'))
      }
    })
    .done((response) => {
      if ($('#search-repo').val().length == 0) {
        for (let i = 0; i < response.length; i++) {
          $('#repo-list').append(`
            <div class="repo-list-border">
              <a class="repo-list" onclick="appendRepoToTodo('${response[i].html_url}')" href="">${i+1}. ${response[i].name}</a><br>
            </div>
          `);
        }
      } else {
        for (let i = 0; i < response.length; i++) {
          if (response[i].name == $('#search-repo').val()) {
            $('#repo-list').append(`
              <div class="repo-list-border">
                <a class="repo-list" onclick="appendRepoToTodo('${response[i].html_url}')" href="">${i+1}. ${response[i].name}</a><br>
              </div>
            `);
          }
        }
      }
    })
    .fail((err) => {
      console.log(err);
    })
}
function appendRepoToTodo(link) {
  event.preventDefault();
  let description = $('#edit-section-description').val();
  description += `${link}`;
  $('#edit-section-description').val(description);
}
  showRepo();