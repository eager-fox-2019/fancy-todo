const baseUrl = 'http://localhost:3000/';
// Data from stef's endpoint
let holidayArr
let eventArr
let favArr

// Format form inputs to json-like
function format(form) {
  let out = {};
  $(form).serializeArray().forEach(x => {
    out[x.name] = x.value
  });
  return out
}

function appendHoliday(obj) {
  let datestring = new Date(obj.date).toDateString()
  $('#list1').append(
    `<div class="holiday">
    <p>
      ${datestring}<br>
      ${obj.detail}
    </p>
    </div>`)
}

function appendEvent(obj) {
  $('#list2').append(
    `<div class="event">
      <a href="${obj.uri}">${obj.displayName}</a><br>
      <p>
        <b>Start date</b>: ${obj.startDate}<br>
        <b>Venue</b>: ${obj.venue}&nbsp;&nbsp;&nbsp;<b>City</b>: ${obj.city}<br>
        <b>Artists</b>: ${obj.artists}<br>
        <b>Currency</b>: ${obj.currency}&nbsp;&nbsp;&nbsp;<b>Rate</b>: ${obj.exchangeRate}<br>
      </p>
      <button class="button button1" onclick="addFav('${obj.eventId}')">Save</button>
    </div>`)
}

function populateFavorite(){
  $('#list3').empty()
  $.ajax({
    method: "GET",
    url: `${baseUrl}api/users/getFav`,
    headers: {token: localStorage.getItem('token')}
  })
  .done(listFav => {
    favArr = listFav
    listFav.forEach(data => {
      appendFavorite(data)
    })
  })
}

function appendFavorite(data) {
  // artists: "Gareth Johnson"
  // city: "Washington, DC, US"
  // currency: "Euro"
  // displayName: "DC Black Theatre & Arts Festival 2019"
  // eventId: "38193844"
  // exchangeRate: 16135
  // isHoliday: false
  // owner: "5d03476dc9306c0ffc863605"
  // startDate: "2019-06-01"
  // uri: "http://www.songkick.com/festivals/3078774-dc-black-theatre-arts/id/38193844-dc-black-theatre--arts-festival-2019?utm_source=57262&utm_medium=partner"
  // venue: "Thearc: Town Hall Education Arts Recreation Campus"
  // __v: 0
  // _id: "5d034e04fcc81a2728d60945"
  if(data.isHoliday) {

  }

    let htmlFav = `<li class="fav">
      <p>
        Name: ${data.displayName}<br>
        Artists: ${data.artists}<br>
        City: ${data.city}<br>
        Date: ${data.startDate}<br>
        Currency: ${data.currency}&nbsp;&nbsp;&nbsp;Rate: ${data.exchangeRate}<br>
      </p>
      <button class="button button1" type="submit" onclick="delFav('${data._id}')">delete</button>
      <div class="holidayStatus">
        <h4 class="${data.isHoliday}">Holiday</h4><br>
      </div>
      </li>`
    $('#list3').append(htmlFav)
}

function delFav(id){
  //id is favorite model id
  $.ajax({
    method: "DELETE",
    url: `${baseUrl}api/users/delFav/`+id,
    headers: {token: localStorage.getItem('token')}
  })
  .done(data => {
    console.log('deleted 1 favorite')
    populateFavorite()
  })
  .fail((jqXHR, textStatus) => {
    console.log('Failed: ', textStatus)
  })
}

function addFav(id) {
  let fav
  for(let event of eventArr) {
    if(event.eventId.toString() === id) {
      fav = event
    }
  }
  fav.holidayList = JSON.stringify(holidayArr);

  $.ajax({
    method: "POST",
    url: `${baseUrl}api/users/addFav/${id}`,
    data: fav,
    headers: {token: localStorage.getItem('token')}
  })
  .done(data => {
    appendFavorite(data)
  })
  .fail((jqXHR, textStatus) => {
    console.log('Failed: ', textStatus)
  })
}

function appendCurrency(obj) {
  $('#currencyinfo').html(
    `<div>
    <u>Currency Name</u>:<br>
    ${obj.currency}</div>
    <div><u>Rate</u>:<br>
    1 ${obj.currency} = ${obj.rate} Rupiah
    </div>`)
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
  localStorage.setItem('token', token)
}

function onSignIn(googleUser) {
  const idToken = googleUser.getAuthResponse().id_token
  $.ajax({
    method: "POST",
    url:`${baseUrl}api/users/googleSignin`,
    data: { idToken }
  })
  .done((result) => {
    localStorage.setItem('token', result.token)
    alert('Success signed in with google')
    $('#outside').hide();
    $('#inside').show();

    populateFavorite()
  })
  .fail((err) => {
    // console.log(err.responseJSON.message)
    alert(err.responseJSON.message)
  })
}

function logout() {
  localStorage.clear()
  $('.currencyinfo').empty()
  $('#list1').empty()
  $('#list2').empty()
  $('#list3').empty()
  $('#inside').hide()
  $('#outside').show()

  let auth2 = gapi.auth2.getAuthInstance();
  auth2
    .signOut()
    .then(() => {
      console.log('User signed out.')
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

    populateFavorite()
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