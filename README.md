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
* **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons
* **Backend & API:** Next.js Route Handlers (`/api/sync/canvas`, `/api/cron`)
* **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS)
* **LMS Integration:** GCC Canvas LMS REST API (`/api/v1/courses`, `/api/v1/assignments`, `/api/v1/announcements`)
* **Risk Engine:** Deterministic academic risk & priority assessment engine
* **Automation:** Vercel Cron (`vercel.json`) scheduled daily at 06:00 AM PST (14:00 UTC)

---

## 📋 Quick Setup & Deployment Guide

### 1. Supabase Setup (สร้างโปรเจกต์ใหม่)
1. เข้าไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. กด **New Project** ตั้งชื่อว่า `student-sky`
3. ไปที่เมนู **SQL Editor** แล้วรันสคริปต์ตามลำดับ:
   * รัน [`supabase/schema.sql`](file:///c:/Users/0xR00t/Documents/Antigravity/Web%20Apps/student-sky/supabase/schema.sql) เพื่อสร้างตาราง `courses`, `assignments`, `announcements`, `flight_lab_logs`, และ `sync_logs`
   * รัน [`supabase/seed.sql`](file:///c:/Users/0xR00t/Documents/Antigravity/Web%20Apps/student-sky/supabase/seed.sql) เพื่อนำเข้าข้อมูลหลักสูตร GCC Aviation Pilot Training ทั้ง 7 เทอม
4. ไปที่ **Project Settings > API** เพื่อคัดลอก:
   * `Project URL`
   * `anon public key`
   * `service_role key` (กด Reveal)

---

### 2. GCC Canvas LMS API Token
1. ล็อกอินเข้าสู่ **GCC Canvas** (`https://glendale.instructure.com`)
2. คลิกที่รูปโปรไฟล์ **Account > Settings**
3. เลื่อนลงมาที่หัวข้อ **Approved Integrations** แล้วคลิกปุ่ม **+ New Access Token**
4. ตั้งชื่อ Purpose เช่น `student-sky-sync` แล้วคลิก **Generate Token**
5. คัดลอก Token ที่ได้มาเก็บไว้เพื่อนำไปใส่ใน Environment Variables

---

### 3. Environment Variables
สร้างไฟล์ `.env.local` ในโฟลเดอร์นี้ โดยอิงจาก [`.env.example`](file:///c:/Users/0xR00t/Documents/Antigravity/Web%20Apps/student-sky/.env.example):

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
สร้าง Repository ใหม่บน GitHub ชื่อ `student-sky`:

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
1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. คลิก **Add New... > Project**
3. เลือก Import จาก GitHub Repo `student-sky`
4. ใส่ Environment Variables ทั้งหมดจากขั้นตอนที่ 3 ในหัวข้อ **Environment Variables**
5. คลิก **Deploy**
6. เมื่อ Deploy เสร็จ ระบบจะรัน Cron Job ทุก 06:00 AM PST อัตโนมัติ และคุณสามารถกด **Open Sync Console** บน Dashboard เพื่อสั่ง Manual Sync ได้ตลอดเวลา!
