# fancy-todo
fancy-todo

server-side : `localhost:3000`

client-side : `localhost:8080`

###### CRUD User
---
| Route | HTTP | Description | Output | Headers | Body
|:--:|:--:|:--:|:--:|:--:|:--:|
| ````/login```` | POST | Create new user via manual register | User Detail | none | email:string(**required**) password:string(**required**),first_name:string(**required**),last_name:string(**required**)
| ````/register```` | POST | Login user via manual login | User Detail | none | email:string(**required**) password:string(**required**)
| ````/google```` | POST | Login user via manual google sign in oauth2 | User Detail | none | none
---

###### CRUD Todo
---
| Route | HTTP | Description | Output | Headers | Body
|:--:|:--:|:--:|:--:|:--:|:--:|
| ````/todos```` | GET | Get List of Todos For Spesific/Authenticated User | Todo Detail | token | none
| ````/todos/finish```` | GET | Get List of Todos with Status `Finished` For Spesific/Authenticated User | Todo Detail | token | none
| ````/todos/unfinish```` | GET | Get List of Todos with Status `Finished` For Spesific/Authenticated User | Todo Detail | token | none
| ````/todos/:id```` | GET | Get One Spesific Todo From Authenticated User | Todo Detail | token | none
| ````/todos/finish/:id```` | PATCH | Set Status of Spesific todo to `Finished` | Todo Detail | token | none
| ````/todos/unfinish/:id```` | PATCH | Set Status of Spesific todo to `Unfinished` | Todo Detail | token | none
| ````/todos```` | POST | Create a New Todo | Todo Detail | token | title:string(**required**),description:string(**required**),category,dueDate:date(**required**)
| ````/todos/:id```` | PUT | Update attributes of spesific todo | Todo Detail | token | none
| ````/todos/:id```` | DELETE | Delete Spesific Todo | Todo Detail | token | none

###### CRUD Project 
---
| Route | HTTP | Description | Output | Headers | Body
|:--:|:--:|:--:|:--:|:--:|:--:|
| ````/projects/pending```` | GET | Show all pending user in a project | Project Detail | token | none
| ````/projects/:id```` | GET | Get a Spesific Project | Project Detail | token | none
| ````/projects```` | GET | Get a list of Projects for an authenticated User | Project Detail | token | none
| ````/projects/:id```` | DELETE | Delete One Spesific Project | Project Detail | token | none
| ````/projects/:id```` | PUT | Update attributes of spesific Project | Project Detail | token | name:string(**required**)
| ````/projects/addTodo/:id```` | PUT | Add todo attributes to spesific Project | token | title:string(**required**),description:string(**required**),category,dueDate:date(**required**)
| ````/projects/invite/:id```` | PUT | Invite a user to join spesific Project | Project Detail | token | title:string(**required**),description:string(**required**),category,dueDate:date(**required**)
| ````/projects/join/:id```` | PUT | User Join On spesific Project | Project Detail | token | none
| ````/projects/decline/:id```` | DELETE | User Decline Invitation On spesific Project | Project Detail | token | none
| ````/projects```` | POST | Create a New project | Project Detail | token | name:string(**required**)

###### USAGE
Make sure you have node.js and npm installed in your computer and then run these commands:
$ npm install
$ nodemon app.js (for running the app)