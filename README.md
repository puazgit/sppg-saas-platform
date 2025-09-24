# 🍽️ SPPG SaaS Platform

**Sistem Manajemen SPPG (Satuan Pelayanan Gizi Gratis) - Platform SaaS**

Platform SaaS untuk manajemen operasional SPPG yang mengelola produksi dan distribusi makanan bergizi gratis. SPPG berlangganan untuk menggunakan sistem dengan fokus pada workflow: Menu Planning → Procurement → Production → Distribution → Reporting.

## 🏗️ **Architecture Overview**

- **Single Database Multi-SPPG** dengan data isolation per `sppgId`
- **Subscription-Based Model** dengan 4-tier pricing (BASIC → ENTERPRISE)
- **Core Operations Focus** pada production & distribution, bukan student management
- **Indonesian Language Support** dengan terminologi Bahasa Indonesia
- **Government Compliance** dengan automated reporting

## 🚀 **Quick Start dengan Docker**

### **Prerequisites**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v20.0+)
- [Node.js](https://nodejs.org/) (v18.0+)
- [Git](https://git-scm.com/)

### **1. Clone & Setup**
```bash
# Copy environment file
cp .env.example .env

### **2. Start Development**
```bash
# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

## 🐳 **Docker Services**

| Service | Port | Purpose | Access |
|---------|------|---------|---------|
| **PostgreSQL** | `5432` | Main database | - |
| **Redis** | `6379` | Session & caching | - |
| **Adminer** | `8080` | Database management | http://localhost:8080 |
| **MinIO** | `9000/9001` | File storage | http://localhost:9001 |

### **Database Access (Adminer)**
- **URL**: http://localhost:8080
- **System**: PostgreSQL  
- **Server**: postgres
- **Username**: `sppg_admin`
- **Password**: `sppg_secure_2025`
- **Database**: `sppg_saas_platform`

## 📋 **Available Commands**

### **Docker Management**
```bash
make setup          # Initial setup with Docker
make start          # Start containers
make stop           # Stop containers  
make restart        # Restart containers
make logs           # View logs
make clean          # Remove all data (⚠️ DATA LOSS)
```

### **Development**
```bash
npm run dev         # Start Next.js dev server
npm run build       # Build for production
npm run db:migrate  # Run database migrations
npm run db:studio   # Open Prisma Studio

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
