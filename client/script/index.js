const baseURL = 'http://localhost:3000'
const Axios = axios.create({
    baseURL
})
const clientUrl = 'http://localhost:8080/'
var page = []

$(document).ready(function () {
    let searchParams = new URLSearchParams(window.location.search)
      if(searchParams.has('userId')){
        $('#main').hide()
        $('#accept-member').show()
      }else{
        $('#accept-member').hide()
        $('#main').show()
      }
    initial()
})

function initial() {
    let token = localStorage.getItem('token')
    if(!token) {
        page.push('login')
        showPage()
    }else {
        let token = localStorage.getItem('token')
        Axios.get('/authenticate',{ headers : { token } })
        .then(data =>{
            page.push('navbar')
            page.push('main-todo')
            showPage()
        })
        .catch(err=>{
            page.push('login')
            showPage()
        })
    }
}

function showPage () {
    closeLogin()
    closeNavbar()
    closeRegister()
    closeMainTodo()
    closeMainProject()
    
    page.forEach(el =>{
        if(el == 'login') {
            showLogin()
        }
        if(el == 'navbar') {
            showNavbar()
        }
        if(el == 'register'){
            showRegister()
        }
        if(el == 'main-todo'){
            showMainTodo()
        }
        if(el == 'main-project'){
            showMainProject()
        }
    })
    page = []
}

function registerTrigger() {
    event.preventDefault()
    page.push('register')
    showPage()
}

function projectTrigger() {
    page.push('navbar')
    page.push('main-project')
    showPage()
}
function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('id')
    localStorage.removeItem('name')
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {});
    initial()    
}