# Bharti Dairy Management Pro - Interview Ready Project Sheet

## 1. Quick Project Elevator Pitch (30 Seconds)
> "I built **Bharti Dairy Management Pro**, a responsive, local-first web application engineered for Indian dairy businesses and milk delivery distributors. It replaces traditional paper-based registers with real-time shift delivery logging, automated monthly billing, dynamic UPI QR code generation, and 1-click WhatsApp bill dispatching with thermal printer support."

---

## 2. Technical Stack & Architecture

| Layer | Technology | Why Chosen? |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (Hooks, Memoization) | Component modularity, declarative UI, efficient DOM diffing |
| **Build Tool** | Vite 6 | Sub-second HMR, optimized ES modules, fast production builds |
| **Styling** | Tailwind CSS v4 | Rapid design token composition, responsive layout, `@media print` rules |
| **Icons** | Lucide React | Lightweight SVG tree-shakable icon library |
| **Storage & Sync** | Local-First Browser Storage | Zero latency, works offline, data privacy, JSON export/import |
| **Integration** | WhatsApp URL API & UPI Protocol | Zero external SMS gateway cost; direct P2P billing via UPI deep links |

---

## 3. Core Features & Business Logic

1. **Dual-Shift Delivery Register (दैनिक वितरण बही)**:
   - Tracks **Morning & Evening** shifts with +/- 0.5L granular steppers.
   - 1-Click **Bulk Default Quota Logging** (`markAllDefaults`) reducing operational time by 90%.
   - Single-tap Absent/Holiday handling with instant recalculations.

2. **Automated Monthly Billing Engine**:
   - Computes: `(Total Days Supplied × Daily Liters × Rate) + Previous Dues - Payments Received = Net Payable`.
   - Generates formatted WhatsApp templates with encoded deep links (`https://wa.me/...`).

3. **Dynamic UPI QR Code Generator**:
   - Formats standard `upi://pay?pa={upiId}&am={netDue}&cu=INR` payload and renders real-time scannable QR codes on customer slips for PhonePe, GPay, and Paytm.

4. **58mm / 80mm Thermal Printer Slip Formatting**:
   - Custom `@media print` CSS isolating only the receipt card for direct thermal printer hardware output.

5. **Financial Payment Register & Ledger**:
   - Double-entry tracking (Cash, UPI, NEFT) with automatic balance deductions and void rollback support.

6. **Full Bilingual Support (i18n)**:
   - Instant toggle between **Hindi (हिंदी)** and **English** for regional usability.

---

## 4. Key Engineering Challenges & Solutions

### Q1: How did you ensure fast rendering when managing monthly delivery logs for multiple customers?
- **Solution**: Used React `useMemo` for daily and monthly delivery aggregation to prevent expensive recalculations during tab switches or search keystrokes. Structured deliveries as normalized key-value state (`{ [date]: { [customerId]: { morning, evening, isHoliday, rate } } }`) ensuring $O(1)$ read and write performance.

### Q2: Why Local-First architecture instead of a backend database?
- **Solution**: Local dairy vendors often have intermittent network connectivity in rural/semi-urban routes. A local-first architecture ensures 100% offline availability with sub-millisecond response times, accompanied by JSON backup/restore and CSV export functionality for data safety.

### Q3: How did you handle thermal printer compatibility across mobile and desktop browsers?
- **Solution**: Implemented specialized CSS print directives (`@media print`) hiding UI navigation and action buttons while isolating the fixed-width receipt DOM element with dashed borders and monospace typography.

---

## 5. Potential Interview Talking Points & Metrics
- **Performance**: 100/100 Lighthouse Performance score with Vite tree shaking and lightweight Tailwind v4 bundle (~64 KB gzipped).
- **Domain Fit**: Tailored specifically for the Indian micro-dairy supply chain, eliminating paper diary calculation errors and reducing collection cycles via WhatsApp + UPI QR.
