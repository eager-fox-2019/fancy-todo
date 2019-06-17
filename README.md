# Fancy Todo
Fancy Todo - Tugas Portofolio Week 1
----------------------------------------

## Endpoint

#### User Routes (Token not required)
| Routes| Method | Request Body | Response Data| Response Error | Description |
|----------------------|--------|-----------------------------|-----------------------------------|--|---------------------------------------------------------------|
| `/user/create`| POST | `{ username, email, password }` | `{ token }` | 400 (Email has been registered!) <br>400 (Email not valid!) <br> 400 (Password minimum 6 characters!) |Create new user.|
| `/user/login` | POST | `{ email, password }`| `{ username, token }`| 400 (Email/Password invalid!) |Login to get access token and username |
| `/user/google` | POST | `{ id_token }` | `{ token }` | |Sign in/Register with Google and get access token |

### *Require Token*

#### Todo Routes (`{ headers: { token } }`)
| Routes | Method | Request Body | Response Success | Response Error | Description|
|-----------------------------------|--------|----------------------------------|------------------|---------------------|------------------------------------------------------------------------------|
| `/todo`| GET | -| `{ data }`| 400 (Invalid Token)<br> 401 (Token not found) <br> 500 (Internal Server Error) | Get all user's todos (Owner only)|
| `/todo/create`| POST | `{ name, description, due_date }` | `{ data }`| 400 (Unverified Token)<br> 401 (Token not found) <br> 500 (Internal Server Error) | Create todo (Owner only) |
| `/todo/edit/:todoId` | PATCH| `{ name, description, due_date, status}`| `{ data }`| 400 (Invalid Token)<br> 401 (Token not found) <br>  404 (Task not found) <br> 500 (Internal Server Error) | Edit todo element(s) (Owner only) |
| `/todo/delete/:id` | DELETE | - | - | 400 (Invalid Token)<br> 401 (Token not found) <br> 404 (Task not found) <br> 500 (Internal Server Error) | Delete todo (Owners only) |