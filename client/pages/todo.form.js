const page_todoForm = (i) => {
    let edit = window.todoAppState.editId
    let todos = window.todoAppState.todos  
    let { dueDate = null, name = ''} = todos[edit] || {}
    let title = (edit && edit != null) ? 'Edit Todo' : 'Create Todo'

    return `
        <div class="text-left pl-5 pt-4">
            <button onClick="render('main')" class="btn btn-md btn-warning">Back</button>
        </div>
        <form class="form-todo mt-5 pl-5 pr-5">
            <h2 class="h2 mb-5 font-weight-normal">${title}</h2>
            
            <div class="text-left">
                <label >Todo Name</label>
            </div>
            <label for="inputTodoName" class="sr-only">Todo Name</label>
            <input type="text" value="${name}" id="inputTodoName" class="form-control mb-2" placeholder="Todo Name" required autofocus>
            
            <div class="text-left">
                <label >Due Date</label>
            </div>
            <label for="inputDueDate" class="sr-only">Due Date</label>
            <input type="date" value="${dueDate}" min="${formatDate(new Date())}" id="inputDueDate" class="form-control mb-2" placeholder="Due Date" required>
            
            <div class="text-left">
                <label >Todo Data</label>
            </div>
            <label for="quill-editor" class="sr-only">Quill Editor</label>
            <div id="quill-editor" class="mb-2"></div>
            <button onclick="event_submitTodo()" class="btn btn-sm btn-primary btn-block" type="submit">Submit Todo</button>
        </form>
    `
}

function event_submitTodo() {
    event.preventDefault()
    let name = $("#inputTodoName").val()
    let dueDate = $("#inputDueDate").val()
    let quillData = window.todoAppState.quill.getContents()
    let textData = window.todoAppState.quill.getText()

    if (name == ''){
        toast_error('judul harus ada')
        return
    }

    if (dueDate == ''){
        toast_error('due date harus ada')
        return
    }

    action_postTodo({name, dueDate, quillData, textData})
        .then(() => action_listTodo())
        .then(res => {
            let todos = res.data
            window.todoAppState.todos = todos
            render('main')
        })
        .catch(toast_error)
}