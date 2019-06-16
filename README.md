# fancy-todo

### http://fancytodo-v2.sukmaranggapradeta.com

### Register :

```sh
URL: http://fancytodo2-server.sukmaranggapradeta.com/users/register
METHOD : POST
AUTHENTICATE: NO
AUTHORIZE: NO
Data Input / req.body:
    {
        name: ironman
        email: ironman@gmail.com
        password: ironman
    }
Response Status : 201 Created
    {
        "_id": "5d0658aa8b95571482f72308",
        "name": "ironman",
        "email": "ironman@gmail.com",
        "password": "$2a$10$kQn5Brn7LtNJzMIHpnDlj.em3Kr6mYd1/pvs.KoiqatpYPQpo69Z2",
        "__v": 0
    }
-----------------------------------------------------------------
IF Error
Response Status : 500
    {
        "message": "Internal Server Error!"
    }
---------------------------------------------------------------
If email format wrong
Response Status : 400 Bad Request
    {
        "message": "User validation failed: email: Invalid format email"
    }
---------------------------------------------------------------
If email duplikat
Response Status : 400 Bad Request
    {
        "message": "User validation failed: email: Email is already registered"
    }
--------------------------------------------------------------
If name, email or password empty
Response Status : 400 Bad Request
{
    "message": "User validation failed: name: Name is required, email: Email is required, password: Password is required"
}
```


### Login :

```sh
http://fancytodo2-server.sukmaranggapradeta.com/users/login
METHOD : POST
AUTHENTICATE: NO
AUTHORIZE: NO
Data Input / req.body:
    {
        email: ironman@mail.com
        password: ironman
    }
Response Status : 200 OK
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMDY1OGFhOGI5NTU3MTQ4MmY3MjMwOCIsImVtYWlsIjoiaXJvbm1hbkBnbWFpbC5jb20iLCJpYXQiOjE1NjA2OTc2NDMsImV4cCI6MTU2MDc4NDA0M30.sRL02p3M2mR_ECeI2s3jXOZ_j0ykoFWZrAbFGm8saTY",
        "id": "5d0658aa8b95571482f72308",
        "name": "ironman",
        "email": "ironman@gmail.com"
    }
----------------------------------------------------------------
If Error:
Response Status : 500
    {
        "message": "Internal Server Error!"
    }
---------------------------------------------------------------
If email or password wrong:
Response Status : 400
   {
        "message": "email/password wrong!"
    }
```

### Get Users :

```sh
URL: http://fancytodo2-server.sukmaranggapradeta.com/users
METHOD : GET
AUTHENTICATE: NO
AUTHORIZE: NO

Response Status : 200 OK
[
    {
        "_id": "5d05ec7d73bcfa62648851a7",
        "name": "naruto",
        "email": "naruto@gmail.com",
        "password": "$2a$10$CdoTX.WWgxkJNLFiAjBz6u0ntrIzuSF7ELwKAit98.iq3y9pvHVbS",
        "__v": 0
    },
    {...},
    {...},
    {...},
]
-----------------------------------------------------------------
IF Error:
Response Status : 500
    {
        "message": "Internal Server Error!"
    }
```

### Create Todos :

```sh
URL: http://fancytodo2-server.sukmaranggapradeta.com/todos
METHOD : POST
AUTHENTICATE: YES
AUTHORIZE: NO
DATA: 
{
    name: Postman
    description: Testing
    due_date: Wednesday Jun 26, 2019
    owner: 5d0658aa8b95571482f72308
}
HEADERS: 
{
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMDY1OGFhOGI5NTU3MTQ4MmY3MjMwOCIsImVtYWlsIjoiaXJvbm1hbkBnbWFpbC5jb20iLCJpYXQiOjE1NjA2OTc2NDMsImV4cCI6MTU2MDc4NDA0M30.sRL02p3M2mR_ECeI2s3jXOZ_j0ykoFWZrAbFGm8saTY    
}

Response Status : 201 Created
{
    "owner": [
        "5d0658aa8b95571482f72308"
    ],
    "members": [],
    "_id": "5d0662198b95571482f7230a",
    "name": "Postman",
    "description": "Testing",
    "status": "todo",
    "due_date": "Wednesday Jun 26, 2019",
    "createdAt": "2019-06-16T15:36:57.097Z",
    "updatedAt": "2019-06-16T15:39:47.386Z",
    "__v": 0
}
-----------------------------------------------------------------
IF Error:
Response Status : 500
    {
        "message": "Internal Server Error!"
    }
```

### Get Todos :

