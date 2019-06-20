# API documentation
## Summary

API to access database of todo application

## Routes

### /signIn and signOut

| Route            | HTTP   | Description                 | Header(s)|Body                              |
|:-----------------|:-------|:----------------------------|:---------|:---------------------------------|
| `/signin`     | GET    | user signIn       |          |    username:String, password:String                              |
| `/signup` | POST    | create new user |      |name:String, email:String, username:String, password:String    |                              
 



### /todos

| Route            | HTTP   | Description                 | Header(s)|Body                              |
|:-----------------|:-------|:----------------------------|:---------|:---------------------------------|
| `/todo`     | GET    | Get all todo info from signed in user       |token          |                                  |
| `/todo/:todoId` | GET    | Get info from a single registered todos  | token    |                                  |
| `/todo`     | POST   | Create a new todo               | token    | title:String  |
| `/todos/:todoId` | DELETE | Delete a todo               | token    |                                  |
| `/todos/:todoId` | PATCH  | Update a todo with new info |          |  status:Boolean, due_date:Date, reminder:Date|   
 


### /user

| Route            | HTTP   | Description                 | Header(s)|Body                              |
|:-----------------|:-------|:----------------------------|:---------|:---------------------------------|
| `/user`     | GET    | get user information of signed in user      |token          |                                  |
| `/user/:userId` | GET    | get user info of any other existing user| token    |                                  |
| `/user` | DELETE | Delete signed in user account              | token    |                                  |
| `/user/info` | PATCH  | Update info of signed in user with new info |          |  name:Boolean, username:String, password:String, email:String|   
 

### /grouping

| Route            | HTTP   | Description                 | Header(s)|Body                              |
|:-----------------|:-------|:----------------------------|:---------|:---------------------------------|
| `/grouping`     | GET    |      |          |                                  |

 

### /tags

| Route            | HTTP   | Description                 | Header(s)|Body                              |
|:-----------------|:-------|:----------------------------|:---------|:---------------------------------|
| `/tags`     | GET    |      |          |                                  |

## ENV

env for SECRET_SAUCE is kalduayam
