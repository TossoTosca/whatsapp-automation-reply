# Struktur Folder Proyek (Folder Structure)

Arsitektur aplikasi dipisahkan secara tegas menjadi dua bagian mandiri (*Monorepo Split Architecture*) untuk menjaga independensi fungsionalitas antara mesin backend dan antarmuka frontend.

```text
whatsapp-bot-project/
│
├── backend/                         # SISI SERVER (Express.js & Puppeteer)
│   ├── .wwebjs_auth/                # Folder penyimpanan otomatis session token WA
│   ├── index.js                     # Server utama, REST API endpoint, & Socket.io engine
│   ├── package.json                 # Dependensi server (Ramping & Dioptimasi)
│   └── database.sqlite              # Database lokal penyimpan kata kunci & blacklist
│
└── frontend/                        # SISI ANTARMUKA (Vue 3 & Vite & Tailwind CSS)
    ├── src/
    │   ├── assets/                  # Aset statis css & logo
    │   ├── components/              # Komponen Modular & Reusable UI
    │   │   ├── AlertiOS.vue         # Modal dialog alert & konfirmasi gaya Apple
    │   │   ├── AutoreplyTable.vue   # Form input & tabel manipulasi kata kunci
    │   │   ├── CerdasSettings.vue   # Panel filter kontak & manajemen nomor blacklist
    │   │   ├── LogTerminal.vue      # Terminal pemantau aktivitas lalu lintas pesan
    │   │   └── MockupPhone.vue      # Grafis dekoratif animasi percakapan telepon
    │   │
    │   ├── locales/                 # SENTRALISASI MULTIBAHASA
    │   │   └── index.js             # Kamus terjemahan Bahasa Indonesia & Inggris
    │   │
    │   ├── views/                   # VIEW HALAMAN UTAMA (PAGE CONTAINER)
    │   │   └── MainDashboard.vue    # Container utama untuk Page 2 (Terhubung)
    │   │
    │   ├── App.vue                  # Otak Frontend, pengontrol state, & transisi global
    │   └── main.js                  # Entry point inisialisasi aplikasi Vue
    │
    ├── index.html                   # Lembar HTML utama
    ├── tailwind.config.js           # Konfigurasi kustom utility kelas Tailwind
    ├── vite.config.js               # Konfigurasi sistem compiler Vite
    └── package.json                 # Dependensi framework frontend