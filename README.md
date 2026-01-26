# 🎯 MyFinance

> **Your All-in-One Personal Finance Dashboard**

MyFinance is a comprehensive personal finance web application designed to help you manage your financial life in one beautiful and intuitive platform. With MyFinance, you can track income & expenses, plan budgets, manage savings goals, and track bills - all in one place.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/React_Query-5.x-ff4154?style=for-the-badge&logo=react-query)](https://tanstack.com/query)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

![MyFinance Dashboard Preview](https://via.placeholder.com/1200x600/1a1a2e/7c3aed?text=NoteFlow+Dashboard)

---

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [📦 Installation & Setup](#-installation--setup)
- [🗄️ Database Schema](#️-database-schema)
- [🔒 Environment Variables](#-environment-variables)
- [🚀 Deployment](#-deployment)
- [📸 Screenshots](#-screenshots)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Key Features

### 🔐 Authentication & Security
| Feature | Description |
|---------|-------------|
| **Secure Login System** | Email/password authentication using Supabase Auth |
| **Row Level Security (RLS)** | Each user can only access their own data |
| **Protected Routes** | Middleware automatically protects pages requiring authentication |
| **Session Management** | Automatic session management with refresh tokens |
| **Profile Management** | Update profile and change password easily |

### � Mobile-First Design
- 📲 **Mobile Bottom Navigation**: Easy-to-use bottom navigation bar for mobile
- 🎯 **Mobile Header**: Clean and intuitive mobile header with quick access
- 💳 **Hero Balance Card**: Beautiful balance display card on dashboard
- � **Quick Stats**: At-a-glance financial statistics
- � **Responsive Layout**: Seamlessly adapts between mobile and desktop

### 💰 Advanced Finance Tracking
- **Transaction Management**: 
  - 💵 Add income and expenses easily
  - 📂 Categorize transactions (Food, Transport, Shopping, Salary, etc.)
  - 📝 Notes for each transaction
  - 📅 Custom transaction date selection
  
- **Multi-View Visualizations**:
  - 📊 **Daily View**: Bar chart showing last 7 days
  - 📈 **Monthly View**: Cumulative line chart for current month
  - 📉 **Yearly View**: Bar chart breakdown per month for selected year with year filter dropdown
  - 🥧 **Category Pie Chart**: Visual breakdown by expense category

- **Transaction History**:
  - 📜 Complete transaction list with filtering
  - 📅 Year filter dropdown to view transactions by year
  - 🔍 Search and categorize transactions

- **Summary Cards**:
  - 💳 Total Balance (Overall balance)
  - 📆 Monthly Expenses (This month's expenses)
  - 📅 Yearly Expenses (This year's expenses)
  - ⚖️ Income vs Expense tracking

### 📄 Bills Management
- 🧾 **Bill Tracking**: Add and manage recurring bills and subscriptions
- 📅 **Due Date Tracking**: Set due dates (1-31) for each bill
- 🔄 **Recurring Bills**: Support for monthly and yearly recurring bills
- ✅ **Payment Status**: Mark bills as paid/unpaid
- ⚠️ **Overdue Alerts**: Visual indicators for overdue bills
- � **Bill Statistics**: 
  - Total bills count
  - Unpaid amount summary
  - Paid amount summary
  - Overdue bills count
- 📂 **Categorization**: Organize bills by category (Internet, Electricity, Water, etc.)

### �💼 Budget Planning
- 🎯 **Budget per Category**: Set budget for each expense category
- 📊 **Progress Tracking**: Monitor budget progress with visual progress bars
- ⚠️ **Alert System**: Notifications when approaching or exceeding budget
- 🔄 **Real-time Update**: Budget automatically updates when adding transactions

### 💎 Savings Goals
- 🏦 **Goal Management**: Create and track multiple savings goals
- 📊 **Progress Visualization**: Visual progress bars for each goal
- 💰 **Contribution Tracking**: Add contributions towards your goals
- 🎯 **Target Dates**: Set target dates for achieving goals

### 📊 Reports & Analytics
- 📈 **Financial Reports**: Comprehensive financial analytics
- 📊 **Visual Charts**: Interactive charts using Recharts
- 📅 **Custom Date Ranges**: Filter reports by date range
- 📦 **Export Options**: Export data for external analysis

### 🌓 Theme Support
- 🌙 **Dark Mode**: Beautiful dark theme for comfortable viewing
- ☀️ **Light Mode**: Clean light theme option
- 🔄 **System Preference**: Automatically matches system theme

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| ⚛️ **Next.js** | 16.0 | React framework with App Router |
| 📘 **TypeScript** | 5.6 | Type-safe development |
| 🎨 **Tailwind CSS** | 3.4 | Utility-first CSS framework |
| 🧩 **Shadcn UI** | Latest | Beautiful UI components |
| 🎭 **Lucide React** | 0.454 | Modern icon library |
| 📊 **Recharts** | 2.13 | Interactive charts |

### **Backend & Database**
| Technology | Purpose |
|------------|---------|
| 🗄️ **Supabase** | PostgreSQL database + Authentication |
| 🔐 **Supabase Auth** | User authentication & authorization |
| 🛡️ **Row Level Security** | Data protection at database level |
| ⚡ **Real-time Subscriptions** | Live data synchronization |

### **State Management & Data Fetching**
| Technology | Version | Purpose |
|------------|---------|---------|
| 🔄 **TanStack Query** | 5.x | Data fetching & caching |
| 📅 **date-fns** | 4.1 | Date manipulation |
| ✅ **Zod** | 3.23 | Schema validation |

---

## 📁 Project Structure

```
noteflow-app/
├── 📂 src/
│   ├── 📂 app/
│   │   ├── 📂 (auth)/              # Authentication pages
│   │   │   ├── 📂 login/           # Login page
│   │   │   └── 📂 register/        # Registration page
│   │   ├── 📂 (dashboard)/         # Protected dashboard pages
│   │   │   ├── 📂 bills/           # Bills management
│   │   │   ├── 📂 budgets/         # Budget planning
│   │   │   ├── 📂 dashboard/       # Main dashboard
│   │   │   ├── 📂 finances/        # Finance tracking
│   │   │   ├── 📂 reports/         # Financial reports
│   │   │   ├── 📂 savings/         # Savings goals
│   │   │   ├── 📂 settings/        # User settings
│   │   │   └── 📄 layout.tsx       # Dashboard layout
│   │   ├── 📂 api/                 # API routes
│   │   │   └── 📂 auth/            # Auth callback
│   │   ├── 📄 globals.css          # Global styles
│   │   ├── 📄 layout.tsx           # Root layout
│   │   └── 📄 page.tsx             # Landing page
│   ├── 📂 components/
│   │   ├── 📂 bills/               # Bill components
│   │   │   ├── 📄 BillCard.tsx     # Individual bill display
│   │   │   └── 📄 BillForm.tsx     # Add/edit bill form
│   │   ├── 📂 finances/            # Finance components
│   │   │   ├── 📄 BudgetCard.tsx
│   │   │   ├── 📄 BudgetForm.tsx
│   │   │   ├── 📄 CategoryPieChart.tsx
│   │   │   ├── 📄 DailyExpenseChart.tsx
│   │   │   ├── 📄 ExpenseForm.tsx
│   │   │   ├── 📄 MonthlyExpenseChart.tsx
│   │   │   ├── 📄 TransactionList.tsx
│   │   │   └── 📄 YearlyExpenseChart.tsx
│   │   ├── 📂 savings/             # Savings components
│   │   │   ├── 📄 SavingsGoalCard.tsx
│   │   │   └── 📄 SavingsGoalForm.tsx
│   │   └── 📂 ui/                  # Shadcn UI components
│   │       ├── 📄 badge.tsx
│   │       ├── 📄 button.tsx
│   │       ├── 📄 card.tsx
│   │       ├── 📄 dialog.tsx
│   │       ├── 📄 hero-balance-card.tsx  # Dashboard balance display
│   │       ├── 📄 input.tsx
│   │       ├── 📄 label.tsx
│   │       ├── 📄 mobile-bottom-nav.tsx  # Mobile navigation
│   │       ├── 📄 mobile-header.tsx      # Mobile header
│   │       ├── 📄 quick-stats.tsx        # Financial quick stats
│   │       ├── 📄 select.tsx
│   │       └── 📄 textarea.tsx
│   ├── 📂 lib/                     # Utility libraries
│   │   ├── 📄 supabase/            # Supabase client config
│   │   └── 📄 utils.ts             # Helper functions
│   ├── 📂 providers/               # React context providers
│   │   ├── 📄 QueryProvider.tsx    # TanStack Query provider
│   │   └── 📄 ThemeProvider.tsx    # Theme provider
│   └── 📂 types/                   # TypeScript type definitions
│       ├── 📄 database.types.ts    # Supabase generated types
│       └── 📄 index.ts             # Custom type definitions
├── 📂 docs/                        # Documentation files
├── 📄 middleware.ts                # Route protection middleware
├── 📄 next.config.js               # Next.js configuration
├── 📄 tailwind.config.ts           # Tailwind configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 package.json                 # Dependencies & scripts
└── 📄 vercel.json                  # Vercel deployment config
```

---

## 📦 Installation & Setup

### **Prerequisites**

Before starting, make sure you have installed:

- ✅ **Node.js** version 18 or newer ([Download here](https://nodejs.org/))
- ✅ **Git** ([Download here](https://git-scm.com/))
- ✅ **Supabase Account** ([Sign up free here](https://supabase.com))
- ✅ **Code Editor** (VS Code recommended)

### **Step 1: Clone Repository**

```bash
git clone https://github.com/ymoricode/noteflow-app.git
cd noteflow-app
```

### **Step 2: Install Dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

### **Step 3: Create Supabase Project**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Fill in project details and wait for setup

### **Step 4: Setup Database Schema**

1. Open **SQL Editor** in Supabase Dashboard
2. Create the required tables for:
   - `profiles` - User profile information
   - `expenses` - Income & expense transactions
   - `budgets` - Budget planning by category
   - `savings_goals` - Savings goal tracking
   - `bills` - Recurring bills & subscriptions

### **Step 5: Configure Environment Variables**

Create `.env.local` file in root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> 💡 Find these values in Supabase Dashboard > Settings > API

### **Step 6: Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema

### **Entity Relationship Diagram**

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     profiles    │       │    expenses     │       │     budgets     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK, FK)     │──┐    │ id (PK)         │       │ id (PK)         │
│ email           │  │    │ user_id (FK)    │───┐   │ user_id (FK)    │───┐
│ full_name       │  │    │ amount          │   │   │ category        │   │
│ avatar_url      │  │    │ type            │   │   │ amount          │   │
│ created_at      │  │    │ category        │   │   │ period          │   │
│ updated_at      │  │    │ note            │   │   │ created_at      │   │
└─────────────────┘  │    │ transaction_date│   │   │ updated_at      │   │
                     │    │ created_at      │   │   └─────────────────┘   │
                     │    │ updated_at      │   │                         │
                     │    └─────────────────┘   │                         │
                     │                          │                         │
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
│ created_at      │                                 │ is_recurring    │
│ updated_at      │                                 │ frequency       │
└─────────────────┘                                 │ is_paid         │
                                                    │ last_paid_date  │
                                                    │ notes           │
                                                    │ created_at      │
                                                    │ updated_at      │
                                                    └─────────────────┘
```

### **Tables Overview**

| Table | Description |
|-------|-------------|
| `profiles` | User profile information |
| `expenses` | Income & expense transactions |
| `budgets` | Budget planning by category |
| `savings_goals` | Savings goal tracking |
| `bills` | Recurring bills & subscriptions |

---

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ Yes |

---

## 🚀 Deployment

### **Deploy to Vercel (Recommended)**

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ymoricode/noteflow-app)

### **Deploy to Other Platforms**

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/1a1a2e/7c3aed?text=Dashboard)

### Finance Tracking
![Finance](https://via.placeholder.com/800x400/1a1a2e/7c3aed?text=Finance+Tracking)

### Budget Planning
![Budget](https://via.placeholder.com/800x400/1a1a2e/7c3aed?text=Budget+Planning)

### Bills Management
![Bills](https://via.placeholder.com/800x400/1a1a2e/7c3aed?text=Bills+Management)

### Savings Goals
![Savings](https://via.placeholder.com/800x400/1a1a2e/7c3aed?text=Savings+Goals)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**ymoricode**

- GitHub: [@ymoricode](https://github.com/ymoricode)

---

<div align="center">

**⭐ If you find this project helpful, please give it a star! ⭐**

Made with ❤️ by ymoricode

© 2026 ymoricode. All rights reserved.

</div>
