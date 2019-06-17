const component_nav = () => {
    let email = window.localStorage.getItem(USER_EMAIL_LOCAL_STORAGE)
    return `
        <nav class="navbar navbar-dark bg-primary">
            <a class="navbar-brand" href="#">Fancy Todo: ${email}</a>
            <button onclick="event_logout()" class="btn btn-md btn-danger" type="button">Logout</button>
        </nav>
    `
}

function event_logout() {
    window.localStorage.removeItem(USER_EMAIL_LOCAL_STORAGE)
    window.localStorage.removeItem(USER_TOKEN_LOCAL_STORAGE)
    render('login')
    toast_success("Logout success", "See you later!")
}
