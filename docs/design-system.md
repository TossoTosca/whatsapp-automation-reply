# Sistem Desain (Design System) - Vue 3 Framework

Dokumen ini merangkum aturan gaya komponen, struktur layout, saringan masukan (input validation), animasi transpirasi, serta mekanisme pelokalan bahasa yang diterapkan pada sisi frontend aplikasi terpisah antara visualisasi mock dan fungsionalitas server sesungguhnya.

## 1. Tata Letak & Sudut Kelengkungan (Layout & Border Radius)
Mengikuti pedoman desain iOS, kelengkungan sudut diatur sangat melengkung (*super-rounded*):
*   **Kartu Kontainer Utama:** `rounded-3xl` (`24px`) untuk wadah penautan dan manajemen kata kunci.
*   **Form Input & Tombol Kecil:** `rounded-xl` (`12px`) untuk menjaga konsistensi komponen masukan.
*   **Jendela Alert Dialog:** `rounded-[14px]` (`14px`) murni menyamai radius standard *Action Alert iOS*.

## 2. Animasi & Transisi (Animations & Transitions)
Aplikasi memanfaatkan komponen `<Transition>` bawaan Vue 3 untuk menggerakkan halaman menggunakan kurva akselerasi Apple yang responsif (`cubic-bezier`):

```css
/* Transisi Perpindahan Halaman (Page Slide Effect) */
.ios-page-enter-active, .ios-page-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.ios-page-enter-from {
  opacity: 0;
  transform: translateX(60px) scale(0.97);
}
.ios-page-leave-to {
  opacity: 0;
  transform: translateX(-60px) scale(1.03);
}
```


## 3. Validasi Form & Penanganan Error (Form & Error Handling)
Aplikasi menggunakan dualisme penanganan validasi tergantung pada mode yang aktif:

* **Pada Mode Mock (Saat Ini):** Validasi form kosong pada komponen `AutoreplyTable.vue` memicu perubahan status variabel reaktif `keywordError = true`. Komponen `AlertiOS.vue` dipanggil secara manual menggunakan teks keras (*hardcoded*) untuk menunjukkan respons visual.
* **Pada Mode Real (Mendatang):** Validasi tetap dilakukan di sisi frontend untuk menghemat beban server. Namun, jika terjadi kegagalan di sisi server (misal: memasukkan kata kunci yang duplikat/sudah ada di SQLite), backend akan mengirimkan status HTTP `400 Bad Request`. Frontend harus menangkap error tersebut lewat blok `try...catch` dan menyuap pesan error dinamis dari database ke dalam `AlertiOS.vue`.

## 4. Arsitektur Komponen Pengingat (Alert & Confirmation Dialog)
Komponen `AlertiOS.vue` telah diisolasi penuh dan mendukung fungsionalitas pintar melalui fungsi *computed property*:
* **Auto-Label Recognition:** Tombol aksi konfirmasi sebelah kanan otomatis berubah label menjadi "Hapus" / "Delete", "Putuskan" / "Disconnect", atau "Buka" / "Unblock" dengan cara mendeteksi kata kunci yang terkandung di dalam properti `title`.
* **Dual Mode:** Mendukung tipe `info`, `success`, `error` (satu tombol OK) dan tipe `confirm` (dua tombol sejajar: Batalkan / Lanjutkan) yang terintegrasi penuh dengan sistem multibahasa.

## 5. Sistem Pelokalan Bahasa (Localization System)
Manajemen bahasa dipisahkan dari komponen UI menggunakan metode *Dependency Injection* (`provide` / `inject`):
* File `src/locales/index.js` bertindak sebagai *Single Source of Truth* untuk seluruh teks di dalam aplikasi.
* Komponen anak tidak diizinkan menulis string teks mentah di dalam template HTML. Semua teks wajib dipanggil melalui objek `lang.value.nama_kunci_terjemahan` agar perpindahan bahasa via tombol ID/EN di pojok kanan atas berjalan mulus dan serentak di seluruh halaman.