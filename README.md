# 🤝 SahakarConnect — Cooperative Gig Services Platform
**Smart India Hackathon (SIH) 2026 | Problem Statement 26089**  
**Sponsoring Ministry: Ministry of Cooperation, Government of India**

---

## 🌟 Executive Summary & Pitch Narrative

In the conventional gig economy, corporate aggregators (such as Urban Company or Uber) extract **20% to 30% commissions** from household service workers (plumbers, cleaners, electricians, carpenters, tutors, care providers) while offering zero worker equity, arbitrary algorithmic deplatforming, and zero social security.

**SahakarConnect** is India's first decentralized **Cooperative Gig Services Platform**. Instead of individual workers being exploited by a centralized corporation, household service workers form or join **Worker Cooperatives**.

### The Core Economic Differentiator (80 / 15 / 5 Model):
- **80% Direct to Worker**: Credited immediately upon service completion.
- **15% Cooperative Welfare & Insurance Fund**: Managed collectively by the worker cooperative for group health/accident insurance, zero-interest tool/equipment loans, and skill certifications.
- **5% Platform Maintenance Fee**: Bare-minimum fee to maintain servers, open-source infrastructure, and payment gateways.
- **Democratic One-Member-One-Vote Governance**: Worker members vote directly on service rates, new member approvals, and how their collective 15% welfare reserve is deployed.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, TailwindCSS, Lucide-React, Recharts |
| **Multilingual** | i18next (English + हिन्दी toggle on all screens) |
| **Backend** | Node.js, Express, TypeScript, Zod |
| **Database & ORM** | PostgreSQL 16, Prisma ORM |
| **Real-time Sync** | Socket.io (live booking lifecycle updates & governance tallies) |
| **Authentication** | JWT Bearer tokens + Phone OTP simulation (Mock OTP for hackathon demo) |
| **Smart Automation** | Weighted Multi-Factor AI Match Ranking ($0.4 \times \text{Prox} + 0.3 \times \text{Rating} + 0.2 \times \text{Avail} + 0.1 \times \text{Skill}$) |
| **Containerization** | Docker, Docker Compose (multi-container: Postgres, Backend, Frontend) |

---

## 🔑 Seeded Demo Credentials (Instant Access)

The platform comes preloaded with realistic test accounts. You can also use the **"Demo Role Switcher"** button in the top navbar for instant 1-click login into any role during your SIH presentation.

| Role | Name | Phone Number | Mock OTP | Description |
|---|---|---|---|---|
| **Government Admin** | Dr. Rajeshwar Sharma (IAS) | `9999900001` | `123456` | Oversees national analytics, GMV charts, approves coops, flags disputes |
| **Cooperative Admin** | Sunita Deshmukh | `9822011111` | `123456` | Admin of Pune Shramik Seva Coop; sets category rates, manages fund & proposals |
| **Worker Member** | Ramesh Patil (Plumber) | `9822099001` | `123456` | Receives 80% direct earnings, toggles duty availability, casts democratic votes |
| **Customer** | Aarav Mehta | `9876500001` | `123456` | Explores services, inspects AI smart matches, books with live 80/15/5 breakdown |

---

## 🚀 Quickstart Guide

### Option 1: Run with Docker Compose (Recommended)
With Docker Desktop installed, run:
```bash
docker-compose up --build
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **PostgreSQL**: `localhost:5432` (db: `sahakarconnect`, user: `postgres`, pass: `postgres`)

---

### Option 2: Run Locally via Node.js (Zero-Docker Dev Mode)

The backend features a resilient data layer that works immediately with pre-populated SIH seed data even if local PostgreSQL is not currently running.

#### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs at [http://localhost:5000](http://localhost:5000) (Socket.io listening on port 5000).

#### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at [http://localhost:5173](http://localhost:5173).

#### Optional: Seed PostgreSQL via Prisma
```bash
cd backend
npx prisma db push
npm run prisma:seed
```

---

## 🧭 Step-by-Step SIH Hackathon Demo Flow

1. **Public Landing Page (`/`)**:
   - Show the **Interactive Commission Calculator**: Move the slider from ₹500 to ₹3,000 to show how much more money stays in the worker's hands compared to Urban Company (25% cut).
   - Click the **Language Toggle** in the top right to show English ⇄ हिन्दी seamless translation.

2. **Customer Journey**:
   - Click **"Demo Switch: Customer (Aarav)"**.
   - Browse **Plumbing** or **Cleaning**.
   - Inspect the **"AI Smart Match Formula"** tooltip to explain the 40/30/20/10 weighted score to the judges.
   - Click **"Book Now"** on Ramesh Patil: show the **Transparent Price Breakdown** widget before confirming.
   - Go to **"My Bookings"** to see the 4-stage lifecycle tracker (`Requested -> Accepted -> In Progress -> Completed`).

3. **Worker Journey**:
   - Switch to **"Worker (Ramesh Patil)"** via top navbar.
   - Toggle **Duty Availability** (Online/Offline) to demonstrate live state changes.
   - In the **Incoming Job Requests** tab, click **Accept Job** then **Start Job** and **Complete Job**.
   - Switch to the **"80% Earnings"** tab: show the real-time calculated ledger with ₹ direct payout and ₹15% cooperative welfare deposit.
   - Switch to the **"Governance"** tab: demonstrate **One-Member-One-Vote** by voting on open proposal *"Should we raise plumbing base rate to ₹450?"* and seeing live percentage updates!

4. **Cooperative Admin Journey**:
   - Switch to **"Coop Admin (Sunita Deshmukh)"**.
   - View the **₹142,500 Welfare Reserve** accumulated from past bookings.
   - Open **Members** tab to verify or onboard a new worker.
   - Open **Rates** tab to customize base rates.
   - Open **Proposals** tab to draft and publish a new democratic ballot.

5. **Ministry / Government Admin Portal**:
   - Switch to **"Gov Admin (Dr. Rajeshwar Sharma)"**.
   - View national macroeconomic KPIs: Total GMV, Total Payouts to Workers, Cooperative Reserves.
   - Show interactive **Recharts graphs**: Demand by Category and Regional Distribution by District.
   - Review the **Quality & Dispute Monitoring Watchlist** flagging cooperatives with average ratings below 3.0 or high dispute rates.

---

## 👥 Roles & Permissions Matrix

| Feature | Customer | Worker | Coop Admin | Gov Admin |
|---|:---:|:---:|:---:|:---:|
| Browse & Search Workers | ✅ | ❌ | ❌ | ❌ |
| Book Service & View Split | ✅ | ❌ | ❌ | ❌ |
| Rate & Review Worker | ✅ | ❌ | ❌ | ❌ |
| Accept / Decline Jobs | ❌ | ✅ | ❌ | ❌ |
| Duty Availability Toggle | ❌ | ✅ | ❌ | ❌ |
| View Personal 80% Earnings | ❌ | ✅ | ❌ | ❌ |
| Cast 1 Vote on Proposals | ❌ | ✅ | ❌ | ❌ |
| Manage Cooperative Members | ❌ | ❌ | ✅ | ❌ |
| Set Category Base Rates | ❌ | ❌ | ✅ | ❌ |
| Create Cooperative Proposals | ❌ | ❌ | ✅ | ❌ |
| Approve / Reject Coops | ❌ | ❌ | ❌ | ✅ |
| Platform-wide Analytics | ❌ | ❌ | ❌ | ✅ |
