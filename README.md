# 🌾 AAGAM — Automated Agricultural Grain & Allocation Management

> **Next-Generation National Agricultural Grain Procurement, Live E-Auction, Virtual Queue Management & DBT Payment Platform**

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-Government_Open_Access-0056B3?style=for-the-badge)
![Language](https://img.shields.io/badge/Bilingual-English_%7C_%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80-2E7D32?style=for-the-badge)

---

## 📺 Product Demo & Walkthrough

[![AAGAM Demo Video](https://img.youtube.com/vi/I3UYwM5ttdg/maxresdefault.jpg)](https://youtu.be/I3UYwM5ttdg)

> 📹 **[Click here to watch the full walkthrough on YouTube](https://youtu.be/I3UYwM5ttdg)**

---

## 📌 Executive Summary

**AAGAM (Automated Agricultural Grain & Allocation Management)** is an integrated digital platform designed to transform agricultural grain procurement, marketplace discovery, live e-auctions, mandi queue operations, logistics routing, quality grading, and Direct Benefit Transfer (DBT) payments across India.

By uniting farmers, private buyers, procurement officers, mandi operators, quality inspectors, logistics providers, and warehouse administrators under a single unified portal, AAGAM eliminates mandi bottlenecks, ensures MSP transparency, accelerates farmer payments, and delivers real-time predictive supply chain analytics.

---

## 🌟 Key Highlights & Core Features

### 🚜 1. Smart Slot Booking & QR Gate Pass Engine
- **Virtual Queue System**: Farmers can pre-book procurement slots at nearby government centers or mandis to eliminate long queues and truck idling.
- **Digital QR Gate Pass**: Generates verifiable QR tokens for hassle-free Mandi gate entry, weighbridge priority lanes, and token validation.
- **Live Queue Monitoring**: Real-time tracking of vehicle status (En-route, Waiting, Weighment, Inspection, Unloading, Complete).

### ⚡ 2. Real-Time Live E-Auction Engine
- **Transparent Grain Auctions**: Real-time bidding interface with live countdown timers, minimum increment controls, reserve price matching, and dynamic bid history logs.
- **Instant Contract Awarding**: Automated winner notification, escrow security, and contract generation for private and bulk buyers.

### 🛒 3. Direct Grain Marketplace & Price Discovery
- **MSP vs. Private Market Matrix**: Compare Minimum Support Prices (MSP) against local mandi rates and private buyer bids in real time.
- **Verified Crop Listings**: Detailed grain profiles complete with moisture percentage, foreign matter content, grain size, quality grade, photo evidence, and location.

### 🔬 4. AI & Manual Quality Inspection
- **Dual-Layer Grading**: AI-assisted computer vision quality assessments paired with certified manual lab testing (moisture meter, foreign grain ratio, damage analysis).
- **Automated Acceptance Certificates**: Instant digital generation of Tola Parchi (weighment slips) and quality approval certificates.

### 🚚 5. Logistics & Warehouse Management
- **Transport Fleet Dispatch**: Request, assign, and track grain transport trucks with live GPS tracking from mandi to warehouse.
- **Smart Inventory & Capacity**: Real-time warehouse capacity tracking, stock-in/stock-out logs, automated capacity warnings, and intra-warehouse transfer workflows.

### 💳 6. Direct Benefit Transfer (DBT) & Payment Tracking
- **Automated Payouts**: Direct integration with PFMS / DBT portals for 48-hour direct-to-bank-account farmer payouts.
- **UTR & Ledger Verification**: Live tracking of bank transaction references, pending clearances, and historical payout statements.

### 🤖 7. AI Predictive Analytics & Supply Forecasting
- **Arrival & Overload Forecasting**: Machine learning models predicting crop arrival surges, center congestion risks, and storage capacity shortages.
- **Price Trend Modeling**: Historical and predictive price charts helping farmers determine optimal sell timing.

### 🌐 8. High Accessibility & Bilingual Support
- **Dual Language**: One-click instant toggling between **English** and **हिन्दी (Hindi)**.
- **Visual Accessibility**: Adjustable font scaling (`sm`, `md`, `lg`) and high-contrast dark accessibility mode for outdoors/field use.
- **Universal Quick Search**: Press `Ctrl + K` or `Cmd + K` anywhere in the app for instant site-wide navigation and command search.

---

## 👥 Persona Portals (10 Multi-Stakeholder Roles)

AAGAM provides dedicated workspace interfaces tailored to each stakeholder in the agricultural ecosystem:

| Persona Role | Primary Capabilities & Functions |
| :--- | :--- |
| **🌾 Farmer** | Book mandi slots, view QR gate passes, check MSP prices, list crops for auction, track DBT payouts, and request transport. |
| **🏢 Private Buyer** | Browse crop marketplace, participate in live e-auctions, place bulk bids, award contracts, and track grain shipments. |
| **🏛️ Procurement Officer** | Manage procurement center capacity, approve farmer declarations, reschedule delayed slots, and oversee center operations. |
| **🚜 Mandi Operator** | Scan QR tokens at gate, manage vehicle priority queues, record weighbridge entries (Tola Parchi), and log daily arrivals. |
| **🔬 Quality Inspector** | Perform moisture & purity checks, record AI vs manual quality reports, assign grades (Grade A, B, Rejection), and sign off certificates. |
| **🚚 Logistics Provider** | Manage driver fleets, accept transport requests, update pickup status, and provide live GPS delivery tracking. |
| **🏭 Warehouse Manager** | Monitor grain stock, record stock-in/stock-out transactions, manage warehouse capacity alerts, and issue truck transfer orders. |
| **💳 Payment & DBT Admin** | Process pending farmer payouts, verify UTR numbers, track DBT status with banks, and generate financial audit reports. |
| **🤖 AI & Analytics Director** | Analyze nationwide crop supply forecasts, arrival trends, mandi overload warnings, price predictions, and risk dashboards. |
| **🛡️ System Administrator** | Manage user accounts, role-based access control (RBAC), system settings, security logs, and integration APIs. |

---

## 🏛️ Comprehensive Architecture (171-Page Specification)

The AAGAM platform is structured across **14 Core Modules** encompassing 171 functional page views:

```text
AAGAM Platform
│
├── 🏠 1. Public Pages (Home, About, How It Works, Features, Price Discovery, Marketplace, E-Auction, Procurement, Analytics, Contact, FAQ, Terms, Privacy)
├── 🔐 2. Authentication Pages (Login, Register, Role Selection, Mobile/OTP, Forgot/Reset Password)
├── 👨‍🌾 3. Farmer Pages (Dashboard, Land Records, Crop Declarations, Auctions, Mandi Slots, QR Tokens, Virtual Queue, Quality Checks, DBT Payouts)
├── 🏢 4. Buyer Pages (Marketplace, Bidding Engine, Live Auctions, Won Bids, Purchased Grain, Delivery Tracking)
├── 🏛️ 5. Government / Procurement Pages (Officer Dashboard, Capacity Management, Daily Procurement, Queue Oversight, Acceptance Rules)
├── 🚜 6. Mandi Center Operator Pages (QR Gate Entry, Priority Vehicle Queue, Weighbridge Tola Parchi, Daily Logbook)
├── 🔬 7. Quality Inspector Pages (Inspection Queue, Moisture Testing, AI vs Manual Grading, Acceptance Certificates)
├── 🚚 8. Logistics Pages (Transport Requests, Fleet Assignment, Pickup Verification, Real-Time GPS Tracking)
├── 🏭 9. Warehouse Pages (Stock In/Out, Grain Inventory, Capacity Alerts, Inter-Warehouse Transfers)
├── 💳 10. Payment Pages (DBT Tracking, UTR Verification, Pending Clearances, Financial Audit)
├── 🤖 11. AI & Analytics Pages (Crop Supply Prediction, Mandi Congestion Alert, Price Forecasting, Risk Dashboard)
├── 🔗 12. Crop Traceability Pages (Grain Journey Timeline, Transaction Ledger, Audit Trail, Blockchain Records)
├── 🛡️ 13. Admin Pages (User RBAC, Procurement Center Registry, Crop Master Data, API & System Settings)
└── ⚙️ 14. Common Pages (Notifications, Profile & Security Settings, Language Preferences, Support, 404/500 Pages)
