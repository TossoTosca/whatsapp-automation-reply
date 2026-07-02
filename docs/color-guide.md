# Panduan Warna (Color Guide) - iOS Minimalist Dashboard

Dokumen ini mendefinisikan palet warna yang digunakan untuk membangun antarmuka pengguna (UI) bergaya Apple iOS Minimalis pada aplikasi dashboard bot WhatsApp. Palet warna ini memanfaatkan utilitas kelas dari Tailwind CSS.

## 1. Warna Utama & Latar Belakang (Base & Background)
Aplikasi ini didominasi oleh warna monokromatik bersih khas Apple untuk menciptakan ruang baca yang luas dan tidak melelahkan mata.

*   **Latar Belakang Utama (App Background):** `bg-zinc-100` (`#f4f4f5`)
    *   *Penggunaan:* Latar belakang layar penuh terluar.
*   **Latar Belakang Kartu (Card Background):** `bg-white` (`#ffffff`) dengan opasitas `bg-white/90` untuk efek transparan.
*   **Warna Teks Utama (Primary Text):** `text-zinc-900` (`#18181b`) atau `text-zinc-950` (`#09090b`).
*   **Warna Teks Sekunder (Secondary/Muted Text):** `text-zinc-500` (`#71717a`) atau `text-zinc-400` (`#a1a1aa`).

## 2. Warna Aksen & Tombol (Accent & Action Colors)
*   **Sistem Utama (System Link / Primary Blue):** `bg-blue-600` / `text-blue-600` (`#2563eb`).
    *   *Penggunaan:* Tombol konfirmasi, teks kode verifikasi pairing, dan penanda fokus input.
*   **Aksi Destruktif (Destructive/Red Accent):** `bg-red-50` / `text-red-600` (`#dc2626`).
    *   *Penggunaan:* Tombol hapus kata kunci, putuskan perangkat, status pembatalan, dan teks peringatan error.
*   **Indikator Sukses & Aktif (Success Green):** `bg-emerald-500` / `text-emerald-400` (`#10b981`).
    *   *Penggunaan:* Indikator denyut (live pulse) aktivitas real-time dan lencana status bot aktif (`READY`).
*   **Indikator Proses (Warning/Alert Amber):** `bg-amber-100` / `text-amber-700` (`#d97706`).
    *   *Penggunaan:* Lencana status memuat browser (`CONNECTING`).

## 3. Efek Khas iOS (iOS-Like Glassmorphism)
Untuk menghadirkan elemen transparansi khas Apple, komponen modal dan alert kustom menggunakan kombinasi:
*   `backdrop-blur-xl` atau `backdrop-blur-sm` untuk efek blur kaca di latar belakang.
*   `border-white/20` untuk garis pembatas kontras tipis di atas lapisan gelap `bg-black/30`.