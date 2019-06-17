const BASE_URL = `http://localhost:3000`

function _axiosGetConfig() {
    let token = window.localStorage.getItem(USER_TOKEN_LOCAL_STORAGE) 
    return {
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    }
}

/**
 * return a promise, {user, email}
 * @param {string} email 
 * @param {sting} password 
 */
function action_login(email, password) {
    let payload = {email, password}
    return axios.post(`${BASE_URL}/user/login`, payload, _axiosGetConfig())
}

function action_loginGithub(code) {
    let payload = { code }
    return axios.post(`${BASE_URL}/user/loginGithub`, payload, _axiosGetConfig())
}


function action_register(email, password) {
    let payload = {email, password}
    return axios.post(`${BASE_URL}/user/register`, payload, _axiosGetConfig()) 
}

function action_listTodo() {
    return axios.get(`${BASE_URL}/todo`, _axiosGetConfig())
}

function action_postTodo(payload) {
    return axios.post(`${BASE_URL}/todo`, payload, _axiosGetConfig())
}

function action_update(payload, id) {
    return axios.patch(`${BASE_URL}/todo/${id}`, payload, _axiosGetConfig())
}

function action_delete(id) {
    return axios.delete(`${BASE_URL}/todo/${id}`, _axiosGetConfig())
}