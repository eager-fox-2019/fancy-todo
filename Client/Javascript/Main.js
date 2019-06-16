const url = "http://localhost:3000";

$(document).ready(function() {
  currentPage()
});

function currentPage(){
  if (localStorage.getItem("token")) {
    if (localStorage.currentPage == 'list'){
      showList()
    } else if (localStorage.currentPage == 'archive'){
      showArchive()
    } else if (localStorage.currentPage == 'create'){
      showCreate()
    } else if (localStorage.currentPage == 'pie'){
      showPieChart()
    } else {
      showList()
    }
  } else {
    if (localStorage.currentPage == 'signin'){
      showSignin()
    } else if (localStorage.currentPage == 'signup'){
      showSignup()
    } else {
      showSignin()
    }
  }
}

function signup() {
  $.ajax({
    url: `${url}/signup`,
    method: "POST",
    data: {
      name: $("#signupName").val(),
      email: $("#signupEmail").val(),
      password: $("#signupPassword").val()
    }
  })
    .done(function(response) {
      console.log("User created.");
      showSignin()
    })
    .fail(function(jqXHR, textStatus) {
      $("#errorSignup").show();
      $("#errorSignup").html(
        `
      <p class="error" data-selector=".editContent" style="color:red;">
      ${jqXHR.responseJSON.message}
      </p>
      `
      );
    });
}

function signin() {
  $.ajax({
    url: `${url}/signin`,
    method: "POST",
    data: {
      email: $("#signinEmail").val(),
      password: $("#signinPassword").val()
    }
  })
    .done(function(response) {
      localStorage.setItem("token", response.token);
      console.log("User signed in.");
      currentPage()
    })
    .fail(function(jqXHR, textStatus) {
      $("#errorSignin").show();
      $("#errorSignin").html(
        `
        <p class="error" data-selector=".editContent" style="color:red;">
        ${jqXHR.responseJSON.message}
        </p>
        `
      );
    });
}
function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
      url:`${url}/google`,
      method: 'POST',
      data: {
          googleToken: id_token
      }
  })
  .done(function(response){
      localStorage.setItem('token', response.token)
      console.log("User signed in via Google.");
      currentPage()
  })
  .fail(function(jqXHR, textStatus){
    $("#errorSignin").show();
    $("#errorSignin").html(
      `
      <p class="error" data-selector=".editContent" style="color:red;">
      ${jqXHR.responseJSON.message}
      </p>
      `
    );
  })
}

function signout() {
  $.ajax({
    url: `${url}/signout`,
    method: "POST"
  })
    .done(function(response) {
      localStorage.removeItem("token");
      if (gapi.auth2) {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function() {
          console.log("User signed out.");
        });
      }
      showSignin()
    })
    .fail(function(jqXHR, textStatus) {
      console.log(jqXHR);
    });
}

function createTodo() {
  $.ajax({
    url: `${url}/todo`,
    method: "POST",
    headers: {
      token: localStorage.getItem("token")
    },
    data: {
      title: $("#createTodoTitle").val(),
      description: $("#createTodoDescription").val(),
      group: $("#createTodoGroup").val(),
      due_date: $("#createTodoDue_date").val()
    }
  })
    .done(function(response) {
      console.log("Todo created.");
      showList()
    })
    .fail(function(jqXHR, textStatus) {
      console.log(jqXHR);
    });
}

