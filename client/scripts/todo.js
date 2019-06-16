function addTask() {
  $.ajax({
    method: `POST`,
    url: `${srvUrl}/api/todo/create`,
    headers: { token: localStorage.getItem('token') },
    data: {
      name: $("#task-name").val(),
      description: $("#task-description").val()
    },
    dataType: `json`
  })
  .done(task => {
    listTask('Not Completed')
  })
  .fail(err => {
    $('#message').append(`
      <div class="alert alert-warning text-center" role="alert">
        ${err.responseJSON.message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `)
  })
}

function listTask(status) {
  $.ajax({
    method: `GET`,
    url: `${srvUrl}/api/todo/list?status=${status}`,
    headers: { token: localStorage.getItem('token') }
  })
  .done(tasks => {
    let listId = '#list-task-not-completed'
    let statusBtn = 'Completed'
    let btnColor = 'success'

    if (status === 'Completed') {
      listId = '#list-task-completed'
      statusBtn = 'Not Completed'
      btnColor = 'secondary'
    }

    $(`${listId}`).empty()
    tasks.forEach(task => {
      $(`${listId}`).append(`
        <div class="card mr-1 mb-4 ">
          <div class="card-body">
            <h5 class="card-title">${task.name}</h5>
            <p class="card-text">${task.description}</p>
            <div class="clearfix">
              <a href="#" class="btn-sm btn-danger float-right" onclick="remove('${task._id}')">Remove</a>
              <a href="#" class="btn-sm btn-${btnColor} float-right mr-1" onclick="updateStatus('${task._id}', '${statusBtn}')">${statusBtn}</a>
            </div>
          </div>
        </div>
      `)
    })
  })
  .fail(err => {
    $('#message').append(`
      <div class="alert alert-warning text-center" role="alert">
        ${err.responseJSON.message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `)
  })
}

function updateStatus(taskId, status) {
  $.ajax({
    method: `POST`,
    url: `${srvUrl}/api/todo/update/${taskId}?status=${status}`,
    headers: { token: localStorage.getItem('token') }
  })
  .done(task => { 
    listTask('Not Completed')
    listTask('Completed') 
  })
  .fail(err => {
    $('#message').append(`
      <div class="alert alert-warning text-center" role="alert">
        ${err.responseJSON.message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `)
  })
}

function remove(taskId) {
  $.ajax({
    method: 'DELETE',
    url: `${srvUrl}/api/todo/delete/${taskId}`,
    headers: { token : localStorage.getItem('token') }
  })
  .done(() => {
    listTask('Completed')
    listTask('Not Completed')
  })
  .fail(err => {
    $('#message').append(`
      <div class="alert alert-warning text-center" role="alert">
        ${err.responseJSON.message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `)
  })
}