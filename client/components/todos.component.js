const component_todo = (todo, i) => `
        <div class="col-sm-2 p-3">
            <h5>${todo.name}</h5>
            <p>Due Date: <b>${formatDate(todo.dueDate)}</b></p>
            ${(todo.status) ? `<img src="assets/svg/check.svg" height="25px" alt="icon name">` : ``}
        </div>
        <div class="col-sm-8 p-3">
            ${todo.htmlData}
        </div>
        <div class="col-sm-2 p-3 text-right">
            <button onclick="event_update(${i})" class="btn btn-sm btn-primary btn-block">Edit</button>
            <button data-toggle="modal" data-target="#delete-todo-${i}" class="btn btn-sm btn-danger btn-block">Delete</button>
            <button onclick="event_markAsDone(${i})" class="btn btn-sm ${(todo.status) ? "btn-danger" : "btn-success"} btn-block">${(todo.status) ? 'Mark as Incomplete' : 'Mark As Complete'}</button>
        </div>
        
        
        <div class="modal fade" id="delete-todo-${i}">
            <div class="modal-dialog">
                <div class="modal-content">
                
                    <div class="modal-header">
                    <h4 class="modal-title">Delete Confirmation</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                    Are you sure to Delete Todo: ${todo.name} ?
                    </div>
                    
                    <!-- Modal footer -->
                    <div class="modal-footer">
                    <button type="button" class="btn btn-danger" onclick="event_delete(${i})">Yes, Delete!</button>
                    </div>
                    
                </div>
            </div>
        </div>
`

function event_update(i) {
    window.todoAppState.editId = i
    let todo = window.todoAppState.todos[i] || {}
    render('form', () => {
        window.todoAppState.quill = new Quill('#quill-editor', {
            theme: 'snow',
        })
        window.todoAppState.quill.setContents(todo.quillData)
    })
}

function event_delete(i) {
    let todo = window.todoAppState.todos[i] || {}
    $(`#delete-todo-${i}`).modal('toggle')
    $(`#delete-todo-${i}`).on('hidden.bs.modal', () => {
        action_delete(todo._id)
            .then(() => action_listTodo())
            .then(res => {
                window.todoAppState.todos = res.data
                render('main')
                toast_success('Berhasil menghapus k!', `Udah dihapus nih`)
            })
            .catch(toast_error)
    })       
}

function event_markAsDone(i) {
    let todo = window.todoAppState.todos[i]  || {}
    let {status = null} = todo 
    if (status === null) return
    status = !status
    action_update({status}, todo._id)
        .then(() => action_listTodo())
        .then(res => {
            window.todoAppState.todos = res.data
            render('main')
            toast_success('Berhasil update!', `Todo ${todo.name} ${(status)? "selesai" : "batal selesai"}`)
        })
        .catch(toast_error)
}