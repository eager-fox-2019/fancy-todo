var createFrom = 'Todo'

function createTodo(){
    let name = $('#todo_name').val()
    let description = $('#todo_description').val()
    let due_date = $('#todo_due_date').val()
    let owner = localStorage.getItem('id')
    let projectId = $('#todo_project_id').val()
    let members = []
    $.ajax({
        url: `${serverUrl}/todos`,
        method: 'POST',
        data: {
            name, description, due_date, owner, projectId, members
        },
        headers:{
            token : localStorage.getItem('token')
        }
    })
    .done((newTodo) => {
        Swal.fire({
            position: 'center',
            type: 'success',
            title: `${newTodo.name} success added`,
            showConfirmButton: false,
            timer: 1500
        })
        $('#loading').hide()
        clear_form()
        // console.log(createFrom)
        if (createFrom == 'Todo') showMyTodo(localStorage.getItem('id'))
        else read_projects()
    })
    .fail((jqXHR, textStatus)=>{
        $('#loading').hide()
        if (jqXHR.responseJSON.message === 'Unauthorized') {
            userLogout()
        } else {
            Swal.fire({
                type: 'error',
                title: `${jqXHR.responseJSON.message}`,
                animation: false,
                customClass: {
                    popup: 'animated tada'
                }
            })
        }
    })
}

function showMyTodo(owner){
    createFrom = 'Todo'
    $('#loading').show()
    $('#todo_form').hide()
    $('#mytodo_link').addClass('blue-grey darken-3')
    $('#allTodo_link').removeClass('blue-grey darken-3')
    $('#createTodo_link').removeClass('blue-grey darken-3')
    $.ajax({
        url:`${serverUrl}/todos/${owner}`,
        method: 'GET',
        headers:{
            token : localStorage.getItem('token')
        }
    })
    .done((myTodos) => {
        let newTodos = myTodos.filter(el => {
            if(el.projectId == 'null') return el
        })
        $('#todo_page').show()
        $('#search_form').show()    
        $('#listTodo').empty()
        $('#loading').hide()
        $('#countMyTodo').empty()
        $('#countMyTodo').addClass("new badge")
        $('#countMyTodo').append(`
            ${newTodos.length}
        `)

        if (newTodos.length === 0){
            $('#search_form').hide()
            $('#listTodo').append(`
            <div class="row">
                <div class="col s12 ">
                <div class="card blue-grey darken-1">
                    <div class="card-content white-text">
                    <span class="card-title">Empty Todo</span>
                </div>
                </div>
                </div>
            </div>
            `)
        }else{
            newTodos.forEach(element => {
                // console.log(element)
                $('#listTodo').append(`
                <li id="${element._id}">
                    <div class="collapsible-header"><i class="material-icons icon-star">event_note</i>${element.name}</div>
                    <div class="collapsible-body">
                    <div class="row">
                        <div class="col s12">
                            <div class="card blue-grey darken-1">
                                <div class="card-content white-text">
                                <span class="card-title">${element.name}</span>
                                <p>${element.description}</p>
                                Creator: <span> ${element.owner[0].name}</span><br>
                                Due Date:<span> ${element.due_date}</span><br>
                                </div>
                                <div class="card-action">
                                <a onclick="update_todo_link('${element._id}', 'updateTodo' )" href="#!">Update</a>
                                <a onclick="delete_todo('${element._id}', 'myTodo')" href="#!">Delete</a>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </li>              
                `)
            });            
        }
    })
    .fail((jqXHR, textStatus)=>{
        $('#loading').hide()
        if (jqXHR.responseJSON.message === 'Unauthorized') {
            userLogout()
        } else {
            Swal.fire({
                type: 'error',
                title: `${jqXHR.responseJSON.message}`,
                animation: false,
                customClass: {
                    popup: 'animated tada'
                }
            })
        }
    })
}

function delete_todo(id){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url:`${serverUrl}/todos/${id}`,
                method: 'DELETE',
                headers:{
                    token : localStorage.getItem('token')
                }
            })
            .done((deleted) => {
                Swal.fire({
                    position: 'center',
                    type: 'success',
                    title: `${deleted.name} success deleted`,
                    showConfirmButton: false,
                    timer: 1500
                })
                $("li").remove(`#${id}`);
                showMyTodo(localStorage.getItem('id'))
            })
            .fail((jqXHR, textStatus)=>{
                $('#loading').hide()
                if (jqXHR.responseJSON.message === 'Unauthorized') {
                    userLogout()
                } else {
                    Swal.fire({
                        type: 'error',
                        title: `${jqXHR.responseJSON.message}`,
                        animation: false,
                        customClass: {
                            popup: 'animated tada'
                        }
                    })
                }
            })
        }
    })
}


