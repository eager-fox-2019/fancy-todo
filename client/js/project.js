function read_projects(){
    $('#listTodo').empty()
    $('#search_form').hide()
    $('#todo_form').hide()
    $('#project_link').addClass('blue-grey darken-3')
    $('#mytodo_link').removeClass('blue-grey darken-3')
    $('#createTodo_link').removeClass('blue-grey darken-3')
    $('#create_project_link').removeClass('blue-grey darken-3')
    $('#project_form').hide()
    $.ajax({
        url: `${serverUrl}/projects/${localStorage.getItem('id')}`,
        method: 'GET',
        headers:{
            token : localStorage.getItem('token')
        }
    })
    .done((projects) => {
        $('#project_page').show()

        $('#listProject').empty()
        $('#loading').hide()
        // $('#countProjects').empty()
        // $('#countProjects').addClass("new badge")
        // $('#countProjects').append(`
        //     ${projects.length}
        // `)
        if (projects.length == 0){
            $('#search_project_form').hide()
            $('#listProject').append(`
                <div class="row">
                    <div class="col s12 ">
                    <div class="card blue-grey darken-1">
                        <div class="card-content white-text">
                        <span class="card-title">Empty Project</span>
                    </div>
                    </div>
                    </div>
                </div>
            `)
        }else{
            $('#search_project_form').show()
            projects.forEach(element => {
                $('#listProject').append(`
                <li>
                    <div id="projectName" class="collapsible-header"><i class="material-icons icon-star">group</i>${element.name}</div>
                    <div id="member" class="collapsible-body">
                        <div class="row">
                            <div class="col s12">
                                <ul class="tabs">
                                <li class="tab col s3 l3"><a onclick="createTodoFromProject('${element._id}', '${element.name}', '${element.member}')" href="#">Create Todo</a></li>
                                <li class="tab col s3 l3"><a onclick="membersOfProject('${element._id}')" href="#">Member</a></li>
                                <li class="tab col s3 l2 actived"><a onclick="todossOfProject('${element._id}')" class="active" href="#">Todo</a></li>
                                <li class="tab col s3 l4"><a onclick="delete_project_link('${element._id}')" href="#">Delete Project</a></li>
                                </ul>                
                            </div>
                        </div>
                        <div id="membersOfProject${element._id}">

                        </div>
                        
                        <div id="todossOfProject${element._id}">

                        </div>
                    </div>
                </li>              
                `)
                element.member.forEach(el => {
                    if (el._id == element.owner._id){
                        $(`#membersOfProject${element._id}`).append(`
                            <ul class="collection">
                                <li class="collection-item avatar">
                                <i class="material-icons circle black">lock</i>
                                <span class="title"> ${el.name}</span>
                                </li>
                            </ul>
                        `)                    
                    }else{
                        $(`#membersOfProject${element._id}`).append(`
                            <ul class="collection">
                                <li class="collection-item avatar">
                                <i class="material-icons circle green">face</i>
                                <span class="title"> ${el.name}</span>
                                </li>
                            </ul>
                        `)                    
                    }
                })
                todossOfProject(`${element._id}`)
            });
        }
    })
    .fail((jqXHR, textStatus)=>{
        $('#loading').hide()
        Swal.fire({
            type: 'error',
            title: `${jqXHR.responseJSON.message}`,
            animation: false,
            customClass: {
                popup: 'animated tada'
            }
        })
    })
}

function membersOfProject(projectId){
    $(`#membersOfProject${projectId}`).show()
    $(`#todossOfProject${projectId}`).hide()
}

