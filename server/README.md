# Fancy Todo
**Fancy Todo** (Tugas Portofolio Week 1)
----------------------------------------

## Endpoint

### *Doesn't Require Token*

#### User Routes
| Routes| Method | Request Body | Response Data| Response Error | Description |
|----------------------|--------|-----------------------------|-----------------------------------|--|---------------------------------------------------------------|
| `/user/register`| POST | `{ name, email, password }` | `{ access_token }` | 400 (`{email}` has been registered!) <br>400 (`{email}` is not a valid email!) <br> 400 (Password must be more or equal than 8 character!) |Register with new user info|
| `/user/login` | POST | `{ email, password }`| `{ name, access_token }`| 400 (Wrong email/password) |Login and get an access token and name |
| `/user/signingoogle` | POST | `{ id_token }` | `{ name, newPass, access_token }` | |Sign in with Google and get an access token, name, new password |

### *Require Token*

#### Todo Routes (`{ headers: { token } }`)
| Routes | Method | Request Body | Response Success | Response Error | Description|
|-----------------------------------|--------|----------------------------------|------------------|---------------------|------------------------------------------------------------------------------|
| `/todo/list`| GET | -| `{ data }`| 400 (Invalid Token)<br> 401 (Please login first) <br> 404 (User not found) <br> 500 (Internal Server Error) | Get all the user's todos (Authenticated user only)|
| `/todo/email` | GET | -| `{ message }` | 400 (Invalid Token)<br> 401 (Please login first) <br> 404 (User not found) <br> 500 (Internal Server Error) | Send email remainder containing todos 5 days ahead (Authenticated user only) |
| `/todo/filter/:field/:value` | GET | -| `{ data }`| 400 (Invalid Token)<br> 401 (Please login first) <br> 404 (User not found) <br> 500 (Internal Server Error) | Get all todo match with filter criteria (Authenticated user only)|
| `/todo/create`| POST | `{ name, description, dueDate }` | `{ data }`| 400 (Invalid Token)<br> 401 (Please login first) <br> 404 (User not found) <br> 500 (Internal Server Error) | Create todo (Authenticated user only) |
| `/todo/complete/:id` | PATCH| -| `{ data }`| 400 (Invalid Token)<br> 400 (Todo already completed) <br> 401 (Please login first) <br> 401 (Unauthorized) <br> 404 (User not found) <br> 404 (Todo not found) <br> 500 (Internal Server Error) | Change todo status to completed (Owner only) |
| `/todo/delete/:id` | DELETE | - | - | 400 (Invalid Token)<br> 401 (Please login first) <br> 401 (Unauthorized) <br> 404 (User not found) <br> 404 (Todo not found) <br> 500 (Internal Server Error) | Delete a todo (Owners only) |