```sh
URL: http://fancytodo2-server.sukmaranggapradeta.com/todos
METHOD : GET
AUTHENTICATE: YES
AUTHORIZE: NO
HEADERS: 
{
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMDY1OGFhOGI5NTU3MTQ4MmY3MjMwOCIsImVtYWlsIjoiaXJvbm1hbkBnbWFpbC5jb20iLCJpYXQiOjE1NjA2OTc2NDMsImV4cCI6MTU2MDc4NDA0M30.sRL02p3M2mR_ECeI2s3jXOZ_j0ykoFWZrAbFGm8saTY    
}

Response Status : 200 OK
[
    {
        "owner": [
            {
                "_id": "5d05ec7d73bcfa62648851a7",
                "name": "naruto",
                "email": "naruto@gmail.com",
                "password": "$2a$10$CdoTX.WWgxkJNLFiAjBz6u0ntrIzuSF7ELwKAit98.iq3y9pvHVbS",
                "__v": 0
            }
        ],
        "members": [],
        "_id": "5d0647dc8b95571482f72302",
        "name": "Learn Vue",
        "description": "Mastering Vue in 30minutes",
        "status": "todo",
        "due_date": "Monday Jun 17, 2019",
        "projectId": "null",
        "createdAt": "2019-06-16T13:45:00.972Z",
        "updatedAt": "2019-06-16T13:45:00.972Z",
        "__v": 0
    },
    {...},
    {...}
]
-----------------------------------------------------------------
IF Error:
Response Status : 500
    {
        "message": "Internal Server Error!"
    }
```

### Update Todos :

```sh
URL: http://fancytodo2-server.sukmaranggapradeta.com/todos/:todosId
Example: http://fancytodo2-server.sukmaranggapradeta.com/todos/5d0662198b95571482f7230a
AUTHENTICATE: YES
AUTHORIZE: YES
METHOD : PUT
HEADERS: 
{
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMDY1OGFhOGI5NTU3MTQ4MmY3MjMwOCIsImVtYWlsIjoiaXJvbm1hbkBnbWFpbC5jb20iLCJpYXQiOjE1NjA2OTc2NDMsImV4cCI6MTU2MDc4NDA0M30.sRL02p3M2mR_ECeI2s3jXOZ_j0ykoFWZrAbFGm8saTY    
}
DATA: 
{
    <field>: <value>
}
Response Status : 200 OK
----------------------------------------------------------
IF Error:
Response Status : 500
    {
        "message": "Internal Server Error!"
    }
```

### Delete Todos :

```sh
URL: http://fancytodo2-server.sukmaranggapradeta.com/todos/:todosId
EXAMPLE: http://fancytodo2-server.sukmaranggapradeta.com/todos/5d0662198b95571482f7230a
AUTHENTICATE: YES
AUTHORIZE: YES
METHOD : DELETE
HEADERS: 
{
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMDY1OGFhOGI5NTU3MTQ4MmY3MjMwOCIsImVtYWlsIjoiaXJvbm1hbkBnbWFpbC5jb20iLCJpYXQiOjE1NjA2OTc2NDMsImV4cCI6MTU2MDc4NDA0M30.sRL02p3M2mR_ECeI2s3jXOZ_j0ykoFWZrAbFGm8saTY    
}

Response Status : 200 Created
{
    "owner": [
        "5d0658aa8b95571482f72308"
    ],
    "members": [],
    "_id": "5d0662198b95571482f7230a",
    "name": "Postman",
    "description": "Testing",
    "status": "todo",
    "due_date": "Wednesday Jun 26, 2019",
    "createdAt": "2019-06-16T15:36:57.097Z",
    "updatedAt": "2019-06-16T15:39:47.386Z",
    "__v": 0
}
-----------------------------------------------------------------
IF Error:
Response Status : 500
    {
        "message": "Internal Server Error!"
    }
-----------------------------------------------------------------
IF Token empty or wrong:
Response Status : 401 Unauthorized
    {
        "message": "Unauthorized"
    }
```

### Create Project  :

```sh
URL: http://fancytodo2-server.sukmaranggapradeta.com/projects/:memberId
EXAMPLE: http://fancytodo2-server.sukmaranggapradeta.com/projects/5d05ec7d73bcfa62648851a7
AUTHENTICATE: YES
AUTHORIZE: NO
METHOD : POST
HEADERS: 
{
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMDY1OGFhOGI5NTU3MTQ4MmY3MjMwOCIsImVtYWlsIjoiaXJvbm1hbkBnbWFpbC5jb20iLCJpYXQiOjE1NjA2OTc2NDMsImV4cCI6MTU2MDc4NDA0M30.sRL02p3M2mR_ECeI2s3jXOZ_j0ykoFWZrAbFGm8saTY    
}

Response Status : 200 OK
{
    "member": [
        "5d05ec7d73bcfa62648851a7",
        "5d0658aa8b95571482f72308"
    ],
    "_id": "5d066b418b95571482f7230d",
    "name": "Senam",
    "createdAt": "2019-06-16T16:16:01.554Z",
    "updatedAt": "2019-06-16T16:16:01.554Z",
    "__v": 0
}
-----------------------------------------------------------------
IF Error:
Response Status : 500
    {
        "message": "Internal Server Error!"
    }
-----------------------------------------------------------------
IF project name empty:
Response Status : 400 Bad Reques
{
    "message": "Project validation failed: name: Project Name is Required"
}
-----------------------------------------------------------------
IF Token empty or wrong:
Response Status : 401 Unauthorized
    {
        "message": "Unauthorized"
    }
```

