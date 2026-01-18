# 📱 My Finance Mobile UI Design System

> High-Fidelity Mobile UI/UX Documentation for Android & iOS

---

## 📋 Table of Contents

1. [App Overview](#app-overview)
2. [Design Tokens](#design-tokens)
3. [Typography](#typography)
4. [Components](#components)
5. [Screen Specifications](#screen-specifications)
6. [Navigation](#navigation)
7. [Interactions & Gestures](#interactions--gestures)
8. [Accessibility](#accessibility)

---

## 🎯 App Overview

### Purpose
My Finance helps users track income & expenses, manage monthly budgets, track bills and subscriptions, set savings targets, and analyze financial reports.

### Target Users
- Students
- Young adults
- Early professionals

### Design Goals
- ✅ Modern & Minimal
- ✅ Premium feel
- ✅ Easy to scan
- ✅ Data-focused but not overwhelming
- ✅ Thumb-friendly (one-hand usage)

---

## 🎨 Design Tokens

### Color Palette

#### Base Colors
```css
/* Dark Mode (Default) */
--background: #0D0D1A;           /* Deep dark blue-black */
--surface: #1A1A2E;              /* Card backgrounds */
--surface-elevated: #252540;     /* Elevated cards */

/* Light Mode */
--background-light: #F8F9FC;
--surface-light: #FFFFFF;
```

#### Accent Colors
```css
--primary: #7C5CFF;              /* Purple - Main accent */
--primary-light: #9B7FFF;        /* Purple light */
--primary-dark: #5A3FD6;         /* Purple dark */

--income: #22C55E;               /* Green */
--income-light: #4ADE80;
--income-dark: #16A34A;

--expense: #EF4444;              /* Red */
--expense-light: #F87171;
--expense-dark: #DC2626;

--balance: #3B82F6;              /* Blue */
--balance-light: #60A5FA;
--balance-dark: #2563EB;
```

#### Semantic Colors
```css
--success: #22C55E;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

#### Text Colors
```css
--text-primary: #FFFFFF;
--text-secondary: #A1A1AA;
--text-tertiary: #71717A;
--text-inverse: #0D0D1A;
```

### Spacing System
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 12px;
--space-lg: 16px;
--space-xl: 24px;
--space-2xl: 32px;
--space-3xl: 48px;
```

### Border Radius
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-full: 9999px;
```

### Shadows
```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.15);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.2);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.25);
--shadow-glow: 0 0 20px rgba(124, 92, 255, 0.3);
```

### Glassmorphism
```css
.glass {
  background: rgba(26, 26, 46, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-elevated {
  background: rgba(37, 37, 64, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
```

---

## 📝 Typography

### Font Family
```css
--font-primary: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;
```

### Type Scale
| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Display | 32px | 700 | 1.2 | Hero numbers |
| Heading 1 | 24px | 600 | 1.3 | Page titles |
| Heading 2 | 20px | 600 | 1.3 | Section titles |
| Heading 3 | 18px | 600 | 1.4 | Card titles |
| Body Large | 16px | 400 | 1.5 | Primary text |
| Body | 14px | 400 | 1.5 | Default text |
| Body Small | 12px | 400 | 1.4 | Secondary text |
| Caption | 10px | 500 | 1.3 | Labels, hints |

---

## 🧩 Components

### Cards

#### Hero Card (Balance)
```
┌─────────────────────────────────┐
│  Saldo Bersih                   │
│  ━━━━━━━━━━━━━━                 │
│  Rp 360.000                     │  ← 32px, Bold
│  Masuk Rp 400k • Keluar Rp 40k  │  ← 12px, Secondary
└─────────────────────────────────┘
- Background: Glassmorphism with purple glow
- Padding: 20px
- Border-radius: 20px
```

#### Metric Card (Small)
```
┌───────────────┐
│ 📈 Pemasukan  │  ← Icon + Label, 12px
│ Rp 400.000    │  ← 18px, Bold, Color-coded
└───────────────┘
- Width: Flexible (scroll container)
- Min-width: 140px
- Padding: 16px
- Border-radius: 16px
```

#### Transaction Item
```
┌─────────────────────────────────────────┐
│ 🍔  Makanan & Minuman           -Rp 15k │
│     Lunch at cafe  •  05 Jan           │
└─────────────────────────────────────────┘
- Left: Category icon (40px circle)
- Middle: Category + Note + Date
- Right: Amount (color-coded)
- Padding: 12px 16px
- Swipe left: Delete action
```

#### Budget Card
```
┌─────────────────────────────────────────┐
│ 🍔  Makanan & Minuman           ✏️ 🗑️  │
│ ████████░░░░░░░░░░░░░░░░  14%          │
│                                         │
│ Budget         Terpakai        Sisa     │
│ Rp 200.000     Rp 28.000      Rp 172k   │
│ (white)        (red)          (green)   │
└─────────────────────────────────────────┘
- Progress bar: Purple gradient fill
- Border-radius: 16px
- Padding: 16px
```

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #7C5CFF, #5A3FD6);
  color: white;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
}
```

#### FAB (Floating Action Button)
```css
.fab {
  position: fixed;
  bottom: 100px;
  right: 20px;
  background: #7C5CFF;
  color: white;
  padding: 16px 24px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(124, 92, 255, 0.4);
}
```

#### Icon Button
```css
.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Input Fields
```css
.input {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
  color: var(--text-primary);
  font-size: 16px; /* Prevents zoom on iOS */
}

.input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(124, 92, 255, 0.2);
}
```

### Progress Bar
```css
.progress {
  height: 8px;
  background: var(--surface-elevated);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #7C5CFF, #9B7FFF);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Warning state (>75% used) */
.progress-fill.warning {
  background: linear-gradient(90deg, #F59E0B, #FBBF24);
}

/* Danger state (>90% used) */
.progress-fill.danger {
  background: linear-gradient(90deg, #EF4444, #F87171);
}
```

---

## 📱 Screen Specifications

### 1. Dashboard Screen

#### Layout Structure
```
┌──────────────────────────────────┐
│  Hai, Dimas 👋              [👤] │  ← Header (60px)
│  Ringkasan keuangan bulan ini    │
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │     HERO BALANCE CARD        │ │  ← Glassmorphism
│ │     Rp 360.000               │ │
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│ [Income] [Expense] [Budget] [Tab]│  ← Horizontal Scroll
├──────────────────────────────────┤
│ Ringkasan Bulan Ini              │
│ [W] [M] [Y]                      │  ← Toggle pills
│ ┌──────────────────────────────┐ │
│ │      BAR CHART               │ │
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│ Top 3 Pengeluaran                │
│ #1 Makanan ──────────── Rp 28k   │
│ #2 Pendidikan ───────── Rp 12k   │
│ #3 Lainnya ──────────── Rp 0     │
├──────────────────────────────────┤
│ [🏠] [💰] [➕] [🎯] [⚙️]         │  ← Bottom Nav (80px)
└──────────────────────────────────┘
```

#### Specifications
- Safe area: Top 44px (iOS) / Status bar aware
- Content padding: 16px horizontal
- Section gap: 20px
- Bottom nav height: 80px (with safe area)

### 2. Keuangan (Finances) Screen

#### Layout Structure
```
┌──────────────────────────────────┐
│  Keuangan                        │  ← Header
│  Kelola pemasukan & pengeluaran  │
├──────────────────────────────────┤
│  [Minggu] [Bulan●] [Tahunan]     │  ← Segmented Control
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │  Bulan Ini (Kumulatif)       │ │
│ │  ══════════════════════════  │ │  ← Line Chart
│ │  Total: Rp 40.000            │ │
│ └──────────────────────────────┘ │
├──────────────────────────────────┤
│ Riwayat Transaksi                │
│ ┌──────────────────────────────┐ │
│ │ 🍔 Makanan          -Rp 15k  │ │
│ │ 📚 Pendidikan       -Rp 12k  │ │
│ │ 💰 Gaji            +Rp 400k  │ │  ← Scrollable List
│ │ ...                          │ │
│ └──────────────────────────────┘ │
│                      [+ Tambah]  │  ← FAB
├──────────────────────────────────┤
│ [🏠] [💰] [➕] [🎯] [⚙️]         │
└──────────────────────────────────┘
```

### 3. Budget Screen

#### Layout Structure
```
┌──────────────────────────────────┐
│  Budget                    [Jan▼]│  ← Month Selector
│  Kelola budget pengeluaran       │
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │ 🍔 Makanan & Minuman    ✏️🗑️│ │
│ │ ████░░░░░░░░░░░░░░░  14%     │ │
│ │ Rp 200k   Rp 28k    Rp 172k  │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ 🚗 Transportasi              │ │
│ │ █████████░░░░░░░░░░  45%     │ │
│ └──────────────────────────────┘ │
│                    [+ Tambah]    │
├──────────────────────────────────┤
│ [🏠] [💰] [➕] [🎯] [⚙️]         │
└──────────────────────────────────┘
```

### 4. Tagihan (Bills) Screen

#### Layout Structure
```
┌──────────────────────────────────┐
│  Tagihan                         │
│  Kelola tagihan & langganan      │
├──────────────────────────────────┤
│ [Total] [Belum] [Sudah] [Telat]  │  ← Summary Cards
│  850k     3       2       1      │
├──────────────────────────────────┤
│ Tagihan Mendatang                │
│ ┌──────────────────────────────┐ │
│ │ 📶 MyRepublic     [Internet] │ │
│ │ Rp 350.000                   │ │
│ │ 📅 15 Jan 2026  🔄 Bulanan   │ │
│ │ [Tandai Lunas]               │ │
│ └──────────────────────────────┘ │
│                    [+ Tambah]    │
├──────────────────────────────────┤
│ [🏠] [💰] [➕] [🎯] [⚙️]         │
└──────────────────────────────────┘
```

### 5. Target Tabungan Screen

#### Layout Structure
```
┌──────────────────────────────────┐
│  Target Tabungan                 │
│  Kelola & lacak target Anda      │
├──────────────────────────────────┤
│ [Terkumpul] [Target] [Tercapai]  │
│   2.5jt       15jt     1/3       │
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │ ✈️ Japan Trip           🗑️  │ │
│ │ ████████████░░░░░░░  45%     │ │
│ │ Rp 4.5jt dari Rp 10jt        │ │
│ │ [+ Tambah Dana]              │ │
│ └──────────────────────────────┘ │
│                  [+ Target Baru] │
├──────────────────────────────────┤
│ [🏠] [💰] [➕] [🎯] [⚙️]         │
└──────────────────────────────────┘
```

### 6. Laporan (Reports) Screen

#### Layout Structure
```
┌──────────────────────────────────┐
│  Laporan               [Jan▼]📥  │  ← Export CSV
│  Analisis keuangan Anda          │
├──────────────────────────────────┤
│ ┌────────┐ ┌────────┐            │
│ │Pemasuk │ │Pengelua│            │  ← 2x2 Grid
│ │+400k 📈│ │-40k  📉│            │
│ └────────┘ └────────┘            │
│ ┌────────┐ ┌────────┐            │
│ │Saldo   │ │Budget  │            │
│ │360k    │ │20% ◐  │            │
│ └────────┘ └────────┘            │
├──────────────────────────────────┤
│ Pengeluaran per Kategori         │
│ Makanan  ████████░░░ 70% Rp28k   │
│ Pendidik ███░░░░░░░░ 30% Rp12k   │
├──────────────────────────────────┤
│ Rata-rata Bulanan                │
│ 📈 Pemasukan: Rp 400k/bln        │
│ 📉 Pengeluaran: Rp 40k/bln       │
├──────────────────────────────────┤
│ Total 5 transaksi bulan ini      │
├──────────────────────────────────┤
│ [🏠] [💰] [➕] [🎯] [⚙️]         │
└──────────────────────────────────┘
```

---

## 🧭 Navigation

### Bottom Navigation Bar

```
┌─────────────────────────────────────────┐
│                                         │
│  🏠      💰      ⊕      🎯      ⚙️    │
│ Dashbrd Keuangn  Add  Target  Setting  │
│                                         │
└─────────────────────────────────────────┘
```

#### Specifications
- Height: 64px + safe area
- Background: Glassmorphism
- Active state: Purple icon + label
- Center button: Elevated, 56px, Purple gradient
- Icon size: 24px
- Label size: 10px

#### Navigation Items
| Icon | Label | Screen |
|------|-------|--------|
| Home | Dashboard | /dashboard |
| Wallet | Keuangan | /finances |
| Plus | Add | Modal (Quick Add) |
| Target | Target | /savings |
| Settings | Pengaturan | /settings |

### Quick Add Modal

Triggered by center button:
```
┌──────────────────────────────────┐
│         Tambah Transaksi      ✕ │
├──────────────────────────────────┤
│  [💰 Pemasukan] [💸 Pengeluaran] │
├──────────────────────────────────┤
│  Nominal                         │
│  ┌────────────────────────────┐  │
│  │ Rp 0                       │  │
│  └────────────────────────────┘  │
│                                  │
│  Kategori          [Pilih ▼]     │
│  Tanggal           [Hari ini ▼]  │
│  Catatan           [Optional]    │
│                                  │
│  [        Simpan        ]        │
└──────────────────────────────────┘
```

---

## 👆 Interactions & Gestures

### Touch Targets
- Minimum: 44x44px (Apple HIG)
- Recommended: 48x48px

### Gestures

| Gesture | Action | Context |
|---------|--------|---------|
| Swipe Left | Delete | Transaction list, Budget card |
| Swipe Right | Mark as Paid | Bill card |
| Pull Down | Refresh | All list screens |
| Tap & Hold | Quick Actions | Transaction item |
| Double Tap | Edit | Savings target |

### Micro-interactions

#### Button Press
```css
.btn:active {
  transform: scale(0.97);
  transition: transform 0.1s ease;
}
```

#### Card Tap
```css
.card:active {
  background: var(--surface-elevated);
  transition: background 0.15s ease;
}
```

#### Success Animation
- Checkmark scales from 0 to 1
- Green ripple effect
- Haptic feedback (medium)

#### Delete Animation
- Slide out left
- Fade to red
- Collapse height

---

## ♿ Accessibility

### Color Contrast
- All text meets WCAG AA (4.5:1 minimum)
- Large text meets AAA (7:1)
- Interactive elements have visible focus states

### Screen Reader
- All icons have aria-labels
- Amount changes announced
- Navigation landmarks defined

### Motion
- Respect `prefers-reduced-motion`
- Essential animations only
- No auto-playing animations

### Font Scaling
- Support up to 200% text scaling
- Flexible layouts adapt to larger text

---

## 📐 Safe Areas

### iOS
```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
```

### Android
- Status bar: 24dp
- Navigation bar: 48dp (3-button) / 0dp (gesture)

---

## 🔧 Implementation Notes

### Performance
- Virtualized lists for transactions
- Lazy load charts
- Skeleton loaders for async content

### Offline Support
- Cache recent transactions
- Queue actions for sync
- Show offline indicator

### Dark Mode
- Default theme
- Automatic system detection
- Manual toggle in settings

---

*Last Updated: January 2026*
*Version: 1.0.0*
