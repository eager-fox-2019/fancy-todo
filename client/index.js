// const server = 'http://localhost:3000/';
const server = 'http://34.83.113.112:3001/';
let currentSection = 0;
let currentProject;
// Google sign in
function renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 122,
    'height': 38,
    'longtitle': false,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}

function onSuccess(googleUser) {
  let profile = googleUser.getBasicProfile();
  console.log('Signing in with Google')
  console.log('Name: ' + profile.getName());
  console.log('Email: ' + profile.getEmail());
  let idtoken = googleUser.getAuthResponse().id_token;
  $.ajax({
    method: 'POST',
    url: `${server}users/google`,
    data: { idtoken },
  })
    .done(data => {
      localStorage.setItem('token', data.token);
      $('#outside').hide();
      $('#inside').css('display', 'flex');
      fetchTodos();
    })
    .fail((jqXHR, textStatus) => console.log(textStatus))
}

function onFailure(error) {
  console.log(error);
}

// Convert to JSON-like object for request body
function format(form) {
  let out = {};
  $(form).serializeArray().forEach(x => out[x.name] = x.value);
  return out
}

// Converts todo status of false/true to 'Not Complete'/'Complete' + colors
function isComplete(status) {
  return status ?
  '<span style="color: #7cbcf8;">Complete</span>' :
  '<span style="color: #e2a35a;">Not Complete</span>'
}

function shortenDate(d) {
  return d.split('T')[0]
}

function getHeaders() {
  return { Authorization: localStorage.getItem('token') }
}

function fetchTodos() {
  $.ajax({
    method: 'GET',
    url: `${server}todos`,
    headers: getHeaders(),
  })
    .done(data => {
      console.log('fetched todos from server', data)
      for(let item of data) {
        appendTodo(item)
      }
    })
}

function fetchProjects() {
  $.ajax({
    method: 'GET',
    url: `${server}projects`,
    headers: getHeaders(),
  })
    .done(data => {
      console.log('fetched projects from server', data)
      for(let item of data) {
        appendProject(item)
      }
    })
}

function appendTodo(obj) {
  $('#list').append(
    `<div id="${obj._id}" class="todo">
      <div class="todocontent"><p class="todotitle">${obj.title}</p>${obj.description}<br>
      <div style="margin-top: 0.8rem; font-size: 0.8rem;">
      <div class="todostatus">Status: ${isComplete(obj.status)}</div>Due Date: ${shortenDate(obj.dueDate)}</div>
      </div>
      <div style="text-align: right;">
      <button class="button3 donebutton" onclick="doneTodo('${obj._id}')">Done</button><br>
      <button class="button3 editbutton" onclick="editTodo('${obj._id}')">Edit</button><br>
      <button class="button3 deletebutton" onclick="deleteTodo('${obj._id}')">Delete</button>
      </div>
    </div>`)
  // Store todo data in DOM
  $(`#${obj._id}`).data({
    title: obj.title,
    description: obj.description,
    dueDate: shortenDate(obj.dueDate),
    status: obj.status,
  })
}

function appendProjectTodo(obj) {
  $('#list3').append(
    `<div id="${obj._id}" class="todo">
      <div class="todocontent"><p class="todotitle">${obj.title}</p>${obj.description}<br>
      <div style="margin-top: 0.8rem; font-size: 0.8rem;">
      <div class="todostatus">Status: ${isComplete(obj.status)}</div>Due Date: ${shortenDate(obj.dueDate)}</div>
      </div>
      <div style="text-align: right;">
      <button class="button3 donebutton" onclick="doneTodo2('${obj._id}')">Done</button><br>
      <button class="button3 editbutton" onclick="editTodo2('${obj._id}')">Edit</button><br>
      <button class="button3 deletebutton" onclick="deleteTodo2('${obj._id}')">Delete</button>
      </div>
    </div>`)
  // Store todo data in DOM
  $(`#${obj._id}`).data({
    title: obj.title,
    description: obj.description,
    dueDate: shortenDate(obj.dueDate),
    status: obj.status,
  })
}

