
// --------- todo form ---------------
function addTodoForm(){
  $('#addTodoForm').show();
  $('#showAddTodoFormButton').hide();
}

function hideAddTodoForm(){
  $('#addTodoForm').hide();
  $('#showAddTodoFormButton').show();
}
//------------ populate todo list ----------
function addTodoButton(){
  let htmlAddTodoButton=`
  <button id="showAddTodoFormButton" onclick="addTodoForm()" class="button" type="submit">add Todo</button>`
  $('#theTodoList').append(htmlAddTodoButton)
}

function populateTodo(){
  $('#theTodoList').empty()
  $('#theTodoList').append("Loading todo list...")
  $.ajax({
    method: "GET",
    url: `${baseUrl}/todos`,
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
  .done(todoList => {
    $('#theTodoList').empty()
    addTodoButton()

    todoList.sort(function(a,b){
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    todoList.forEach(todo => {
      appendTodo(todo)
    })
    $(`.loading`).hide()
  })
  .fail(err => {
    console.log(err)
  })
}



// -------------- appending todo ---------
function getDateInFormat(date){
  let yyyy = new Date(date).getFullYear()
  let mm = new Date(date).getMonth()+1
  if (mm<10) mm = '0'+mm
  let dd = new Date(date).getDate()
  if (dd<10) dd = '0'+dd
  let dateYYYYMMDD = yyyy+'-'+mm+'-'+dd
  return dateYYYYMMDD
}

function appendTodoEditForm(todo){
  let htmlTodoEditForm = `
  <div id="editTodoDiv${todo._id}" class="editTodoForm">
    <form id="editTodo${todo._id}" class="form1" action="/" method="PATCH" autocomplete="off">
      <div class="form1title">Edit a Todo</div>
      <input class="input1" type="text" value="${todo.name}" name="name">
      <br>
      <input class="input1" type="text" value="${todo.description}" name="description">
      <br>`

  let htmlStatusRadioButtons = `<label>Status:</label><br>`
  if(todo.status == "done"){
    htmlStatusRadioButtons +=
    `<input class="" type="radio" name="status" value="not done"> Not done<br>
      <input class="" type="radio" name="status" value="in progress"> In progress<br>
      <input class="" type="radio" name="status" value="done" checked> Done<br>`

  } else if (todo.status == "in progress"){
    htmlStatusRadioButtons +=
    `<input class="" type="radio" name="status" value="not done"> Not done<br>
      <input class="" type="radio" name="status" value="in progress" checked> In progress<br>
      <input class="" type="radio" name="status" value="done"> Done<br>`

  } else { //todo.status == 'not done'
    htmlStatusRadioButtons +=
    `<input class="" type="radio" name="status" value="not done" checked> Not done<br>
      <input class="" type="radio" name="status" value="in progress"> In progress<br>
      <input class="" type="radio" name="status" value="done"> Done<br>`

  }
      
  htmlTodoEditForm += htmlStatusRadioButtons

  let dateYYYYMMDD = getDateInFormat(todo.dueDate)
  
  htmlTodoEditForm +=
  `<input class="input1" type="Date" value="${dateYYYYMMDD}" name="dueDate">
      <br>
      <a href="#" onclick="hideEditTodoForm('${todo._id}')">cancel edit</a> | 
      <a href="#" onclick="editTodo('${todo.owner},${todo._id}')">update todo</a>
    </form>
  </div>`
  $('#theTodoList').append(htmlTodoEditForm)
  //appendUploadImageForm(todo)
}

function appendTodo(todo){
  let htmlTodo = `
  <div id="nonEditTodoDiv${todo._id}" class="nonEditTodoDiv">
    <ul>
      <li><label>Name:</label> ${todo.name}</li>
      <li><label>Description:</label> ${todo.description}</li>
      <li><label>Status:</label> ${todo.status}</li>
      <li><label>Due Date:</label> ${new Date(todo.dueDate).toDateString()}</li>
      <li><a href="#" onclick="showEditTodoForm('${todo._id}')">edit</a> | 
      <a href="#" onclick="delTodo('${todo.owner},${todo._id}')">delete</a></li>
      <li><label class="loading">loading..</label><a class="read" href="#" onclick="readTodo('${todo.owner},${todo._id}')">Read the Todo</a></li>
    </ul>
  </div>
  `
  $('#theTodoList').append(htmlTodo)
  appendTodoEditForm(todo)
  $('.editTodoForm').hide()
}

function readTodo(inputStr){
  let [userId, todoId] = inputStr.split(',')
  $(`.read`).hide()
  $(`.loading`).show()


  $.ajax({
      method: "GET",
      url: `${baseUrl}/todos/read/${userId}/${todoId}`,
      headers: {
        access_token: localStorage.getItem('access_token')
      }
    })
    .done(result => {
      let [api_key, readStr] = result

      $.speech({
            key: api_key,
            src: readStr,
            hl: 'en-us',
            r: 0, 
            c: 'mp3',
            f: '44khz_16bit_stereo',
            ssml: false
        });

    $(`.read`).show()
    $(`.loading`).hide()

    })
    .fail(err => {
      console.log(err)
    })
}

// ---------- editing a todo -------------
function showEditTodoForm(todoId){
  $('.editTodoForm').hide() //hide all other edit todo forms
  $('.nonEditTodoDiv').show()//show all todos
  $(`#nonEditTodoDiv${todoId}`).hide() //and hide the todo itself
  $(`#editTodoDiv${todoId}`).show() //then open the todo's edit form
}

function hideEditTodoForm(todoId){
  $(`#editTodoDiv${todoId}`).hide()
  $(`#nonEditTodoDiv${todoId}`).show()
}

function editTodo(strInput){
  let [userId, todoId] = strInput.split(',')

  let name = $(`#editTodo${todoId} input[name='name']`).val()
  let description = $(`#editTodo${todoId} input[name='description']`).val()
  let status = $(`#editTodo${todoId} input[name='status']:checked`).val()
  let dueDate = $(`#editTodo${todoId} input[name='dueDate']`).val()
  // console.log("editform input values:")
  // console.log(name,description,status,dueDate)

  $.ajax({
      method: "PATCH",
      url: `${baseUrl}/todos/update/${userId}/${todoId}`,
      headers: {
        access_token: localStorage.getItem('access_token')
      },
      data: {
        name: name,
        description: description,
        status: status,
        dueDate: dueDate
      }
    })
    .done(result => {
      console.log("updated a todo", result)
      populateTodo()
    })
    .fail(err => {
      console.log(err)
    })

}

// --------- deleting a todo -----------
function delTodo(strInput){
  let [userId, todoId] = strInput.split(',')
  $.ajax({
      method: "DELETE",
      url: `${baseUrl}/todos/del/${userId}/${todoId}`,
      headers: {
        access_token: localStorage.getItem('access_token')
      }
    })
    .done(result => {
      console.log("deleted a todo")
      populateTodo()
    })
    .fail(err => {
      console.log(err)
    })
}