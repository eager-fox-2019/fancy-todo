# fancy todos
# link deploy = http://fancytodoz.muhamadnabila.com/
## First Initial
### URL : '/authenticate'
* METHOD : POST
* AUTHENTICATION : YES
* HEADERS : { token : < jwt_token > }
* RESPONSE STATUS : 200
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```

## List of user routes
### URL : '/register'
* METHOD : POST
* BODY : 
    ```
    {
        name : ""
        email : ""
        password : ""
    }
    ```
* AUTHENTICATION : NO
* RESPONSE STATUS : 201
    ``` 
    OUTPUT : {
        name : ""
        id : ""
        token : < jwt_token >
    }
    ```
* RESPONSE STATUS : 500
    ``` 
    OUTPUT {
        message : "Internal server error"
    }
    ```

### URL : '/login'
* METHOD : POST
* BODY : 
    ```
    {
        name : ""
        email : ""
        password : ""
    }
    ```
* AUTHENTICATION : NO
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        name : ""
        id : ""
        token : < jwt_token >
    }
    ```
* RESPONSE STATUS : 400
    ``` 
    OUTPUT : {
        message : "username / password invalid"
    }
    ```
* RESPONSE STATUS : 500
    ``` 
    OUTPUT {
        message : "Internal server error"
    }
    ```
### URL : '/google/login'
* METHOD : POST
* BODY : 
    ```
    {
        id_token : ""
    }
    ```
* AUTHENTICATION : NO
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        name : ""
        id : ""
        token : < jwt_token >
    }
    ```
* RESPONSE STATUS : 500
    ``` 
    OUTPUT {
        message : "Internal server error"
    }
    ```
### URL : '/user'
* METHOD : GET
* AUTHENTICATION : YES
* HEADERS : 
    ```
    {
        token : < jwt_token >
    }
    ```
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        _id : ""
        name : ""
        email : ""
        password : < hashed_bcyrptjs >
        token : < jwt_token >
    }
    ```
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```
* RESPONSE STATUS : 500
    ``` 
    OUTPUT {
        message : "Internal server error"
    }
    ```
## List of project routes
### URL : '/project'
* METHOD : POST
* AUTHENTICATION : YES
* HEADERS : 
    ```
    {
        token : < jwt_token >
    }
    ```
* BODY : 
    ```
    {
        title : ""
    }
    ```
* RESPONSE STATUS : 201
    ``` 
    OUTPUT : {
        _id : ""
        title : ""
        userId : ""
        members : []
        todos : []
    }
    ```
* RESPONSE STATUS : 404
    ``` 
    OUTPUT : {
        "Project validation failed: title: Title required."
    }
    ```
* RESPONSE STATUS : 404
    ``` 
    OUTPUT : {
        "Project validation failed: userId: userId required."
    }
    ```
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```
* RESPONSE STATUS : 500
    ```
    OUTPUT : {
        message : "Internal server error"
    }
    ```'

### URL : '/projects'
* METHOD : GET
* AUTHENTICATION : YES
* HEADERS : 
    ```
    {
        token : < jwt_token >
    }
    ```
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        _id : ""
        title : ""
        userId : ""
        members : []
        todos : []
    }
    ```
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```
* RESPONSE STATUS : 500
    ```
    OUTPUT {
        message : "internal server error"
    }
    ```
### URL : '/projects/:id'
* METHOD : GET
* AUTHENTICATION : YES
* HEADERS : 
    ```
    {
        token : < jwt_token >
    }
    ```
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        _id : ""
        title : ""
        userId : ""
        members : []
        todos : []
    }
    ```
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```
* RESPONSE STATUS : 400
    ``` 
    OUTPUT : {
        message : "Bad Request"
    }
    ```
* RESPONSE STATUS : 500
    ```
    OUTPUT {
        message : "internal server error"
    }
    ```
