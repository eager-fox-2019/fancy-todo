# Infinite-todos
INFINITE todos is todo-app where you can create your own todo as many as you can.

#### BaseUrl : 
> http://localhost:8080

#### database :
> mongoDB

You need to Install:
- Express
- Mongoose
- cors
- dotenv
- axios
- bcryptjs
- google-auth-library
- jsonwebtoken

| method | routes                        | detail                                                       |
| ------ | ----------------------------- | ------------------------------------------------------------ |
| GET    | /api/todos                    |   show all `Todo` list                                         |
| GET    | /api/todos/:todoid               | to get One of `Todo` list by id                                     |
| GET    | /api/todos/search/:search               | search `Todo` list by {name}                                    |
| POST   | /api/todos                    | create new `Todo` list {name, description, due_date,status(default: false), user_id}                                         | 
| DELETE   | /api/todos/:todoid              | delete one of `Todo` list by id                                |
| PUT    | /api/todos/:todoid                | edit `Todo` including {name, description, due_date} by id                                       |
| PATCH    | /api/todos/:todoid              | set {status} `Todo` to `true` mark as Completed Task                        |
| POST   | /api/register                 | create new `User` {email,password,username}                                            |
| POST   | /api/login                    | `User` login to system using email & password                                      | 
| POST   | /api/tokensignin                    | `User` login to system using their Google Account, and also create new `User`                                      |                 

------