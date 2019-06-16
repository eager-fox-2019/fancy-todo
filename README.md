#Fancy Todo

API documentation (via postman)
https://documenter.getpostman.com/view/6691212/S1Zw9BS2

environment variables:
- JWT_SECRET
- GOOGLE_CLIENT_ID
- FB_CLIENT_ID=857945794540372
- VOICE_API

Kendala saat mengerjakan:

Saat membuat client progress sangat lambat. Banyak waktu dipakai untuk membaca dokumentasi jQuery, mencari contoh code untuk memilih dan mengubah DOM di html, dan mencoba-coba code yang ditemukan hingga client berjalan sesuai rencana.

Selain itu, saat membuat 3rd party api feature image uploading, menemukan kendala FormData() tidak memberikan return value setelah di append dengan file object. Setelah mencoba banyak cara lain seperti dari object, array, dan fetch, masih tidak menemukan kenapa body tidak bisa menerima kiriman file dari client ke server. Rencana untuk mengubah file ke uri dan di upload via 3rd party api cloudinary tidak jadi.

--- 
#Readme
Aplikasi Todo menggunakan Client-server model dengan spesifikasi sebagai berikut:

- API Documentation yang meliputi : URLs, HTTP method, request, response (success dan error case)
- Membuat routes sesuai standar REST API
- CRUD endpoints untuk Todo (name, description, status, due date)
- Register
- Login menggunakan email & password (menggunakan JWT)
- Sign in with 3rd APIs (Google/Twitter/Facebook/GitHub)
- Validasi sehingga hanya authenticated user (owner) yang bisa melakukan CRUD Todo, baik dari sisi client maupun server
- Membuat authorization sehingga user hanya bisa melakukan Update/Delete terhadap todo-nya sendiri (server)
- NO alert();! (Client)
- Make it fancy! Tambahkan 1 fitur atau lebih yang akan menjadikan aplikasi todo kamu menjadi unik dan berbeda. Misal, integrasikan dengan Google Calendar. (Ingat, tambahkan fitur seunik mungkin)

#Extras:

- Authenticated user bisa membuat project, dan invite/add member ke project tersebut.
- User dapat membuat todo di project yang sudah dipilih
- Todo yang ada di suatu project hanya bisa di read/write (CRUD) oleh project members.


Kompetensi Backend:

- REST API

- API Documentation

- API CRUD Todo + Authentication

- MongoDB + Mongoose



Kompetensi Client:

- jQuery + AJAX

- SPA (Single Page Application)


Tambahkan comment yang berisi environment variables yang dipakai (beserta valuenya), link deploy (jika ada), fitur uniknya dan kendala saat mengerjakan.
