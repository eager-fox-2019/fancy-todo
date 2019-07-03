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
 

### /grouping (projects)

| Route            | HTTP   | Description                 | Header(s)|Body                              |
|:-----------------|:-------|:----------------------------|:---------|:---------------------------------|
| `/grouping`     | GET    |    get all groups  | token         |      -                            |
| `/grouping/:groupingId`     | GET    |    get a single group based on id  |  token        |       -                           |
| `/grouping/:groupingId`     | DELETE    |  delete a single group based on id    |  token        |       -                           |
| `/grouping/contributor/add/:groupingId/:userId`     | PATCH    | add group contributor |   token |   -       |                                 
| `/grouping/contributor/remove/:groupingId/:userId`     | PATCH    |remove group contributor | token    |  -        |                                  
| `/grouping/:groupingId`     | PATCH    |    update group details| token   |  title:String, description:String      |                                  
| `/grouping`     | POST    |    create new group      |      token   |  title:String, description:String, contributors:Array(emails)                            |

 

