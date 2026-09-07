# 🎯 My Finance (NoteFlow App)

> **Platform Dashboard Manajemen Keuangan Pribadi Serba Ada (All-in-One Personal Finance Dashboard)**

**My Finance** adalah aplikasi web manajemen keuangan pribadi modern yang dirancang untuk membantu Anda mengelola, memantau, dan merencanakan keuangan secara efisien dan intuitif. Melalui aplikasi ini, Anda dapat mencatat pemasukan & pengeluaran, menyusun anggaran bulanan, memantau target tabungan, hingga mengelola tagihan rutin dalam satu tempat.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/React_Query-5.x-ff4154?style=for-the-badge&logo=react-query)](https://tanstack.com/query)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 📋 Daftar Isi

- [✨ Fitur Utama](#-fitur-utama)
- [🛠️ Teknologi (Tech Stack)](#️-teknologi-tech-stack)
- [📁 Struktur Proyek](#-struktur-proyek)
- [📦 Instalasi & Cara Menjalankan](#-instalasi--cara-menjalankan)
- [🗄️ Skema Database](#️-skema-database)
- [🔒 Variabel Lingkungan (Environment Variables)](#-variabel-lingkungan-environment-variables)
- [🚀 Deploy ke Produksi](#-deploy-ke-produksi)
- [📄 Lisensi](#-lisensi)

---

## ✨ Fitur Utama

### 🔐 1. Autentikasi & Keamanan Data
- **Sistem Login & Registrasi**: Otentikasi aman berbasis Email dan Password menggunakan Supabase Auth.
- **Row Level Security (RLS)**: Keamanan di tingkat database; pengguna hanya dapat mengakses data milik mereka sendiri.
- **Proteksi Rute (Middleware)**: Otomatis mengarahkan pengguna ke halaman login jika belum terautentikasi.
- **Manajemen Sesi**: Penanganan sesi otomatis dengan token yang selalu diperbarui.

### 📱 2. Desain Mobile-First & Responsif
- **Navigasi Bawah Mobile**: Bar navigasi bawah yang ramah pengguna smartphone.
- **Hero Balance Card**: Kartu informasi saldo ringkas & elegan pada dashboard utama.
- **Quick Stats Bar**: Statistik cepat mengenai transaksi harian, bulanan, dan tahunan.
- **Tampilan Dark Mode**: Desain bertema gelap modern yang nyaman di mata.

### 💰 3. Pelacakan Transaksi & Keuangan
- **Pencatatan Pemasukan & Pengeluaran**:
  - Tambah transaksi lengkap dengan nominal, tipe (Income/Expense), dan tanggal.
  - Pengelompokan berdasarkan kategori (Makanan, Transportasi, Gaji, Belanja, dll).
  - Catatan/deskripsi opsional untuk setiap transaksi.
- **Visualisasi Multi-Dimensi (Recharts)**:
  - 📊 **Tampilan Harian**: Grafik batang 7 hari terakhir.
  - 📈 **Tampilan Bulanan**: Grafik garis akumulatif bulan berjalan.
  - 📉 **Tampilan Tahunan**: Grafik perbandingan bulanan dalam 1 tahun dengan filter tahun.
  - 🥧 **Pie Chart Kategori**: Visualisasi persentase pengeluaran per kategori.
- **Riwayat & Filter**: Filter transaksi berdasarkan tahun, jenis, dan pencarian cepat.

### 💼 4. Perencanaan Anggaran (Budgets)
- **Anggaran Per Kategori**: Tentukan batas anggaran bulanan untuk tiap kategori pengeluaran.
- **Indikator Progres**: Progress bar visual untuk memantau sisa anggaran.
- **Alert & Notifikasi**: Peringatan otomatis jika pengeluaran mendekati atau melebihi anggaran.

### 💎 5. Target Tabungan (Savings Goals)
- **Manajemen Target Tabungan**: Buat beberapa target tabungan (misal: Dana Darurat, Liburan, Gadget).
- **Progres Visual**: Lacak akumulasi tabungan terhadap target yang ditentukan.
- **Tanggal Target**: Tentukan tenggat waktu pencapaian target.

### 📄 6. Pelacakan Tagihan Rutin (Bills Management)
- **Tagihan Berulang & Subskripsi**: Catat tagihan listrik, internet, sewa, atau langganan bulanan/tahunan.
- **Peringatan Jatuh Tempo**: Pengaturan tanggal jatuh tempo (tanggal 1-31) setiap bulannya.
- **Status Pembayaran**: Tandai tagihan sebagai "Lunas" (Paid) atau "Belum Dibayar" (Unpaid).

### 📊 7. Analisis & Laporan (Reports)
- Ringkasan statistik performa keuangan secara holistik untuk evaluasi finansial pengguna.

---

## 🛠️ Teknologi (Tech Stack)

### **Frontend**
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| ⚛️ **Next.js** | 16.0 | React Framework dengan App Router |
| 📘 **TypeScript** | 5.6 | Tiposasi kode secara statis (Type-safe) |
| 🎨 **Tailwind CSS** | 3.4 | Framework Utility-first CSS |
| 🧩 **Shadcn UI / Radix UI** | Latest | Komponen UI accessible dan kustom |
| 🎭 **Lucide React** | 0.454 | Ikonografi modern |
| 📊 **Recharts** | 2.13 | Grafik data interaktif |

### **Backend & Database**
| Teknologi | Kegunaan |
|-----------|----------|
| 🗄️ **Supabase** | Backend-as-a-Service berbasis PostgreSQL |
| 🔐 **Supabase Auth** | Autentikasi dan manajemen sesi pengguna |
| 🛡️ **Row Level Security (RLS)** | Isolasi dan proteksi akses data per pengguna |

### **State & Helper Libraries**
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| 🔄 **TanStack Query (React Query)** | 5.x | Fetching, caching, & revalidasi data server |
| 📅 **date-fns** | 4.1 | Manipulasi dan format tanggal |
| ✅ **Zod** | 3.23 | Validasi skema input & bentuk data |

---

## 📁 Struktur Proyek

```
noteflow-app/
├── 📂 src/
│   ├── 📂 app/
│   │   ├── 📂 (auth)/              # Halaman autentikasi (login & register)
│   │   ├── 📂 (dashboard)/         # Halaman dashboard yang dilindungi middleware
│   │   │   ├── 📂 bills/           # Manajemen tagihan rutin
│   │   │   ├── 📂 budgets/         # Perencanaan anggaran
│   │   │   ├── 📂 dashboard/       # Dashboard utama & statistik
│   │   │   ├── 📂 finances/        # Catatan & grafik transaksi
│   │   │   ├── 📂 reports/         # Laporan & analisis
│   │   │   ├── 📂 savings/         # Target tabungan
│   │   │   ├── 📂 settings/        # Pengaturan profil & akun
│   │   │   └── 📄 layout.tsx       # Layout utama dashboard
│   │   ├── 📂 api/                 # Endpoint API Auth callback
│   │   ├── 📄 globals.css          # Styling global & variabel CSS
│   │   ├── 📄 layout.tsx           # Root layout aplikasi
│   │   └── 📄 page.tsx             # Landing page publik
│   ├── 📂 components/
│   │   ├── 📂 bills/               # Komponen tagihan (BillCard, BillForm)
│   │   ├── 📂 finances/            # Komponen transaksi & grafik
│   │   ├── 📂 savings/             # Komponen target tabungan
│   │   └── 📂 ui/                  # Komponen dasar UI (Button, Card, Input, Dialog, dll)
│   ├── 📂 lib/                     # Konfigurasi Supabase client & utilitas
│   ├── 📂 providers/               # Context provider (React Query, Theme)
│   └── 📂 types/                   # Definisi tipe data TypeScript & Supabase schema
├── 📄 middleware.ts                # Middleware proteksi rute halaman
├── 📄 next.config.js               # Konfigurasi Next.js
├── 📄 tailwind.config.ts           # Konfigurasi Tailwind CSS
├── 📄 tsconfig.json                # Konfigurasi TypeScript
└── 📄 package.json                 # Daftar dependensi & script proyek
```

---

## 📦 Instalasi & Cara Menjalankan

### **Prasyarat**
Sebelum memulai, pastikan perangkat Anda telah terinstal:
- **Node.js** (Versi 18.x atau lebih baru)
- **Git**
- **Akun Supabase** (Dapat didaftarkan gratis di [supabase.com](https://supabase.com))

### **Langkah 1: Clone Repository**
```bash
git clone https://github.com/ymoricode/noteflow-app.git
cd noteflow-app
```

### **Langkah 2: Instal Dependensi**
```bash
npm install
```

### **Langkah 3: Konfigurasi Supabase**
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/dashboard).
2. Jalankan skrip DDL SQL pada **SQL Editor** Supabase untuk membuat tabel-tabel berikut:
   - `profiles`
   - `expenses`
   - `budgets`
   - `savings_goals`
   - `bills`
   - `notes` (opsional)
   - `habits` & `habit_logs` (opsional)

### **Langkah 4: Konfigurasi Environment Variables**
Buat file `.env.local` pada direktori root proyek dan isikan variabel berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> 💡 Kunci API dan URL proyek dapat ditemukan di Supabase Dashboard > **Project Settings** > **API**.

### **Langkah 5: Jalankan Server Pengembang**
```bash
npm run dev
```
Buka peramban (browser) dan akses [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Skema Database

Secara garis besar, entitas data saling terhubung dengan tabel `auth.users` Supabase melalui relasi `user_id` dan dilindungi oleh kebijakan Row Level Security (RLS):

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     profiles    │       │    expenses     │       │     budgets     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK, FK)     │──┐    │ id (PK)         │       │ id (PK)         │
│ email           │  │    │ user_id (FK)    │───┐   │ user_id (FK)    │───┐
│ full_name       │  │    │ amount          │   │   │ category        │   │
│ avatar_url      │  │    │ type            │   │   │ amount          │   │
│ created_at      │  │    │ category        │   │   │ month           │   │
└─────────────────┘  │    │ transaction_date│   │   └─────────────────┘   │
                     │    └─────────────────┘   │                         │
                     ▼                          ▼                         ▼
              ┌──────────────────────────────────────────────────────────────┐
              │                          auth.users                          │
              └──────────────────────────────────────────────────────────────┘
                     ▲                          ▲                         ▲
                     │                          │                         │
┌─────────────────┐  │                          │   ┌─────────────────┐   │
│ savings_goals   │  │                          │   │      bills      │   │
├─────────────────┤  │                          │   ├─────────────────┤   │
│ id (PK)         │──┘                          │   │ id (PK)         │───┘
│ user_id (FK)    │─────────────────────────────┘   │ user_id (FK)    │
│ name            │                                 │ name            │
│ target_amount   │                                 │ amount          │
│ current_amount  │                                 │ due_date (1-31) │
│ target_date     │                                 │ category        │
└─────────────────┘                                 └─────────────────┘
```

---

## 🔒 Variabel Lingkungan (Environment Variables)

| Nama Variabel | Deskripsi | Wajib |
|---------------|-----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL proyek Supabase milik Anda | ✅ Ya |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anonymous Key Supabase | ✅ Ya |

---

## 🚀 Deploy ke Produksi

### **Deploy ke Vercel (Rekomendasi)**
1. Push kode ke repository GitHub Anda.
2. Buka platform [Vercel](https://vercel.com) dan impor repository tersebut.
3. Tambahkan environment variables `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Klik **Deploy**.

### **Build Manual**
Untuk memvalidasi dan memproduksi bundle build secara lokal:
```bash
# Kompilasi aplikasi
npm run build

# Menjalankan server produksi
npm start
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.

---

<div align="center">

Dibuat dengan ❤️ oleh **ymoricode**

</div>
