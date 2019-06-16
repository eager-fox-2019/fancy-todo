# fancy-todo
# Trail Work

## Geting Started
- npm init
- npm install
- Run `nodemon app.js or npm run dev` to start the server.
- Run `live-server --host=localhost` to start the client

## Routes
### User Route
| Route             | HTTP       | Description                              | Success Res        | Error Res  |
|-------------------|:-----------|:-----------------------------------------| :------------------| :----------|
| /users/register     | POST       | Register new user                        | 201: object user created | 500: internal server error
| /users/login        | POST       | Login                                    | 200: token containing id, firstName, lastName, email | 404: user not found, 400: wrong username/password, 500: internal server error
| /users/loginGoogle        | POST       | Login                                    | 200: token containing id, username | 404: user not found, 400: wrong username/password, 500: internal server error


### Todo Route
| Route             | HTTP       | Description                              | Success Res        | Error Res  |
|-------------------|:-----------|:-----------------------------------------| :------------------| :----------|
| /todos        | GET        | Get all user's todo (Authenticated users only)                      | 200: array of object all todos created by user | 500: internal server error
| /todos/details/:id    | GET        | Get a single todo (Authenticated users only)           | 200: object of todo | 403: not authorized, 404: todo not found, 500: internal server error
| /todos/:status    | GET        | Get all user's todo with specific status (Authenticated users only)           | 200: array object of todo | 403: not authorized, 404: todo not found, 500: internal server error
| /todos/status/deadline    | GET        | Get all user's todo with dueDate is tomorrow (Authenticated users only)           | 200: array object of todo | 403: not authorized, 404: todo not found, 500: internal server error
| /todos        | POST       | Create a todo (Authenticated users only) | 201: object todo created | 403: not authenticated, 500: internal server error
| /todos/:id    | DELETE     | Delete a todo (Authenticated and authorizedusers only)               | 200: info of deleted todo's |403: not authorized, 404: todo not found, 500: internal server error
| /todos/:id    | PATCH        | Update a todo to status complete (Authenticated and authorizedusers only) | 200: updated todos object | 403: not authorized, 404: todo not found, 500: internal server error
| /todos/:id/:status    | PATCH      | Update a todo to status (Authenticated and authorizedusers only) | 200: updated todos object | 403: not authorized, 404: todo not found, 500: internal server error

