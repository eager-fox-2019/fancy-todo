# fancy-todo

Hayo ngintip2 gw laporin mba icha ntar

ᕦ(ò_óˇ)ᕤ
do you even lift bro?

### Signup 

- route:
  - `POST /signup`
- request:
  - body:
    - `{ name: dimitri, email: 'dimitri@mail.com', password: 'secret' }`
- response:
  - `201`: `{ _id: ObjectId(''), name: dimitri, email: 'dimitri@mail.com', password: 'HashedPassword' }`

```
- Email is unique, so it is not allowed to have same email in database.

- Password is hashed with bcryptjs.
```

### Signin

- route:
  - `POST /signin`
- request:
  - body
    - `{ email: 'dimitri@mail.com', password: 'secret' }`
- response:
  - `201`: `{ token: '...' }`

```
Token is generated from JWT package.
```

### Google Signin

- route:
  - `POST /google`
- request:
  - payload
    - `{ name: dimitri, email: 'dimitri@mail.com' }`
- response:
  - `201`: `{ token: '...' }`

```
- If Google email is present in database, user receive token that is generated from JWT package.

- If Google email is not present in database, Google email will be registered to database and password is randomly generated, then user automatically login and receive token that is generated from JWT package.
```

### Signout

- route:
  - `POST /signout`
- response:
  - `201`: `{ headers: null }`

```
Remove {headers: null} and token from localstorage.
```
## Create To-Do

- route:
  - `POST /todo`
- request
  - decoded
    - `{id: _id}`
  - body
    - `{ title, description, group (tag), due_date }`
- response
  - `201`: `{
      title
      description
      status
      due_date
      group
      UserId
    };

```
Token is decoded via JWT to get UserId.
```

## Read To-Do

- route:
  - `GET /todo`
- request
  - decoded
    - `{id: _id}`
  - query
    - `{tag, status, title}`
- response
  - `200`: `{
        _id,
        title,
        description,
        status,
        group (tag),
        UserId,
        dbDue_date (ex: 2015-03-25T12:00:00Z),
        due_date: (ex:`${2015}-${03}-${25}`),
        showDue_date: (ex: `${25} ${March} ${2015}`),
        __v
    }`
```
- Token is decoded via JWT to get UserId.

- query is used to find specific To-Do.
```

## Delete To-Do

- route:
  - `DELETE /:id`
- request
  - headers
    - `{ token }`
- response
  - `200`: `{ _id: ObjectId('') }`

```
User can not delete To-Do that does not belongs to his/her, it is authorized in middleware.
```

## Update To-Do

- route:
  - `PATCH /:id`
- request
  - headers
    - `{ token }`
  - body
    - `{ title, description, group (tag), due_date }`
- response
  - `201`: `{
        _id,
        title,
        description,
        status,
        group (tag),
        UserId,
        dbDue_date (ex: 2015-03-25T12:00:00Z),
        due_date: (ex:`${2015}-${03}-${25}`),
        showDue_date: (ex: `${25} ${March} ${2015}`),
        __v
    }`
```
User can not update To-Do that does not belongs to his/her, it is authorized in middleware.
```

