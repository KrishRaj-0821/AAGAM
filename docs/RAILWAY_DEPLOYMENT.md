# 🚂 AAGAM — Railway Deployment Guide

This guide details how to deploy the entire AAGAM full-stack platform (PostgreSQL, Django REST API, and Vite React Frontend) to **[Railway.app](https://railway.app)**.

---

## 🏗️ Architecture Overview on Railway

```text
               [Client Browsers / Mandi Scanners]
                               │
            ┌──────────────────┴──────────────────┐
            │                                     │
            ▼                                     ▼
┌───────────────────────────┐         ┌───────────────────────────┐
│     Railway Frontend      │  HTTP   │      Railway Backend      │
│     (React + Vite)        │ ──────> │   (Django REST + WSGI)    │
│  aagam-web.up.railway.app │  REST   │ aagam-api.up.railway.app  │
└───────────────────────────┘         └─────────────┬─────────────┘
                                                    │
                                                    ▼
                                      ┌───────────────────────────┐
                                      │    Railway PostgreSQL     │
                                      │      (Managed DB)         │
                                      └───────────────────────────┘
```

---

## 🚀 Step-by-Step Deployment (Railway Dashboard)

### Step 1: Create a New Project on Railway
1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **"+ New Project"**.
3. Select **"Deploy from GitHub repo"**.
4. Choose `KrishRaj-0821/AAGAM`.

---

### Step 2: Add Railway PostgreSQL Database
1. Inside your Railway Project canvas, click **"+ Create"** (or hit `Ctrl+K`).
2. Select **"Database"** -> **"Add PostgreSQL"**.
3. Railway will provision a managed PostgreSQL 15+ database and generate a `DATABASE_URL` variable automatically.

---

### Step 3: Configure the Backend Service (Django API)
1. In your project canvas, click on the **AAGAM** service created from your GitHub repo (or click **"+ Create" -> "GitHub Repo" -> AAGAM**).
2. Rename this service to `aagam-backend`.
3. Go to **Settings**:
   - **Root Directory**: Set to `/backend`
   - **Build**: Nixpacks / Dockerfile (Railway detects `backend/Dockerfile` or `backend/railway.json` automatically)
4. Go to **Variables** and configure:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Connects directly to the PostgreSQL database |
   | `SECRET_KEY` | *(Generate a random 50-character string)* | Django cryptographic security key |
   | `DEBUG` | `False` | Production mode |
   | `ALLOWED_HOSTS` | `.railway.app,.up.railway.app,localhost,127.0.0.1` | Host whitelisting |
   | `CSRF_TRUSTED_ORIGINS` | `https://*.railway.app,https://*.up.railway.app` | CSRF protection for HTTPS |
   | `CORS_ALLOWED_ORIGINS` | `https://<YOUR-FRONTEND-DOMAIN>.up.railway.app,http://localhost:5173` | Allowed frontend domains |
   | `DEMO_AUTH_MODE` | `True` *(or `False` if using real SMS)* | Demo OTP mode |
5. Go to **Networking**:
   - Click **"Generate Domain"** to get your public backend URL (e.g., `https://aagam-backend-production.up.railway.app`).
6. Deploy the backend. Railway will automatically run:
   ```bash
   python manage.py migrate --noinput
   python manage.py collectstatic --noinput
   gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
   ```
7. Verify by opening `https://<YOUR-BACKEND-DOMAIN>/health/` in your browser. You should see:
   ```json
   {
     "status": "healthy",
     "system": "AAGAM Core Backend",
     "database": "connected"
   }
   ```

---

### Step 4: Configure the Frontend Service (React + Vite)
1. In the same project canvas, click **"+ Create"** -> **"GitHub Repo"** -> select `KrishRaj-0821/AAGAM`.
2. Rename this service to `aagam-frontend`.
3. Go to **Settings**:
   - **Root Directory**: Leave as `/` (repository root)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
4. Go to **Variables**:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://<YOUR-BACKEND-DOMAIN>.up.railway.app/api` | Direct URL to your deployed Django API |
5. Go to **Networking**:
   - Click **"Generate Domain"** to get your public frontend URL (e.g., `https://aagam-frontend-production.up.railway.app`).
6. Deploy the frontend!

---

### Step 5: Link Frontend URL in Backend CORS
1. Copy your generated frontend URL (e.g. `https://aagam-frontend-production.up.railway.app`).
2. Go back to `aagam-backend` -> **Variables**.
3. Update `CORS_ALLOWED_ORIGINS` to include your frontend URL:
   ```text
   https://aagam-frontend-production.up.railway.app,http://localhost:5173
   ```
4. Click **Redeploy**.

---

## 🛠️ Optional: Deploying via Railway CLI

If you prefer deploying from your local terminal:

1. **Login to Railway:**
   ```bash
   npx @railway/cli login
   ```
2. **Link or Create Project:**
   ```bash
   npx @railway/cli init
   ```
3. **Add Postgres Database:**
   ```bash
   npx @railway/cli add -d postgres
   ```
4. **Deploy Backend:**
   ```bash
   cd backend
   npx @railway/cli up
   ```
5. **Deploy Frontend:**
   ```bash
   cd ..
   npx @railway/cli up
   ```

---

## 🔍 Verification & Testing Checklist

- [ ] Backend `/health/` returns `200 OK` and `"database": "connected"`.
- [ ] Backend `/api/schema/swagger-ui/` loads Swagger UI documentation.
- [ ] Frontend successfully registers/logs in and connects to the backend API.
- [ ] QR tokens and gate passes generate without CORS or 403 errors.
