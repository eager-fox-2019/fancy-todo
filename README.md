# fancy-todo
fancy-todo

**Fancy Todo** (Portofolio Project Week 1)
----------------------------------------

## Endpoint

### *Doesn't Require Token*

#### User Routes
| Routes               | Method | Request Body                | Response Data                            | Description                                                     |
| -------------------- | ------ | --------------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| `/user/register`     | POST   | `{ name, email, password }` | `{ access-token }`                       | > Register with new user info                                   |
| `/user/login`        | POST   | `{ email, password }`       | `{ name, email, access-token }`          | Login and get an access token and name                          |
| `/user/signingoogle` | POST   | `{ id_token }`              | `{ name, email, newPass, access-token }` | Sign in with Google and get an access token, name, new password |

### *Require Token* (`{ headers: { access-token } }`)

#### User Routes
| Routes  | Method | Request Body          | Response Data                   | Description                            |
| ------- | ------ | --------------------- | ------------------------------- | -------------------------------------- |
| `/user` | GET    | - | `[{ _id, name, email }]` | Get all users data (Authenticated user only) |

#### Todos Routes
| Routes                             | Method | Request Body                                                           | Response Data                                              | Description                                                            |
| ---------------------------------- | ------ | ---------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------- |
| `/todo`                            | POST   | `{ project, title, description, status, duedate }`                     | `{ user, project, title, description, status, duedate }`   | Create a todo (Authenticated user only)                                |
| `/todo`                            | GET    | -                                                                      | `[{ user, project, title, description, status, duedate }]` | Get all user's todos (Authenticated user only)                         |
| `/todo?title=TITLE&?status=STATUS` | GET    | -                                                                      | `[{ user, project, title, description, status, duedate }]` | Search user's todos by title / status / both (Authenticated user only) |
| `/todo/:id`                        | GET    | -                                                                      | `{ user, project, title, description, status, duedate }`   | Get a todo by id (Owners only)                                         |
| `/todo/:id`                        | PATCH  | `{ project } / { title } / { description } / { status } / { duedate }` | `{ user, project, title, description, status, duedate }`   | Update field(s) of a todo with new data(s) by id (Owners only)         |
| `/todo/:id`                        | PUT    | `{ project, title, description, status, duedate }`                     | `{ user, project, title, description, status, duedate }`   | Update all fields of a todo with new datas by id (Owners only)         |
| `/todo/:id`                        | DELETE | -                                                                      | `{ user, project, title, description, status, duedate }`   | Delete a todo by id (Owners only)                                      |

#### Project Routes
| Routes                                | Method | Request Body                                              | Response Data                                                      | Description                                                               |
| ------------------------------------- | ------ | --------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `/project`                            | POST   | `{ [user], [todo], title, description, status, duedate }` | `{ admin, [user], [todo], title, description, status, duedate }`   | Create a project (Authenticated user only)                                |
| `/project`                            | GET    | -                                                         | `[{ admin, [user], [todo], title, description, status, duedate }]` | Get all user's projects (Authenticated user only)                         |
| `/project?title=TITLE&?status=STATUS` | GET    | -                                                         | `[{ admin, [user], [todo], title, description, status, duedate }]` | Search user's projects by title / status / both (Authenticated user only) |
| `/project/:id`                        | GET    | -                                                         | `{ admin, [user], [todo], title, description, status, duedate }`   | Get a project by id (Owners only)                                         |
| `/project/:id`                        | PATCH  | `{ [user]/ [todo]/ title/ description/ status/ duedate }` | `{ admin, [user], [todo], title, description, status, duedate }`   | Update field(s) of a project with new data(s) by id (Owners only)         |
| `/project/:id`                        | PUT    | `{ [user], [todo], title, description, status, duedate }` | `{ admin, [user], [todo], title, description, status, duedate }`   | Update all fields of a project with new datas by id (Owners only)         |
| `/project/:id`                        | DELETE | -                                                         | `{ admin, [user], [todo], title, description, status, duedate }`   | Delete a project by id (Owners only)                                      |
