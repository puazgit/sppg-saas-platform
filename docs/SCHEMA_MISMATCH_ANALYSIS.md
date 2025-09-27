# 🚨 SCHEMA MISMATCH ANALYSIS & FIXES

## ❌ **MASALAH YANG DITEMUKAN:**

### 1. **SPPG Model - Missing PIC Fields**

**Current Prisma Schema:**
```prisma
model SPPG {
  id              String @id @default(cuid())
  code            String @unique
  name            String
  description     String
  address         String
  phone           String
  email           String
  // ❌ MISSING PIC fields
}
```

**Required Frontend Fields:**
- `picName` - Person in Charge Name
- `picPosition` - PIC Position/Role
- `picEmail` - PIC Email
- `picPhone` - PIC Phone
- `picWhatsapp` - PIC WhatsApp (optional)
- `organizationType` - Organization Type enum
- `establishedYear` - Year established

### 2. **SubscriptionPackage - Minor Field Mismatches**

**Prisma uses `Float` vs Frontend expects `number`** - This is OK, compatible.

### 3. **Billing Component References**

**Billing Dashboard** references metrics that don't exist in schema:
- `totalRevenue`
- `activeSubscriptions` 
- `pendingInvoices`
- `monthlyRecurring`
- `churnRate`
- `avgRevenuePerUser`

---

## ✅ **FIXES REQUIRED:**

### **FIX 1: Update SPPG Prisma Model**

Add missing PIC fields to SPPG model:

```prisma
model SPPG {
  id              String @id @default(cuid())
  code            String @unique
  name            String
  description     String
  address         String
  phone           String
  email           String
  
  // ADD: Person in Charge Information
  picName         String // Person in Charge Name
  picPosition     String // PIC Position/Role
  picEmail        String // PIC Email
  picPhone        String // PIC Phone Number
  picWhatsapp     String? // PIC WhatsApp (optional)
  
  // ADD: Organization Details
  organizationType OrganizationType // Organization Type enum
  establishedYear Int? // Year established
  
  // existing fields...
  targetRecipients   Int
  maxRadius          Float
  maxTravelTime      Int
  // ... rest of fields
}

// ADD: Organization Type Enum
enum OrganizationType {
  PEMERINTAH
  SWASTA
  YAYASAN
  KOMUNITAS
  LAINNYA
}
```

### **FIX 2: Add Billing Metrics Models**

Create models for billing dashboard:

```prisma
model BillingMetrics {
  id              String @id @default(cuid())
  sppgId          String?
  
  // Metrics Data
  totalRevenue    Float @default(0)
  monthlyRevenue  Float @default(0)
  activeSubscriptions Int @default(0)
  pendingInvoices Int @default(0)
  churnRate       Float @default(0)
  avgRevenuePerUser Float @default(0)
  
  // Date Range
  periodStart     DateTime
  periodEnd       DateTime
  
  // Relations
  sppg            SPPG? @relation(fields: [sppgId], references: [id])
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("billing_metrics")
}
```

### **FIX 3: Update Frontend Schemas**

Update Zod schemas to match database:

```typescript
// Update organizationType enum to match database
organizationType: z.enum(['PEMERINTAH', 'SWASTA', 'YAYASAN', 'KOMUNITAS', 'LAINNYA'])

// Update establishedYear to be number
establishedYear: z.number().min(1945).max(new Date().getFullYear())
```

---

## 🎯 **IMPLEMENTATION PRIORITY:**

### **HIGH PRIORITY** (Required for subscription flow):
1. ✅ Add PIC fields to SPPG model
2. ✅ Add OrganizationType enum  
3. ✅ Update Zod schemas to match
4. ✅ Update migration files

### **MEDIUM PRIORITY** (For billing dashboard):
1. ✅ Add BillingMetrics model
2. ✅ Create billing analytics tables
3. ✅ Update billing components to use real data

### **LOW PRIORITY** (Nice to have):
1. ✅ Add indexes for performance
2. ✅ Add audit trails
3. ✅ Add soft deletes

---

## 📋 **ACTION ITEMS:**

### **Immediate (Today)**:
- [ ] Create migration to add PIC fields to SPPG
- [ ] Add OrganizationType enum
- [ ] Update subscription schemas
- [ ] Test subscription flow end-to-end

### **This Week**:
- [ ] Add billing metrics models
- [ ] Create billing analytics APIs
- [ ] Update billing dashboard to use real data
- [ ] Add proper error handling

### **Next Sprint**:
- [ ] Performance optimization
- [ ] Add comprehensive testing
- [ ] Add monitoring & analytics
- [ ] Documentation updates

---

## 🚨 **IMPACT ASSESSMENT:**

### **Breaking Changes:**
- ✅ SPPG model structure change (requires migration)
- ✅ Frontend form validation updates
- ✅ API contract changes

### **Non-Breaking Changes:**
- ✅ Adding new billing metrics (optional)
- ✅ Enhanced error handling
- ✅ Performance improvements

### **Risk Level:** 🟡 **MEDIUM**
- Requires database migration
- Frontend component updates needed
- API endpoint modifications required