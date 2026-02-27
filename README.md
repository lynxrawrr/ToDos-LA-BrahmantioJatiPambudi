# ToDos - Mini Project Lumoshive Academy

Sebuah aplikasi **Dashboard Todo App** untuk mengelola todo (Read, Create, Delete, Toggle Complete) menggunakan **React**, **Redux Toolkit**, dan async middleware berbasis **redux-thunk** (`createAsyncThunk`). Data todo diambil dari **JSONPlaceholder API**.

---

## Live Demo
`https://todos-la.vercel.app/`

---

## Fitur Utama
- Read: menampilkan daftar todo dari API (dengan loading & error state)
- Create: menambah todo baru melalui form
- Delete: menghapus todo dengan konfirmasi dialog
- Toggle Status: ubah status `complete/incomplete`
- Auth UI: halaman login & register
- UX Feedback: state loading, error message, empty state, dan konfirmasi aksi
- Validasi & sanitasi input: mencegah todo kosong dan membersihkan input user

---

## Tech Stack
- React + Vite
- Redux Toolkit
- Tailwind CSS
- React Router DOM
- Lucide React
- Google Font API

---

## Struktur Project
```txt
todos/
|__ public/
|   |__ pavicon.svg
|
|__ src/
|   |__ app/
|   |   |__ hooks.js
|   |   |__ store.js
|   |
|   |__ assets/
|   |   |__ logo/
|   |       |__ logo.svg
|   |
|   |__ components/
|   |   |__ Badge.jsx
|   |   |__ Button.jsx
|   |   |__ Card.jsx
|   |   |__ Checkbox.jsx
|   |   |__ ConfirmDialog.jsx
|   |   |__ Header.jsx
|   |   |__ Input.jsx
|   |   |__ Tabs.jsx
|   |   |__ TodoComposer.jsx
|   |   |__ TodoItem.jsx
|   |   |__ TodoList.jsx
|   |
|   |__ features/
|   |   |__ auth/
|   |   |   |__ authSlice.js
|   |   |
|   |   |__ todos/
|   |       |__ selectors.js
|   |       |__ todosApi.js
|   |       |__ todosSlice.js
|   |
|   |__ hooks/
|   |   |__ useConfirm.js
|   |
|   |__ pages/
|   |   |__ Dashboard.jsx
|   |   |__ Login.jsx
|   |   |__ Register.jsx
|   |   |__ NotFound.jsx
|   |
|   |__ utils/
|   |   |__ sanitize.js
|   |   |__ storage.js
|   |
|   |__ App.jsx
|   |__ index.css
|   |__ main.jsx
|
|__ index.html
|__ vercel.json
|__ vite.config.js
|__ package.json
|__ README.md
```
---

## Instalasi & Menjalankan Project

#### 1) Clone repository
```bash
git clone https://github.com/lynxrawrr/ToDos-LA-BrahmantioJatiPambudi.git
cd todos
```

#### 2) Install dependencies dan jalankan development server
```bash
npm install
npm run dev
```

---
## Akun Login
```txt
Email: Bebas
Password: Bebas
```

---
## Routes
- `/login` : Halaman login
- `/register` : Halaman register
- `/` : Dashboard
- `/*` : Not Found
---

## API yang Digunakan
Base URL: `https://jsonplaceholder.typicode.com/todos`

**Todos**
- `GET /todos`
- `POST /todos`
- `PATCH /todos/:id`
- `DELETE /todos/:id`


---
## Redux + Async Flow (Redux Toolkit + Thunk)

Aplikasi Web ini menggunakan Redux Toolkit sebagai state management, dan operasi async dilakukan melalui createAsyncThunk yang memanfaatkan middleware redux-thunk.
*Alur*
- `todosApi.js` : kumpulan fungsi request API (fetch/add/toggle/delete)
- `todosSlice.js` : state global todo + reducer + extraReducers
- Komponen UI hanya dispatch(thunk) dan membaca state dari selector

---
## Validasi & Sanitasi Input
Untuk menjaga input user:
- Todo tidak boleh kosong
- Input dibersihkan (trim, normalisasi spasi, pembatasan panjang, dan mitigasi tag HTML sederhana)
- Jika input tidak valid, proses submit dibatalkan dan user mendapat feedback

---

## Auth
Aplikasi memiliki alur **Login/Register** sederhana untuk kebutuhan dashboard. Status autentikasi disimpan di **localStorage** agar sesi tetap ada saat user refresh halaman.
*Alur*
- Saat **login berhasil**, aplikasi menyimpan data auth (contoh: `user`, `token`/flag) ke localStorage.
- Redux `authSlice` membaca state awal dari localStorage saat aplikasi dijalankan.
- Saat **logout**, data auth dihapus dari localStorage dan state Redux di-reset.
- Halaman tertentu dapat diproteksi dengan pengecekan state auth (misal redirect ke `/login` jika belum login).

---

## Referensi
- https://jsonplaceholder.typicode.com/todos
- https://redux-toolkit.js.org/usage/usage-guide
- https://lucide.dev/icons/
- https://tailwindcss.com/docs/installation/using-vite