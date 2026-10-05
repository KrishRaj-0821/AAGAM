# AAGAM — Production Deployment Architecture & Guide (P0-15)

## 1. Multi-Tier Deployment Topology

The AAGAM platform is architected as an enterprise, decoupled multi-tier web application:

```text
       User Devices (Mobile Browsers / Mandi Scanners / Desktops)
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │  Tier 1: Frontend (Static Distribution)      │
         │  - Hosted on GitHub Pages / Cloud CDN        │
         │  - Pure Static Assets: HTML / CSS / JS       │
         │  - Build Environment: Vite                   │
         │  - Configuration: VITE_API_BASE_URL          │
         └──────────────────────┬───────────────────────┘
                                │ HTTPS REST Calls (JWT Authorization)
                                ▼
         ┌──────────────────────────────────────────────┐
         │  Tier 2: Backend (Django REST Framework)     │
         │  - Hosted on Cloud Run / AWS ECS / Ubuntu VM │
         │  - WSGI/ASGI Server: Gunicorn / Uvicorn      │
         │  - Reverse Proxy: Nginx                      │
         │  - Security: DEBUG=False, CORS Whitelisting  │
         │  - Health Check: GET /health/                │
         └──────────────────────┬───────────────────────┘
                                │ Connection Pool (psycopg2)
                                ▼
         ┌──────────────────────────────────────────────┐
         │  Tier 3: Database (PostgreSQL 15+)           │
         │  - Managed Cloud SQL / AWS RDS               │
         │  - ACID Transactions                         │
         │  - Row-Level Locking (select_for_update)     │
         │  - Integrity CheckConstraints                │
         └──────────────────────────────────────────────┘
```

---

## 2. Frontend Configuration & Deployment (GitHub Pages)

### Build Environment Variable
The frontend must point directly to the production backend domain:
```bash
VITE_API_BASE_URL=https://api.aagam.org
```

> **Warning (P0-15):** GitHub Pages does not support reverse proxying. In `src/services/apiClient.js`, AAGAM actively detects if the site is running on GitHub Pages without `VITE_API_BASE_URL` and prevents silent failures.

### Build Command
```bash
npm install
npm run build
```
Build artifacts are generated in `/dist` and published to the `gh-pages` branch.

---

## 3. Backend Configuration & Deployment (Django REST Framework)

### Production Environment Variables (`.env`)
```bash
# Core Security
DEBUG=False
SECRET_KEY=generate_a_cryptographically_secure_random_key_here_minimum_50_chars
ALLOWED_HOSTS=api.aagam.org,your-cloudrun-service.run.app

# Cross-Origin Resource Sharing (CORS)
CORS_ALLOWED_ORIGINS=https://aagam.up.railway.app,https://aagam-backend-production.up.railway.app
CORS_ALLOW_ALL_ORIGINS=False

# Database (Production PostgreSQL)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=aagam_db
DB_USER=aagam_user
DB_PASSWORD=strong_postgres_password_here
DB_HOST=127.0.0.1
DB_PORT=5432

# Demonstration Mode (Set False in Production)
DEMO_AUTH_MODE=False

# SMS Gateway Integration
FAST2SMS_API_KEY=your_production_fast2sms_api_key_here
```

### Production Readiness Checklist (P0-10)
1. `DEBUG=False` strictly enforced.
2. `SECRET_KEY` loaded from environment (validated on startup).
3. `CORS_ALLOWED_ORIGINS` explicitly defined.
4. `DEFAULT_PERMISSION_CLASSES` set to `rest_framework.permissions.IsAuthenticated`.
5. Run migrations: `python manage.py migrate`.
6. Collect static: `python manage.py collectstatic --noinput`.

---

## 4. Production Health Check

### Endpoint
```http
GET /health/
```

### Response (`HTTP 200 OK`)
```json
{
  "status": "healthy",
  "system": "AAGAM Core Backend",
  "version": "1.0.0",
  "environment": "production",
  "database": "connected",
  "timestamp": "2026-10-05T13:40:00Z"
}
```
If the database connection fails, the health check returns `HTTP 503 Service Unavailable`.
This endpoint is publicly accessible and configured for automated load balancer / uptime health monitoring.
