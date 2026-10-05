# 🌾 AAGAM — Automated Agricultural Grain & Allocation Management

> **National Agricultural Grain Procurement, Mandi Slot Allocation, Gate Pass Verification & Workflow Platform**

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Django](https://img.shields.io/badge/Django_REST-5.1-092E20?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18.6-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Deployed on Railway](https://img.shields.io/badge/Railway-Production_Live-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![License](https://img.shields.io/badge/License-Government_Open_Access-0056B3?style=for-the-badge)
![Language](https://img.shields.io/badge/Bilingual-English_%7C_%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80-2E7D32?style=for-the-badge)

---

## 🌐 Live Production Deployments (Railway)

| Service | Technology | Production Live URL | Status |
| :--- | :--- | :--- | :--- |
| 🚀 **Frontend Web Application** | React 18 + Vite + PWA | **[https://aagam.up.railway.app](https://aagam.up.railway.app/)** | 🟢 Live |
| ⚡ **Backend REST API** | Django 5.1 + DRF | **[https://aagam-backend-production.up.railway.app/api/](https://aagam-backend-production.up.railway.app/api/)** | 🟢 Live |
| 🛡️ **Django Admin Portal** | Secure Management | **[https://aagam-backend-production.up.railway.app/admin/](https://aagam-backend-production.up.railway.app/admin/)** *(admin@aagam.gov.in / aagam@2026)* | 🟢 Live |
| 🩺 **System Health Check** | API Liveness & DB | **[https://aagam-backend-production.up.railway.app/api/health/](https://aagam-backend-production.up.railway.app/api/health/)** | 🟢 200 OK |
| 📖 **Interactive API Docs** | Swagger UI | **[https://aagam-backend-production.up.railway.app/api/schema/swagger-ui/](https://aagam-backend-production.up.railway.app/api/schema/swagger-ui/)** | 🟢 Live |

---

## 📺 Product Demo & Walkthrough

[![AAGAM Demo Video](https://img.youtube.com/vi/I3UYwM5ttdg/maxresdefault.jpg)](https://youtu.be/I3UYwM5ttdg)

> 📹 **[Click here to watch the full walkthrough on YouTube](https://youtu.be/I3UYwM5ttdg)**

---

## 📌 Executive Summary

**AAGAM (Automated Agricultural Grain & Allocation Management)** is a digital procurement platform engineered to solve physical mandi bottlenecks, eliminate excessive truck idling, prevent slot overbooking, and guarantee transparency in grain arrival schedules across Indian agricultural procurement centers.

---

## 📊 Feature Implementation Status Matrix

Every capability in AAGAM is categorized according to its technical maturity:

### 🟢 1. IMPLEMENTED (Production-Hardened & Server-Authoritative)

The core procurement pipeline is fully authoritative, running on Django REST Framework and PostgreSQL:

* **Server-Authoritative Authentication**:
  - Secure backend-generated 6-digit OTP stored as salted SHA-256 hash with 5-minute expiry.
  - Strict rate limiting (maximum 3 requests per 10 minutes per phone number).
  - SimpleJWT tokens issued strictly after backend hash verification.
* **Concurrency-Safe Mandi Slot Capacity Management**:
  - Row-level database locking (`select_for_update()`) inside atomic transactions.
  - Validated under 5,000 concurrent HTTP requests on PostgreSQL 18 with **zero oversubscription**.
* **Canonical Idempotency Engine**:
  - SHA-256 canonical request fingerprinting of `center_id:date:time_slot:commodity:quantity`.
  - Replays with identical parameters safely return the existing booking (HTTP 200).
  - Replays with altered quantities/parameters are rejected with HTTP 409 (`IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST`).
* **Multi-Device Double-Booking Prevention**:
  - PostgreSQL partial conditional unique constraint (`unique_active_farmer_booking_date_commodity`) preventing a farmer from holding multiple active bookings for the same date and commodity across devices.
* **Cryptographically Signed QR Gate Pass Tokens**:
  - Backend HMAC-SHA256 signature generation over `token_string:booking_uuid:date`.
  - Zero sensitive PII (Aadhaar, bank numbers) stored in QR payload.
  - Rejects tampered, expired, cancelled, wrong-center, and future-dated tokens.
* **Gate Entry State Machine & Replay Protection**:
  - Operator scanning enforces single-use transition: `ISSUED` → `USED`.
  - Concurrent operator scan attempts are serialized via row locks (one succeeds with HTTP 200, duplicates rejected with HTTP 409).
* **Progressive Web App (PWA) Foundation**:
  - `manifest.json`, Service Worker (`sw.js`), and offline app shell (`offline.html`).
  - **Security Invariant**: Authoritative slot confirmation is strictly prohibited offline; offline requests are held as unconfirmed drafts.
* **Zero-Trust Role-Based Access Control (RBAC)**:
  - Default-deny permissions across all endpoints (`IsAuthenticated`, `IsFarmer`, `IsCenterOperator`).

---

### 🟡 2. DEMO / SIMULATED (Demonstration & Workflow Simulation)

These modules are implemented as interactive demonstrations and user interface simulations for SIH evaluation:

* **SMS Provider Gateway Simulation**:
  - `DEMO_AUTH_MODE=True` returns visual demonstration simulation in API response.
  - In `PRODUCTION_MODE` (`DEMO_AUTH_MODE=False`), failures directly return HTTP 502 with error states (no silent claims).
* **Mandi Operations UI Workflow**:
  - Simulated weighbridge Tola Parchi (gross, tare, net weight calculation).
  - Simulated vehicle priority queue and gate lane assignments.
* **Quality Inspection UI**:
  - Simulated lab moisture analysis, foreign matter calculation, and grading (Grade A / Grade B / Rejection).
* **Warehouse Management Mock**:
  - Storage bay capacity visualization and simulated stock-in/stock-out movements.
* **Logistics UI**:
  - Mock truck dispatch request workflow and simulated delivery progress steps.
* **Persona Portals**:
  - Interactive demonstration workspaces for Officer, Operator, Quality Inspector, Warehouse Manager, and Admin.

---

### 🔵 3. FUTURE INTEGRATION (Planned External Enterprise Systems)

The following enterprise integrations represent architectural specifications for subsequent phases and are **not** claimed as live integrations:

* **PFMS / DBT Rail**: Direct integration with Public Financial Management System and core banking payment gateways for automated DBT disbursements.
* **UIDAI Aadhaar e-KYC**: Direct biometric fingerprint/iris or official UIDAI OTP authentication.
* **Government SSO**: Single Sign-On integration with National SSO (Jan Parichay / MeriPehchaan).
* **e-NAM Integration**: Interoperability with the National Agriculture Market electronic trading portal.
* **Live GPS Telematics**: Real-time hardware IoT tracking on transport fleet trucks.
* **Live E-Auction Engine**: WebSocket-based dynamic multiplayer bidding engine with financial escrow settlement.
* **Blockchain Ledger**: Hyperledger Fabric immutable crop provenance ledger.

---

## 🏛️ Comprehensive Architecture (171-Page Specification)

The AAGAM platform is structured across **14 Core Modules** defined in the **171-page functional/workflow specification**:

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
```

---

## 🛠️ Technology Stack

| Layer | Technologies | Role / Responsibility |
| :--- | :--- | :--- |
| **Frontend Web App** | React 18, Vite 6, TailwindCSS, Lucide Icons | Responsive UI, PWA shell, bilingual language toggle |
| **Backend REST API** | Python 3.13, Django 5.1, Django REST Framework | Authoritative business logic, cryptographic signing, RBAC |
| **Authoritative Database** | PostgreSQL 18.6 | ACID transactions, row-level locking (`select_for_update`) |
| **Authentication** | SimpleJWT, SHA-256 hashed OTPs | Stateless token verification, secure credential management |
| **PWA Foundation** | Service Worker (`sw.js`), Web App Manifest | Offline asset caching, offline booking guard |
| **Load & Stress Testing** | Locust, aiohttp, Waitress WSGI | 5,000-request concurrency verification |

---

## 🚀 Local Development Setup

### 1. Backend (Django + PostgreSQL)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or .venv\Scripts\activate on Windows

pip install -r requirements.txt

# Configure PostgreSQL connection in .env
# USE_POSTGRES=True
# DATABASE_NAME=aagam_db
# DATABASE_PORT=5432

python manage.py migrate
python manage.py test tests
python manage.py runserver
```

### 2. Frontend (React + Vite)

```bash
npm install
npm run dev
```

Frontend will run at `http://localhost:5173` with proxy forwarding to `http://localhost:8000/api/`.

---

## 📄 Validation Documentation

Detailed evidence reports for all validation requirements are available in `/docs/`:

* [`docs/P0-FINAL-VALIDATION.md`](docs/P0-FINAL-VALIDATION.md): Overall 11-point validation summary.
* [`docs/LOAD-TEST-RESULTS.md`](docs/LOAD-TEST-RESULTS.md): 5,000-request HTTP load test metrics.
* [`docs/POSTGRES-CONCURRENCY.md`](docs/POSTGRES-CONCURRENCY.md): Database locking, isolation levels, and constraints.
* [`docs/IDEMPOTENCY-TESTS.md`](docs/IDEMPOTENCY-TESTS.md): Canonical fingerprinting and replay defense evidence.
* [`docs/SECRET-SCAN.md`](docs/SECRET-SCAN.md): Git history secret scan and key revocation verification.
* [`docs/PWA-FOUNDATION.md`](docs/PWA-FOUNDATION.md): Service worker, cache behavior, and offline booking guard.
* [`docs/LIVE-E2E-TEST.md`](docs/LIVE-E2E-TEST.md): Complete 11-step end-to-end verification audit log.
