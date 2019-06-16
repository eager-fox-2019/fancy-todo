# fancy-todo

# LIST OF USER ROUTES

Routes| Method | Request Body | Response Data| Response Error | Description 
------|--------|--------------|--------------|----------------|-------------
/user/signup | POST | email:string **required**, password:string **required** | { accessToken } | 400 - Email has already been registered| Register a new user
/user/login | POST |  email:string **required**, password:string **required** | { accessToken } | 400 -  Username/password incorrect | login with an existing user
/user/googlesign | POST | id_token **required** | { accessToken } | none | Sign in with Google API

# LIST OF TODO ROUTES

Routes| Method | Request Body | Response Data| Response Error | Description 
------|--------|--------------|--------------|----------------|-------------
/todo/findtodos | GET | none | list of all user todos | 401 - User unauthorized | list of todos based on logged user 
/todo/findtodos/checked | GET | none | list of all user finished todos | 401 - User unauthorized | list of finished todos based on logged user
/todo/findone/:id, | GET | none | lists todo data | 401 - User unauthorized | lists todo data of logged user based on todo id
/todo/add | POST | task:string **requried**, description:string, dueDate:string **required**, time:string, image:string | success notification } | 401 - User unauthorized, 400 - required fields are missing | adds a todo task based on logged user
/todo/upload | POST | imgUrl:string **required** | imgur link | 401 - User unauthorized | Uploads selected picture to Imgur database and returns the image link
/todo/delete/:id | DELETE | none | success message | 401 - User unauthorized | deletes a task from database based on todo id and logged user
/todo/checked/:id | PATCH | none | success message | 401 - User unauthorized | Marks todo task status as true indicating that the task has been done
/todo/update/:id | PATCH | task:string, description:string, dueDate:string, time:string | 401 - User unauthorized, 400 - required fields are missing |  Updates a todo task info based on its id and logged on user

