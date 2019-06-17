# Fancy Todo
**What ToDo Today**
----------------------------------------

## Endpoint

#### User Routes
| Routes| Method | Request Body | Response Data| Response Error | Description |
|----------------------|--------|-----------------------------|-----------------------------------|--|---------------------------------------------------------------|
| `/user/register`| POST | `{ username, email, password }` | `Registered User Info` | 400 ( Email is already taken!) <br>400 (Email is empty!) <br>400 (Password is empty!) <br> 40- (Username is empty!) <br>400 (Username is already taken!)  |Register with new user info|
| `/user/login` | POST | `{ username, password }`| `{ access_token }`| 400 (Invalid username/password) |Login and get an access token and name |
| `/user/signingoogle` | POST | `{ id_token }` | `{ username, access_token }` | |Sign in with Google|


#### Todo Routes(Requires Token)
| Routes | Method | Request Body | Response Success | Response Error | Description|
|-----------------------------------|--------|----------------------------------|------------------|---------------------|------------------------------------------------------------------------------|
| `/todo/bored?type={type}`| GET | -| `{ data }`| 401 (Login first) <br> 500 (Internal Server Error) | Generates random task based on the selected `{type}` |
| `/todo/all` | GET | -| `{ data }` | 401 (Login first) <br> 500 (Internal Server Error) | Retrieves all tasks from current logged in `{user}` |
| `/todo/create`| POST | `{ task, time, type, status }` | `{ data }`| 401 (Login first)  <br>  500 (Internal Server Error) | Create todo (Authenticated user only) |
| `/todo/update?id={taskId}` | PUT| -| `{ task, time, type, status }`| 401 (Login first)  <br>  500 (Internal Server Error)| Updates `{task, time, type, status}` of the selected Todo  |
| `/todo/delete?id={taskId}` | DELETE | - | - | 401 (Login first) <br> 500 (Internal Server Error) | Deletes selected Todo |