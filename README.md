# 🎬 AIVidGen — Professional AI Video Studio

**AIVidGen** adalah platform berbasis AI yang dirancang untuk membantu kreator, marketer, dan edukator menghasilkan naskah video produksi yang lengkap dalam hitungan detik. Platform ini tidak hanya menghasilkan teks, tetapi juga memberikan breakdown per adegan (*scene-by-scene*) yang siap untuk diproduksi.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

---

## ✨ Fitur Utama

- **🤖 AI-Powered Script Generation**: Algoritma cerdas yang menyesuaikan naskah berdasarkan tipe video, audiens, dan tone suara.
- **📑 Scene Breakdown**: Setiap naskah dilengkapi dengan arahan visual dan naskah audio per adegan lengkap dengan estimasi durasi.
- **🔄 Live Editing & Update**: Fitur "Preview & Export" yang memungkinkan Anda menarik kembali naskah dari histori untuk direvisi dan di-generate ulang.
- **📥 Multi-Format Export**:
    - **Export as PDF**: Template profesional yang dioptimalkan untuk cetak.
    - **Export as TXT**: File teks terstruktur yang mencakup detail scene.
- **🕒 Generation History**: Simpan dan kelola semua proyek naskah Anda di satu tempat.
- **🎨 Aether Flux Design System**: Antarmuka modern yang futuristik dengan mode gelap (*dark mode*) yang nyaman di mata.

---

## 🚀 Teknologi yang Digunakan

- **Frontend**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan custom theme "Aether Flux".
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (Feather Icons set).
- **State Management**: React Hooks (useState, useEffect, useCallback).
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/).
- **API Client**: Axios untuk koneksi ke backend AI service.

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
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
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
├── components/        # Reusable UI Components (Sidebar, etc.)
├── lib/               # Utility functions & API configuration
├── public/            # Static assets
└── styles/            # Global styles & Tailwind config
```

---

## 📝 Alur Kerja Pengguna (User Workflow)

1. **Register/Login**: Masuk menggunakan akun lokal (Database-driven).
2. **Setup Prompt**: Pilih tipe video (Marketing, Edukasi, dll), masukkan topik, target audiens, dan tone.
3. **Generate**: AI akan memproses naskah dan menampilkan breakdown scene di layar.
4. **Manage History**: Akses histori untuk melihat naskah lama.
5. **Re-edit**: Gunakan tombol "Preview & Export" di histori untuk memodifikasi naskah lama di dashboard.
6. **Export**: Unduh hasil akhir dalam format PDF yang rapi atau file teks mentah.

---

## 🤝 Kontribusi

Kontribusi selalu terbuka! Silakan fork repositori ini dan buat pull request jika ingin menambahkan fitur baru atau memperbaiki bug.

---

## 📄 Lisensi

Proyek ini berada di bawah lisensi MIT.

---

Designed with ❤️ by [Lazuardi Fadhilah](https://github.com/username)
