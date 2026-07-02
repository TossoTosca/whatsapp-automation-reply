# Rough sketches of the roadmap for now.

Rencana aksi bertahap untuk mengubah aplikasi dari mode **Simulasi Frontend (Mock)** saat ini menuju integrasi **Koneksi Server Penuh (Real Backend)**.

```text
+-----------------------+      +-----------------------+      +-----------------------+
|  FASE 1: MOCK MODE    | ---> |  FASE 2: REAL BACKEND | ---> |  FASE 3: DEPLOYMENT   |
|  - UI/UX Simulasi iOS |      |  - Sambung Socket.io  |      |  - Docker / VPS Awan  |
|  - Kamus Bahasa ID/EN |      |  - Fetch API SQLite   |      |  - Headless Chrome    |
|  - Jeda Timer Tiruan  |      |  - Hapus Mock Timers  |      |  - SSL HTTPS Nginx    |
+-----------------------+      +-----------------------+      +-----------------------+
```

## Tahap 1: Migrasi dari Alur Mock ke Alur Real di Frontend
Untuk mengaktifkan koneksi backend asli, file frontend/src/App.vue dan MainDashboard.vue harus diubah dengan panduan berikut:

Mengaktifkan Socket.io: Buka kembali komentar instansiasi socket = io('http://localhost:3000') dan matikan fungsi simulasiStartBot() serta simulasiCancelPairing().

1. Menghapus Mock Timers: Cabut fungsi setInterval dummy yang ada di LogTerminal.vue dan kembalikan penyuapan data array logs murni dari tangkapan event socket.on('bot-log').

2. Mengganti Emit Event ke Fetch API: Di dalam MainDashboard.vue, ubah fungsi manipulasi array lokal (unshift / filter) menjadi fungsi asynchronous fetch() yang menembak ke endpoint REST API backend (/api/autoreplies, /api/settings, dll).

## Tahap 2: Refactor Protokol Pembatalan Sesi di Backend
1. Buka backend/index.js, hapus baris fungsi forceKillChromium() yang memuat perintah taskkill /f /im chrome.exe.

2. Ganti dengan penutupan internal library yang aman:

```JavaScript
if (client) {
   await client.destroy(); // Menutup tab browser Puppeteer milik bot saja
   client = null;
}
```

3. Pastikan folder .wwebjs_auth otomatis menghapus cache session yang rusak saat terjadi pembatalan agar proses pairing berikutnya tidak terkunci (stale process).

## Tahap 3: Pemantapan Sesi Autoreconnect (Production Ready)
1. Modifikasi backend agar saat pertama kali dinyalakan, ia mengecek status perangkat di database SQLite. Jika status terakhir adalah CONNECTED, backend otomatis memanggil client.initialize() di latar belakang tanpa menunggu instruksi tombol dari frontend.

2. Frontend akan langsung melompat ke Page 2 begitu menerima event socket.emit('bot-status', 'READY') saat browser pertama kali dibuka oleh pengguna.

## Tahap 4: Deployment Hosting (PaaS Docker / VPS Tradisional)
1. Pilihan A (PaaS - Railway/Render): Membuat Dockerfile khusus yang menginstal dependensi Linux GUI (seperti libatk-bridge, libxss1, libgtk-3-0) agar Puppeteer Headless bisa menyala di server awan.

2. Pilihan B (VPS - Biznet Gio): Menyewa VM Ubuntu Server, menginstal Node.js, SQLite3, dan Google Chrome Stable, lalu mengonfigurasi Nginx Reverse Proxy beserta SSL HTTPS dari Let's Encrypt.
