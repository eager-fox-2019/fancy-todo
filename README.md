# fancy-todo

## USAGE

Before using the API, makes sure you install these package on global by running this codes

```
 $ npm i -g live-server nodemon mongodb
```

Then just run these codes 
```
  $ npm install
  $ npm run dev
```

Now you're ready to use the routes below

---------------------------------------------

### Base URL Routes

Type this before any other routes below `http//localhost:3000/api`

Examples : `http//localhost:3000/api/users`

#### User Routes


| Routes| Method | Request Body | Response Data| Response Error | Description |
|----------------------|--------|-----------------------------|-----------------------------------|--|---------------------------------------------------------------|
| `/user`| POST | `{ username, email, password }` | `Registered User Info` | 400 ( Email is already taken!) <br>400 (Email is empty!) <br>400 (Password is empty!) <br> 40- (Username is empty!) <br>400 (Username is already taken!)  |Register with new user info|
| `/user/login` | POST | `{ username, password }`| `{ access_token }`| 400 (Invalid username/password) |Login and get an access token and email |
| `/user/facebookSignin` | POST |  | `{ email, access_token }` | | Sign in with Facebook|


#### Todo Routes


| Routes | Method | Request Body | Response Success | Response Error | Description|
|-----------------------------------|--------|----------------------------------|------------------|---------------------|------------------------------------------------------------------------------|
| `/todos` | GET | -| `{ data }` | 401 (Login first) <br> 500 (Internal Server Error) | Retrieves all tasks from current logged in `{user}` |
| `/todos/${todos._id}` | GET | -| `{ data }` | 401 (Login first) <br> 500 (Internal Server Error) | Retrieve one task by id from parameter |
| `/todos`| POST | `{ name, descriptiom, due_date }` | `{ created-task }`| 401 (Login first)  <br>  500 (Internal Server Error) | Create todo (Authenticated user only) |
| `/todos/${todos._id}` | PATCH| `{  name, description, due_date}`| `{  }`| 401 (Login first)  <br>  500 (Internal Server Error)| Updates `{}` of the selected Todo  |
| `/todos/status/${todos._id}` | PATCH| -| `{ updated task}`| 401 (Login first)  <br>  500 (Internal Server Error)| Update todos status to `true` |
| `/todos/${todos._id}` | DELETE | - | - | 401 (Login first) <br> 500 (Internal Server Error) | Deletes selected Todo |