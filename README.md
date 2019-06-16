# fancy-todo
@hemhem 2020

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