### URL : '/projects/:id'
* METHOD : DELETE
* AUTHENTICATION : YES
* AUTHORIZEPROJECT : YES
* HEADERS : 
    ```
    {
        token : < jwt_token >
    }
    ```
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        message : "Delete project successfully"
    }
    ```
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```
* RESPONSE STATUS : 400
    ``` 
    OUTPUT : {
        message : "Bad Request"
    }
    ```
* RESPONSE STATUS : 403
    ``` 
    OUTPUT : {
        message : "Forbidden"
    }
    ```
* RESPONSE STATUS : 500
    ```
    OUTPUT {
        message : "internal server error"
    }
    ```
### URL : '/projects/member/accept/:id'
* METHOD : PUT
* BODY : 
    ```
    {
        userId : ""
    }
    ```
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        _id : ""
        title : ""
        userId : ""
        members : []
        todos : []
    }
    ```
* RESPONSE STATUS : 400
    ``` 
    OUTPUT : {
        message : "Bad Request"
    }
    ```
* RESPONSE STATUS : 500
    ```
    OUTPUT {
        message : "internal server error"
    }
    ```
### URL : '/projects/todos/:projectId''
* METHOD : POST
* AUTHENTICATION : YES
* MEMBERAUTHENTICATION : YES
* HEADERS : 
    ```
    {
        token : < jwt_token >
    }
    ```
* BODY : 
    ```
    {
        title : "",
        description : "",
        due_date : "",
        projectId : ""
    }
    ```
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        _id : ""
        title : ""
        desription : ""
        due_date : ""
        userId : ""
        projectId : ""
    }
    ```
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```
* RESPONSE STATUS : 400
    ``` 
    OUTPUT : {
        message : "Bad Request"
    }
    ```
* RESPONSE STATUS : 403
    ``` 
    OUTPUT : {
        message : "Forbidden"
    }
    ```
* RESPONSE STATUS : 404
    ``` 
    OUTPUT : {
        "Project validation failed: title: Title required."
    }
    ```
* RESPONSE STATUS : 500
    ```
    OUTPUT {
        message : "internal server error"
    }
    ```
### URL : '/projects/todos/:projectId:id'
* METHOD : PUT
* AUTHENTICATION : YES
* MEMBERAUTHENTICATION : YES
* HEADERS : 
    ```
    {
        token : < jwt_token >
    }
    ```
* BODY : 
    ```
    {
        title : "",
        description : "",
        due_date : "",
        projectId : ""
    }
    ```
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        _id : ""
        title : ""
        desription : ""
        due_date : ""
        userId : ""
        projectId : ""
    }
    ```
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```
* RESPONSE STATUS : 400
    ``` 
    OUTPUT : {
        message : "Bad Request"
    }
    ```
* RESPONSE STATUS : 403
    ``` 
    OUTPUT : {
        message : "Forbidden"
    }
    ```
* RESPONSE STATUS : 404
    ``` 
    OUTPUT : {
        "Project validation failed: title: Title required."
    }
    ```
* RESPONSE STATUS : 500
    ```
    OUTPUT {
        message : "internal server error"
    }
    ```
### URL : '/projects/todos/:projectId/:todoId'
* METHOD : DELETE
* AUTHENTICATION : YES
* MEMBERAUTHENTICATION : YES
* HEADERS : 
    ```
    {
        token : < jwt_token >
    }
    ```
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        _id : ""
        title : ""
        userId : ""
        members : []
        todos : []
    }
    ```
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```
* RESPONSE STATUS : 400
    ``` 
    OUTPUT : {
        message : "Bad Request"
    }
    ```
* RESPONSE STATUS : 403
    ``` 
    OUTPUT : {
        message : "Forbidden"
    }
    ```
* RESPONSE STATUS : 404
    ``` 
    OUTPUT : {
        "Project validation failed: title: Title required."
    }
    ```
* RESPONSE STATUS : 500
    ```
    OUTPUT {
        message : "internal server error"
    }
    ```
### URL : '/member/:id'
* METHOD : POST
* ACTIVATE : "enable less secure app from GMAIL"
* AUTHENTICATION : YES
* HEADERS : 
    ```
    {
        token : < jwt_token >
    }
    ```
* BODY : 
    ```
    {
        userId : ""
    }
    ```
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        < output from nodemailer (npm) >
    }
    ```
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```
* RESPONSE STATUS : 400
    ``` 
    OUTPUT : {
        message : "Bad Request"
    }
    ```
* RESPONSE STATUS : 500
    ```
    OUTPUT {
        message : "internal server error"
    }
    ```
## list of todo routes
### URL : '/todos'
* METHOD : POST
* AUTHENTICATE : YES
* HEADERS : 
    ```
    {
        token : < jwt_token >
    }
    ```
* BODY : 
    ```
    {
        title : ""
        description : ""
        due_date : ""
        userId : ""
        projectId : ""
    }
    ```
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        _id : ""
        title : ""
        desription : ""
        due_date : ""
        userId : ""
        projectId : ""
    }
    ```
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```
* RESPONSE STATUS : 500
    ```
    OUTPUT {
        message : "internal server error"
    }
    ```
### URL : '/todos'
* METHOD : GET
* AUTHENTICATE : YES
* HEADERS : 
    ```
    {
        token : < jwt_token >
    }
    ```
* BODY : 
    ```
    {
        title : ""
        description : ""
        due_date : ""
        userId : ""
        projectId : ""
    }
    ```
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : [{
        _id : ""
        title : ""
        desription : ""
        due_date : ""
        userId : ""
        projectId : ""
    }]
    ```
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```
* RESPONSE STATUS : 500
    ```
    OUTPUT {
        message : "internal server error"
    }
    ```
### URL : '/todos/:id'
* METHOD : GET
* AUTHENTICATE : YES
* HEADERS : 
    ```
    {
        token : < jwt_token >
    }
    ```
* BODY : 
    ```
    {
        title : ""
        description : ""
        due_date : ""
        userId : ""
        projectId : ""
    }
    ```
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        _id : ""
        title : ""
        desription : ""
        due_date : ""
        userId : ""
        projectId : ""
    }
    ```
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```
* RESPONSE STATUS : 500
    ```
    OUTPUT {
        message : "internal server error"
    }
    ```
### URL : '/todos/:id'
* METHOD : PUT
* AUTHENTICATE : YES
* AUTHORIZETODO : YES
* HEADERS : 
    ```
    {
        token : < jwt_token >
    }
    ```
* BODY : 
    ```
    {
        title : ""
        description : ""
        due_date : ""
        userId : ""
        projectId : ""
    }
    ```
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        _id : ""
        title : ""
        desription : ""
        due_date : ""
        userId : ""
        projectId : ""
    }
    ```
