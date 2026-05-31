# TEJ India CRM – Setup Guide

A comprehensive CRM & Research Management System for investment professionals.

---

## 🚀 Quick Start (Frontend Only — Current State)

The frontend is already running with mock data. Simply visit:

```
http://localhost:3000
```

**Login Credentials:**
- Email: `admin@tejindia.com`
- Password: `Admin@1234`

---

## 📋 Full Stack Setup

### Prerequisites

- **Node.js** 20+ (for frontend)
- **PHP** 8.2+ (for backend)
- **Composer** 2.x (for backend)
- **PostgreSQL** 16 (or Docker)

---

### Step 1 — Frontend (Already done ✅)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

### Step 2 — Backend (Laravel 12)

#### 2a. Install PHP & Composer

**Windows**: Download from https://www.apachefriends.org/ (XAMPP) or https://laravel.com/docs/installation#installing-php

```bash
# Install Composer (after PHP is installed)
# Download from: https://getcomposer.org/download/
```

#### 2b. Scaffold Laravel

```bash
# From the project root
composer create-project laravel/laravel backend --prefer-dist

# Copy our pre-built backend files
# (Routes, Controllers, Models, Migrations are already in /backend)
```

#### 2c. Install Backend Dependencies

```bash
cd backend
composer require laravel/sanctum spatie/laravel-permission
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

#### 2d. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` and set your PostgreSQL credentials:
```env
DB_HOST=127.0.0.1
DB_DATABASE=tej_crm
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

#### 2e. Run Migrations & Seed

```bash
# Create the database first
createdb tej_crm  # or via pgAdmin

# Run migrations
php artisan migrate

# Seed with demo data
php artisan db:seed

# Create storage symlink
php artisan storage:link
```

#### 2f. Start Backend Server

```bash
php artisan serve
# Runs at: http://localhost:8000
```

---

### Step 3 — Connect Frontend to Backend

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🐳 Docker Deployment (Production)

```bash
# From project root
docker compose up -d

# After containers start, initialize the backend
docker exec tej_crm_backend php artisan migrate
docker exec tej_crm_backend php artisan db:seed
docker exec tej_crm_backend php artisan storage:link
```

Access at: `http://localhost`

---

## 🔐 User Roles & Permissions

| Role | Access Level |
|------|-------------|
| **Super Admin** | Full access — all CRUD + user management |
| **Admin** | Full CRUD on all modules |
| **Research Analyst** | Research + Companies access |
| **CRM Executive** | CRM modules access |
| **Viewer** | Read-only access |

---

## 📁 Project Structure

```
CRM software/
├── frontend/               # Next.js 14 + TypeScript + Tailwind
│   ├── src/
│   │   ├── app/            # All pages (App Router)
│   │   ├── components/     # UI components + layout
│   │   └── lib/            # Utilities
│   └── package.json
│
├── backend/                # Laravel 12 API
│   ├── app/
│   │   ├── Http/Controllers/Api/  # All API controllers
│   │   └── Models/                # Eloquent models
│   ├── database/
│   │   ├── migrations/            # All DB migrations
│   │   └── seeders/               # Demo data seeder
│   └── routes/api.php             # All API routes
│
├── nginx/                  # Nginx reverse proxy config
├── docker-compose.yml      # Full stack Docker setup
└── README.md               # This file
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS v4 |
| UI Components | Radix UI primitives, Lucide icons |
| Charts | Recharts |
| State | Zustand + TanStack Query v5 |
| Backend | Laravel 12 REST API |
| Auth | Laravel Sanctum (JWT tokens) |
| Database | PostgreSQL 16 |
| Storage | Local filesystem (switchable to S3) |
| Cache | Redis |
| Deployment | Docker + Nginx |

---

## 📞 Support

Built by Antigravity AI for TEJ India · 2026
