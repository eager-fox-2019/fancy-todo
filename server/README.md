# HACKTODO
## This App Built With Express and Mongoose
## how to run this APP


1. Make sure you installed

    * git
    * nodeJs
    * npm
    * mongodb

2. Create .env file containing your database credentials , you can check env template 

3. setup commands
    * git clone https://github.com/dedysimamora/fancy-todo.git
    * cd node-rest-api.
    * npm install

4. running the app

    * Run `npm run dev` to start the server.

    * Run `live-server --host=localhost` to start the client


### Routes List


| Route | HTTP | Headers(s) | Body | Description | Response Success | Response Error |
| ----- | ---- | ---------- | ---- | ----------- | ---------------- | -------------- |
| `/users/login/` | **POST** | none       | email: String (**required**),  password: String (**required**) | Log in as registered user | Show response  in `object` : { token: String, email:String} with status code 200 | Status code 500 |
| `/users/register` | **POST** | none | first_name:string(**required**), last_name:string(**required**),email: String (**required**),  password: String (**required**) | Register as new user | Response an`object` {_id, email} | Status code 500 |
| `/users/googlelogin` | **POST** | none       | tokenId | Log in with google account | Show response  in `object` : { token: String, email:String} with status code 200 | Status code 500 |
| `/todo` | **GET** | Token | none | Find All todo | Response an`array of objects` {todo} | Status code 500 |
| `/todo/[id]` | **GET** | Token | none | Find one todo | Response an `objects` {todo} | Status code 500 |
| `todo/create` | **POST** | Token | name:string(**required**), description:string(**required**),description: String (**required**), dueDate:Date, importantStatus: Boolean (**required**) | Add todo  | Response an`object` {todo} | Status code 500 |
| `todo/[id]` | **DELETE** | email | none | Delete todo  | Response status 200 | Status code 500 |
| `todo/[id]` | **PUT** | Token | name:string(**required**), description:string(**required**),description: String (**required**), dueDate:Date, importantStatus: Boolean (**required**) | update todo  | Response an`object` {todo} | Status code 500 |

## This app can send email remainder 30 minutes before task due
