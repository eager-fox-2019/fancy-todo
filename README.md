# fancy-todo
@hemhem 2020

### Fitur Tambahan
- WYSIWYG editor buat detail todo

### Alamat Aplikasi
- client: `https://khasburrahman.github.io/fancy-todo/`
- server: `https://hemhem-fancytodo.herokuapp.com/`

### Cara main
- buat file `.env` dari template `.envTemplate`
- jalankan server `npm run dev`
- jalankan client `npm run client-dev`

### API Route

::API `POST` harus menggunakan `Content-Type` header dengan nilai `application/json`::

Route | HTTP | Header | BodyJSON / QueryParam | Response | Description
-- | -- | -- | -- | -- | --
`/user/register` | POST | - | {email, password} | {_id, email, password} | register a user
`/user/login` | POST | - | {email, password} | {access_token} | login: get token
`/user/loginGithub` | POST | - | {code} | {access_token, email} | login: get token pake github
`/todo` | POST | token | {textData, quillData, dueDate, name, htmlData} | {textData, quillData, dueDate, name _id} | create a new todo
`/todo` | GET | token | - | [{ name, textData, quillData, dueDate, status, htmlData, _id }] | get list of todo
`/todo/:id` | GET | token | - | { name, textData, quillData, dueDate, status } | get single todo
`/todo/:id` | DELETE | token | - | - | delete a todo
`/todo/:id` | PATCH | token | { textData, quillData, name, dueDate, status, htmlData} | { name, textData, quillData, dueDate, status } | update todo
