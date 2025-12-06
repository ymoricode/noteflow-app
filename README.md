# 🎯 NoteFlow
> **Your All-in-One Productivity Dashboard**
NoteFlow adalah aplikasi web produktivitas komprehensif yang dirancang untuk membantu Anda mengelola kehidupan sehari-hari dalam satu platform yang indah dan intuitif. Dengan NoteFlow, Anda dapat mencatat ide, melacak keuangan, merencanakan budget, dan membangun kebiasaan baik - semuanya dalam satu tempat.
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
---
## ✨ **Fitur Utama**
### 🔐 **Autentikasi & Keamanan**
- **Sistem Login Aman**: Autentikasi berbasis email/password menggunakan Supabase Auth
- **Row Level Security (RLS)**: Setiap user hanya dapat mengakses data mereka sendiri
- **Protected Routes**: Middleware otomatis melindungi halaman yang memerlukan autentikasi
- **Session Management**: Pengelolaan sesi otomatis dengan refresh token
- **Profile Management**: Update profil dan ubah password dengan mudah
### 📝 **Sistem Catatan Harian (Daily Notes)**
- ✅ **CRUD Lengkap**: Create, Read, Update, Delete, dan Archive notes
- 🏷️ **Organisasi dengan Tags**: Kategorisasi notes menggunakan tag yang fleksibel
- 🔍 **Search & Filter**: Cari dan filter notes berdasarkan judul, konten, atau tag
- 🎨 **Masonry Grid Layout**: Tampilan visual yang indah dan responsif
- 💾 **Real-time Sync**: Sinkronisasi otomatis dengan Supabase database
- 📱 **Responsive Design**: Bekerja sempurna di desktop, tablet, dan mobile
### 💰 **Pelacakan Keuangan Lanjutan (Finance Tracking)**
- 💵 **Manajemen Transaksi**: 
  - Tambah income dan expense dengan mudah
  - Kategorisasi transaksi (Makanan, Transport, Belanja, Gaji, dll.)
  - Catatan untuk setiap transaksi
  - Pilih tanggal transaksi custom
- 📊 **Visualisasi Multi-View**:
  - **Daily View**: Bar chart menampilkan 7 hari terakhir
  - **Monthly View**: Line chart kumulatif untuk bulan berjalan
  - **Yearly View**: Bar chart breakdown per bulan untuk tahun yang dipilih
- 📈 **Summary Cards**:
  - Total Balance (Saldo keseluruhan)
  - Monthly Expenses (Pengeluaran bulan ini)
  - Yearly Expenses (Pengeluaran tahun ini)
  - Income vs Expense tracking
### 💼 **Budget Planning**
- 🎯 **Budget per Kategori**: Atur budget untuk setiap kategori pengeluaran
- 📊 **Progress Tracking**: Monitor progress budget dengan visual progress bar
- ⚠️ **Alert System**: Notifikasi ketika mendekati atau melebihi budget
- 🔄 **Real-time Update**: Budget otomatis terupdate saat menambah transaksi
### 🎯 **Pelacak Kebiasaan (Habit Tracker)**
- ✅ **Habit Management**: Buat dan kelola kebiasaan harian
- 🎨 **Kustomisasi**: Pilih warna dan icon untuk setiap habit
- 📅 **Daily Tracking**: Tandai habit sebagai completed/not completed setiap hari
- 📊 **Visual Progress**: Lihat progress kebiasaan dengan visualisasi yang jelas
- 💾 **Persistent Storage**: Semua data tersimpan aman di Supabase
---
## 🛠️ **Tech Stack**
### **Frontend**
- ⚛️ **Next.js 15**: React framework dengan App Router untuk performa optimal
- 📘 **TypeScript**: Type-safe development untuk kode yang lebih robust
- 🎨 **Tailwind CSS**: Utility-first CSS framework untuk styling yang cepat
- 🧩 **Shadcn UI**: Komponen UI yang beautiful dan accessible
- 🎭 **Lucide React**: Icon library yang modern dan konsisten
### **Backend & Database**
- 🗄️ **Supabase**: 
  - PostgreSQL database untuk data storage
  - Supabase Auth untuk authentication
  - Row Level Security untuk data protection
  - Real-time subscriptions
### **State Management & Data Fetching**
- 🔄 **TanStack Query (React Query)**: 
  - Efficient data fetching dan caching
  - Automatic background refetching
  - Optimistic updates
### **Visualisasi & Charts**
- 📊 **Recharts**: Library untuk membuat chart yang interaktif dan responsif
- 📅 **date-fns**: Utility untuk manipulasi dan formatting tanggal
---
## 📦 **Installation & Setup**
### **Prerequisites**
Sebelum memulai, pastikan Anda sudah menginstall:
- ✅ **Node.js** versi 18 atau lebih baru ([Download di sini](https://nodejs.org/))
- ✅ **Git** ([Download di sini](https://git-scm.com/))
- ✅ **Akun Supabase** ([Daftar gratis di sini](https://supabase.com))
- ✅ **Code Editor** (VS Code, WebStorm, dll.)
---
### **Step 1: Clone Repository dari GitHub**
Buka terminal/command prompt dan jalankan:
```bash
# Clone repository
git clone [https://github.com/ymoricode/noteflow-app.git](https://github.com/ymoricode/noteflow-app.git)