### Get Project  :

```sh
URL: http://fancytodo2-server.sukmaranggapradeta.com/projects/:memberId
EXAMPLE: http://fancytodo2-server.sukmaranggapradeta.com/projects/5d05ec7d73bcfa62648851a7
AUTHENTICATE: YES
AUTHORIZE: NO
METHOD : GET
HEADERS: 
{
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMDY1OGFhOGI5NTU3MTQ4MmY3MjMwOCIsImVtYWlsIjoiaXJvbm1hbkBnbWFpbC5jb20iLCJpYXQiOjE1NjA2OTc2NDMsImV4cCI6MTU2MDc4NDA0M30.sRL02p3M2mR_ECeI2s3jXOZ_j0ykoFWZrAbFGm8saTY    
}

Response Status : 200 OK
[
    {
        "member": [
            {
                "_id": "5d05ec7d73bcfa62648851a7",
                "name": "naruto",
                "email": "naruto@gmail.com",
                "password": "$2a$10$CdoTX.WWgxkJNLFiAjBz6u0ntrIzuSF7ELwKAit98.iq3y9pvHVbS",
                "__v": 0
            },
            {...},
            {...}
        ],
        "_id": "5d0648108b95571482f72303",
        "name": "Naruto Project",
        "owner": {
            "_id": "5d05ec7d73bcfa62648851a7",
            "name": "naruto",
            "email": "naruto@gmail.com",
            "password": "$2a$10$CdoTX.WWgxkJNLFiAjBz6u0ntrIzuSF7ELwKAit98.iq3y9pvHVbS",
            "__v": 0
        },
        "createdAt": "2019-06-16T13:45:52.835Z",
        "updatedAt": "2019-06-16T13:45:56.019Z",
        "__v": 0
    }
]
-----------------------------------------------------------------
IF Error:
Response Status : 500
    {
        "message": "Internal Server Error!"
    }
-----------------------------------------------------------------
IF Token empty or wrong:
Response Status : 401 Unauthorized
    {
        "message": "Unauthorized"
    }
```


### Update Project  :

```sh
URL: http://fancytodo2-server.sukmaranggapradeta.com/projects/:projectId
EXAMPLE: http://fancytodo2-server.sukmaranggapradeta.com/projects/5d066b728b95571482f7230e
AUTHENTICATE: YES
AUTHORIZE: YES
METHOD : PUT
HEADERS: 
{
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMDY1OGFhOGI5NTU3MTQ4MmY3MjMwOCIsImVtYWlsIjoiaXJvbm1hbkBnbWFpbC5jb20iLCJpYXQiOjE1NjA2OTc2NDMsImV4cCI6MTU2MDc4NDA0M30.sRL02p3M2mR_ECeI2s3jXOZ_j0ykoFWZrAbFGm8saTY    
}
DATA:
{
    <field>:<value>
}
Response Status : 200 OK
-----------------------------------------------------------------
IF Error:
Response Status : 500
    {
        "message": "Internal Server Error!"
    }
-----------------------------------------------------------------
IF Token empty or wrong:
Response Status : 401 Unauthorized
    {
        "message": "Unauthorized"
    }
-----------------------------------------------------------------
IF not project creator:
    {
        "message": "You dont have access"
    }
```

### Delete Project  :

```sh
URL: http://fancytodo2-server.sukmaranggapradeta.com/projects/:projectId
EXAMPLE: http://fancytodo2-server.sukmaranggapradeta.com/projects/5d066b728b95571482f7230e
AUTHENTICATE: YES
AUTHORIZE: YES
METHOD : DELETE
HEADERS: 
{
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMDY1OGFhOGI5NTU3MTQ4MmY3MjMwOCIsImVtYWlsIjoiaXJvbm1hbkBnbWFpbC5jb20iLCJpYXQiOjE1NjA2OTc2NDMsImV4cCI6MTU2MDc4NDA0M30.sRL02p3M2mR_ECeI2s3jXOZ_j0ykoFWZrAbFGm8saTY    
}

Response Status : 200 OK
{
    "member": [
        "5d05ec7d73bcfa62648851a7",
        "5d0658aa8b95571482f72308"
    ],
    "_id": "5d066b418b95571482f7230d",
    "name": "Senam",
    "createdAt": "2019-06-16T16:16:01.554Z",
    "updatedAt": "2019-06-16T16:16:01.554Z",
    "__v": 0
}
-----------------------------------------------------------------
IF Error:
Response Status : 500
    {
        "message": "Internal Server Error!"
    }
-----------------------------------------------------------------
IF Token empty or wrong:
Response Status : 401 Unauthorized
    {
        "message": "Unauthorized"
    }
-----------------------------------------------------------------
IF not project creator:
    {
        "message": "You dont have access"
    }
```
