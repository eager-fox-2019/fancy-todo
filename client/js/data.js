function oneCard(cmd, target, oneTask) {
  let due_date = ''
  if (oneTask.due_date) {
    due_date = new Date(oneTask.due_date)
    due_date = due_date.toDateString()
  }
  const cardHtml = `
    <div class="card" id="${oneTask._id}-card">
      <div class="card-header row" id="${oneTask._id}-heading">
        <div id='${oneTask._id}-checkbox-group' class="col-1">
          <input id='${oneTask._id}-checkbox' onChange="checkBoxChange(this)" class='checkbox checkbox-round' type="checkbox">
        </div>
        <span class="col justify-content-center align-items-center mb-0">
          <button id='${oneTask._id}-title' class="col btn m-0 p-0" type="button" data-toggle="collapse" 
            data-target="#collapse-${oneTask._id}" aria-expanded="true" 
            aria-controls="collapse-${oneTask._id}">${oneTask.title}</button>
        </span>
        <div id='${oneTask._id}-due_date' class="col-4">
          <small>${due_date}</small>
        </div>
        <div class="col-1">
          <a class='justify-content-center' id="${oneTask._id}-edit-button" 
            onclick="showEditTask('${oneTask._id}')"><i type='button' class="fas fa-edit"></i></a>
          <a class='justify-content-center' id="${oneTask._id}-delete-button" 
            onclick="deleteTask('${oneTask._id}')"><i type='button' class="fas fa-trash-alt"></i></a>
        </div>
      </div>

      <div id="collapse-${oneTask._id}" class="collapse" aria-labelledby="${oneTask._id}-heading" data-parent="#all-task-accordion">
        <div class='card-body'>
          <h6 class='card-title'>Notes</h6>
          <div id='${oneTask._id}-note' class="card-text">${oneTask.note}</div>
        </div>
      </div>
    </div>
  `
  if (cmd == 'append') {
    $(target).append(cardHtml)
  } else if (cmd == 'update') {
    $(target).replaceWith(cardHtml)
  }

  // give checked
  if (oneTask.is_done == true) {
    $(`#${oneTask._id}-checkbox`).addClass('taskDone')    
    $(`#${oneTask._id}-checkbox`).attr('checked', 'checked')
    let title_val = $(`#${oneTask._id}-title`).text()
    $(`#${oneTask._id}-title`).html(`<strike>${title_val}</strike>`)
  }
}

function addNewTask() {
  event.preventDefault()
  let due_date = $('#add_task-due_date').val()
  let today_date
  if (due_date) {
    due_date = new Date(due_date)
    today_date = new Date()
  }

  if (due_date < today_date) {
    return showError('Due Date must be after today')
  } else {
    let newTask = {
      title: $('#add_task-title').val(),
      note: $('#add_task-note').val(),
      due_date: $('#add_task-due_date').val(),
    }
    
    $.ajax({
      url: `${url_server}/task`,
      method: 'POST',
      data: newTask,
      headers: {
        token: JSON.parse(localStorage.token).token
      }
    })
      .done((result) => {
        oneCard('append', '#all-task-accordion', result)
        updateCalendar()
        $('#add_task-title').val('')
        $('#add_task-note').val('')
        $('#add_task-due_date').val('')
      })
      .fail((err) => {
        checkError(err)
      })
  }  
  
}

function showEditTask(id) {
  // Change into form
  // title
  $(`#${id}-title`).attr('data-target', '')
  let titleCurrent = $.trim($(`#${id}-title`).text())
  $(`#${id}-title`).html(`
  <small>Title</small>
  <textarea type="text" class="form-control" id="${id}-edit_task-title" aria-describedby="title_edit" name='title'>${titleCurrent}</textarea>
  `)
  // note
  let noteCurrent = $.trim($(`#${id}-note`).text())
  $(`#${id}-note`).html(`
  <textarea class="form-control" id="${id}-edit_task-note" name='note' aria-label="With textarea">${noteCurrent}</textarea>
  <button class='btn btn-primary' onclick="submitEditTask('${id}')">Submit</button>
  <button class='btn btn-danger' onclick="updateOneTask('${id}')">Cancel</button>
  `)
  // date
  let datedata = $(`#${id}-due_date`).text()
  let due_dateCurrent = new Date(datedata)
  let year = due_dateCurrent.getFullYear()
  let month = due_dateCurrent.getMonth()
  let day = due_dateCurrent.getDay()

  if (month < 10) {
    month = '0' + String(month)
  }
  if (day < 10) {
    day = '0' + String(day)
  }
  due_dateCurrent = year + '-' + month + '-' + 19;
  $(`#${id}-due_date`).html(`
  <div class="form-group">
    <label for="edit_task-due_date" class="col-form-label"><small>Due Date</small></label>
    <div class="">
      <input class="form-control" type="date" value="${due_dateCurrent}" id="${id}-edit_task-due_date">
    </div>
  </div>
  `)

  // open collapse
  $(`#collapse-${id}`).addClass('show')

  // Remove edit button and Done
  $(`#${id}-edit-button`).remove()
  $(`#${id}-checkbox-group`).remove()
}

function submitEditTask(id) {
  let editTask = {
    title: $(`#${id}-edit_task-title`).val(),
    note: $(`#${id}-edit_task-note`).val(),
    due_date: $(`#${id}-edit_task-due_date`).val(),
  }
  $.ajax({
    url: `${url_server}/task/${id}`,
    method: 'PATCH',
    data: editTask,
    headers: {
      token: JSON.parse(localStorage.token).token
    }
  })
    .done((oneTask) => {      
      updateOneTask(id)
      if (editTask.due_date) {
        updateCalendar()
      }
    })
    .fail((err) => {
      showError(err)
    })
}

function updateOneTask(id) {
  $.ajax({
    url: `${url_server}/task/${id}`,
    method: 'GET',
    headers: {
      token: JSON.parse(localStorage.token).token
    }
  })
    .done((oneTask) => {
      $(`#${id}-card`).empty()
      oneCard('update', `#${id}-card`, oneTask)
    })
    .fail((err) => showError(err))
}

function deleteTask(id) {
  $.ajax({
    url: `${url_server}/task/${id}`,
    method: 'DELETE',
    headers: {
      token: JSON.parse(localStorage.token).token
    }
  })
    .done(() => {
      $(`#${id}-card`).remove()
    })
    .fail(err=> showError(err))
}

function getAllTask() {
  $.ajax({
    url: `${url_server}/task`,
    method: 'GET',
    headers: {
      token: JSON.parse(localStorage.token).token,
    }
  })
    .done((res) => {
      $('#all-task-accordion').empty()
      res.forEach((oneTask) => {
        oneCard('append', '#all-task-accordion', oneTask)
      })
      updateCalendar(res)
    })
    .fail((err) => showError(err))
}

function checkBoxChange(el) {
  let taskId = el.id.split('-')[0]
  let method
  if(el.checked) {
    method = 'PUT'    
  } else {
    method = 'DELETE'
  }
  $.ajax({
    url: `${url_server}/task/done/${taskId}`,
    method: method,
    headers: {
      token: JSON.parse(localStorage.token).token
    }
  })
    .then((result) => {
      updateOneTask(taskId)
    })
    .fail((err) => showError(err))
}

function filterCompleteTask() {
  console.log('masuk complete task'); 
  // $("#all-task-accordion .card").filter(':checked');
  $('input:checked')
}

function filterUncompleteTask() {
  
}