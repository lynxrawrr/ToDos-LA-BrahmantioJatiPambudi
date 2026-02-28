# ToDos - Mini Project Lumoshive Academy

Sebuah aplikasi **Dashboard Todo App** untuk mengelola todo (Read, Create, Delete, Toggle Complete) menggunakan **React**, **Redux Toolkit**, dan async middleware berbasis **redux-thunk** (`createAsyncThunk`). Data todo diambil dari **JSONPlaceholder API**.

---

## Live Demo

[Open Live Demo](https://todos-la.vercel.app/)

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
|   |__ favicon.svg
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

## React-Adv-2 Enhancements

Project ini merupakan lanjutan dari mini project React-Adv-1 dengan penambahan fitur yang berfokus pada **testing**, **PWA**, dan **optimasi performa**.

### Penambahan pada versi React-Adv-2

- Unit Testing menggunakan **Jest** dan **React Testing Library**
- Snapshot Testing untuk menjaga konsistensi tampilan UI
- End-to-End Testing menggunakan **Cypress**
- Konfigurasi **Progressive Web App (PWA)**
- Dukungan **offline fallback** menggunakan cache todo yang tersimpan
- Optimasi render dengan **React.memo**, **useMemo**, dan **useCallback**
- Selector Redux yang dimemoisasi dengan **createSelector**
- **Code Splitting** dan lazy loading menggunakan **React.lazy** dan **Suspense**
- Peningkatan semantik form dengan relasi **htmlFor** dan **id**

---

## Testing

Project ini memiliki pengujian otomatis untuk memastikan fitur utama berjalan stabil, baik pada level unit/component maupun alur aplikasi secara end-to-end.

### Unit Testing

Unit test ditulis menggunakan:

- **Jest**
- **React Testing Library**

Cakupan pengujian meliputi:

- Komponen UI
- Redux slice
- Selectors
- Utility functions
- Halaman utama (Dashboard, Login, Register, dll.)

### Snapshot Testing

Snapshot test digunakan untuk membantu memastikan tampilan UI tertentu tetap konsisten saat terjadi perubahan kode.

### End-to-End Testing

E2E test ditulis menggunakan **Cypress** untuk memverifikasi:
- Auth dan Routing
- Responsive
- Todos

### Menjalankan Testing

#### Unit Test

```bash
npm test
```

#### Cypress E2E Test

```bash
npm run cypress:open
```

---

## PWA / Offline Support

Aplikasi ini telah dikonfigurasi sebagai **Progressive Web App (PWA)**.

### Kemampuan PWA

- Dapat di-install pada browser/perangkat yang mendukung
- Menggunakan **service worker**
- Mendukung caching asset penting
- Mendukung runtime caching untuk request terkait data
- Memiliki fallback data todo dari cache lokal saat kondisi offline

### Offline Fallback

Saat koneksi internet tidak tersedia, aplikasi dapat menampilkan data todo yang sebelumnya sudah tersimpan pada cache lokal, sehingga user tetap dapat melihat data terakhir yang tersedia.

---

## Performance Optimization

Untuk meningkatkan efisiensi render dan mengurangi re-render yang tidak perlu, project ini menerapkan beberapa teknik optimasi performa React.

### Teknik yang digunakan

- **React.memo** untuk memoization pada komponen tertentu
- **useMemo** untuk menyimpan hasil perhitungan turunan
- **useCallback** untuk menjaga referensi function tetap stabil
- **createSelector** untuk memoized selector pada Redux
- **React.lazy** dan **Suspense** untuk lazy loading / code splitting

### Tujuan Optimasi

- Mengurangi render yang tidak perlu
- Menjaga UI tetap responsif
- Membantu aplikasi tetap efisien saat daftar todo berubah

---

## Struktur Project (Update React-Adv-2)

Selain struktur dasar di atas, versi React-Adv-2 juga menambahkan beberapa file dan folder penting berikut:

```txt
todos/
|__ cypress/
|   |__ e2e/
|   |   |__ auth-pages.cy.js
|   |   |__ responsive.cy.js
|   |   |__ todos.cy.js
|   |
|   |__ fixtures/
|   |   |__ example.json
|   |
|   |__ support/
|       |__ commands.js
|       |__ e2e.js
|
|__ public/
|   |__ favicon.svg
|   |__ pwa-192.png
|   |__ pwa-512.png
|
|__ src/
|   |__ components/
|   |   |__ __snapshots__/
|   |   |__ Button.test.jsx
|   |   |__ Checkbox.test.jsx
|   |   |__ ConfirmDialog.test.jsx
|   |   |__ Header.test.jsx
|   |   |__ Input.test.jsx
|   |   |__ Tabs.snapshot.test.jsx
|   |   |__ TodoComposer.test.jsx
|   |   |__ TodoItem.test.jsx
|   |   |__ TodoList.test.jsx
|   |
|   |__ features/
|   |   |__ auth/
|   |   |   |__ authSlice.test.js
|   |   |
|   |   |__ todos/
|   |       |__ selectors.test.js
|   |       |__ todosApi.test.js
|   |       |__ todosSlice.test.js
|   |
|   |__ hooks/
|   |   |__ useConfirm.test.js
|   |
|   |__ pages/
|   |   |__ Dashboard.test.jsx
|   |   |__ Login.test.jsx
|   |   |__ NotFound.test.jsx
|   |   |__ Register.test.jsx
|   |
|   |__ tests/
|   |   |__ fileMock.js
|   |   |__ setupTests.js
|   |
|   |__ utils/
|       |__ sanitize.test.js
|       |__ storage.test.js
|
|__ babel.config.cjs
|__ cypress.config.js
|__ jest.config.cjs
```

---

## Build for Production

Untuk membuat build production:

```bash
npm run build
```

---

## Catatan Implementasi

Beberapa hal yang menjadi fokus implementasi pada project ini:

- Menjaga struktur kode tetap rapi dan modular
- Menggunakan Redux Toolkit untuk state management yang lebih terorganisir
- Menggunakan async thunk untuk alur request API
- Menambahkan test agar perubahan kode lebih aman
- Menambahkan dukungan PWA dan offline fallback untuk meningkatkan reliability
- Mengoptimalkan performa agar aplikasi tetap efisien

---

## Referensi

- https://jsonplaceholder.typicode.com/todos
- https://redux-toolkit.js.org/usage/usage-guide
- https://lucide.dev/icons/
- https://tailwindcss.com/docs/installation/using-vite
