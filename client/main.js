let token = localStorage.getItem("token")
const serverUrl = 'http://localhost:3000';
$(document).ready(function(){
    // if(token){
    //     $('#login-form').hide()
    //     $('#loggedUsername').append(`${localStorage.getItem("username")}`)
    //     $('#hacktivGit').show()
    //     let logout = `<a id="logout" class="dropdown-item" href="#" onclick="signoutall()">Log out</a>`
    //     $('#outButton').append(logout)
    // }

    $('#to-register-form').on('click', function(event){
        event.preventDefault()
        console.log("To Register Form")
        $('#login-form').hide()
        $('#register-form').show()
    })

    $('#to-login-form').on('click', function(event){
        event.preventDefault()
        console.log("To Login Form")
        $('#register-form').hide()
        $('#login-form').show()
    })

    $('#register').on('click', function(event){
        event.preventDefault()
        console.log("Create an account button clicked")
        let username = $('#username').val()
        let email = $('#reg-email').val()
        let password = $('#reg-psw').val()        
        $.ajax({
            method: "POST",
            data: {username, email, password},
            url: `${serverUrl}/user/create`
        })
            .done(function(res) {
                console.log("Account created: ", res)
                $('#register-form').hide()
                $('#login-form').show()
            })
            .fail(function(err) {
                console.log(err.responseJSON.message)
            })
            .always(function() {
                console.log("Register Process Finished")
            })
    })

    $('#login').on('click', function(event){
        event.preventDefault()
        console.log("Login button clicked")
        let email = $('#log-email').val()
        let password = $('#log-psw').val()
        $.ajax({
            method: "POST",
            data: {email, password},
            url: `${serverUrl}/user/signin`
        })
            .done(function(res) {
                localStorage.setItem("token", res.token)
                localStorage.setItem("email", email)
                let logout = `<a id="logout" class="dropdown-item" href="#" onclick="signout()">Log out</a>`
                $('#outButton').append(logout)
                $('#login-form').hide()
                $('#loggedUsername').append(`Hi, ${res.username}!`)
                $('#todolist').show()
            })
            .fail(function(err) {
                console.log(err.responseJSON.message)
            })
            .always(function() {
                console.log("Login Process Finished")
            })
    })

    // $('.username').on('click', function(event){
    //     event.preventDefault()
    //     let user = $('.username').prevObject[0].activeElement.innerHTML
    //     $.ajax({
    //         method: 'GET',
    //         url: `http://localhost:3000/api/github/${user}/repo`
    //     })
    //         .done(function(repos){
    //             $("#repolist").empty();
    //             let list = ``
    //             for(let i = 0; i < repos.length; i++){
    //                 console.log(repos[i])
    //                 list += `<li class="repository">
    //                     <a href="#" class="repodetail"><b>${repos[i].name}</b></a><br>
    //                     Author: <a href="#" class="username">${repos[i].owner.login}</a><br>
    //                     ${repos[i].language || ""}<br>
    //                     <span class="border-bottom border-dark">
    //                         <a href="${repos[i].html_url}" target="blank">View on Github</a>
    //                     </span>
    //                 </li>`
    //             }
    //             $('#repolist').append(list)
    //         })
    //         .fail(function(err) {
    //             console.log(err)
    //         })
    //         .always(function() {
    //             console.log("Process Finished")
    //         });
    // })

    // $('#search').submit(function(event) {
    //     event.preventDefault()
    //     const filter = $("#filter").val()
    //     $.ajax({
    //         method: "GET",
    //         url: `http://localhost:3000/api/github/my-starred-repo`
    //     })
    //         .done(function(repos) {
    //             let rgx = new RegExp(filter, 'i')
    //             $("#repolist").empty()
    //             for(let i = 0; i < repos.length; i++){
    //                 if(rgx.test(repos[i].name) || rgx.test(repos[i].owner.login)){
    //                     $("#repolist").append(`
    //                         <li>
    //                             <p><b><a href="#" class="repodetail">${repos[i].name}</a></b><br>
    //                                 Author: <a href="#" class="username">${repos[i].owner.login}</a><br>
    //                                 ${repos[i].language || ""}<br>
    //                                 <span class="border-bottom border-dark">
    //                                     <a href="${repos[i].html_url}">View on Github</a>
    //                                 </span>
    //                             </p>
    //                         </li>
    //                     `)
    //                 }
    //             }
    //         })
    //         .fail(function(err) {
    //             console.log(err)
    //         })
    //         .always(function() {
    //             console.log("Process Finished")
    //         });
    // })
})

// function signout() {
//     event.preventDefault()
//     console.log("Logging out")
//     localStorage.removeItem("token")
//     localStorage.removeItem("username")
//     $('#loggedUsername').empty()
//     $('#outButton').empty()
//     $('#logform').show()
//     $('#hacktivGit').hide()
// }

// function onSignIn(googleUser) {
//     var idToken = googleUser.getAuthResponse().id_token;
//     axios.post(`${serverUrl}/api/user/tokensignin`, { idToken:idToken })
//         .then(function({ data }) {
//             // IMPORTANT! Saves the accessToken from server
//             let profile = googleUser.getBasicProfile();
//             localStorage.setItem('token', data.token);
//             localStorage.setItem("username", profile.getEmail())
//             $('#logform').hide()
//             $('#loggedUsername').append(`${localStorage.getItem("username")}`)
//             $('#hacktivGit').show()
//             let logout = `<a id="logout" class="dropdown-item" href="#" onclick="signoutall()">Log out</a>`
//             $('#outButton').append(logout)        
//         })
//         .catch(function(err) {
//             console.log(err);
//         });
// }

// function googleSignOut() {
//     var auth2 = gapi.auth2.getAuthInstance();
//     auth2.signOut().then(function () {
//       console.log('User (Google Account) signed out.');
//     });
// }

// function signoutall() {
//     signout()
//     googleSignOut()
// }

