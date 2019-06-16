const baseUrl = 'http://localhost:3000/';

// Format form inputs to json-like
function format(form) {
  let out = {};
  $(form).serializeArray().forEach(x => {
    out[x.name] = x.value
  });
  return out
}

$(document).ready(() => {
  // Search Form submit
  $('#search1').on('submit', function(event) {
    event.preventDefault();
    let input = format(this)
    $.ajax({
      url: `${baseUrl}api/events/`,
      method: 'POST',
      data: input,
    })
      .done(data => {
        eventArr = data.events
        // console.log(data);
        appendCurrency(data);
        $('#list2').empty();
        for(let event of data.events) {
          appendEvent(event);
        }
      })
      .fail((jqXHR, textStatus) => {
        console.log('Failed: ', textStatus)
      })

    $.ajax({
      url: `${baseUrl}api/holidays/nextholidays`,
      method: 'POST',
      data: input,
    })
      .done(data => {
        console.log(data)
        holidayArr = data;
        $('#list1').empty();
        for(let holiday of data) {
          appendHoliday(holiday)
        }
      })
      .fail((jqXHR, textStatus) => {
        console.log('Failed: ', textStatus)
      })
  })

  $('#ok1').on('click', function() {
    $('#reg-message').hide()
    $('#front-forms').show()
    $('.goog').show()
  })
});


// <| ------- google sign-in -------|>

function accessToken(token) {
  localStorage.setItem('access_token', token)
}

function onSignIn(googleUser) {
  console.log("client google onSignIn")
  const idToken = googleUser.getAuthResponse().id_token
  $.ajax({
    method: "POST",
    url:`${baseUrl}api/users/googleSignin`,
    data: { idToken }
  })
  .done((result) => {
    localStorage.setItem('access_token', result.token)
    console.log('Success signed in with google')
    $('#outside').hide();
    $('#inside').show();

  })
  .fail((err) => {
    console.log(err.responseJSON.message)
  })
}

function logout() {
  console.log("logout function")
  console.log($)
  localStorage.clear()

  let auth2 = gapi.auth2.getAuthInstance();
  auth2
    .signOut()
    .then(() => {
      console.log('User signed out.')
      $('#outside').show();
      $('#inside').hide();
     });
}

// --------- sign in --------- 
$('#login-form').submit(() => {
  event.preventDefault()
  let inputEmail = $('#loginEmail').val()
  let inputPassword = $('#loginPassword').val()
  $.ajax({
    method: "POST",
    url: `${baseUrl}api/users/login`,
    data: {
      email: inputEmail,
      password: inputPassword
    }
  })
  .done((result) => {
    $('#loginEmail').val('')
    $('#loginPassword').val('')
    accessToken(result)
    $('#outside').hide();
    $('#inside').show();

  })
  .fail(err => {
    alert(err.responseJSON.message)
  })
})

// -------- Register ------------
$('#register-form').submit((event) => {
  event.preventDefault()
  let inputEmail = $('#registrationEmail').val()
  let inputPassword = $('#registrationPassword').val()
  console.log('masuk')
  $.ajax({ 
    method: "POST",
    url: `${baseUrl}api/users/register`,
    data: {
      email: inputEmail,
      password: inputPassword
    }
  })
  .done((result) => {
    $('#front-forms').hide()
    $('.goog').hide()
    $('#reg-message').show()
  })
  .fail(err => {
    alert(err.responseJSON.message)
  })
})