# SkillSync.id

## Deskripsi Proyek
SkillSync.id adalah aplikasi web inovatif yang dirancang untuk membantu pengguna merancang peta jalan karier impian mereka dengan bantuan kecerdasan buatan (AI). Pengguna dapat memasukkan posisi karier yang diinginkan, dan aplikasi akan menghasilkan panduan langkah demi langkah yang dipersonalisasi, termasuk keterampilan fondasi, keterampilan lanjutan, rekomendasi sumber belajar, dan ide proyek portofolio. Aplikasi ini juga memungkinkan pengguna untuk menyimpan peta jalan yang dihasilkan dalam format PDF.

## Fitur Utama
-   **Pembuatan Peta Jalan Karier Berbasis AI**: Menggunakan Google Gemini API untuk menganalisis input pengguna dan menghasilkan peta jalan karier yang komprehensif.
-   **Tampilan Peta Jalan Terstruktur**: Menyajikan informasi dalam format akordeon yang mudah dinavigasi, mencakup:
    -   Keterampilan Fondasi
    -   Keterampilan Lanjutan & Spesialisasi
    -   Rekomendasi Sumber Belajar (dengan paginasi)
    -   Ide Proyek Portofolio
-   **Unduh Peta Jalan sebagai PDF**: Memungkinkan pengguna mengunduh bagian Keterampilan Fondasi dan Keterampilan Lanjutan dari peta jalan mereka dalam format PDF yang rapi dan profesional.
-   **Desain Responsif**: Antarmuka pengguna yang menyesuaikan dengan berbagai ukuran layar.
-   **Indikator Loading**: Memberikan umpan balik visual kepada pengguna saat AI sedang memproses atau saat PDF sedang dibuat.

## Teknologi yang Digunakan
-   **Frontend**:
    -   HTML5
    -   CSS3 (dengan TailwindCSS untuk styling cepat dan responsif)
    -   JavaScript (ES6 Modules)
-   **AI Generatif**:
    -   Google Gemini API (model `gemini-1.5-flash`)