function delete_todoProject(id, projectId){
    $.ajax({
        url:`${serverUrl}/todos/${id}/${projectId}`,
        method: 'DELETE',
        headers:{
            token : localStorage.getItem('token')
        }
    })
    .done((deleted) => {
        Swal.fire({
            position: 'center',
            type: 'success',
            title: `${deleted.name} success deleted`,
            showConfirmButton: false,
            timer: 1500
        })
        $("div").remove(`#${id}`);

    })
    .fail((jqXHR, textStatus)=>{
        $('#loading').hide()
        if (jqXHR.responseJSON.message === 'Unauthorized') {
            userLogout()
        } else {
            Swal.fire({
                type: 'error',
                title: `${jqXHR.responseJSON.message}`,
                animation: false,
                customClass: {
                    popup: 'animated tada'
                }
            })
        }
    })
}

function update_todo_link(id, updateForm, projectId, projectName){
    // console.log(updateForm)
    if(updateForm == 'updateFromProject'){
        createFrom = updateForm
    }else{
        createFrom = 'Todo'
    }
    $('#todo_form').show()
    $('#todo_page').hide()
    $('#search_form').hide()
    $('#createTodo_link').removeClass('blue-grey darken-3')
    $('#mytodo_link').removeClass('blue-grey darken-3')
    $('#allTodo_link').removeClass('blue-grey darken-3')
    $('#create_project_link').removeClass('blue-grey darken-3')
    $('#update_todo_button').show()
    $('#create_todo_button').hide()
    $('#create_title').hide()
    $('#update_title').show()
    $('#todo_project_id_form').hide()
    $('#todo_from_project').hide()
    $('#project_form').hide()
    $('#listProject').empty()
    $('#search_project_form').hide()

    $.ajax({
        url:`${serverUrl}/todos/find/${id}`,
        method: 'GET',
        headers:{
            token : localStorage.getItem('token')
        }
    })
    .done((todo) => {
        $('#todo_name').val(`${todo.name}`).focus()
        $('#todo_due_date').val(`${todo.due_date}`).focus()
        $('#todo_description').val(`${todo.description}`).focus()
        $('#update_todo_button').on('click', () => {
            update_todo(`${id}`)
        })
    })
    .fail((jqXHR, textStatus)=>{
        $('#loading').hide()
        if (jqXHR.responseJSON.message === 'Unauthorized') {
            userLogout()
        } else {
            Swal.fire({
                type: 'error',
                title: `${jqXHR.responseJSON.message}`,
                animation: false,
                customClass: {
                    popup: 'animated tada'
                }
            })
        }
    })
}

function update_todo(id){
    let name = $('#todo_name').val()
    let description = $('#todo_description').val()
    let due_date = $('#todo_due_date').val()
    $.ajax({
        url:`${serverUrl}/todos/${id}`,
        method: 'PUT',
        data: {
            name, description, due_date
        },
        headers:{
            token : localStorage.getItem('token')
        }
    })
    .done((updated) => {
        Swal.fire({
            position: 'center',
            type: 'success',
            title: `${updated.name} success update`,
            showConfirmButton: false,
            timer: 1500
        })
        clear_form()
        if (createFrom == 'Todo') showMyTodo(localStorage.getItem('id'))
        else read_projects()

        // showCreateTodoFrom()
    })
    .fail((jqXHR, textStatus)=>{
        $('#loading').hide()
        if (jqXHR.responseJSON.message === 'Unauthorized') {
            userLogout()
        } else {
            Swal.fire({
                type: 'error',
                title: `${jqXHR.responseJSON.message}`,
                animation: false,
                customClass: {
                    popup: 'animated tada'
                }
            })
        }
    })
}

function clear_form(){
    $('#todo_name').val('')
    $('#todo_description').val('')
    $('#todo_due_date').val('')
}

function showCreateTodoFrom(){
    $('#todo_form').slideDown()
    $('#todo_page').hide()
    $('#search_form').hide()
    $('#createTodo_link').addClass('blue-grey darken-3')
    $('#mytodo_link').removeClass('blue-grey darken-3')
    $('#project_link').removeClass('blue-grey darken-3')
    $('#update_todo_button').hide()
    $('#create_todo_button').show()    
    $('#todo_name').val('')
    $('#todo_description').val('')
    $('#todo_due_date').val('')
    $('#project_form').hide()
    $('#create_project_link').removeClass('blue-grey darken-3')
    $('#listProject').empty()
    $('#search_project_form').hide()
    $('#create_title').show()
    $('#update_title').hide()
    $('#todo_from_project').hide()
    $('#todo_project_id_form').hide()
    $('#todo_project_id').val('null')
}