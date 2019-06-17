# Fancy ToDo Server

## Getting Started
Please follow this through before you start and use the server.
1. Run this script in the terminal to install all dependencies
```
npm install
```
2. Create .env file. You could copy paste value in .env, from .env-template.
- JWT_TOKEN is used for package
- CLIENT_ID is used for google oAuth. You could get it here https://developers.google.com/identity/sign-in/web/sign-in

3. Run this in your terminal to start the server
```
npm run
```

# Route
## User
### Register Customer
Register new customer as default login path, not using third party oAuth.
URL : /user/register
Method : Post
Request Header : NONE
Request Body : 
```
{
  full_name: Robby Caesar Putra,
  username: robbycp,
  password; robbycp,
  email: robby@mail.com,
}
```
Success Status Code : 201
Success Response : No Response
Error Status Code : 400, 500
Error Response :
```
{
  message: 'User validation failed: username: robbycp is already in our database. Please use other username. email: robby@mail.com is already in our database. Please use other email'
}
```
### Login Customer
Login for both default login or oAuth google login. The difference is in the request body.
URL : /user/login
Method : Post
Request Header : NONE
#### Defaul Login
Request Body : 
```
{
  username: robbycp,
  password; robbycp,
}
```
Success Status Code : 200
Success Response : 
```
{ 
  token: 'jsfiowjoefi29sd9d8fsa0aef890ewf8s9a',
  full_name: Robby Putra 
}
```
#### Google Login
Request Body : 
```
{
  google_id_token: 'sfoiwf9ewfsd0fa90fasfdf90asf'
}
```
Success Status Code : 200
Success Response : 
```
{ 
  token: 'jsfiowjoefi29sd9d8fsa0aef890ewf8s9a',
  full_name: Robby Putra 
}
```

Error Status Code : 400, 500
Error Response :
```
{
  message: 'Username / password Invalid'
}
```
### Logout Customer
Logout for both default login user and google login user
URL : /user/register
Method : Post
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body : NONE
Success Status Code : 201
Success Response : 
```
{
  message: 'Successfully log out'
}
```
Error Status Code : 400, 500
Error Response :
```
{
  message: 'Internal Server Error'
}
```
### MyProfile Customer
Get login user basic profile data : full name, username, and email
URL : /user/myprofile
Method : Post
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body : NONE
Success Status Code : 201
Success Response : 
```
{ 
  full_name: 'robby caesar putra',
  username: 'robbycp',
  email: 'robby@gmail.com' 
}
```
Error Status Code : 400, 500
Error Response :
```
{
  message: 'Internal Server Error'
}
```

## Task
router.post('/', authentication, ControllerTask.create)
router.get('/', authentication, ControllerTask.read)
router.get('/:taskId', authentication, authorization,ControllerTask.readOne)
router.patch('/:taskId', authentication, authorization, ControllerTask.update)
router.delete('/:taskId', authentication, authorization, ControllerTask.delete)
router.put('/done/:taskId', authentication, authorization, ControllerTask.checkDone)
router.delete('/done/:taskId', authentication, authorization, ControllerTask.checkDone)

### Get All Tasks
Get all tasks that login user has been created.
URL : /task
Method : Get
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body : NONE
Success Status Code : 200
Success Response : 
```
[
  { 
    _id: 5d0534917b435249d04f76bc,
    title: 'belajar ngoding',
    note: 'disana',
    is_done: false, // boolean
    is_starred: false, // boolean
    is_late: false, // boolean
    user_id: 5cf0f0b0b7e65069eb905f7d,
    due_date: 2019-06-18T00:00:00.000Z,
    __v: 0 
  },
  {...} 
]
```
Error Status Code : 500
Error Response :
```
{
  message: 'Internal Server Error'
}
```
### Create New Task
Create new task for login user
URL : /task
Method : Post
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body : 
```
{
  title: 'testing title',
  note: 'testing note',
  due_date: '2019-08-08' // Format should be in YYYY-MM-DD
}
```
Success Status Code : 200
Success Response : 
```
[
  { 
    _id: 5d060e1ef325dc2ae51c90c2,
    title: 'test tambah task',
    note: 'task lagi dong',
    is_done: false,
    is_starred: false,
    is_late: false,
    user_id: 5cf0f0b0b7e65069eb905f7d,
    due_date: 2019-08-08T00:00:00.000Z, // if there is no due_date, due_date will be null
    __v: 0 
  },
  {...} 
]
```
Error Status Code : 500
Error Response :
```
{
  message: 'Internal Server Error'
}
```
### Get One Task
Get one detail task data, search by id given
URL : /:taskId
Method : Get
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body : NONE
Success Status Code : 200
Success Response : 
```
[
  { 
    _id: 5d060e1ef325dc2ae51c90c2,
    title: 'test tambah task',
    note: 'task lagi dong',
    is_done: false,
    is_starred: false,
    is_late: false,
    user_id: 5cf0f0b0b7e65069eb905f7d,
    due_date: 2019-08-08T00:00:00.000Z,
    __v: 0 
  },
  {...} 
]
```
Error Status Code : 500
Error Response :
```
{
  message: 'Internal Server Error'
}
```
### Delete One Task
Delete one task by given taskId
URL : /:taskId
Method : Delete
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body : NONE
Success Status Code : 201
Success Response : NONE
Error Status Code : 500
Error Response :
```
{
  message: 'Internal Server Error'
}
```
### Update One Task
Update one task by given taskId. Request body sent from the client doesn't have to be in complete field. It will update one field that send by the client
URL : /:taskId
Method : Patch
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body : 
```
// We could send only one field that we want to change. You could send all too
// example1 
{
  title: 'test update'
}
// example2 
{
  title: 'test update',
  note: 'test note update',
  due_date: '2019-08-08'
}
```
Success Status Code : 200
Success Response : NONE
Error Status Code : 500
Error Response :
```
{
  message: 'Internal Server Error'
}
```
### Set One Task Complete
Set complete status to one task, or set is_done to true 
URL : /done/:taskId
Method : Put
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body : NONE
Success Status Code : 201
Success Response : 
```
{ 
  _id: 5d0534917b435249d04f76bc,
  title: 'belajar ngoding',
  note: 'disana',
  is_done: true,
  is_starred: false,
  is_late: false,
  user_id: 5cf0f0b0b7e65069eb905f7d,
  due_date: 2019-06-18T00:00:00.000Z,
  __v: 0 
}
```
Error Status Code : 500
Error Response :
```
{
  message: 'Internal Server Error'
}
```
### Set One Task Uncomplete
Set uncomplete status to one task, or set is_done to false 
URL : /done/:taskId
Method : Put
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body : NONE
Success Status Code : 201
Success Response : 
```
{ 
  _id: 5d0534917b435249d04f76bc,
  title: 'belajar ngoding',
  note: 'disana',
  is_done: false,
  is_starred: false,
  is_late: false,
  user_id: 5cf0f0b0b7e65069eb905f7d,
  due_date: 2019-06-18T00:00:00.000Z,
  __v: 0 
}
```
Error Status Code : 500
Error Response :
```
{
  message: 'Internal Server Error'
}
```