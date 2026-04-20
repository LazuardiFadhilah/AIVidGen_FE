# 🎬 AIVidGen — Professional AI Video Studio

**AIVidGen** adalah platform berbasis AI yang dirancang untuk membantu kreator, marketer, dan edukator menghasilkan naskah video produksi yang lengkap dalam hitungan detik. Platform ini tidak hanya menghasilkan teks, tetapi juga memberikan breakdown per adegan (*scene-by-scene*) yang siap untuk diproduksi.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

---

## ✨ Fitur Utama

- **🤖 AI-Powered Script Generation**: Algoritma cerdas yang menyesuaikan naskah berdasarkan tipe video, audiens, dan tone suara menggunakan **OpenAI GPT-4o**.
- **⚡ Fast & Creative Modes**:
    - **Fast Mode**: Menghasilkan 1 versi script secara instan.
    - **Creative Mode**: Menghasilkan **3 variasi script sekaligus** untuk memberikan lebih banyak opsi kreatif.
- **📑 Scene Breakdown**: Setiap naskah dilengkapi dengan arahan visual dan naskah audio per adegan lengkap dengan estimasi durasi.
- **🔄 Smart Update**: Kemampuan untuk mengedit parameter input dan melakukan *re-generate* script yang sudah ada langsung dari dashboard.
- **📥 Multi-Format Export**:
    - **Enhanced Copy**: Menyalin seluruh detail naskah (Judul, Scene Breakdown, & Full Script) dalam satu klik.
    - **Export as PDF**: Template profesional yang dioptimalkan untuk cetak.
    - **Export as TXT**: File teks terstruktur yang mencakup detail scene.
- **🕒 Generation History**: Simpan, cari, dan kelola semua proyek naskah Anda di satu tempat.

---

## 🚀 Teknologi yang Digunakan

- **Frontend**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan custom theme futuristik.
- **AI Integration**: Koneksi aman ke OpenAI API melalui Backend khusus.
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/) untuk feedback real-time.
- **API Client**: Axios dengan interceptor untuk manajemen keamanan JWT.

---

## 🛠️ Instalasi & Persiapan

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/username/aividgen-fe.git
   cd aividgen-fe
   ```

2. **Install Dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Buat file `.env.local` dan tambahkan URL API backend Anda:
   ```env
   NEXT_PUBLIC_API_URL=https://aividgen-be.vercel.app/api
   ```

4. **Jalankan Aplikasi**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📐 Arsitektur Folder

```text
├── app/               # Next.js App Router (Pages & Layouts)
│   ├── (app)/         # Protected Routes (Dashboard, History)
│   ├── login/         # Authentication Page
│   └── register/      # Registration Page
├── components/        # Reusable UI Components (Sidebar, Navbar)
├── lib/               # API configuration (Axios Interceptors)
├── public/            # Static assets
└── types/             # TypeScript definitions
```

---

## 📝 Alur Kerja Pengguna (User Workflow)

1. **Authentication**: Register dan Login untuk masuk ke workspace personal.
2. **Setup Project**: Masukkan topik, pilih tipe video, tentukan audiens, dan tambahkan keywords.
3. **Choose Mode**: Pilih **Fast Mode** (1 versi) atau **Creative Mode** (3 variasi).
4. **Review Storyboard**: Lihat breakdown visual dan audio per adegan.
5. **Manage & Update**: Akses histori untuk mengedit atau memperbarui naskah lama dengan parameter baru.
6. **Export & Share**: Salin script lengkap atau unduh dalam format TXT/PDF.

---

Designed with ❤️ by [Lazuardi Fadhilah](https://github.com/username)
