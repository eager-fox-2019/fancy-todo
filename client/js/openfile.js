$(document).ready(function(){
    if (localStorage.getItem('token')){
      $('#login').hide()
      $('#register').hide()
      $('#main').hide()
      $('#signout-link').hide()
      $('#home').show()
      $('#register-form').hide()
      $('#login-form').hide()
      
    // navbar()
    }
    else {
        $('.the-world').hide()
        $('#signout-link').hide()
        $('#register-form').toggle()
        $('#login-form').toggle()
    }
  })
