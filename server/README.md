# Fancy Todo App API
## Routing
### User Account Endpoint

> #### Register new account

* route: 
  * POST /api/user/register
* request:
  * body:
    * { name: String, email: String, password: String}
* success response:
  * 201: { name: String, email: String }
* error response:
  * 400:
    * email address is not valid mail address format
    * email address is already used

> #### Login
* route:
  * POST /api/user/login
* request:
  * body:
    * { email: String, password: String }
* success response:
  * 200: { token: String, name: String }
* error response:
  * 404:
    * Invalid email/password

> #### Signin with google

* route:
  * POST /api/user/glogin
* request:
  * header:
    * { token: String }
* success response:
  * 200: { token: String, name: String }


### Todo App Endpoint
> #### Add new task
* route:
  * /api/todo/create
* request:
  * header:
    * { token: String }
  * body:
    * { name: String, description: String }
* success response:
  * 200:
    * { _id: ObjectId, userId: ObjectId, name: String, description: String }
* error response:
  * 400: 
    * No Token provided
    * Invalid Token
  * 401:
    * Unauthrized access
  * 500:
    * Internal server error

> #### List task by user
* route:
  * /api/todo/list
* request:
  * header:
    * { token: String }
  * param:
    * { status: String }
* success response:
  * 200:
    * [{ _id: ObjectId, userId: ObjectId, name: String, description: String }]
* error response:
  * 400: 
    * No Token provided
    * Invalid Token
  * 401:
    * Unauthrized access
  * 500:
    * Internal server error

> #### Update status
* route:
  * /api/todo/update/:id
* request:
  * header:
    * { token: String }
  * param:
    * { status: String }
* success response:
  * 200:
    * [{ _id: ObjectId, userId: ObjectId, name: String, description: String }]
* error response:
  * 400: 
    * No Token provided
    * Invalid Token
  * 401:
    * Unauthrized access
  * 500:
    * Internal server error

> #### Delete Task
* route:
  * /api/todo/delete/:id
* request:
  * header:
    * { token: String }
* success response:
  * 200:
    * { message: 'success' }
* error response:
  * 400: 
    * No Token provided
    * Invalid Token
  * 401:
    * Unauthrized access
  * 500:
    * Internal server error

## Usage
Make sure you have node.js, npm and mongodb installed on your computer, and then run these commands:

> $ npm install

> $ npm run dev 

> $ npm start