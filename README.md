# **Fancy Todo** (Portofolio Project Week 1)
Website : http://fancy-todo.alvinchristian7.icu/
----------------------------------------

## Endpoint

### *Doesn't Require Token*

#### User Routes
| Routes               | Method | Request Body                                           | Response Data                                                                | Description                                                     |
|----------------------|--------|--------------------------------------------------------|------------------------------------------------------------------------------|-----------------------------------------------------------------|
| `/user/register`     | POST   | `{ name : String, email : String, password : String }` | `{ access-token : String }`                                                  | > Register with new user info                                   |
| `/user/login`        | POST   | `{ email : String, password : String }`                | `{ name : String, email : String, access-token : String }`                   | Login and get an access token and name                          |
| `/user/signingoogle` | POST   | `{ id_token : String }`                                | `{ name : String, email : String, newPass : String, access-token : String }` | Sign in with Google and get an access token, name, new password |

### *Require Token* (`{ headers: { access-token } }`)

#### User Routes
| Routes  | Method | Request Body | Response Data                                       | Description                                  |
|---------|--------|--------------|-----------------------------------------------------|----------------------------------------------|
| `/user` | GET    | -            | `[{ _id : String, name : String, email : String }]` | Get all users data (Authenticated user only) |

#### Todos Routes
| Routes                             | Method | Request Body                                                                                                        | Response Data                                                                                                  | Description                                                            |
|------------------------------------|--------|---------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| `/todo`                            | POST   | `{ project : String, title : String, description : String, status : String, duedate : String }`                     | `{ user : String, project : String, title : String, description : String, status : String, duedate : String }` | Create a todo (Authenticated user only)                                |
| `/todo`                            | GET    | -                                                                                                                   | `[{ user, project, title, description, status, duedate }]`                                                     | Get all user's todos (Authenticated user only)                         |
| `/todo?title=TITLE&?status=STATUS` | GET    | -                                                                                                                   | `[{ user, project, title, description, status, duedate }]`                                                     | Search user's todos by title / status / both (Authenticated user only) |
| `/todo/:id`                        | GET    | -                                                                                                                   | `{ user, project, title, description, status, duedate }`                                                       | Get a todo by id (Owners only)                                         |
| `/todo/:id`                        | PATCH  | `{ project : String } / { title : String } / { description : String } / { status : String } / { duedate : String }` | `{ user : String, project : String, title : String, description : String, status : String, duedate : String }` | Update field(s) of a todo with new data(s) by id (Owners only)         |
| `/todo/:id`                        | PUT    | `{ project : String, title : String, description : String, status : String, duedate : String }`                     | `{ user : String, project : String, title : String, description : String, status : String, duedate : String }` | Update all fields of a todo with new datas by id (Owners only)         |
| `/todo/:id`                        | DELETE | -                                                                                                                   | `{ user, project, title, description, status, duedate }`                                                       | Delete a todo by id (Owners only)                                      |

#### Project Routes
| Routes                                | Method | Request Body                                                                                                                      | Response Data                                                                                                               | Description                                                               |
|---------------------------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| `/project`                            | POST   | `{ user : Array, todo : Array, title : String, description : String, status : String, duedate : String }`                         | `{ admin : String, user : Array, todo : Array, title : String, description : String, status : String, duedate : String }`   | Create a project (Authenticated user only)                                |
| `/project`                            | GET    | -                                                                                                                                 | `[{ admin : String, user : Array, todo : Array, title : String, description : String, status : String, duedate : String }]` | Get all user's projects (Authenticated user only)                         |
| `/project?title=TITLE&?status=STATUS` | GET    | -                                                                                                                                 | `[{ admin : String, user : Array, todo : Array, title : String, description : String, status : String, duedate : String }]` | Search user's projects by title / status / both (Authenticated user only) |
| `/project/:id`                        | GET    | -                                                                                                                                 | `{ admin : String, user : Array, todo : Array, title : String, description : String, status : String, duedate : String }`   | Get a project by id (Owners only)                                         |
| `/project/:id`                        | PATCH  | `{ user : Array } / { todo : Array }/ { title : String } / { description : String } / { status : String } / { duedate : String }` | `{ admin : String, user : Array, todo : Array, title : String, description : String, status : String, duedate : String }`   | Update field(s) of a project with new data(s) by id (Owners only)         |
| `/project/:id`                        | PUT    | `{ user : Array, todo : Array, title : String, description : String, status : String, duedate : String }`                         | `{ admin : String, user : Array, todo : Array, title : String, description : String, status : String, duedate : String }`   | Update all fields of a project with new datas by id (Owners only)         |
| `/project/:id`                        | DELETE | -                                                                                                                                 | `{ admin : String, user : Array, todo : Array, title : String, description : String, status : String, duedate : String }`   | Delete a project by id (Owners only)                                      |
