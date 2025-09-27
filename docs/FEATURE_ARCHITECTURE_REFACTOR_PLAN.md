# 🏗️ SPPG SaaS - Feature Architecture Refactoring Plan

## 🎯 **CLEAR SEPARATION OF CONCERNS**

### 📋 **Proposed Architecture:**

```
src/features/
├── subscription/          # NEW CUSTOMER REGISTRATION FLOW
│   ├── components/        # Registration journey components
│   ├── services/         # Registration & onboarding services  
│   ├── types/           # Registration & onboarding types
│   └── ...              # Registration-specific logic
│
└── billing/             # EXISTING CUSTOMER MANAGEMENT
    ├── components/      # Billing dashboard, invoice management
    ├── services/       # Billing operations, payment updates
    ├── types/          # Billing & invoice types  
    └── ...             # Billing-specific logic
```

---

## 🎯 **FEATURE RESPONSIBILITIES:**

### 🆕 **`src/features/subscription/` (New Customer Journey)**
**Purpose**: Handle new SPPG organization registration and initial onboarding

**Responsibilities:**
- ✅ **New Registration Flow** - Steps 1-5 yang sudah kita implement
- ✅ **Payment Processing** - Initial subscription payment only
- ✅ **Account Creation** - First-time admin account setup
- ✅ **Onboarding Process** - Welcome flow & initial setup
- ✅ **Success Flow** - Post-registration success page

**Key Components:**
- `PackageSelectionStep` - Choose subscription plan
- `RegistrationFormStep` - Organizational details
- `ConfirmationStep` - Review before payment
- `PaymentMethodStep` - Payment method selection
- `PaymentProcessingStep` - Payment processing
- `SuccessStep` - Onboarding initiation

### 💰 **`src/features/billing/` (Existing Customer Management)**
**Purpose**: Handle ongoing billing and subscription management for existing customers

**Responsibilities:**
- ✅ **Subscription Management** - Upgrade, downgrade, cancel
- ✅ **Invoice Management** - View, download, payment history
- ✅ **Payment Method Updates** - Change payment methods
- ✅ **Billing Dashboard** - Overview of billing status
- ✅ **Recurring Billing** - Automatic monthly/yearly charges
- ✅ **Usage Monitoring** - Track usage vs plan limits

**Key Components:**
- `BillingDashboard` - Main billing overview
- `SubscriptionSettings` - Plan management
- `InvoiceManager` - Invoice history & downloads
- `PaymentMethodManager` - Update payment methods
- `UsageMonitor` - Track plan usage
- `BillingAlerts` - Payment warnings & notifications

---

## 🔄 **REFACTORING ACTION PLAN:**

### **Phase 1: Move Duplicate Components**
```bash
# Remove duplicates from billing, keep in subscription
rm src/features/billing/components/confirmation-step.tsx
rm src/features/billing/components/payment-step.tsx  
rm src/features/billing/components/registration-form.tsx
rm src/features/billing/components/success-step.tsx
rm src/features/billing/components/subscription-flow.tsx
```

### **Phase 2: Rename & Reorganize Billing Components**
```bash
# Focus billing on post-registration management
mv billing/components/package-selector.tsx → subscription/components/
# Keep billing-specific components
keep billing/components/billing-dashboard.tsx
keep billing/components/invoice-manager.tsx  
keep billing/components/payment-status.tsx
```

### **Phase 3: Clear API Boundaries**
```typescript
// subscription/services/ - Registration APIs
- createNewSubscription()
- validateRegistrationData() 
- processInitialPayment()
- createAdminAccount()

// billing/services/ - Management APIs  
- getCurrentSubscription()
- updateSubscriptionPlan()
- getInvoiceHistory()
- updatePaymentMethod()
```

---

## 📊 **UPDATED FEATURE MATRIX:**

| Feature | Subscription | Billing |
|---------|-------------|---------|
| **Target Users** | New customers | Existing customers |
| **Primary Use Case** | Registration & onboarding | Ongoing management |
| **Payment Context** | Initial payment | Recurring payments |
| **Data Scope** | Registration data | Billing & usage data |
| **Journey Stage** | Pre-customer → Customer | Customer → Retained customer |
| **Success Metrics** | Conversion rate, onboarding completion | Revenue retention, upgrade rate |

---

## 🎯 **BENEFITS OF THIS SEPARATION:**

### 🏗️ **Architecture Benefits:**
- ✅ **Clear Boundaries** - No overlap in responsibilities
- ✅ **Single Responsibility** - Each feature has distinct purpose  
- ✅ **Maintainability** - Easier to modify without conflicts
- ✅ **Team Ownership** - Clear feature ownership

### 💼 **Business Benefits:**
- ✅ **Optimized Flows** - Registration vs management optimized separately
- ✅ **Better Analytics** - Clear funnel tracking
- ✅ **Targeted Improvements** - Focus improvements per user journey
- ✅ **Reduced Complexity** - Simpler user mental models

### 👥 **Developer Benefits:**  
- ✅ **No Code Duplication** - Single source of truth
- ✅ **Clear Integration Points** - Well-defined APIs between features
- ✅ **Independent Development** - Teams can work in parallel
- ✅ **Easier Testing** - Isolated test scopes

---

## 🚀 **IMMEDIATE NEXT STEPS:**

1. **✅ Keep Current Subscription Implementation** - Steps 1-5 are perfect
2. **🔄 Refactor Billing Feature** - Remove duplicates, focus on management
3. **📋 Update Documentation** - Clear feature boundaries
4. **🔗 Define Integration Points** - How features communicate
5. **🧪 Update Tests** - Test suites per feature responsibility

---

**Status**: 🎯 **ARCHITECTURE CLARIFICATION NEEDED**
**Action Required**: Refactor billing feature untuk clear separation of concerns