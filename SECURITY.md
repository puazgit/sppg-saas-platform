# 🔒 SECURITY SETUP GUIDE - SPPG SaaS Platform

## ⚠️ IMPORTANT: Before Pushing to Git

### 1. 🔐 Environment Variables Security

**NEVER commit these files:**
- ✅ `.env` - Already in `.gitignore`
- ✅ `.env.local` - Already in `.gitignore`
- ✅ Any files with real passwords/secrets

**ALWAYS use:**
- ✅ `.env.example` - Template with placeholder values

### 2. 🛡️ Generate Secure Keys

Before production, generate secure keys:

```bash
# Generate NextAuth Secret
openssl rand -base64 32

# Generate JWT Secret  
openssl rand -base64 32

# Generate Encryption Key (32 characters)
openssl rand -hex 16
```

### 3. 📋 Environment Setup Checklist

Copy the template and fill real values:
```bash
cp .env.example .env
```

**Required for Development:**
- [ ] `DATABASE_URL` - PostgreSQL connection
- [ ] `NEXTAUTH_SECRET` - Authentication secret
- [ ] `JWT_SECRET` - API authentication
- [ ] `MINIO_ACCESS_KEY` & `MINIO_SECRET_KEY` - File storage

**Required for Production:**
- [ ] `MIDTRANS_SERVER_KEY` - Payment gateway
- [ ] `SMTP_*` - Email configuration
- [ ] `SENTRY_DSN` - Error monitoring
- [ ] SSL certificates paths

### 4. 🔄 Database Setup

```bash
# Start Docker services
docker-compose up -d

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

### 5. 🚨 Production Security

**Before deploying to production:**

1. **Change ALL default passwords**
2. **Use strong, unique secrets**
3. **Enable SSL/TLS**
4. **Set up monitoring**
5. **Configure proper CORS**
6. **Set up rate limiting**
7. **Enable audit logging**

### 6. 📝 Git Commit Checklist

Before `git push`:
- [ ] No `.env` files committed
- [ ] No database credentials in code
- [ ] No payment gateway keys in code
- [ ] No real email credentials
- [ ] All secrets use environment variables
- [ ] `.env.example` has placeholder values only

### 7. 🔍 Verify Clean Commit

Check for sensitive data:
```bash
# Check for potential secrets
git log --all -p | grep -i "password\|secret\|key\|token"

# Check current diff
git status
git diff --cached
```

## 🚀 Safe Development Commands

```bash
# Safe: Start development
npm run dev

# Safe: Database operations
npx prisma studio
npx prisma migrate dev

# Safe: Build for production
npm run build

# ⚠️  DANGER: Never commit these
# .env
# docker-compose.override.yml (if exists)
# Any backup files with credentials
```

## 📞 Emergency Response

If secrets are accidentally committed:
1. **Immediately rotate all exposed secrets**
2. **Force push with history rewrite (if safe)**
3. **Notify team members**
4. **Check for any unauthorized access**

```bash
# Remove sensitive file from git history (DANGEROUS)
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch .env' \
--prune-empty --tag-name-filter cat -- --all
```

## ✅ Security Best Practices

- 🔐 Use different passwords for each service
- 🔄 Rotate secrets regularly
- 📊 Monitor access logs
- 🚫 Never share `.env` files
- 💾 Backup credentials securely
- 🔍 Regular security audits