function todossOfProject(projectId){
    event.preventDefault()
    $(`#todossOfProject${projectId}`).empty()
    $(`#membersOfProject${projectId}`).hide()
    $.ajax({
        url:`${serverUrl}/todos`,
        method: 'GET',
        headers:{
            token : localStorage.getItem('token')
        }
    })
    .done((allTodos) => {
        let newTodos = allTodos.filter(el => {
             if(el.projectId == projectId) return el
        })
        $(`#todossOfProject${projectId}`).fadeIn(1000)
        if(newTodos.length == 0){
            $(`#todossOfProject${projectId}`).append(`
                <div class="row">
                    <div class="col s12 ">
                    <div class="card blue-grey darken-1">
                        <div class="card-content white-text">
                        <span class="card-title">Empty Todo</span>
                        <p>Please make a todo from this page</p>
                    </div>
                    </div>
                    </div>
                </div>
            `)
        }else{
            newTodos.forEach(element => {
                // console.log(element)
                $(`#todossOfProject${projectId}`).append(`
                    <div class="row" id="${element._id}">
                        <div class="col s12 ">
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                            <span class="card-title">${element.name}</span>
                            <p>${element.description}</p>
                            Creator: <span> ${element.owner[0].name}</span><br>
                            Due Date:<span> ${element.due_date}</span><br>
                            </div>
                            <div class="card-action">
                            <a onclick="update_todo_link('${element._id}', 'updateFromProject', '${projectId}', '${element.name}')" href="#!">Update</a>
                            <a onclick="delete_todoProject('${element._id}', '${projectId}')" href="#!">Delete</a>
                        </div>
                        </div>
                        </div>
                    </div>
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

function createTodoFromProject(projectId, projectName, projectMembers){
    $(`#todossOfProject${projectId}`).hide()
    $(`#membersOfProject${projectId}`).hide()
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
    $('#todo_project_id_form').hide()
    $('#todo_from_project').show()
    $('#todo_project_name').val(projectName)
    $('#todo_project_id').val(projectId)
    createFrom = 'project'
}

function addMember(memberId, projectId, memberName){
    $.ajax({
        url: `${serverUrl}/projects/addmember/${projectId}`,
        method: 'PUT',
        data:{
            member: memberId,
        },
        headers:{
            token : localStorage.getItem('token')
        }
    })
    .done((newProject) => {
        $(`#add_member_done${memberId}`).show()
        $(`#add_member_icon${memberId}`).hide()
        M.toast({html: `${memberName} added to project`})
    })
    .fail((jqXHR, textStatus)=>{
        $('#loading').hide()
        Swal.fire({
            type: 'error',
            title: `${jqXHR.responseJSON.message}`,
            animation: false,
            customClass: {
                popup: 'animated tada'
            }
        })
    })
}

function create_project(){
    let project_name = $('#project_name').val()
    let project_member = localStorage.getItem('id')
    let owner = localStorage.getItem('id')
    $.ajax({
        url: `${serverUrl}/projects`,
        method: 'POST',
        data:{
            name: project_name,
            member: project_member,
            owner,
        },
        headers:{
            token : localStorage.getItem('token')
        }
    })
    .done((newProject) => {
        $('#project_name_input').hide()
        $('#next_project_button').hide()
        $('#project_form_title').hide()
        $('#member_input').show()
        getMember(newProject._id)
        $('#member_input').show()
        $('#done_project_button').show()
    })
    .fail((jqXHR, textStatus)=>{
        $('#loading').hide()
        Swal.fire({
            type: 'error',
            title: `${jqXHR.responseJSON.message}`,
            animation: false,
            customClass: {
                popup: 'animated tada'
            }
        })
    })
}

function delete_project_link(id){
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
                url: `${serverUrl}/projects/${id}`,
                method: 'DELETE',
                headers:{
                    token : localStorage.getItem('token')
                }
            })
            .done((deleted) => {
                Swal.fire({
                    position: 'center',
                    type: 'success',
                    title: `${deleted.name} has been deleted.`,
                    showConfirmButton: false,
                    timer: 1500
                  })
                  read_projects()
            })
            .fail((jqXHR, textStatus)=>{
                $('#loading').hide()
                Swal.fire({
                    type: 'error',
                    title: `${jqXHR.responseJSON.message}`,
                    animation: false,
                    customClass: {
                        popup: 'animated tada'
                    }
                })
            })
        }
    })
}