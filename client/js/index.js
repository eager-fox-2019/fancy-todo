$(()=>{
    $('.collapsible').collapsible();
    $('.tabs').tabs();
    $('.tooltipped').tooltip();
    $('select').formSelect();
    $('.datepicker').datepicker({
        autoClose: true,
        format: 'dddd mmm dd, yyyy',
    });
    $('#login_email_valid').hide();
    $('#login_email_empty').hide();
    $('#loading').hide()
    $('#search_form').hide()
    $('#project_form').hide()
    $('#listProject').empty()
    $('#search_project_form').hide()

    if (localStorage.getItem('token')){
        userLogin(localStorage.getItem('name'))
        showCreateTodoFrom()
    }else{
        userLogout()
    }

    $('.register_link').on('click', ()=>{
        $('#login_page').slideUp()
        $('#register_page').slideDown()
        $('#content_page').hide()
        clearForm()
    })

    $('.login_link').on('click', ()=>{
        $('#login_page').slideDown()
        $('#register_page').slideUp()
        $('#content_page').hide()
        $('#login_email').focus()
    })

    $('#login_button').on('click', ()=>{
        event.preventDefault()
        $('#loading').show()
        let email = $('#login_email').val()
        let password = $('#login_password').val()
        login(email, password)
    })

    $('#register_email').focusout(() => {
        email_validate();
    })

    $('#register_button').on('click', ()=>{
        event.preventDefault()
        $('#loading').show()
        let name = $('#register_name').val()
        let email = $('#register_email').val()
        let password = $('#register_password').val()
        let confirmpassword = $('#confirmpassword').val()
        if(password === confirmpassword){
            register(name, email, password)
        }else{
            Swal.fire({
                type: 'error',
                title: "Password and Confirm Password don't match",
                animation: false,
                customClass: {
                  popup: 'animated tada'
                }
            })
            $('#confirmpassword').focus()
        }
    })

    $('.logout_link').on('click', () => {
        logout()
    })

    // --------------------- SEARCH TODO
    $("#search_todo").on("keyup", function() {
        let value = $(this).val().toLowerCase();
        $("#listTodo li").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $('#close_search').on('click', () => {
        $('#search_todo').val('')
        $("#listTodo li").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf('') > -1)
        });
    })

    // --------------------- SEARCH PROJECT
    $("#search_project").on("keyup", function() {
        let value = $(this).val().toLowerCase();
        $("#listProject li #projectName").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $('#close_search').on('click', () => {
        $('#search_project').val('')
        $("#listProject li").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf('') > -1)
        });
    })

    // --------------------- TODO
    $('#create_todo_button').on('click', ()=>{
        $('#loading').show()
        createTodo('Todo')
    })

    $('#mytodo_link').on('click', ()=>{
        $('#loading').show()
        $('#project_link').removeClass('blue-grey darken-3')
        $('#project_form').hide()
        $('#create_project_link').removeClass('blue-grey darken-3')
        $('#listProject').empty()
        $('#search_project_form').hide()
        showMyTodo(localStorage.getItem('id'))
    })

    $('#createTodo_link').on('click', () => {
        createFrom = 'Todo'
        console.log(createFrom)
        showCreateTodoFrom()
    })

    // --------------------- PROJECT
    $('#project_link').on('click', () => {
        $('#loading').show()
        read_projects()
    })

    $('#create_project_link').on('click', () => {
        $('#createTodo_link').removeClass('blue-grey darken-3')
        $('#mytodo_link').removeClass('blue-grey darken-3')
        $('#project_link').removeClass('blue-grey darken-3')
        $('#create_project_link').addClass('blue-grey darken-3')
        $('#todo_page').hide()
        $('#search_form').hide()
        $('#todo_form').hide()
        $('#project_form').slideDown()
        $('#listProject').empty()
        $('#update_project_button').hide()
        $('#done_project_button').hide()
        $('#member_input').hide()
        $('#project_name_input').show()
        $('#next_project_button').show()
        $('#project_name').focus()
        $('#project_name').val('')
        $('#list_member').empty()
        $('#search_project_form').hide()
        $('#project_form_title').show()
    })

    $('#next_project_button').on('click', () => {
        create_project()
    })

    $('#done_project_button').on('click', () => {
        $('#loading').show()
        read_projects()
    })

})