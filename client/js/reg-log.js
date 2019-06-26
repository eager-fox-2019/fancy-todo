function registForm() {
     $('#register-form').toggle()
     $('#login-form').hide()
}

function loginForm() {
    $('#login-form').toggle()
    $('#register-form').hide()
    $('#google-sign-in').show()
}