function appendProject(obj) {
  let memberCount = obj.members.length
  let todoCount = obj.todos.length
  $('#list2').append(
    `<div class="project" onclick="projectDetail('${obj._id}')">
    <div class="projecttitle">${obj.name}</div>
    <div style="margin-bottom: 0.5rem;">Created by: ${obj.creator.email}</div>
    <div>${memberCount} members&nbsp;&nbsp;&nbsp; ${todoCount} todos</div>
    </div>`)
}
// Change todo status to complete
function doneTodo(id) {
  $.ajax({
    method: 'PATCH',
    url: `${server}todos/${id}`,
    data: { status: true },
    headers: getHeaders(),
  })
    .done(() => {
      $(`#${id}`).data({ status: true })
      // Replace 'not complete' span with 'complete' span in raw html
      let newHtml = $(`#${id}`).html().replace(
        '<span style="color: #e2a35a;">Not Complete</span>',
        '<span style="color: #7cbcf8;">Complete</span>'
      )
      $(`#${id}`).html(newHtml)
    })
    .fail((jqXHR, textStatus) => console.log(textStatus))
}
// same as above, but for todos in project
function doneTodo2(id) {
  $.ajax({
    method: 'PATCH',
    url: `${server}projects/${currentProject}/${id}`,
    data: { status: true },
    headers: getHeaders(),
  })
    .done(() => {
      $(`#${id}`).data({ status: true })
      let newHtml = $(`#${id}`).html().replace(
        '<span style="color: #e2a35a;">Not Complete</span>',
        '<span style="color: #7cbcf8;">Complete</span>'
      )
      $(`#${id}`).html(newHtml)
    })
    .fail((jqXHR, textStatus) => console.log(textStatus))
}

function deleteTodo(id) {
  let yesButton = $('#deleteyes')

  $('#deleteconfirm').css('display', 'flex')
  yesButton.off()
  yesButton.on('click', () => {
    $.ajax({
      method: 'DELETE',
      url: `${server}todos/${id}`,
      headers: getHeaders(),
    })
      .done(() => $(`#${id}`).remove())
      .fail((jqXHR, textStatus) => console.log(textStatus))
      .always(closeModal())
  })
}

// For todo in project
function deleteTodo2(id) {
  let yesButton = $('#deleteyes')

  $('#deleteconfirm').css('display', 'flex')
  yesButton.off()
  yesButton.on('click', () => {
    $.ajax({
      method: 'DELETE',
      url: `${server}projects/${currentProject}/${id}`,
      headers: getHeaders(),
    })
      .done(() => $(`#${id}`).remove())
      .fail((jqXHR, textStatus) => console.log(textStatus))
      .always(closeModal())
  })
}

function editTodo(id) {
  let td = $(`#${id}`).data() // Get stored data of the todo

  $('#editconfirm').css('display', 'flex')
  $('#edittitle').val(td.title)
  $('#editdescription').val(td.description)
  $('#editdate').val(td.dueDate)
  $('#edit-form').off('submit') // Remove previous event listener
  $('#edit-form').on('submit', function(event) {
    event.preventDefault()
    let data = format(this)
    $.ajax({
      method: 'PATCH',
      url: `${server}todos/${id}`,
      data,
      headers: getHeaders(),
    })
      .done(data => {
        console.log(data)
        $('#list').empty()
        fetchTodos()
      })
      .fail((jqXHR, textStatus) => console.log(textStatus))
      .always(closeModal())
  })
}

// For todo in project
function editTodo2(id) {
  let td = $(`#${id}`).data() // Get stored data of the todo

  $('#editconfirm').css('display', 'flex')
  $('#edittitle').val(td.title)
  $('#editdescription').val(td.description)
  $('#editdate').val(td.dueDate)
  $('#edit-form').off('submit') // Remove previous event listener
  $('#edit-form').on('submit', function(event) {
    event.preventDefault()
    let data = format(this)
    $.ajax({
      method: 'PATCH',
      url: `${server}projects/${currentProject}/${id}`,
      data,
      headers: getHeaders(),
    })
      .done(data => {
        console.log(data)
        $('#list3').empty()
        for(let todo of data.todos) {
          appendProjectTodo(todo)
        }
      })
      .fail((jqXHR, textStatus) => console.log(textStatus))
      .always(closeModal())
  })
}

function closeModal() {
  $('.modal').hide()
}

