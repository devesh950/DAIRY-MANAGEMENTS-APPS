# Bharti Dairy Management System (भारती डेयरी प्रबंधन)

A modern, responsive, and full-featured web application designed for milk dairy owners, milk delivery vendors, and dairy farms. Built with **React 18**, **Vite**, **Tailwind CSS**, and **Lucide Icons**.

---

## 🌟 Key Features

### 1. 📅 Daily Delivery Register (दैनिक दूध वितरण)
- **Shift Support**: Morning, Evening, or Both shifts.
- **1-Click Bulk Action**: Quickly mark default quota for all active customers in one click.
- **Quick Steppers**: `+` and `-` (0.5L) adjustments on the fly.
- **Absent / Leave Toggle**: One-tap marking for customer holidays (`आज छुट्टी`).
- **Dual View Modes**: Switch between **Cards View** and **Compact Table View**.
- **Route / Area Filter**: Filter daily delivery runs by delivery routes.

### 2. 👥 Customer Management (ग्राहक खाता)
- Add, edit, search, and manage customer accounts.
- Configure milk types (**Buffalo, Cow, A2 Desi Cow, Mixed**), custom rates per liter, and opening balance.
- Live active/inactive customer status toggling.

### 3. 🧾 Monthly Billing & 1-Click WhatsApp Sharing
- Automatic monthly calculations (Days supplied, Absent days, Total Liters, Monthly total, Previous balance, Net Due).
- **1-Click WhatsApp Integration**: Generates a pre-formatted bilingual bill message with a direct `https://wa.me/` link.
- **Thermal Receipt Slip**: Built-in 58mm/80mm dashed thermal slip formatting with `window.print()` support.
- **Live Scannable UPI QR Code**: Dynamically generates UPI QR code directly on the receipt for instant customer payment via PhonePe, Google Pay, or Paytm.

### 4. 🪙 Payment Register (भुगतान बही)
- Log received payments via **UPI / PhonePe / GPay**, **Cash**, or **Bank Transfer**.
- Automatically deducts payments from customer balances in real-time.
- Void / delete payment capability with automatic balance rollback.

### 5. 📖 Customer Passbook & Calendar
- Full date-wise daily delivery passbook for each customer with logs of morning/evening milk quantity, absences, and daily cost.

### 6. 🌐 Bilingual & Local-First Architecture
- Seamless toggle between **Hindi (हिंदी)** and **English**.
- **100% Local Storage Persistence**: All data is stored locally in the browser with no external server required.
- **JSON Backup & Restore**: Export and import complete dairy data backups anytime.
- **CSV Export**: Export monthly billing records for Excel and spreadsheets.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)

### Installation & Run

1. Clone the repository:
```bash
git clone https://github.com/devesh950/DAIRY-MANAGEMENTS-APPS.git
cd DAIRY-MANAGEMENTS-APPS
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

---

## 🛠️ Built With
- **React 18** - UI Library
- **Vite** - Next-gen Frontend Tooling
- **Tailwind CSS v4** - Utility-first styling
- **Lucide React** - Modern Icons
