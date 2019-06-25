# fancy-todo
fancy-todo
End Route Documentation : 

| Routes           | HTTP   | Header(s) | Body                                                         | Response                                                     | Description                                                 |
| ---------------- | ------ | --------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| `/login   `        | `POST`   | `none`      | **email**(required) : String, **password**(required) : String | **Success** : (200) show task of authenticated user, **Error** : (500) : Internal Server Error | User can login                                              |
| `/loginGoogle   `       | `POST`   | `none`      | **email**(required) of Gmail, **password**(required) of Gmail | **Success** : (200) show task of authenticated user, **Error** : (500) : Internal Server Error | User can login with Google email                            |
| `/register`        | `POST`   | `none`      | **email**(required) : String, **password**(required) : String | **Success** : (200) show login form**Error** : (500) : Internal Server Error | User signing up as a new user                               |
| `/todos`    | `POST`   | `token`     | **name**(required) : String, **dueDate** : Date, **description**: String, **Status** : String, **userId** : ObjectId | **Success** : (200) Created a new task **Error** : (500) : Internal Server Error | Create a new task                                           |
| `/todos`   | `GET` | `token`   |   none    | **Success** : (200) Fetch Data **Error** : (500) : Internal Server Error  | Show all tasks for authenticated user
| `/todos/showTips `       | `GET`    | `token`     | none                                                         | **Success** : (200) Fetch Data **Error** : (500) : Internal Server Error | Show video Tips from youtube                   |
| `/todos/:id` | `PATCH`    | `token`     | none                                                         | **Success** : (200) Updated status and completedAt **Error** : (500) : Internal Server Error | Updating a name, description,status and due date |
| `/todos/:id` | `DELETE` | `token`     | none                                                         | **Success** : (200) The task has been removed, **Error** : (500) : Internal Server Error | Remove the task                                             |

Usage :

```javascript
npm install
node app.js
```

Access client via `http://localhost:8080`<br>


## Keterangan:
* Login menggunakan third party belom bisa jalan, masih terdapat error
* Tampilan masih suka berantakan (show hide nya suka ngaco)