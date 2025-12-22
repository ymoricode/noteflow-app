# 🎯 NoteFlow
> **Your All-in-One Productivity Dashboard**
NoteFlow is a comprehensive productivity web application designed to help you manage your daily life in one beautiful and intuitive platform. With NoteFlow, you can take notes, track finances, plan budgets, and build better habits - all in one place.
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
---
## ✨ **Key Features**
### 🔐 **Authentication & Security**
- **Secure Login System**: Email/password authentication using Supabase Auth
- **Row Level Security (RLS)**: Each user can only access their own data
- **Protected Routes**: Middleware automatically protects pages requiring authentication
- **Session Management**: Automatic session management with refresh tokens
- **Profile Management**: Update profile and change password easily
### 📝 **Daily Notes System**
- ✅ **Full CRUD**: Create, Read, Update, Delete, and Archive notes
- 🏷️ **Tag Organization**: Categorize notes using flexible tags
- 🔍 **Search & Filter**: Search and filter notes by title, content, or tags
- 🎨 **Masonry Grid Layout**: Beautiful and responsive visual display
- 💾 **Real-time Sync**: Automatic synchronization with Supabase database
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
### 💰 **Advanced Finance Tracking**
- 💵 **Transaction Management**: 
  - Add income and expenses easily
  - Categorize transactions (Food, Transport, Shopping, Salary, etc.)
  - Notes for each transaction
  - Custom transaction date selection
- 📊 **Multi-View Visualizations**:
  - **Daily View**: Bar chart showing last 7 days
  - **Monthly View**: Cumulative line chart for current month
  - **Yearly View**: Bar chart breakdown per month for selected year
- 📈 **Summary Cards**:
  - Total Balance (Overall balance)
  - Monthly Expenses (This month's expenses)
  - Yearly Expenses (This year's expenses)
  - Income vs Expense tracking
### 💼 **Budget Planning**
- 🎯 **Budget per Category**: Set budget for each expense category
- 📊 **Progress Tracking**: Monitor budget progress with visual progress bars
- ⚠️ **Alert System**: Notifications when approaching or exceeding budget
- 🔄 **Real-time Update**: Budget automatically updates when adding transactions
### 🎯 **Habit Tracker**
- ✅ **Habit Management**: Create and manage daily habits
- 🎨 **Customization**: Choose colors and icons for each habit
- 📅 **Daily Tracking**: Mark habits as completed/not completed each day
- 📊 **Visual Progress**: View habit progress with clear visualizations
- 💾 **Persistent Storage**: All data stored securely in Supabase
---
## 🛠️ **Tech Stack**
### **Frontend**
- ⚛️ **Next.js 15**: React framework with App Router for optimal performance
- 📘 **TypeScript**: Type-safe development for more robust code
- 🎨 **Tailwind CSS**: Utility-first CSS framework for rapid styling
- 🧩 **Shadcn UI**: Beautiful and accessible UI components
- 🎭 **Lucide React**: Modern and consistent icon library
### **Backend & Database**
- 🗄️ **Supabase**: 
  - PostgreSQL database for data storage
  - Supabase Auth for authentication
  - Row Level Security for data protection
  - Real-time subscriptions
### **State Management & Data Fetching**
- 🔄 **TanStack Query (React Query)**: 
  - Efficient data fetching and caching
  - Automatic background refetching
  - Optimistic updates
### **Visualization & Charts**
- 📊 **Recharts**: Library for creating interactive and responsive charts
- 📅 **date-fns**: Utility for date manipulation and formatting
---
## 📦 **Installation & Setup**
### **Prerequisites**
Before starting, make sure you have installed:
- ✅ **Node.js** version 18 or newer ([Download here](https://nodejs.org/))
- ✅ **Git** ([Download here](https://git-scm.com/))
- ✅ **Supabase Account** ([Sign up free here](https://supabase.com))
- ✅ **Code Editor** (VS Code, WebStorm, etc.)