function readArchive() {
  $.ajax({
    url: `${url}/todo?name=true`,
    method: "GET",
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(function(response) {
      console.log("Reading archive.");
      $("#archiveList").empty();
      response.forEach((value, index) => {
        $("#archiveList").append(
          `
        <div class="card" style="width:auto;margin-bottom:10px;">
          <div class="card-header" id="atodo${value._id}" onclick="archiveToggle('${value._id}')" style="cursor:pointer;height:50px;width:auto;text-align:left">
            ${index+1}. <strike>${value.title}</strike> <p style="text-align:center;float: right;">${value.group}</p>
          </div>
          <div id="a_todo${value._id}" style="display:none">
            <ul class="list-group list-group-flush">
              <li class="list-group-item" style="text-align:left">Description: ${value.description}</li>
              <li class="list-group-item" style="text-align:left">Due Date: ${value.showDue_date}</li>
              <li class="list-group-item">
              <a href="#" class="btn btn-primary" onclick="deleteTodo('${value._id}')" style="background-color:red;border-color:red">Delete</a>
              <a href="#" class="btn btn-primary" onclick="doneTodo('${value._id}', 0)" >Restore</a>
              </li>
            </ul>
          </div>
        </div>
        `
        );
      });
      if (response.length == 0)
      $("#archiveList").html(`<p>Your archive is empty</p>`)
    })
    .fail(function(jqXHR, textStatus) {
      console.log(jqXHR);
    });
}

function readTodo(id, tag, find) {
  let search = null
  if (find){
    search = $("#searchTodo").val()
  }
  let link = null
  if (tag){
    link = `${url}/todo?tag=${tag}&name=false`
  } else if (search){
    link = `${url}/todo?search=${search}&name=false`
  } else {
    link = `${url}/todo?name=false`
  }
  $.ajax({
    url: link,
    method: "GET",
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(function(response) {
      console.log("Reading To-Do.");
      $("#searchTodo").val("")
      $("#readTodo").empty();
      if (!tag && !search){
        $("#readTodo3").empty();
        $("#readTodo3").html(`
        <input type="text" class="form-control" id="searchTodo" placeholder="Search title..">

        <a href="#" class="btn btn-primary" style="padding:3px 10px 3px 10px;margin-top:10px;background-color:#505397;border-color:#505397" id="searchTodoButton" onclick="readTodo(undefined,undefined, true)">Search</a>
        <br><br>
        `)
        $("#readTodo3").append(' Tags: ')
        let arr = []
        response.forEach((tag) => {
          if (arr.indexOf(tag.group) == -1){
            arr.push(tag.group)
          }
        })
        arr.forEach((tag, i) => {
          if (tag != ""){
            $("#readTodo3").append(`
            <a href="#" class="btn btn-primary" id="tag${i}${tag}" onclick="readTodo(undefined, '${tag}')" style="border-color:#505397;background-color:#505397;padding:2px;padding-left:4px;padding-right:4px;height:25px;font-size: 13px;margin-bottom: 6px">${tag}</a>
            `)
          }
        })
      }
      if (search){
        console.log("Search loaded.");
        $("#readTodo").append(`<p>Search result for "${search}"</p>`)
      }
      response.forEach((value, index) => {
        $("#readTodo").append(
          `
          <div class="card" style="width:auto;margin-bottom:10px;">
            <div class="card-header" id="todo${value._id}" onclick="toggleTodo('${value._id}')" style="cursor:pointer;height:50px;width:auto;text-align:left">
              ${index+1}. ${value.title} <p style="text-align:center;float: right;">${value.group}</p>
            </div>

            <div id="_todo${value._id}" style="display:none">
              <ul class="list-group list-group-flush">
                <li class="list-group-item" style="text-align:left">Description: ${value.description}</li>
                <li class="list-group-item" style="text-align:left">Due Date: ${value.showDue_date}</li>
                <li class="list-group-item">
                  <a href="#" class="btn btn-primary" id="editTodo${value._id}" onclick="readEdit('${value._id}')" style="background-color:green;border-color:green">Edit</a>
                  <a href="#" class="btn btn-primary" id="deleteTodo${value._id}" onclick="deleteTodo('${value._id}')" style="background-color:red;border-color:red">Delete</a>
                  <a href="#" class="btn btn-primary" id="_doneTodo${value._id}" onclick="doneTodo('${value._id}', 1)" >Complete</a>
                </li>
              </ul>
            </div>
          
            <div id="_eTodo${value._id}" style="display:none">
              <ul class="list-group list-group-flush">
                <li class="list-group-item" style="text-align:left">  <div class="form-group">Title:<br> <input id="editTitle${value._id}"class="form-control" type="text" value="${value.title}" required></div></li>
                <li class="list-group-item" style="text-align:left"> <div class="form-group">Description:<br><textarea rows="3" class="form-control" id="editDescription${value._id}" required>${value.description}</textarea></div></li>
                <li class="list-group-item" style="text-align:left"> <div class="form-group">Tag:<br><input  class="form-control" id="editGroup${value._id}" type="text" value="${value.group}" required> </div></li>
                <li class="list-group-item" style="text-align:left"> <div class="form-group">Due Date:<br><input  class="form-control" id="editDue_date${value._id}" type="date" value="${value.due_date}" required> </div></li>
                <li class="list-group-item">
                  <a href="#" class="btn btn-primary" id="_editTodo${value._id}" onclick="readEdit2('${value._id}')">Edit</a>
                  <a href="#" class="btn btn-primary" id="_cancelTodo${value._id}" onclick="readCancel('${value._id}')" style="background-color:red;border-color:red">Cancel</a>
                </li>
              </ul>
            </div>
          </div>
          `
        );
        if (id != undefined)
        $(`#_todo${id}`).show()
      });
      if (tag){
        console.log("Tag loaded.");
        $("#readTodo").append(`<a href="#" class="btn btn-primary" id="searchTodoButton2" style="margin-top:15px;background-color:#505397;border-color:#505397" onclick="readTodo()">Show all To-Do</a>`)
      }
      if (response.length == 0){
        if (search){
          console.log("Search 404.");
          $("#readTodo").html(`<p>To-Do with title "${search}" not found!</p>`)
        } else {
          $("#readTodo3").html(`<p>Your To-Do is empty</p>`)
        }
      }
      if (search){
        $("#readTodo").append(`<a href="#"  style="background-color:#505397;border-color:#505397" class="btn btn-primary" id="searchTodoButton2" onclick="readTodo()">Show all To-Do</a>`)
      }
    })
    .fail(function(jqXHR, textStatus) {
      console.log(jqXHR);
    });
}

function deleteTodo(id) {
  $.ajax({
    url: `${url}/todo/${id}`,
    method: "DELETE",
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(function(response) {
      console.log(`${id} deleted.`);
      showList()
    })
    .fail(function(jqXHR, textStatus) {
      console.log(jqXHR);
    });
}

function editTodo(id) {
  $.ajax({
    url: `${url}/todo/${id}`,
    method: "PATCH",
    data: {
      title: $(`#editTitle${id}`).val(),
      description: $(`#editDescription${id}`).val(),
      due_date: $(`#editDue_date${id}`).val(),
      group: $(`#editGroup${id}`).val()
    },
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(function(response) {
      console.log(`${id} updated.`);
      readTodo(id);
    })
    .fail(function(jqXHR, textStatus) {
      console.log(jqXHR);
    });
}

function doneTodo(id, value) {
  $.ajax({
    url: `${url}/todo/${id}`,
    method: "PATCH",
    data: {
      status: value
    },
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(function(response) {
      console.log(`${id} completed.`);
      if (value == 0){
        readArchive();
      } else if (value == 1){
        readTodo();
      }
    })
    .fail(function(jqXHR, textStatus) {
      console.log(jqXHR);
    });
}

function readPieChart(){
  $.ajax({
    url: `${url}/todo?name=false`,
    method: "GET",
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done(function(response) {
      console.log(`Pie chart loaded.`)
      console.log(`If you read this and pie chart is not loaded, its probably in the page below.`)
      let obj = {}
      response.forEach((x) => {
        if (x.group == ""){
          x.group = 'No Tag'
        }
        if (obj[x.group] == undefined){
          obj[x.group] = []
        } 
        obj[x.group].push(x)
      })
      let arr = []
      for (let keys in obj){
        let temp = {
          name: keys,
          y: obj[keys].length
        }
        arr.push(temp)
      }
      Highcharts.chart('container', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Proportion of Tags'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            name: 'Tags',
            colorByPoint: true,
            data: arr
        }]
    });
    })
    .fail(function(jqXHR, textStatus) {
      console.log(jqXHR);
    });

}
function archiveToggle(id){
  var x = document.getElementById(`a_todo${id}`);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
function readEdit(id){
  $(`#_todo${id}`).hide()
  $(`#_eTodo${id}`).show()
}
function readEdit2(id){
  event.preventDefault()
  editTodo(id)
}
function readCancel(id){
  $(`#_eTodo${id}`).hide()
  $(`#_todo${id}`).show()
}
function toggleTodo(id){
  $(`#_eTodo${id}`).hide()
  var x = document.getElementById(`_todo${id}`);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function showSignup(){
  localStorage.setItem("currentPage", 'signup');
  $("#signupName").val("");
  $("#signupEmail").val("");
  $("#signupPassword").val("");
  $("#signupForm").show();
  $("#signinRight").show();

  $("#calendar").hide();
  $("#errorSignup").hide();
  $("#signinForm").hide();
  $("#homePage").hide();
  $("#listTodoRight").hide();
  $("#pieChart").hide();
  $("#archiveTodo").hide();
}

function showSignin(){
  localStorage.setItem("currentPage", 'signin');
  $("#signinEmail").val("");
  $("#signinPassword").val("");
  $("#signinForm").show();
  $("#signinRight").show();

  $("#calendar").hide();
  $("#errorSignin").hide();
  $("#homePage").hide();
  $("#listTodoRight").hide();
  $("#pieChart").hide();
  $("#archiveTodo").hide();
  $("#signupForm").hide();
}

function showList(){
  localStorage.setItem("currentPage", 'list');
  readTodo()
  $("#homePage").show();
  $("#listTodoRight").show();
  $("#readTodo2").show();

  $("#calendar").hide();
  $("#pieChart").hide();
  $("#archiveTodo").hide();
  $("#signinForm").hide();
  $("#signinRight").hide();
  $("#signupForm").hide();
  $("#createTodo").hide();
}

function showArchive(){
  localStorage.setItem("currentPage", 'archive');
  readArchive()
  $("#homePage").show();
  $("#listTodoRight").show();
  $("#archiveTodo").show();

  $("#calendar").hide();
  $("#readTodo2").hide();
  $("#pieChart").hide();
  $("#signinForm").hide();
  $("#signinRight").hide();
  $("#signupForm").hide();
  $("#createTodo").hide();
}

function showCreate(){
  localStorage.setItem("currentPage", 'create');
  $("#createTodoTitle").val("");
  $("#createTodoDescription").val("");
  $("#createTodoGroup").val("");
  $("#createTodoDue_date").val("");
  $("#homePage").show();
  $("#listTodoRight").show();
  $("#createTodo").show();

  $("#calendar").hide();
  $("#readTodo2").hide();
  $("#archiveTodo").hide();
  $("#pieChart").hide();
  $("#signinForm").hide();
  $("#signinRight").hide();
  $("#signupForm").hide();
}

function showPieChart(){
  localStorage.setItem("currentPage", 'pie');
  readPieChart()
  $("#homePage").show();
  $("#listTodoRight").show();
  $("#pieChart").show();

  $("#calendar").hide();
  $("#readTodo2").hide();
  $("#archiveTodo").hide();
  $("#createTodo").hide();
  $("#signinForm").hide();
  $("#signinRight").hide();
  $("#signupForm").hide();
}

$("#signupButton").click(function() {
  event.preventDefault();
  showSignup()
});
$("#signinButton2").click(function() {
  event.preventDefault();
  showSignin()
});
$("#signupButton2").click(function() {
  event.preventDefault();
  signup();
});
$("#signinButton").click(function() {
  event.preventDefault();
  signin();
});
$("#signoutButton").click(function() {
  event.preventDefault();
  signout();
});
$("#createTodoButton").click(function() {
  event.preventDefault();
  createTodo();
});
$("#createTodoBtn").click(function() {
  event.preventDefault();
  showCreate()
});
$("#listTodoBtn").click(function() {
  event.preventDefault();
  showList()
});
$("#archiveBtn").click(function() {
  event.preventDefault();
  showArchive()
});
$("#pieChartBtn").click(function() {
  event.preventDefault();
  showPieChart()
});


