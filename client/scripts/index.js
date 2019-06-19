//variable declaration
const srvUrl = `http://localhost:3000`

//Prevent default action for html tag
$("a").click(function(event) {
  event.preventDefault()
})

$("button").click(function(event) {
  event.preventDefault();
});

//Render page based on authentication
if(localStorage.getItem("token")) loadTodoPage()
else loadLoginPage()