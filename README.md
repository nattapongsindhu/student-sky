# ✈️ Student Sky · GCC Aviation & Pilot Training Operations

> Academic & Flight Training Operations Dashboard for **Glendale Community College (GCC)**  
> Degree: **Associate of Science in Pilot Training** (FAA Part 141 Pathway)  
> Automated synchronization with **GCC Canvas LMS** daily at **06:00 AM PST** via Vercel Cron.

---

## 🔒 Blast Radius & System Isolation Guarantee
* **Repository:** `student-sky` (100% independent from `student-star`)
* **Database:** Isolated Supabase project instance (zero data overlap with LACC Cybersecurity)
* **Canvas Integration:** Configured exclusively for Glendale Community College (`https://glendale.instructure.com`)

---

## 🛠️ Tech Stack & Architecture
* **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS, Lucide Icons
* **Backend & API:** Next.js Route Handlers (`/api/sync/canvas`, `/api/cron`)
* **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS)
* **LMS Integration:** GCC Canvas LMS REST API (`/api/v1/courses`, `/api/v1/assignments`, `/api/v1/announcements`)
* **Risk Engine:** Deterministic academic risk & priority assessment engine
* **Automation:** Vercel Cron (`vercel.json`) scheduled daily at 06:00 AM PST (14:00 UTC)

---

## 📋 Quick Setup & Deployment Guide

### 1. Supabase Setup (Create New Project)
1. Navigate to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project** and name it `student-sky`.
3. Go to the **SQL Editor** menu and run scripts in order:
   * Run [`supabase/schema.sql`](supabase/schema.sql) to create `courses`, `assignments`, `announcements`, `flight_lab_logs`, and `sync_logs` tables.
   * Run [`supabase/seed.sql`](supabase/seed.sql) to seed the 7-term GCC Aviation Pilot Training curriculum records.
4. Go to **Project Settings > API** to copy:
   * `Project URL`
   * `anon public key`
   * `service_role key` (click Reveal)

---

### 2. GCC Canvas LMS API Token
1. Log in to **GCC Canvas** (`https://glendale.instructure.com`).
2. Click your profile avatar **Account > Settings**.
3. Scroll down to **Approved Integrations** and click **+ New Access Token**.
4. Set Purpose (e.g., `student-sky-sync`) and click **Generate Token**.
5. Copy and securely store the generated token for environment configuration.

---

### 3. Environment Variables
Create a `.env.local` file in the project root based on [`.env.example`](.env.example):

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-student-sky-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# GCC Canvas LMS
CANVAS_BASE_URL=https://glendale.instructure.com
CANVAS_API_TOKEN=your_gcc_canvas_api_token

# Vercel Cron Security
CRON_SECRET=your_secure_cron_secret_random_string
```

---

### 4. Git & GitHub Repository Setup
Initialize and push to GitHub repository `student-sky`:

```bash
cd "c:\Users\0xR00t\Documents\Antigravity\Web Apps\student-sky"
git init
git add .
git commit -m "feat: initial commit for student-sky GCC aviation operations dashboard"
git branch -M main
git remote add origin https://github.com/nattapongsindhu/student-sky.git
git push -u origin main
```

---

### 5. Vercel Deployment
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New... > Project**.
3. Select and import the GitHub repository `student-sky`.
4. Add all environment variables from Step 3 under **Environment Variables**.
5. Click **Deploy**.
6. Once deployed, the system will run daily Cron synchronization at 06:00 AM PST automatically, and you can click **Open Sync Console** on the dashboard anytime for manual sync!
