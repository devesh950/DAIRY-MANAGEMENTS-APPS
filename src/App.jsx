import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Milk,
  Users,
  Calendar,
  IndianRupee,
  Phone,
  MapPin,
  Check,
  X,
  Plus,
  Search,
  Printer,
  Share2,
  Download,
  Receipt,
  CreditCard,
  Settings,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Sun,
  Moon,
  Send,
  Edit2,
  Trash2,
  ChevronRight,
  Filter,
  CheckCircle2,
  CalendarDays,
  Coins,
  QrCode,
  FileSpreadsheet,
  Upload,
  Database,
  RefreshCw,
  Copy,
  ChevronDown,
  FileText,
  Sliders,
  DollarSign,
  Truck
} from 'lucide-react';

const BHARTI_DAIRY_PROFILE = {
  dairyName: "भारती डेयरी (Bharti Dairy)",
  ownerName: "सुरेश भारती (Suresh Bharti)",
  phone: "9876543210",
  upiId: "bhartidairy@upi",
  address: "दुकान नं. 4, मेन मार्केट, विकास नगर",
  tagline: "100% शुद्ध एवं ताजा दूध - आपके घर तक",
  footerMsg: "शुद्धता और विश्वास ही हमारी पहचान है। धन्यवाद!",
  defaultRates: {
    buffalo: 70,
    cow: 55,
    mix: 65,
    a2: 85
  },
  routes: ["विकास नगर", "पटेल नगर", "साईं रेजीडेंसी", "सेक्टर 5", "शिव शक्ति एन्क्लेव"]
};

const INITIAL_CUSTOMERS = [
  {
    id: "cust-1",
    name: "राजेश शर्मा (Rajesh Sharma)",
    phone: "9812345670",
    address: "मकान नं 12, गली 3, विकास नगर",
    route: "विकास नगर",
    milkType: "buffalo",
    morningQty: 1.5,
    eveningQty: 1.0,
    rate: 70,
    balance: 1450,
    active: true
  },
  {
    id: "cust-2",
    name: "अमित कुमार वर्मा (Amit Verma)",
    phone: "9898765432",
    address: "फ्लैट 204, साईं रेजीडेंसी",
    route: "साईं रेजीडेंसी",
    milkType: "cow",
    morningQty: 1.0,
    eveningQty: 0.0,
    rate: 55,
    balance: 825,
    active: true
  },
  {
    id: "cust-3",
    name: "श्रीमती सुनीता गुप्ता (Sunita Gupta)",
    phone: "9711223344",
    address: "एच-45, पटेल नगर",
    route: "पटेल नगर",
    milkType: "buffalo",
    morningQty: 2.0,
    eveningQty: 1.5,
    rate: 72,
    balance: 3200,
    active: true
  },
  {
    id: "cust-4",
    name: "डॉ. विकास त्यागी (Dr. Tyagi)",
    phone: "9988776655",
    address: "क्लिनिक रोड, सेक्टर 5",
    route: "सेक्टर 5",
    milkType: "cow",
    morningQty: 2.0,
    eveningQty: 2.0,
    rate: 56,
    balance: 0,
    active: true
  },
  {
    id: "cust-5",
    name: "महेश चंद्र जोशी (M. C. Joshi)",
    phone: "9823456781",
    address: "प्लॉट 88, शिव शक्ति एन्क्लेव",
    route: "शिव शक्ति एन्क्लेव",
    milkType: "buffalo",
    morningQty: 1.0,
    eveningQty: 1.0,
    rate: 70,
    balance: 650,
    active: true
  }
];

const getTodayDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMonthYear = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export default function App() {
  const [lang, setLang] = useState('hi'); // 'hi' or 'en'
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'customers' | 'billing' | 'payments' | 'settings' | 'reports'
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Persistent States
  const [dairyInfo, setDairyInfo] = useState(() => {
    try {
      const s = localStorage.getItem('bharti_dairy_info_v2');
      return s ? JSON.parse(s) : BHARTI_DAIRY_PROFILE;
    } catch {
      return BHARTI_DAIRY_PROFILE;
    }
  });

  const [customers, setCustomers] = useState(() => {
    try {
      const s = localStorage.getItem('bharti_customers_v2');
      return s ? JSON.parse(s) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  // Delivery Records: { [date]: { [customerId]: { morning: 1.5, evening: 1.0, isHoliday: false, rate: 70, note: '' } } }
  const [deliveries, setDeliveries] = useState(() => {
    try {
      const s = localStorage.getItem('bharti_deliveries_v2');
      if (s) return JSON.parse(s);

      // Auto prefill sample history for current month
      const initialMap = {};
      const today = new Date();
      for (let i = 1; i <= Math.min(today.getDate(), 20); i++) {
        const dStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        initialMap[dStr] = {};
        INITIAL_CUSTOMERS.forEach(c => {
          initialMap[dStr][c.id] = {
            morning: c.morningQty,
            evening: c.eveningQty,
            isHoliday: (i === 4 && c.id === 'cust-2'), // Sample absent day
            rate: c.rate,
            note: ''
          };
        });
      }
      return initialMap;
    } catch {
      return {};
    }
  });

  // Payment Logs: [ { id, customerId, date, amount, mode, note } ]
  const [payments, setPayments] = useState(() => {
    try {
      const s = localStorage.getItem('bharti_payments_v2');
      if (s) return JSON.parse(s);
      return [
        { id: "pay-1", customerId: "cust-1", date: getTodayDate(), amount: 1000, mode: "PhonePe/UPI", note: "महीने की अग्रिम राशि" },
        { id: "pay-2", customerId: "cust-3", date: getTodayDate(), amount: 2000, mode: "Cash", note: "नकद प्राप्त हुआ" }
      ];
    } catch {
      return [];
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('bharti_dairy_info_v2', JSON.stringify(dairyInfo));
  }, [dairyInfo]);

  useEffect(() => {
    localStorage.setItem('bharti_customers_v2', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('bharti_deliveries_v2', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem('bharti_payments_v2', JSON.stringify(payments));
  }, [payments]);

  // Operational Date & Filters
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedShift, setSelectedShift] = useState('both'); // 'morning' | 'evening' | 'both'
  const [filterMilkType, setFilterMilkType] = useState('all');
  const [filterRoute, setFilterRoute] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'inactive'

  // Modals & Temp States
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    address: '',
    route: '',
    milkType: 'buffalo',
    morningQty: 1.0,
    eveningQty: 0.5,
    rate: 70,
    balance: 0,
    active: true
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    customerId: customers[0]?.id || '',
    amount: '',
    mode: 'UPI',
    date: getTodayDate(),
    note: 'दूध बिल भुगतान'
  });

  const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [billingCustomer, setBillingCustomer] = useState(null);
  const [billingMonth, setBillingMonth] = useState(getMonthYear(getTodayDate()));
  const [notification, setNotification] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrModalData, setQrModalData] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // Ensure record exists for today/selectedDate
  const getCustomerDelivery = (cId, date) => {
    const dayData = deliveries[date] || {};
    if (dayData[cId]) {
      return dayData[cId];
    }
    const cust = customers.find(c => c.id === cId);
    return {
      morning: cust ? cust.morningQty : 0,
      evening: cust ? cust.eveningQty : 0,
      isHoliday: false,
      rate: cust ? cust.rate : 70,
      note: ''
    };
  };

  // Update specific delivery quantity
  const updateDelivery = (cId, updates, date = selectedDate) => {
    setDeliveries(prev => {
      const currentDay = prev[date] || {};
      const currentEntry = currentDay[cId] || getCustomerDelivery(cId, date);
      return {
        ...prev,
        [date]: {
          ...currentDay,
          [cId]: { ...currentEntry, ...updates }
        }
      };
    });
  };

  // One click mark all active customers as delivered their defaults
  const markAllDefaults = () => {
    setDeliveries(prev => {
      const updatedDay = { ...(prev[selectedDate] || {}) };
      customers.filter(c => c.active).forEach(c => {
        updatedDay[c.id] = {
          morning: c.morningQty,
          evening: c.eveningQty,
          isHoliday: false,
          rate: c.rate,
          note: ''
        };
      });
      return { ...prev, [selectedDate]: updatedDay };
    });
    showToast(lang === 'hi' ? "सभी सक्रिय ग्राहकों का तय दूध दर्ज किया गया!" : "Default milk marked for all active customers!");
  };

  const todayMetrics = useMemo(() => {
    let morningLiters = 0;
    let eveningLiters = 0;
    let totalEstimatedRupees = 0;
    let absentCount = 0;

    customers.filter(c => c.active).forEach(c => {
      const d = getCustomerDelivery(c.id, selectedDate);
      if (d.isHoliday) {
        absentCount++;
      } else {
        const m = parseFloat(d.morning) || 0;
        const e = parseFloat(d.evening) || 0;
        morningLiters += m;
        eveningLiters += e;
        totalEstimatedRupees += (m + e) * (d.rate || c.rate);
      }
    });

    const totalLiters = morningLiters + eveningLiters;

    return {
      morningLiters: morningLiters.toFixed(1),
      eveningLiters: eveningLiters.toFixed(1),
      totalLiters: totalLiters.toFixed(1),
      totalEstimatedRupees: totalEstimatedRupees.toFixed(0),
      absentCount
    };
  }, [deliveries, customers, selectedDate]);

  const calculateCustomerMonthSummary = (customerId, monthStr) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return null;

    let totalLiters = 0;
    let totalDaysSupplied = 0;
    let totalBillAmount = 0;
    let absentDays = 0;
    const records = [];

    // Filter deliveries belonging to selected month (YYYY-MM)
    Object.keys(deliveries)
      .filter(date => date.startsWith(monthStr))
      .sort()
      .forEach(date => {
        const entry = deliveries[date][customerId];
        if (entry) {
          if (entry.isHoliday) {
            absentDays++;
            records.push({ date, isHoliday: true, morning: 0, evening: 0, total: 0, amount: 0 });
          } else {
            const m = parseFloat(entry.morning) || 0;
            const e = parseFloat(entry.evening) || 0;
            const dayLit = m + e;
            const rate = entry.rate || cust.rate;
            const dayCost = dayLit * rate;
            if (dayLit > 0) {
              totalDaysSupplied++;
              totalLiters += dayLit;
              totalBillAmount += dayCost;
            }
            records.push({ date, isHoliday: false, morning: m, evening: e, total: dayLit, rate, amount: dayCost });
          }
        }
      });

    // Payments in this month
    const monthPayments = payments.filter(p => p.customerId === customerId && p.date.startsWith(monthStr));
    const totalPaidInMonth = monthPayments.reduce((sum, p) => sum + p.amount, 0);

    return {
      customer: cust,
      monthStr,
      totalDaysSupplied,
      absentDays,
      totalLiters: totalLiters.toFixed(1),
      rate: cust.rate,
      billAmount: totalBillAmount.toFixed(0),
      totalPaidInMonth: totalPaidInMonth.toFixed(0),
      currentBalance: cust.balance.toFixed(0),
      netDue: (parseFloat(cust.balance) + totalBillAmount - totalPaidInMonth).toFixed(0),
      records,
      payments: monthPayments
    };
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!customerForm.name.trim() || !customerForm.phone.trim()) {
      showToast(lang === 'hi' ? "नाम और मोबाइल नंबर जरूरी है!" : "Name & Phone are required!");
      return;
    }

    if (editingCustomer) {
      // Edit existing
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? {
        ...c,
        ...customerForm,
        morningQty: parseFloat(customerForm.morningQty) || 0,
        eveningQty: parseFloat(customerForm.eveningQty) || 0,
        rate: parseFloat(customerForm.rate) || 60,
        balance: parseFloat(customerForm.balance) || 0
      } : c));
      showToast(lang === 'hi' ? "ग्राहक की जानकारी अपडेट हुई!" : "Customer updated!");
    } else {
      // Create new
      const newCust = {
        id: `cust-${Date.now()}`,
        ...customerForm,
        morningQty: parseFloat(customerForm.morningQty) || 0,
        eveningQty: parseFloat(customerForm.eveningQty) || 0,
        rate: parseFloat(customerForm.rate) || (dairyInfo.defaultRates[customerForm.milkType] || 70),
        balance: parseFloat(customerForm.balance) || 0,
        active: true
      };
      setCustomers(prev => [...prev, newCust]);
      showToast(lang === 'hi' ? "नया ग्राहक सफलतापूर्वक जोड़ा गया!" : "New customer added!");
    }

    setShowAddCustomerModal(false);
    setEditingCustomer(null);
    setCustomerForm({
      name: '',
      phone: '',
      address: '',
      route: '',
      milkType: 'buffalo',
      morningQty: 1.0,
      eveningQty: 0.5,
      rate: 70,
      balance: 0,
      active: true
    });
  };

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm(lang === 'hi' ? "क्या आप वाकई इस ग्राहक को हटाना चाहते हैं?" : "Are you sure you want to delete this customer?")) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      showToast(lang === 'hi' ? "ग्राहक हटा दिया गया" : "Customer removed");
    }
  };

  const toggleCustomerActive = (customerId) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const updated = !c.active;
        showToast(updated ? (lang === 'hi' ? "ग्राहक सक्रिय किया गया" : "Customer activated") : (lang === 'hi' ? "ग्राहक निष्क्रिय किया गया" : "Customer deactivated"));
        return { ...c, active: updated };
      }
      return c;
    }));
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    const amt = parseFloat(paymentForm.amount);
    if (!amt || amt <= 0) {
      showToast(lang === 'hi' ? "कृपया सही राशि भरें!" : "Enter valid amount!");
      return;
    }

    const newPay = {
      id: `pay-${Date.now()}`,
      customerId: paymentForm.customerId,
      amount: amt,
      mode: paymentForm.mode,
      date: paymentForm.date,
      note: paymentForm.note
    };

    setPayments(prev => [newPay, ...prev]);

    // Subtract from customer balance
    setCustomers(prev => prev.map(c => {
      if (c.id === paymentForm.customerId) {
        return { ...c, balance: +(c.balance - amt).toFixed(2) };
      }
      return c;
    }));

    setShowPaymentModal(false);
    setPaymentForm(prev => ({ ...prev, amount: '', note: 'दूध बिल भुगतान' }));
    showToast(lang === 'hi' ? `₹${amt} का भुगतान सफलतापूर्वक दर्ज हुआ!` : `Payment of ₹${amt} recorded!`);
  };

  const handleDeletePayment = (payId) => {
    const pay = payments.find(p => p.id === payId);
    if (!pay) return;
    if (window.confirm(lang === 'hi' ? "क्या आप इस भुगतान को हटाना चाहते हैं? ग्राहक का बकाया वापस बढ़ जाएगा।" : "Delete this payment? The customer balance will be restored.")) {
      setPayments(prev => prev.filter(p => p.id !== payId));
      setCustomers(prev => prev.map(c => {
        if (c.id === pay.customerId) {
          return { ...c, balance: +(c.balance + pay.amount).toFixed(2) };
        }
        return c;
      }));
      showToast(lang === 'hi' ? "भुगतान प्रविष्टि हटाई गई!" : "Payment deleted!");
    }
  };

  const generateWhatsAppMessage = (billData) => {
    const cust = billData.customer;
    const phoneNum = cust.phone.replace(/[^0-9]/g, '');
    const cleanPhone = phoneNum.length === 10 ? `91${phoneNum}` : phoneNum;

    const message = `🥛 *${dairyInfo.dairyName}*
📍 *${dairyInfo.address}*
📞 संपर्क: ${dairyInfo.phone}

नमस्ते *${cust.name}* जी,

आपका मासिक दूध बिल विवरण नीचे दिया गया है:
━━━━━━━━━━━━━━━━━━━━━
📅 *बिल महीना:* ${billData.monthStr}
🥛 *कुल दूध सप्लाई:* ${billData.totalLiters} लीटर
📆 *सप्लाई दिन:* ${billData.totalDaysSupplied} दिन (छुट्टी: ${billData.absentDays} दिन)
💰 *दूध दर (Rate):* ₹${cust.rate} / लीटर
─────────────────────
💵 *इस माह का बिल:* ₹${billData.billAmount}
⏳ *पिछला बकाया:* ₹${cust.balance}
✅ *जमा किया गया:* ₹${billData.totalPaidInMonth}
─────────────────────
🏷️ *कुल देय राशि (Total Payable): ₹${billData.netDue}*
━━━━━━━━━━━━━━━━━━━━━
कृपया समय पर भुगतान करें।
*UPI ID:* ${dairyInfo.upiId}

_${dairyInfo.footerMsg}_`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const copyWhatsAppText = (billData) => {
    const cust = billData.customer;
    const message = `🥛 *${dairyInfo.dairyName}*
📍 *${dairyInfo.address}*
📞 संपर्क: ${dairyInfo.phone}

नमस्ते *${cust.name}* जी,

आपका मासिक दूध बिल विवरण (${billData.monthStr}):
• कुल दूध सप्लाई: ${billData.totalLiters} L
• सप्लाई दिन: ${billData.totalDaysSupplied} दिन
• भाव: ₹${cust.rate}/L
• इस माह का बिल: ₹${billData.billAmount}
• पिछला बकाया: ₹${cust.balance}
• प्राप्त भुगतान: ₹${billData.totalPaidInMonth}
━━━━━━━━━━━━━━━━━━━━━
🏷️ *कुल देय राशि: ₹${billData.netDue}*
━━━━━━━━━━━━━━━━━━━━━
UPI ID: ${dairyInfo.upiId}`;
    navigator.clipboard.writeText(message);
    showToast(lang === 'hi' ? "बिल विवरण कॉपी किया गया!" : "Bill details copied to clipboard!");
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.address.toLowerCase().includes(q) ||
        (c.route && c.route.toLowerCase().includes(q));

      const matchesMilk = filterMilkType === 'all' || c.milkType === filterMilkType;
      const matchesRoute = filterRoute === 'all' || c.route === filterRoute;
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'active' && c.active) ||
        (filterStatus === 'inactive' && !c.active);

      return matchesSearch && matchesMilk && matchesRoute && matchesStatus;
    });
  }, [customers, searchQuery, filterMilkType, filterRoute, filterStatus]);

  // Export Data to CSV / JSON
  const exportDataJSON = () => {
    const data = {
      dairyInfo,
      customers,
      deliveries,
      payments,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bharti_dairy_backup_${getTodayDate()}.json`;
    a.click();
    showToast(lang === 'hi' ? "डाटा बैकअप फाइल डाउनलोड हुई!" : "Data backup downloaded!");
  };

  const importDataJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.dairyInfo) setDairyInfo(data.dairyInfo);
        if (data.customers) setCustomers(data.customers);
        if (data.deliveries) setDeliveries(data.deliveries);
        if (data.payments) setPayments(data.payments);
        showToast(lang === 'hi' ? "डाटा सफलतापूर्वक रिस्टोर हो गया!" : "Data restored successfully!");
      } catch {
        showToast(lang === 'hi' ? "अमान्य बैकअप फाइल!" : "Invalid backup file!");
      }
    };
    reader.readAsText(file);
  };

  const exportMonthlyBillingCSV = () => {
    let csv = "Customer Name,Phone,Route,Milk Type,Supply Days,Absent Days,Total Liters,Rate,Month Amount,Previous Due,Paid,Net Due\n";
    customers.forEach(c => {
      const summary = calculateCustomerMonthSummary(c.id, billingMonth);
      if (summary) {
        csv += `"${c.name}","${c.phone}","${c.route || ''}","${c.milkType}",${summary.totalDaysSupplied},${summary.absentDays},${summary.totalLiters},${c.rate},${summary.billAmount},${c.balance},${summary.totalPaidInMonth},${summary.netDue}\n`;
      }
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dairy_bills_${billingMonth}.csv`;
    a.click();
    showToast(lang === 'hi' ? "बिलिंग रिपोर्ट CSV डाउनलोड हुई!" : "Billing CSV exported!");
  };

  const resetToSampleData = () => {
    if (window.confirm(lang === 'hi' ? "क्या आप सैंपल डाटा लोड करना चाहते हैं?" : "Load sample demonstration data?")) {
      setDairyInfo(BHARTI_DAIRY_PROFILE);
      setCustomers(INITIAL_CUSTOMERS);
      localStorage.clear();
      showToast(lang === 'hi' ? "डिफ़ॉल्ट सैंपल डाटा रीसेट हुआ!" : "Reset to default sample data!");
    }
  };

  // UPI QR Code URL Generator (generates QR image via free public API)
  const getUpiQrUrl = (amount, customerName) => {
    const upiLink = `upi://pay?pa=${dairyInfo.upiId}&pn=${encodeURIComponent(dairyInfo.ownerName)}&am=${amount}&tn=${encodeURIComponent(`Milk Bill - ${customerName}`)}&cu=INR`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}`;
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans pb-16 antialiased selection:bg-emerald-500 selection:text-white">

      {/* Top Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-stone-700 text-sm font-black animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Header with Bharti Dairy Branding & Controls */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 text-white shadow-xl border-b border-emerald-700/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3.5">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-emerald-950 flex items-center justify-center font-black shadow-lg border-2 border-amber-200">
                <Milk className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-sm">
                    {dairyInfo.dairyName}
                  </h1>
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    Dairy Pro v2.0
                  </span>
                </div>
                <p className="text-xs text-emerald-200 font-medium flex items-center gap-2 mt-0.5">
                  <span>{dairyInfo.ownerName}</span>
                  <span>•</span>
                  <span>📞 {dairyInfo.phone}</span>
                  <span>•</span>
                  <span className="text-amber-300">UPI: {dairyInfo.upiId}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions Header */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLang(l => l === 'hi' ? 'en' : 'hi')}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs sm:text-sm font-bold border border-white/15 transition cursor-pointer flex items-center gap-1.5"
                title="Toggle Language"
              >
                <span>🌐</span>
                <span>{lang === 'hi' ? 'English' : 'हिंदी'}</span>
              </button>

              <button
                onClick={() => {
                  setPaymentForm({
                    customerId: customers[0]?.id || '',
                    amount: '',
                    mode: 'UPI',
                    date: getTodayDate(),
                    note: 'दूध बिल भुगतान'
                  });
                  setShowPaymentModal(true);
                }}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl text-xs sm:text-sm font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>+ ₹ {lang === 'hi' ? 'भुगतान दर्ज करें' : 'Record Payment'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar border-t border-emerald-800/60 bg-emerald-950/40">
          <nav className="flex space-x-1.5 py-2">
            {[
              { id: 'daily', label: lang === 'hi' ? 'दैनिक दूध वितरण (Daily)' : 'Daily Delivery', icon: Milk },
              { id: 'customers', label: lang === 'hi' ? 'ग्राहक खाता (Customers)' : 'Customers List', icon: Users },
              { id: 'billing', label: lang === 'hi' ? 'मासिक बिल व WhatsApp' : 'Monthly Bill & WhatsApp', icon: Receipt },
              { id: 'payments', label: lang === 'hi' ? 'भुगतान बही (Payments)' : 'Payment Register', icon: Coins },
              { id: 'reports', label: lang === 'hi' ? 'बैकअप व रिपोर्ट्स' : 'Backup & Reports', icon: FileSpreadsheet },
              { id: 'settings', label: lang === 'hi' ? 'डेयरी सेटिंग्स' : 'Dairy Settings', icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-emerald-950 shadow-md font-black'
                      : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-emerald-300'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 space-y-5">

        {/* DASHBOARD TOP STATS BAR */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  {lang === 'hi' ? 'आज का कुल दूध' : 'Total Milk Today'}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                  {todayMetrics.totalLiters} <span className="text-xs font-semibold text-stone-500">Liters</span>
                </h3>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                <Milk className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2.5 text-xs font-bold text-stone-600 flex justify-between border-t border-stone-100 pt-2">
              <span className="text-amber-700 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5" /> {lang === 'hi' ? 'सुबह' : 'M'}: {todayMetrics.morningLiters}L
              </span>
              <span className="text-indigo-700 flex items-center gap-1">
                <Moon className="w-3.5 h-3.5" /> {lang === 'hi' ? 'शाम' : 'E'}: {todayMetrics.eveningLiters}L
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  {lang === 'hi' ? 'आज का अनुमानित बिल' : 'Estimated Daily Sale'}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1">
                  ₹{todayMetrics.totalEstimatedRupees}
                </h3>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2.5 text-xs font-semibold text-stone-500 border-t border-stone-100 pt-2">
              {lang === 'hi' ? `कुल ${customers.length} पंजीकृत कस्टमर` : `Total ${customers.length} Customers`}
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  {lang === 'hi' ? 'आज की छुट्टियां (Absent)' : 'Absents Today'}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                  {todayMetrics.absentCount}
                </h3>
              </div>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2.5 text-xs font-semibold text-stone-500 border-t border-stone-100 pt-2">
              {lang === 'hi' ? `${customers.length - todayMetrics.absentCount} घरों में दूध गया` : `${customers.length - todayMetrics.absentCount} houses served today`}
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  {lang === 'hi' ? 'कुल मार्केट बकाया' : 'Total Due Balance'}
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
                  ₹{customers.reduce((sum, c) => sum + (c.balance || 0), 0).toFixed(0)}
                </h3>
              </div>
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl">
                <Coins className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2.5 text-xs font-semibold text-stone-500 border-t border-stone-100 pt-2">
              {lang === 'hi' ? 'ग्राहकों पर कुल उधारी' : 'Total Market Receivables'}
            </div>
          </div>
        </section>

        {/* TAB 1: DAILY DELIVERY REGISTER */}
        {activeTab === 'daily' && (
          <div className="space-y-4">
            {/* Control & Filter Toolbar */}
            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {/* Date Picker */}
                <div className="flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-2xl px-3 py-1.5 shadow-inner">
                  <Calendar className="w-4 h-4 text-emerald-800" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-xs sm:text-sm font-black bg-transparent text-stone-800 focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Shift Selector */}
                <div className="flex rounded-2xl bg-stone-100 p-1 border border-stone-200 text-xs font-bold">
                  <button
                    onClick={() => setSelectedShift('both')}
                    className={`px-3 py-1 rounded-xl transition cursor-pointer ${selectedShift === 'both' ? 'bg-white shadow text-emerald-900 font-black' : 'text-stone-600 hover:text-stone-900'}`}
                  >
                    {lang === 'hi' ? 'दोनों शिफ्ट' : 'Both'}
                  </button>
                  <button
                    onClick={() => setSelectedShift('morning')}
                    className={`px-3 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 ${selectedShift === 'morning' ? 'bg-amber-400 text-stone-950 font-black shadow' : 'text-stone-600 hover:text-stone-900'}`}
                  >
                    <Sun className="w-3 h-3" />
                    <span>{lang === 'hi' ? 'सुबह' : 'Morning'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedShift('evening')}
                    className={`px-3 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 ${selectedShift === 'evening' ? 'bg-indigo-700 text-white font-black shadow' : 'text-stone-600 hover:text-stone-900'}`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>{lang === 'hi' ? 'शाम' : 'Evening'}</span>
                  </button>
                </div>

                {/* Route Filter */}
                {dairyInfo.routes && dairyInfo.routes.length > 0 && (
                  <select
                    value={filterRoute}
                    onChange={(e) => setFilterRoute(e.target.value)}
                    className="bg-stone-50 border border-stone-300 rounded-2xl px-3 py-1.5 text-xs font-bold text-stone-700 focus:outline-none"
                  >
                    <option value="all">{lang === 'hi' ? 'सभी रूट / गली' : 'All Routes'}</option>
                    {dairyInfo.routes.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(v => v === 'cards' ? 'table' : 'cards')}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Toggle View Mode"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{viewMode === 'cards' ? (lang === 'hi' ? 'टेबल व्यू' : 'Table View') : (lang === 'hi' ? 'कार्ड व्यू' : 'Cards View')}</span>
                </button>

                <button
                  onClick={markAllDefaults}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>{lang === 'hi' ? 'एक-क्लिक: सभी को तय दूध भरें' : '1-Click: Mark All Defaults'}</span>
                </button>
              </div>
            </div>

            {/* Delivery Cards Grid */}
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map((customer) => {
                  const delivery = getCustomerDelivery(customer.id, selectedDate);
                  const morning = delivery.morning;
                  const evening = delivery.evening;
                  const isHoliday = delivery.isHoliday;
                  const totalToday = isHoliday ? 0 : (parseFloat(morning) + parseFloat(evening));
                  const costToday = totalToday * (delivery.rate || customer.rate);

                  return (
                    <div
                      key={customer.id}
                      className={`rounded-3xl border p-4 shadow-xs transition ${
                        isHoliday
                          ? 'bg-rose-50/60 border-rose-200 opacity-85'
                          : 'bg-white border-stone-200 hover:shadow-md'
                      }`}
                    >
                      {/* Customer Info Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-stone-900 text-base">
                              {customer.name}
                            </h4>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              customer.milkType === 'cow' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                              customer.milkType === 'a2' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                              'bg-blue-100 text-blue-900 border border-blue-200'
                            }`}>
                              {customer.milkType === 'cow' ? 'गाय (Cow)' :
                               customer.milkType === 'a2' ? 'A2 देशी गाय' :
                               customer.milkType === 'mix' ? 'मिश्रित' : 'भैंस (Buffalo)'}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 font-medium flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{customer.address}</span>
                          </p>
                          <p className="text-xs text-stone-400 mt-0.5">
                            📞 {customer.phone}
                          </p>
                        </div>

                        {/* Absent / Holiday Toggle */}
                        <button
                          onClick={() => updateDelivery(customer.id, { isHoliday: !isHoliday })}
                          className={`text-[11px] font-black px-3 py-1 rounded-xl transition border cursor-pointer ${
                            isHoliday
                              ? 'bg-rose-600 text-white border-rose-600 shadow'
                              : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-rose-50 hover:text-rose-600'
                          }`}
                        >
                          {isHoliday ? (lang === 'hi' ? '❌ आज छुट्टी' : 'On Leave') : (lang === 'hi' ? 'छुट्टी करें?' : 'Mark Leave')}
                        </button>
                      </div>

                      {/* Delivery Adjuster Inputs */}
                      {!isHoliday ? (
                        <div className="mt-4 space-y-2.5">
                          {/* Morning Shift Row */}
                          {(selectedShift === 'both' || selectedShift === 'morning') && (
                            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-2.5 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Sun className="w-4 h-4 text-amber-600" />
                                <span className="text-xs font-black text-amber-950">{lang === 'hi' ? 'सुबह (Morning):' : 'Morning:'}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateDelivery(customer.id, { morning: Math.max(0, +(morning - 0.5).toFixed(1)) })}
                                  className="w-7 h-7 rounded-xl bg-white border border-amber-300 font-black text-sm text-amber-900 flex items-center justify-center shadow-xs hover:bg-amber-100 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="w-12 text-center text-sm font-black text-stone-900 font-mono">
                                  {morning} L
                                </span>
                                <button
                                  onClick={() => updateDelivery(customer.id, { morning: +(morning + 0.5).toFixed(1) })}
                                  className="w-7 h-7 rounded-xl bg-amber-400 font-black text-sm text-amber-950 flex items-center justify-center shadow-xs hover:bg-amber-300 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Evening Shift Row */}
                          {(selectedShift === 'both' || selectedShift === 'evening') && (
                            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-2.5 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Moon className="w-4 h-4 text-indigo-700" />
                                <span className="text-xs font-black text-indigo-950">{lang === 'hi' ? 'शाम (Evening):' : 'Evening:'}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateDelivery(customer.id, { evening: Math.max(0, +(evening - 0.5).toFixed(1)) })}
                                  className="w-7 h-7 rounded-xl bg-white border border-indigo-300 font-black text-sm text-indigo-900 flex items-center justify-center shadow-xs hover:bg-indigo-100 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="w-12 text-center text-sm font-black text-stone-900 font-mono">
                                  {evening} L
                                </span>
                                <button
                                  onClick={() => updateDelivery(customer.id, { evening: +(evening + 0.5).toFixed(1) })}
                                  className="w-7 h-7 rounded-xl bg-indigo-600 font-black text-sm text-white flex items-center justify-center shadow-xs hover:bg-indigo-500 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Total Litres and Bill Info */}
                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-stone-600">
                              {lang === 'hi' ? 'कुल:' : 'Total:'} <strong className="text-stone-900">{totalToday.toFixed(1)} L</strong> (₹{customer.rate}/L)
                            </span>
                            <span className="font-black text-emerald-800 text-sm">
                              ₹{costToday.toFixed(0)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-5 text-center text-xs font-bold text-rose-600 bg-rose-50/50 rounded-2xl mt-3 border border-rose-100">
                          {lang === 'hi' ? 'आज इस पते पर दूध नहीं दिया गया (Customer on Leave)' : 'Customer is on leave today'}
                        </div>
                      )}

                      {/* Bottom Quick Tools */}
                      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedCustomerForHistory(customer);
                          }}
                          className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <CalendarDays className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? 'खाता / पासबुक' : 'Passbook'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setBillingCustomer(customer);
                            setShowBillModal(true);
                          }}
                          className="text-xs font-black text-teal-800 bg-teal-50 px-2.5 py-1 rounded-xl hover:bg-teal-100 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? 'बिल बनाएं' : 'Make Bill'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Compact Table View for Fast Auditing */
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-black">
                      <tr>
                        <th className="p-3">ग्राहक का नाम</th>
                        <th className="p-3">पता / रूट</th>
                        <th className="p-3 text-center">सुबह (L)</th>
                        <th className="p-3 text-center">शाम (L)</th>
                        <th className="p-3 text-right">कुल (L)</th>
                        <th className="p-3 text-right">रकम (₹)</th>
                        <th className="p-3 text-center">स्थिति</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      {filteredCustomers.map(c => {
                        const d = getCustomerDelivery(c.id, selectedDate);
                        const total = d.isHoliday ? 0 : (parseFloat(d.morning) || 0) + (parseFloat(d.evening) || 0);
                        const cost = total * (d.rate || c.rate);
                        return (
                          <tr key={c.id} className={`hover:bg-stone-50 ${d.isHoliday ? 'bg-rose-50/50' : ''}`}>
                            <td className="p-3 font-black text-stone-900">{c.name}</td>
                            <td className="p-3 text-stone-500 text-xs">{c.address}</td>
                            <td className="p-3 text-center font-bold text-amber-900">{d.isHoliday ? '-' : `${d.morning}L`}</td>
                            <td className="p-3 text-center font-bold text-indigo-900">{d.isHoliday ? '-' : `${d.evening}L`}</td>
                            <td className="p-3 text-right font-black text-stone-900">{d.isHoliday ? '0 L' : `${total.toFixed(1)}L`}</td>
                            <td className="p-3 text-right font-black text-emerald-800">₹{cost.toFixed(0)}</td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => updateDelivery(c.id, { isHoliday: !d.isHoliday })}
                                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold cursor-pointer ${d.isHoliday ? 'bg-rose-600 text-white' : 'bg-emerald-100 text-emerald-800'}`}
                              >
                                {d.isHoliday ? 'छुट्टी' : 'सप्लाई'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CUSTOMERS DIRECTORY */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder={lang === 'hi' ? "ग्राहक का नाम, पता या मोबाइल खोजें..." : "Search name, address, phone..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64 sm:w-80"
                  />
                </div>

                <select
                  value={filterMilkType}
                  onChange={(e) => setFilterMilkType(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-xs font-bold text-stone-700 focus:outline-none"
                >
                  <option value="all">{lang === 'hi' ? 'सभी दूध प्रकार' : 'All Milk Types'}</option>
                  <option value="buffalo">{lang === 'hi' ? 'भैंस (Buffalo)' : 'Buffalo'}</option>
                  <option value="cow">{lang === 'hi' ? 'गाय (Cow)' : 'Cow'}</option>
                  <option value="a2">A2 देशी गाय</option>
                  <option value="mix">{lang === 'hi' ? 'मिश्रित' : 'Mix'}</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-xs font-bold text-stone-700 focus:outline-none"
                >
                  <option value="all">{lang === 'hi' ? 'सभी ग्राहक' : 'All Status'}</option>
                  <option value="active">{lang === 'hi' ? 'सक्रिय (Active)' : 'Active'}</option>
                  <option value="inactive">{lang === 'hi' ? 'निष्क्रिय (Inactive)' : 'Inactive'}</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingCustomer(null);
                  setCustomerForm({
                    name: '',
                    phone: '',
                    address: '',
                    route: dairyInfo.routes?.[0] || '',
                    milkType: 'buffalo',
                    morningQty: 1.0,
                    eveningQty: 0.5,
                    rate: dairyInfo.defaultRates?.buffalo || 70,
                    balance: 0,
                    active: true
                  });
                  setShowAddCustomerModal(true);
                }}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ {lang === 'hi' ? 'नया ग्राहक जोड़ें (Add Customer)' : 'Add Customer'}</span>
              </button>
            </div>

            {/* Customers Table List */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-black">
                    <tr>
                      <th className="p-3.5">{lang === 'hi' ? 'ग्राहक का नाम' : 'Customer Name'}</th>
                      <th className="p-3.5">{lang === 'hi' ? 'मोबाइल व पता' : 'Phone & Address'}</th>
                      <th className="p-3.5">{lang === 'hi' ? 'दूध का प्रकार' : 'Milk Type'}</th>
                      <th className="p-3.5 text-right">{lang === 'hi' ? 'तय मात्रा (सुबह / शाम)' : 'Daily Quota'}</th>
                      <th className="p-3.5 text-right">{lang === 'hi' ? 'भाव (₹/L)' : 'Rate (₹/L)'}</th>
                      <th className="p-3.5 text-right">{lang === 'hi' ? 'कुल बकाया (Due ₹)' : 'Balance Due (₹)'}</th>
                      <th className="p-3.5 text-center">{lang === 'hi' ? 'कार्य (Actions)' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-stone-400 font-bold">
                          {lang === 'hi' ? 'कोई ग्राहक नहीं मिला।' : 'No customers found.'}
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c) => (
                        <tr key={c.id} className="hover:bg-stone-50/80 transition">
                          <td className="p-3.5">
                            <div className="font-black text-stone-900">{c.name}</div>
                            <button
                              onClick={() => toggleCustomerActive(c.id)}
                              className="text-[11px] font-mono hover:underline cursor-pointer flex items-center gap-1 mt-0.5"
                            >
                              <span className={c.active ? 'text-emerald-700 font-bold' : 'text-stone-400'}>
                                {c.active ? '● सक्रिय (Active)' : '○ बंद (Inactive)'}
                              </span>
                            </button>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-stone-800">📞 {c.phone}</div>
                            <div className="text-xs text-stone-500">{c.address} {c.route && `• [${c.route}]`}</div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-black border ${
                              c.milkType === 'cow' ? 'bg-amber-100 text-amber-900 border-amber-200' :
                              c.milkType === 'a2' ? 'bg-purple-100 text-purple-900 border-purple-200' :
                              'bg-blue-100 text-blue-900 border-blue-200'
                            }`}>
                              {c.milkType === 'cow' ? 'गाय (Cow)' :
                               c.milkType === 'a2' ? 'A2 देशी गाय' :
                               c.milkType === 'mix' ? 'मिश्रित' : 'भैंस (Buffalo)'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-black text-stone-800">
                            {c.morningQty}L | {c.eveningQty}L
                          </td>
                          <td className="p-3.5 text-right font-black text-stone-900">
                            ₹{c.rate}
                          </td>
                          <td className="p-3.5 text-right font-black text-rose-600 text-base">
                            ₹{c.balance.toFixed(0)}
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button
                                onClick={() => setSelectedCustomerForHistory(c)}
                                title={lang === 'hi' ? "कैलेंडर पासबुक" : "Passbook"}
                                className="p-1.5 bg-stone-100 hover:bg-emerald-100 text-emerald-800 rounded-xl transition cursor-pointer"
                              >
                                <CalendarDays className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setBillingCustomer(c);
                                  setShowBillModal(true);
                                }}
                                title={lang === 'hi' ? "बिल व WhatsApp" : "Bill & WhatsApp"}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-200 text-emerald-900 rounded-xl transition cursor-pointer"
                              >
                                <Receipt className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingCustomer(c);
                                  setCustomerForm({ ...c });
                                  setShowAddCustomerModal(true);
                                }}
                                title={lang === 'hi' ? "एडिट करें" : "Edit"}
                                className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCustomer(c.id)}
                                title={lang === 'hi' ? "हटाएं" : "Delete"}
                                className="p-1.5 bg-rose-50 hover:bg-rose-200 text-rose-700 rounded-xl transition cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BILLING & 1-CLICK WHATSAPP */}
        {activeTab === 'billing' && (
          <div className="space-y-4">
            {/* Header toolbar card */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-800" />
                  <span>{lang === 'hi' ? 'मासिक दूध बिलिंग व 1-क्लिक WhatsApp शेयरिंग' : 'Monthly Milk Billing & 1-Click WhatsApp'}</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {lang === 'hi' ? 'महीना चुनें और एक क्लिक में ग्राहकों को WhatsApp बिल भेजें या थर्मल पर्ची प्रिंट करें' : 'Select billing month and send formatted bill directly on WhatsApp'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={exportMonthlyBillingCSV}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{lang === 'hi' ? 'CSV बिल एक्सपोर्ट' : 'Export CSV'}</span>
                </button>

                <div className="flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-2xl px-3 py-1.5 shadow-inner">
                  <span className="text-xs font-bold text-stone-600">{lang === 'hi' ? 'बिल महीना:' : 'Month:'}</span>
                  <input
                    type="month"
                    value={billingMonth}
                    onChange={(e) => setBillingMonth(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-black focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* List of customer bills with WhatsApp Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.map((c) => {
                const summary = calculateCustomerMonthSummary(c.id, billingMonth);
                if (!summary) return null;
                const waLink = generateWhatsAppMessage(summary);

                return (
                  <div key={c.id} className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-base text-stone-900">{c.name}</h4>
                          <p className="text-xs text-stone-500">📞 {c.phone}</p>
                        </div>
                        <span className="text-[10px] font-black bg-stone-100 px-2.5 py-1 rounded-full text-stone-700 font-mono">
                          {summary.monthStr}
                        </span>
                      </div>

                      <div className="bg-stone-50 rounded-2xl p-3.5 space-y-1.5 text-xs mt-3 border border-stone-100">
                        <div className="flex justify-between text-stone-600">
                          <span>{lang === 'hi' ? 'दूध सप्लाई के दिन:' : 'Delivery Days:'}</span>
                          <span className="font-bold text-stone-900">{summary.totalDaysSupplied} {lang === 'hi' ? 'दिन' : 'days'} ({lang === 'hi' ? 'छुट्टी:' : 'Absent:'} {summary.absentDays})</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span>{lang === 'hi' ? 'कुल दूध मात्रा:' : 'Total Milk:'}</span>
                          <span className="font-black text-stone-900">{summary.totalLiters} L</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span>{lang === 'hi' ? 'भाव (Rate):' : 'Rate:'}</span>
                          <span className="font-bold">₹{c.rate}/L</span>
                        </div>
                        <div className="flex justify-between text-stone-600 border-t border-stone-200 pt-1.5">
                          <span>{lang === 'hi' ? 'इस माह का बिल:' : 'Month Total:'}</span>
                          <span className="font-bold text-stone-900">₹{summary.billAmount}</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                          <span>{lang === 'hi' ? 'पिछला बकाया:' : 'Prev Balance:'}</span>
                          <span className="font-bold text-rose-600">₹{c.balance}</span>
                        </div>
                        <div className="flex justify-between text-emerald-700">
                          <span>{lang === 'hi' ? 'जमा भुगतान:' : 'Paid:'}</span>
                          <span className="font-bold">- ₹{summary.totalPaidInMonth}</span>
                        </div>
                        <div className="flex justify-between text-stone-900 border-t border-stone-200 pt-1.5 text-sm font-black">
                          <span>{lang === 'hi' ? 'कुल देय (Payable):' : 'Net Due:'}</span>
                          <span className="text-emerald-800 text-base">₹{summary.netDue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-stone-100">
                      {/* WhatsApp 1-Click direct URL */}
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-2.5 px-3 text-xs font-black shadow flex items-center justify-center gap-1.5 transition text-center"
                      >
                        <Send className="w-4 h-4 text-emerald-200" />
                        <span>{lang === 'hi' ? 'WhatsApp बिल' : 'WhatsApp'}</span>
                      </a>

                      <button
                        onClick={() => copyWhatsAppText(summary)}
                        className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl text-xs font-bold transition cursor-pointer"
                        title={lang === 'hi' ? "बिल कॉपी करें" : "Copy Text"}
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setBillingCustomer(c);
                          setShowBillModal(true);
                        }}
                        className="p-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-2xl text-xs font-bold transition cursor-pointer"
                        title={lang === 'hi' ? "पर्ची प्रिंट / देखें" : "Print Slip"}
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENTS REGISTER */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-stone-900">
                  {lang === 'hi' ? 'भुगतान एवं जमा बही (Payment Register)' : 'Payment Register'}
                </h3>
                <p className="text-xs text-stone-500">
                  {lang === 'hi' ? 'ग्राहकों से प्राप्त नकद, UPI व बैंक भुगतान का विवरण' : 'Track and record customer payments'}
                </p>
              </div>

              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ {lang === 'hi' ? 'नया भुगतान दर्ज करें' : 'Record Payment'}</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-black">
                  <tr>
                    <th className="p-3.5">{lang === 'hi' ? 'तारीख' : 'Date'}</th>
                    <th className="p-3.5">{lang === 'hi' ? 'ग्राहक का नाम' : 'Customer Name'}</th>
                    <th className="p-3.5">{lang === 'hi' ? 'भुगतान माध्यम' : 'Mode'}</th>
                    <th className="p-3.5">{lang === 'hi' ? 'टिप्पणी / नोट' : 'Note'}</th>
                    <th className="p-3.5 text-right">{lang === 'hi' ? 'प्राप्त राशि (₹)' : 'Amount (₹)'}</th>
                    <th className="p-3.5 text-center">{lang === 'hi' ? 'कार्य' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-stone-400">
                        {lang === 'hi' ? 'अभी कोई भुगतान दर्ज नहीं है।' : 'No payments recorded.'}
                      </td>
                    </tr>
                  ) : (
                    payments.map(p => {
                      const cust = customers.find(c => c.id === p.customerId);
                      return (
                        <tr key={p.id} className="hover:bg-stone-50 transition">
                          <td className="p-3.5 font-semibold text-stone-600 font-mono">{p.date}</td>
                          <td className="p-3.5 font-black text-stone-900">{cust?.name || 'Customer'}</td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {p.mode}
                            </span>
                          </td>
                          <td className="p-3.5 text-stone-600">{p.note || '-'}</td>
                          <td className="p-3.5 text-right font-black text-emerald-700 text-base">
                            + ₹{p.amount.toFixed(2)}
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleDeletePayment(p.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Payment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: REPORTS & BACKUP */}
        {activeTab === 'reports' && (
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-800" />
                <span>{lang === 'hi' ? 'डाटा बैकअप एवं रिस्टोर (Backup & Restore)' : 'Data Backup & Restore'}</span>
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'hi' ? 'डेयरी का सारा हिसाब-किताब अपने कंप्यूटर या फोन में सुरक्षित रखें।' : 'Securely backup or restore all your customers, deliveries, and payment data.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={exportDataJSON}
                  className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-950 font-black flex items-center justify-between shadow-xs transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-emerald-700" />
                    <div className="text-left">
                      <div className="text-sm font-black">{lang === 'hi' ? 'पूरा डाटा बैकअप डाउनलोड करें' : 'Download Full Backup'}</div>
                      <div className="text-[10px] text-emerald-700 font-normal">Save as JSON file</div>
                    </div>
                  </div>
                </button>

                <label className="p-4 rounded-2xl bg-stone-50 border border-stone-300 hover:bg-stone-100 text-stone-900 font-black flex items-center justify-between shadow-xs transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-stone-700" />
                    <div className="text-left">
                      <div className="text-sm font-black">{lang === 'hi' ? 'बैकअप फाइल रिस्टोर करें' : 'Restore from Backup'}</div>
                      <div className="text-[10px] text-stone-500 font-normal">Upload JSON file</div>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importDataJSON}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                <span className="text-xs text-stone-500">{lang === 'hi' ? 'टेस्टिंग हेतु डिफ़ॉल्ट सैंपल डाटा:' : 'Default Sample Data:'}</span>
                <button
                  onClick={resetToSampleData}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  {lang === 'hi' ? 'सैंपल डाटा रीसेट करें' : 'Reset Sample Data'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DAIRY SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
            <h3 className="text-lg font-black text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-800" />
              <span>{lang === 'hi' ? 'भारती डेयरी प्रोफाइल व रसीद सेटिंग्स' : 'Dairy Profile & Receipt Settings'}</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-stone-600 mb-1">
                  {lang === 'hi' ? 'डेयरी का नाम (Business Name)' : 'Business Name'}
                </label>
                <input
                  type="text"
                  value={dairyInfo.dairyName}
                  onChange={(e) => setDairyInfo({ ...dairyInfo, dairyName: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-black"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-600 mb-1">
                  {lang === 'hi' ? 'संचालक का नाम (Owner Name)' : 'Owner Name'}
                </label>
                <input
                  type="text"
                  value={dairyInfo.ownerName}
                  onChange={(e) => setDairyInfo({ ...dairyInfo, ownerName: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-stone-600 mb-1">
                    {lang === 'hi' ? 'संपर्क मोबाइल नंबर' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={dairyInfo.phone}
                    onChange={(e) => setDairyInfo({ ...dairyInfo, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-stone-600 mb-1">
                    {lang === 'hi' ? 'UPI ID (पेमेंट QR कोड हेतु)' : 'UPI ID for Payment QR'}
                  </label>
                  <input
                    type="text"
                    value={dairyInfo.upiId}
                    onChange={(e) => setDairyInfo({ ...dairyInfo, upiId: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-600 mb-1">
                  {lang === 'hi' ? 'डेयरी का पता (Dairy Address)' : 'Dairy Address'}
                </label>
                <input
                  type="text"
                  value={dairyInfo.address}
                  onChange={(e) => setDairyInfo({ ...dairyInfo, address: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-600 mb-1">
                  {lang === 'hi' ? 'टैगलाइन (Tagline)' : 'Tagline'}
                </label>
                <input
                  type="text"
                  value={dairyInfo.tagline}
                  onChange={(e) => setDairyInfo({ ...dairyInfo, tagline: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-600 mb-1">
                  {lang === 'hi' ? 'बिल के नीचे का संदेश (Footer Message)' : 'Bill Footer Message'}
                </label>
                <input
                  type="text"
                  value={dairyInfo.footerMsg}
                  onChange={(e) => setDairyInfo({ ...dairyInfo, footerMsg: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm"
                />
              </div>

              {/* Default Rates Settings */}
              <div className="border-t border-stone-100 pt-3">
                <label className="block text-xs font-black text-stone-800 mb-2">
                  {lang === 'hi' ? 'डिफ़ॉल्ट दूध भाव (₹ प्रति लीटर)' : 'Default Rates per Liter (₹)'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-stone-500">भैंस (Buffalo):</span>
                    <input
                      type="number"
                      value={dairyInfo.defaultRates?.buffalo || 70}
                      onChange={(e) => setDairyInfo({
                        ...dairyInfo,
                        defaultRates: { ...dairyInfo.defaultRates, buffalo: parseFloat(e.target.value) || 70 }
                      })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-stone-500">गाय (Cow):</span>
                    <input
                      type="number"
                      value={dairyInfo.defaultRates?.cow || 55}
                      onChange={(e) => setDairyInfo({
                        ...dairyInfo,
                        defaultRates: { ...dairyInfo.defaultRates, cow: parseFloat(e.target.value) || 55 }
                      })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-stone-500">A2 गाय:</span>
                    <input
                      type="number"
                      value={dairyInfo.defaultRates?.a2 || 85}
                      onChange={(e) => setDairyInfo({
                        ...dairyInfo,
                        defaultRates: { ...dairyInfo.defaultRates, a2: parseFloat(e.target.value) || 85 }
                      })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast(lang === 'hi' ? "सेटिंग्स सफलतापूर्वक सुरक्षित हुईं!" : "Settings saved successfully!")}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-2xl shadow-md transition cursor-pointer mt-2"
              >
                {lang === 'hi' ? 'सेटिंग्स सुरक्षित करें (Save Profile)' : 'Save Profile'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD / EDIT CUSTOMER */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-base text-stone-900">
                {editingCustomer
                  ? (lang === 'hi' ? 'ग्राहक जानकारी सुधारें' : 'Edit Customer')
                  : (lang === 'hi' ? 'नया ग्राहक जोड़ें' : 'Add New Customer')}
              </h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-stone-600 mb-1">{lang === 'hi' ? 'ग्राहक का पूरा नाम *' : 'Full Name *'}</label>
                <input
                  type="text"
                  placeholder={lang === 'hi' ? "उदा. राजेश शर्मा" : "e.g. Rajesh Sharma"}
                  required
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-stone-600 mb-1">{lang === 'hi' ? 'मोबाइल नंबर *' : 'Phone Number *'}</label>
                  <input
                    type="tel"
                    placeholder="9812345670"
                    required
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-stone-600 mb-1">{lang === 'hi' ? 'रूट / क्षेत्र' : 'Route / Area'}</label>
                  <input
                    type="text"
                    placeholder="उदा. विकास नगर"
                    value={customerForm.route || ''}
                    onChange={(e) => setCustomerForm({ ...customerForm, route: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-600 mb-1">{lang === 'hi' ? 'मकान नं. व पूरा पता' : 'Address'}</label>
                <input
                  type="text"
                  placeholder={lang === 'hi' ? "उदा. मकान 12, गली 3, विकास नगर" : "e.g. House 12, Street 3"}
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-stone-600 mb-1">{lang === 'hi' ? 'दूध का प्रकार' : 'Milk Type'}</label>
                  <select
                    value={customerForm.milkType}
                    onChange={(e) => {
                      const type = e.target.value;
                      const autoRate = dairyInfo.defaultRates?.[type] || customerForm.rate;
                      setCustomerForm({ ...customerForm, milkType: type, rate: autoRate });
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-bold"
                  >
                    <option value="buffalo">भैंस (Buffalo)</option>
                    <option value="cow">गाय (Cow)</option>
                    <option value="a2">A2 देशी गाय</option>
                    <option value="mix">मिश्रित (Mix)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-stone-600 mb-1">{lang === 'hi' ? 'दूध भाव (₹/L)' : 'Rate (₹/L)'}</label>
                  <input
                    type="number"
                    value={customerForm.rate}
                    onChange={(e) => setCustomerForm({ ...customerForm, rate: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-stone-600 mb-1">{lang === 'hi' ? 'तय सुबह मात्रा (L)' : 'Morning Qty (L)'}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={customerForm.morningQty}
                    onChange={(e) => setCustomerForm({ ...customerForm, morningQty: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-stone-600 mb-1">{lang === 'hi' ? 'तय शाम मात्रा (L)' : 'Evening Qty (L)'}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={customerForm.eveningQty}
                    onChange={(e) => setCustomerForm({ ...customerForm, eveningQty: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-600 mb-1">{lang === 'hi' ? 'शुरुआती पुराना बकाया (₹)' : 'Opening Balance (₹)'}</label>
                <input
                  type="number"
                  value={customerForm.balance}
                  onChange={(e) => setCustomerForm({ ...customerForm, balance: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-bold"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2.5 rounded-2xl text-sm transition cursor-pointer"
                >
                  {lang === 'hi' ? 'सुरक्षित करें (Save Customer)' : 'Save Customer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2.5 bg-stone-100 text-stone-600 font-bold rounded-2xl text-sm cursor-pointer"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD PAYMENT */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-base text-stone-900">
                {lang === 'hi' ? 'भुगतान प्राप्त करें (Receive Payment)' : 'Record Payment Received'}
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-stone-600 mb-1">{lang === 'hi' ? 'ग्राहक चुनें *' : 'Select Customer *'}</label>
                <select
                  value={paymentForm.customerId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, customerId: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-bold"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({lang === 'hi' ? 'बकाया:' : 'Due:'} ₹{c.balance})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-stone-600 mb-1">{lang === 'hi' ? 'प्राप्त राशि (₹) *' : 'Amount (₹) *'}</label>
                  <input
                    type="number"
                    placeholder="₹ 1500"
                    required
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-black text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-stone-600 mb-1">{lang === 'hi' ? 'भुगतान माध्यम' : 'Payment Mode'}</label>
                  <select
                    value={paymentForm.mode}
                    onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-bold"
                  >
                    <option value="PhonePe/UPI">PhonePe / GPay (UPI)</option>
                    <option value="Cash">नकद (Cash)</option>
                    <option value="Bank">बैंक ट्रांसफर (NEFT)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-600 mb-1">{lang === 'hi' ? 'तारीख' : 'Date'}</label>
                <input
                  type="date"
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-600 mb-1">{lang === 'hi' ? 'टिप्पणी / नोट' : 'Remarks / Note'}</label>
                <input
                  type="text"
                  placeholder={lang === 'hi' ? "उदा. पूरे महीने का दूध बिल" : "e.g. Monthly milk bill payment"}
                  value={paymentForm.note}
                  onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-3 py-2 text-sm"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black py-2.5 rounded-2xl text-sm transition cursor-pointer"
                >
                  {lang === 'hi' ? 'जमा दर्ज करें (Save Payment)' : 'Save Payment'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2.5 bg-stone-100 text-stone-600 font-bold rounded-2xl text-sm cursor-pointer"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOMER PASSBOOK / CALENDAR */}
      {selectedCustomerForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-gradient-to-r from-emerald-950 to-teal-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-amber-400" />
                  <span>{selectedCustomerForHistory.name} - {lang === 'hi' ? 'दैनिक वितरण पासबुक' : 'Daily Passbook'}</span>
                </h3>
                <p className="text-xs text-emerald-200">
                  📞 {selectedCustomerForHistory.phone} • {selectedCustomerForHistory.address}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomerForHistory(null)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Sub-header with balance */}
            <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 font-bold">{lang === 'hi' ? 'वर्तमान कुल बकाया (Net Due):' : 'Current Net Due:'}</span>
                <span className="ml-2 text-xl font-black text-rose-600">
                  ₹{selectedCustomerForHistory.balance.toFixed(0)}
                </span>
              </div>
              <span className="text-xs font-bold text-stone-600">
                {lang === 'hi' ? 'तय दर:' : 'Rate:'} ₹{selectedCustomerForHistory.rate}/L
              </span>
            </div>

            {/* Scrollable Date wise Table */}
            <div className="p-4 overflow-y-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 font-black">
                  <tr>
                    <th className="p-2.5">{lang === 'hi' ? 'तारीख (Date)' : 'Date'}</th>
                    <th className="p-2.5 text-center">{lang === 'hi' ? 'सुबह (L)' : 'Morning (L)'}</th>
                    <th className="p-2.5 text-center">{lang === 'hi' ? 'शाम (L)' : 'Evening (L)'}</th>
                    <th className="p-2.5 text-right">{lang === 'hi' ? 'कुल लीटर' : 'Total Liters'}</th>
                    <th className="p-2.5 text-right">{lang === 'hi' ? 'दैनिक रकम (₹)' : 'Daily Cost (₹)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {Object.keys(deliveries)
                    .sort((a, b) => (b > a ? 1 : -1))
                    .map(date => {
                      const entry = deliveries[date][selectedCustomerForHistory.id];
                      if (!entry) return null;
                      const isHol = entry.isHoliday;
                      const totalLit = isHol ? 0 : ((parseFloat(entry.morning) || 0) + (parseFloat(entry.evening) || 0));
                      const amt = totalLit * (entry.rate || selectedCustomerForHistory.rate);

                      return (
                        <tr key={date} className={`hover:bg-stone-50 ${isHol ? 'bg-rose-50/60' : ''}`}>
                          <td className="p-2.5 font-bold text-stone-800 font-mono">{date}</td>
                          <td className="p-2.5 text-center font-bold text-amber-900">
                            {isHol ? '-' : `${entry.morning} L`}
                          </td>
                          <td className="p-2.5 text-center font-bold text-indigo-900">
                            {isHol ? '-' : `${entry.evening} L`}
                          </td>
                          <td className="p-2.5 text-right font-black text-stone-900">
                            {isHol ? <span className="text-rose-600 font-bold">{lang === 'hi' ? 'छुट्टी (Absent)' : 'Absent'}</span> : `${totalLit.toFixed(1)} L`}
                          </td>
                          <td className="p-2.5 text-right font-black text-emerald-800">
                            {isHol ? '₹0' : `₹${amt.toFixed(0)}`}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRINTABLE THERMAL BILL RECEIPT WITH SCANNABLE UPI QR */}
      {showBillModal && billingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl animate-in fade-in zoom-in-95 space-y-4 my-8">
            {(() => {
              const summary = calculateCustomerMonthSummary(billingCustomer.id, billingMonth);
              if (!summary) return null;
              const waLink = generateWhatsAppMessage(summary);
              const qrUrl = getUpiQrUrl(summary.netDue, billingCustomer.name);

              return (
                <div>
                  {/* Thermal Bill Receipt Card (Print-target) */}
                  <div className="print-area border-2 border-dashed border-stone-400 p-4 rounded-2xl bg-amber-50/20 text-stone-900 font-mono text-xs space-y-2">
                    <div className="text-center pb-2 border-b border-dashed border-stone-300">
                      <h4 className="font-black text-sm tracking-wider uppercase text-emerald-950">
                        {dairyInfo.dairyName}
                      </h4>
                      <p className="text-[10px] text-stone-500 font-sans">{dairyInfo.address}</p>
                      <p className="text-[10px] text-stone-500 font-sans">📞 {dairyInfo.phone}</p>
                      <p className="text-[10px] font-bold text-emerald-900 mt-1 uppercase">
                        {lang === 'hi' ? 'मासिक दूध पर्ची (DELIVERY BILL)' : 'MONTHLY MILK BILL'}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <span>{lang === 'hi' ? 'महीना:' : 'Month:'}</span>
                      <span className="font-bold">{summary.monthStr}</span>
                    </div>
                    <div className="flex justify-between font-black text-stone-900">
                      <span>{lang === 'hi' ? 'ग्राहक:' : 'Customer:'} {billingCustomer.name}</span>
                    </div>
                    <div className="text-stone-500 text-[10px]">
                      {billingCustomer.phone}
                    </div>

                    <div className="border-t border-dashed border-stone-300 pt-2 space-y-1">
                      <div className="flex justify-between">
                        <span>{lang === 'hi' ? 'कुल दूध डिलीवरी:' : 'Total Milk:'}</span>
                        <span className="font-black">{summary.totalLiters} L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{lang === 'hi' ? 'सप्लाई दिन:' : 'Supply Days:'}</span>
                        <span>{summary.totalDaysSupplied} {lang === 'hi' ? 'दिन' : 'days'} ({lang === 'hi' ? 'छुट्टी:' : 'Absent:'} {summary.absentDays})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{lang === 'hi' ? 'भाव प्रति लीटर:' : 'Rate/L:'}</span>
                        <span>₹{billingCustomer.rate}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>{lang === 'hi' ? 'इस माह की राशि:' : 'Month Total:'}</span>
                        <span>₹{summary.billAmount}</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>{lang === 'hi' ? 'पिछला बकाया:' : 'Previous Due:'}</span>
                        <span>₹{billingCustomer.balance}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700">
                        <span>{lang === 'hi' ? 'प्राप्त भुगतान:' : 'Paid:'}</span>
                        <span>- ₹{summary.totalPaidInMonth}</span>
                      </div>
                    </div>

                    <div className="border-t-2 border-stone-900 pt-2 flex justify-between text-base font-black text-emerald-950">
                      <span>{lang === 'hi' ? 'कुल देय (Total):' : 'Total Payable:'}</span>
                      <span>₹{summary.netDue}</span>
                    </div>

                    {/* Scannable UPI QR Box in Receipt */}
                    <div className="pt-2 text-center border-t border-dashed border-stone-300 mt-2">
                      <div className="text-[10px] font-bold text-stone-700 font-sans mb-1">
                        Scan & Pay via Any UPI App
                      </div>
                      <div className="inline-block p-1.5 bg-white border border-stone-300 rounded-xl shadow-xs">
                        <img
                          src={qrUrl}
                          alt="UPI Payment QR"
                          className="w-24 h-24 mx-auto object-contain"
                        />
                      </div>
                      <div className="text-[10px] font-mono text-emerald-900 font-bold mt-1">
                        {dairyInfo.upiId}
                      </div>
                    </div>

                    <div className="pt-2 text-center text-[9px] text-stone-500 font-sans">
                      {dairyInfo.footerMsg}
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="mt-4 space-y-2 no-print">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow transition text-center"
                    >
                      <Send className="w-4 h-4" />
                      <span>{lang === 'hi' ? 'WhatsApp पर तुरंत भेजें' : 'Send on WhatsApp'}</span>
                    </a>

                    <div className="flex gap-2">
                      <button
                        onClick={() => window.print()}
                        className="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-2 rounded-2xl text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'प्रिंट पर्ची' : 'Print Slip'}</span>
                      </button>
                      <button
                        onClick={() => setShowBillModal(false)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-2xl text-xs transition cursor-pointer"
                      >
                        {lang === 'hi' ? 'बंद करें' : 'Close'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