-   **Pembuatan PDF (Sisi Klien)**:
    -   jsPDF (https://github.com/parallax/jsPDF)
    -   html2canvas (https://html2canvas.hertzen.com/)
-   **Lainnya**:
    -   Heroicons (untuk ikon SVG)

## Struktur Proyek
. ├── README.md // File dokumentasi ini 
    ├── index.html // Halaman utama aplikasi 
    ├── js/ // Direktori untuk file JavaScript │ 
    ├── main.js // Logika utama UI, interaksi DOM, dan pembuatan PDF │ 
        └── generateRoadmap.js // Logika untuk berinteraksi dengan Gemini API 
    ├── node_modules/ // Dependensi (jika ada, untuk pengembangan lokal) 
    ├── package.json // Informasi proyek dan dependensi (jika ada) 
        └── package-lock.json // Versi pasti dari dependensi (jika ada)

Catatan: `node_modules`, `package.json`, dan `package-lock.json` mungkin ada jika proyek diinisialisasi dengan npm/yarn, tetapi untuk proyek frontend murni seperti ini, mereka tidak selalu esensial jika semua library dimuat via CDN.

## Cara Kerja Aplikasi

### Alur Pengguna
1.  **Buka Aplikasi**: Pengguna mengakses `index.html` di browser.
2.  **Masukkan Tujuan Karier**: Pengguna mengetikkan posisi karier yang diinginkan (misalnya, "Data Scientist") di kolom input.
3.  **Buat Peta Jalan**: Pengguna mengklik tombol "Buat Peta Jalan Saya".
4.  **Proses AI**: Aplikasi menampilkan indikator loading sementara AI (Gemini API) memproses permintaan dan menghasilkan data peta jalan.
5.  **Tampilkan Peta Jalan**: Setelah data diterima, aplikasi menyembunyikan halaman landing dan menampilkan bagian peta jalan yang terstruktur dalam akordeon.
6.  **Navigasi Konten**: Pengguna dapat membuka dan menutup setiap bagian akordeon (Keterampilan Fondasi, Lanjutan, Sumber Belajar, Proyek).
7.  **Simpan Peta Jalan (PDF)**: Pengguna mengklik tombol "Simpan Peta Jalan".
    -   Aplikasi menampilkan indikator loading pada tombol.
    -   Secara internal, aplikasi menyiapkan versi HTML khusus dari Keterampilan Fondasi dan Lanjutan.
    -   Versi HTML ini dikonversi menjadi gambar menggunakan `html2canvas`.
    -   Gambar tersebut dimasukkan ke dalam file PDF menggunakan `jspdf`.
    -   Browser memulai unduhan file PDF bernama `Peta Jalan - [nama_karir].pdf`.

### Alur Teknis Pembuatan Peta Jalan (`js/generateRoadmap.js`)
1.  Fungsi `generateRoadmap(targetCareer)` dipanggil dengan input dari pengguna.
2.  Sebuah prompt yang detail dan terstruktur disiapkan, menginstruksikan Gemini API untuk menghasilkan data dalam format JSON tertentu (mencakup `foundation_skills`, `advanced_skills`, `learning_resources`, `portfolio_projects`).
3.  Permintaan HTTP POST dikirim ke `GEMINI_API_ENDPOINT` dengan `GEMINI_API_KEY` dan prompt.
4.  Respons dari API diterima. Teks JSON dari respons di-parse.
5.  Objek JavaScript yang berisi data peta jalan dikembalikan ke `js/main.js`.
6.  Jika terjadi error (misalnya, API key tidak valid, masalah jaringan, format JSON tidak sesuai), fungsi akan menangani error dan mengembalikan `null`.

### Alur Teknis Unduh PDF (`js/main.js`)
1.  Event listener pada tombol "Simpan Peta Jalan" diaktifkan.
2.  Data peta jalan saat ini (`currentRoadmapData`) diambil.
3.  Fungsi `prepareContentForPdf(careerTitle, foundationSkills, advancedSkills)` dipanggil:
    -   Membuat elemen `div` sementara yang tidak terlihat oleh pengguna.
    -   Mengisi `div` ini hanya dengan judul karir, Keterampilan Fondasi, dan Keterampilan Lanjutan & Spesialisasi, menggunakan data dari `currentRoadmapData`.
    -   Menerapkan kelas CSS (`.pdf-container`) pada `div` ini untuk styling khusus PDF (font, ukuran, margin, dll.).
    -   Menambahkan `div` sementara ke `document.body`.
4.  `html2canvas` dipanggil untuk merender `div` sementara ini menjadi objek canvas (gambar). Opsi `scale: 2` digunakan untuk meningkatkan kualitas.
5.  Canvas dikonversi menjadi format data URL gambar (PNG).
6.  Objek `jsPDF` baru dibuat (format A4, orientasi potret).
7.  Gambar dari canvas ditambahkan ke dokumen PDF. Jika gambar lebih tinggi dari satu halaman A4, `jspdf` secara otomatis menangani pembuatan halaman tambahan.
8.  Fungsi `pdf.save(filename)` memulai unduhan PDF di browser.
9.  Dalam blok `finally`, `div` sementara dihapus dari `document.body` untuk membersihkan DOM.

## Pengaturan dan Konfigurasi

### API Key Gemini
Untuk menggunakan fungsionalitas pembuatan peta jalan AI, Anda **HARUS** mengatur API Key Google Gemini Anda:
1.  Buka file `js/generateRoadmap.js`.
2.  Temukan baris berikut di bagian atas file:
    ```javascript
    const GEMINI_API_KEY = 'MASUKKAN_API_KEY_ANDA_DI_SINI';
    const GEMINI_API_ENDPOINT = 'MASUKKAN_ENDPOINT_GEMINI_API_ANDA_DI_SINI'; // Contoh: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    ```
3.  Ganti `'MASUKKAN_API_KEY_ANDA_DI_SINI'` dengan API Key Gemini Anda yang valid.
4.  Pastikan `GEMINI_API_ENDPOINT` sudah benar sesuai dengan model yang ingin Anda gunakan (defaultnya adalah `gemini-1.5-flash`).

**PENTING**: Jaga kerahasiaan API Key Anda. Jangan pernah meng-commit API Key secara langsung ke repositori publik. Untuk pengembangan atau deployment, pertimbangkan untuk menggunakan variabel lingkungan atau mekanisme konfigurasi aman lainnya. Proyek ini, dalam bentuknya saat ini, menempatkan API key di kode sisi klien, yang **tidak aman untuk produksi**.

## Detail Implementasi Khusus

### Pembuatan Konten PDF Dinamis
Untuk memastikan PDF hanya berisi Keterampilan Fondasi dan Keterampilan Lanjutan dengan tampilan yang lebih profesional, aplikasi tidak langsung mengambil screenshot dari konten halaman web yang terlihat. Sebaliknya:
-   Sebuah elemen `div` baru dibuat secara dinamis di JavaScript (`prepareContentForPdf` function).
-   Elemen ini diisi hanya dengan data keterampilan yang relevan.
-   Styling khusus (melalui kelas CSS `.pdf-container`) diterapkan pada elemen ini untuk mengontrol font, ukuran, warna, dan tata letak di PDF.
-   Elemen ini ditempatkan di luar viewport pengguna (`position: absolute; left: -9999px;`) sehingga tidak mengganggu tampilan, tetapi masih dapat dirender oleh `html2canvas`.
-   Setelah PDF dihasilkan, elemen sementara ini dihapus dari DOM.

Pendekatan ini memberikan kontrol lebih besar atas output PDF dibandingkan hanya mengambil screenshot dari apa yang terlihat di layar.

## Keterbatasan Saat Ini
-   **Keamanan API Key**: Seperti yang disebutkan, API Key Gemini saat ini disimpan di kode sisi klien, yang tidak aman untuk lingkungan produksi.
-   **Ketergantungan CDN**: Fungsionalitas `html2canvas` dan `jspdf` bergantung pada ketersediaan CDN. Jika CDN down atau diblokir, fitur unduh PDF tidak akan berfungsi.
-   **Kualitas PDF**: PDF yang dihasilkan adalah berbasis gambar (dari `html2canvas`). Meskipun skala ditingkatkan untuk kualitas yang lebih baik, teks mungkin tidak setajam PDF berbasis vektor murni. Tautan di PDF juga tidak akan bisa diklik.
-   **Kompleksitas Styling PDF**: Styling PDF melalui CSS yang dirender `html2canvas` memiliki batasan dibandingkan dengan pembuatan PDF secara programatik penuh.
-   **Error Handling**: Penanganan error bisa lebih detail dan ramah pengguna, terutama untuk masalah API.

## Potensi Pengembangan Selanjutnya
-   **Backend untuk API Key**: Pindahkan logika panggilan Gemini API ke backend untuk mengamankan API Key.
-   **Otentikasi Pengguna**: Tambahkan sistem login agar pengguna dapat menyimpan peta jalan mereka.
-   **Pembuatan PDF Sisi Server atau Lebih Lanjut**: Gunakan library PDF sisi server atau fitur `jspdf` yang lebih canggih untuk membuat PDF berbasis vektor dengan tautan yang bisa diklik dan kualitas teks yang lebih tinggi.
-   **Kustomisasi Peta Jalan**: Izinkan pengguna untuk mengedit atau menambahkan item ke peta jalan yang dihasilkan.
-   **Integrasi dengan Platform Belajar**: Tautkan langsung ke kursus atau sumber belajar yang direkomendasikan.
-   **Pilihan Bahasa**: Dukungan untuk berbagai bahasa.
-   **Mode Offline**: Simpan library secara lokal untuk mengurangi ketergantungan pada CDN.

---