function projectDetail(id) {
  currentProject = id;
  currentSection = 2;
  $('#projects-section').hide();
  $('#project-section').show();
  $('#list3').empty();
  $.ajax({
    method: 'GET',
    url: `${server}projects/${id}`,
    headers: getHeaders(),
  })
    .done(data => {
      fillProject(data)
    })
}

function fillProject(data) {
  let memberlist = data.members.map(member => member.email).join(', ')
  $('#project-info').html(
    `<br><div style="margin-bottom: 0.8rem" class="projecttitle">Project name: ${data.name}</div>
    <div style="margin-bottom: 0.5rem;">Created by: ${data.creator.email}</div>
    <div>Members: ${memberlist}</div>`
  )
  for(let todo of data.todos) {
    appendProjectTodo(todo)
  }
}

function section(s) {
  currentProject = null;
  $('#project-section').hide();

  if(s !== currentSection) {
    $('#list').empty();
    $('#list2').empty()
    if(s === 0) {
      currentSection = 0;
      $('#my-todos').css('text-decoration', 'underline')
      $('#my-projects').css('text-decoration', 'none')
      $('#todos-section').show()
      $('#projects-section').hide()
      fetchTodos()
    } else {
      currentSection = 1;
      $('#my-todos').css('text-decoration', 'none');
      $('#my-projects').css('text-decoration', 'underline');
      $('#todos-section').hide();
      $('#projects-section').show();
      fetchProjects();
    }
  } else return
}

function logout() {
  localStorage.clear();
  currentProject = null;
  $('#project-section').hide();
  $('#list').empty();
  $('#list2').empty();
  $('#inside').hide();
  $('link[href="./css/light.css"]').remove(); // defaults to dark theme
  $('#outside').show();
  if(gapi.auth2) {
    gapi.auth2.getAuthInstance()
      .signOut()
      .then(() => console.log('User signed out.'));
  }
}

