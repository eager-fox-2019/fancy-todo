const page_todoMain = () => {
    let todos = window.todoAppState.todos 
    return `
        <div class="p-4">
            <div class="text-left pl-5">
                <button onClick="event_create()" class="btn btn-md btn-primary">New Todo</button>
            </div>
            <h3 class="h3 mb-3 font-weight-normal">${(todos.length > 0) ? "Your Todo list: " : 'Your Todo is currently empty'}</h3>

            <div class="row text-left p-5">
                ${window.todoAppState.todos.map((todo, i) => component_todo(todo, i)).join('')}
            </div> 
        </div>
    `
}

function event_create() {
    render('form', () => {
        window.todoAppState.quill = new Quill('#quill-editor', {
            theme: 'snow'
        })
    })
}