* RESPONSE STATUS : 400
    ``` 
    OUTPUT : {
        message : "Bad Request"
    }
    ```
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```
* RESPONSE STATUS : 403
    ``` 
    OUTPUT : {
        message : "Bad Request"
    }
    ```
* RESPONSE STATUS : 500
    ```
    OUTPUT {
        message : "internal server error"
    }
    ```
### URL : '/todos/:id'
* METHOD : DELETE
* AUTHENTICATE : YES
* AUTHORIZETODO : YES
* HEADERS : 
    ```
    {
        token : < jwt_token >
    }
    ```
* BODY : 
    ```
    {
        title : ""
        description : ""
        due_date : ""
        userId : ""
        projectId : ""
    }
    ```
* RESPONSE STATUS : 200
    ``` 
    OUTPUT : {
        message : "Deleted todo successfully"
    }
    ```
* RESPONSE STATUS : 400
    ``` 
    OUTPUT : {
        message : "Bad Request"
    }
    ```
* RESPONSE STATUS : 401
    ``` 
    OUTPUT : {
        message : "Unauthorized"
    }
    ```
* RESPONSE STATUS : 403
    ``` 
    OUTPUT : {
        message : "Bad Request"
    }
    ```
* RESPONSE STATUS : 500
    ```
    OUTPUT {
        message : "internal server error"
    }
    ```