$(document).ready(() => {
  // Auto login
  if (localStorage.getItem("token")) {
    $.ajax({
      method: 'POST',
      url: `${server}users/check`,
      headers: getHeaders(),
    })
      .done(() => {
        $('#outside').hide();
        $('#inside').css('display', 'flex');
        fetchTodos();
      })
      .fail((jqXHR, textStatus) => console.log(textStatus))
  }

  let lightMode = false;
  $('#switch-theme').on('click', function() {
    if(!lightMode) {
      $('link[rel="stylesheet"]').after('<link rel="stylesheet" type="text/css" href="./css/light.css">');
      lightMode = true;
    } else {
      $('link[href="./css/light.css"]').remove();
      lightMode = false;
    }
  })
  // Submit register form
  $('#register-form').on('submit', function(event) {
    event.preventDefault();
    let data = format(this);
    $.ajax({
      method: 'POST',
      url: `${server}users/register`,
      data,
    })
      .done(() => {
        $(this)[0].reset();
        $('#front-forms').hide();
        $('#reg-message').show();
      })
      .fail((jqXHR, textStatus) => {
        console.log(textStatus);
        $(this).children('button').html('<span style="color: #ff3a3a;">FAILED</span>');
        setTimeout(() => {
          $(this).children('button').html('Register');
        }, 2200);
      })
  });
  // Button to return home after registering new user
  $('#ok1').on('click', function() {
    $('#reg-message').hide()
    $('#front-forms').show()
  })
  // Submit login form
  $('#login-form').on('submit', function(event) {
    event.preventDefault();
    let data = format(this);
    $.ajax({
      method: 'POST',
      url: `${server}users/login`,
      data,
    })
      .done(data => {
        localStorage.setItem('token', data.token); // Save token to local storage
        $(this)[0].reset();
        $('#outside').hide();
        $('#inside').css('display', 'flex');
        fetchTodos();
      })
      .fail((jqXHR, textStatus) => {
        console.log(textStatus)
        $(this).children('button').html('<span style="color: #ff3a3a;">FAILED</span>')
        setTimeout(() => {
          $(this).children('button').html('Login')
        }, 1600);
      })
  });
  // Show create form
  $('#newtodo-button').on('click', function() {
    $('#newtodo-form').slideToggle()
  })
  // Submit new todo
  $('#newtodo-form').on('submit', function(event) {
    event.preventDefault()
    let data = format(this)
    $.ajax({
      method: 'POST',
      url: `${server}todos`,
      data,
      headers: getHeaders(),
    })
    .done(data => {
      $('#list').empty()
      fetchTodos()
    })
    .fail((jqXHR, textStatus) => console.log(textStatus))
    .always(() => {
      $(this)[0].reset();
      $('#newtodo-form').slideToggle()
    })
  })
  // O for all, 1 for not complete, 2 for complete
  let filterState = 0
  // No filter
  $('#filteroff').on('click', function() {
    if(filterState === 0) return;
    $('.filterbutton').removeClass('filterselect')
    $(this).toggleClass('filterselect')

    $('#list').children().show()
    filterState = 0;
  })
  // Incomplete todos only
  $('#filter1').on('click', function() {
    if(filterState === 1) return;
    $('.filterbutton').removeClass('filterselect')
    $(this).toggleClass('filterselect')

    let arr = $('#list').children()
    for(let i = 0; i < arr.length; i ++) {
      if(arr.eq(i).data('status')) { // .eq gets jquery object from single element of group of elements
        arr.eq(i).hide()
      } else {
        arr.eq(i).show()
      }
    }
    filterState = 1;
  })
  // Complete todos only
  $('#filter2').on('click', function() {
    if(filterState === 2) return;
    $('.filterbutton').removeClass('filterselect')
    $(this).toggleClass('filterselect')

    let arr = $('#list').children()
    for(let i = 0; i < arr.length; i ++) {
      if(arr.eq(i).data('status')) {
        arr.eq(i).show()
      } else {
        arr.eq(i).hide()
      }
    }
    filterState = 2;
  })

  $('#newproject-button').on('click', function() {
    $('#newproject-form').slideToggle()
  })


  $('#newproject-form').on('submit', function(event) {
    event.preventDefault()
    let data = format(this)
    $.ajax({
      method: 'POST',
      url: `${server}projects`,
      data,
      headers: getHeaders(),
    })
    .done(data => {
      $('#list2').empty()
      fetchProjects()
    })
    .fail((jqXHR, textStatus) => console.log(textStatus))
    .always(() => {
      $(this)[0].reset();
      $('#newproject-form').slideToggle()
    })
  })

  $('#newtodo2-button').on('click', function() {
    $('#addmember-form').hide()
    $('#removemember-form').hide()
    $('#newtodo2-form').slideToggle()
  })
  
  $('#addmember-button').on('click', function() {
    $('#newtodo2-form').hide()
    $('#removemember-form').hide()
    $('#addmember-form').slideToggle()
  })

  $('#removemember-button').on('click', function() {
    $('#newtodo2-form').hide()
    $('#addmember-form').hide()
    $('#removemember-form').slideToggle()
  })
  // Submit new todo
  $('#newtodo2-form').on('submit', function(event) {
    event.preventDefault()
    let data = format(this);
    $.ajax({
      method: 'POST',
      url: `${server}projects/${currentProject}`,
      data,
      headers: getHeaders(),
    })
      .done(data => {
        $('#list3').empty()
        for(let todo of data.todos) {
          appendProjectTodo(todo)
        }
      })
      .fail((jqXHR, textStatus) => console.log(textStatus))
      .always(() => {
        $(this)[0].reset();
        $('#newtodo2-form').slideToggle()
      })
  })

  $('#addmember-form').on('submit', function(event) {
    event.preventDefault()
    let data = format(this);
    $.ajax({
      method: 'POST',
      url: `${server}projects/${currentProject}/addmember`,
      data,
      headers: getHeaders(),
    })
      .done(data => {
        $('#list3').empty()
        fillProject(data)
      })
      .fail((jqXHR, textStatus) => console.log(textStatus))
      .always(() => {
        $(this)[0].reset();
        $(this).slideToggle()
      })
  })

  $('#removemember-form').on('submit', function(event) {
    event.preventDefault()
    let data = format(this);
    $.ajax({
      method: 'POST',
      url: `${server}projects/${currentProject}/removemember`,
      data,
      headers: getHeaders(),
    })
      .done(data => {
        $('#list3').empty()
        fillProject(data)
      })
      .fail((jqXHR, textStatus) => console.log(textStatus))
      .always(() => {
        $(this)[0].reset();
        $(this).slideToggle()
      })
  })
});