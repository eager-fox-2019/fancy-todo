
function fetchTodo() {
    return new Promise (( res,rej ) => {
        let token = localStorage.getItem('token')
        Axios.get('/todos',{ headers : { token }})
        .then(data =>{
            res(data)
        })
        .catch(err =>{
            rej(err)
        })
    })
}

function fetchProject() {
    return new Promise(( res,rej )=>{
        let token = localStorage.getItem('token')
        Axios.get('/projects', { headers : { token } })
        .then(data =>{
            res(data)
        })
        .catch(err =>{
            rej(err)
        })
    })
}

function fetchProjectOne(projectId) {
    return new Promise(( res,rej )=>{
        let token = localStorage.getItem('token')
        Axios.get(`/projects/${projectId}`, { headers : { token } })
        .then(data =>{
            res(data)
        })
        .catch(err =>{
            rej(err)
        })
    })
}

function fetchUser() {
    return new Promise(( res,rej )=>{
        let token = localStorage.getItem('token')
        Axios.get('/user',{ headers : { token } })
        .then(data =>{
            res(data)
        })
        .catch(err =>{
            rej(err)
        })
    })
}