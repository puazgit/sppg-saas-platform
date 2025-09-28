# Payment & Billing Management API Documentation

## ✅ Complete API Endpoints Implementation

### 1. **Payments API** - `/api/superadmin/payments/`

#### GET `/api/superadmin/payments/` - List Payments
**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search by payment ID, invoice ID, or SPPG ID
- `status` (enum): PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED, REFUNDED, PARTIAL_REFUND
- `method` (enum): BANK_TRANSFER, CREDIT_CARD, DIGITAL_WALLET, VIRTUAL_ACCOUNT, CASH
- `gateway` (enum): MIDTRANS, XENDIT, DOKU, FASPAY, GOPAY, OVO, DANA
- `amountMin` (number): Minimum amount filter
- `amountMax` (number): Maximum amount filter
- `dateFrom` (string): Start date filter (ISO format)
- `dateTo` (string): End date filter (ISO format)
- `sortBy` (enum): createdAt, paidAt, amount, status
- `sortOrder` (enum): asc, desc

**Response:**
```json
{
  "payments": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 50,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "limit": 10
  }
}
```

#### POST `/api/superadmin/payments/` - Create Payment
**Request Body:**
```json
{
  "invoiceId": "string",
  "subscriptionId": "string",
  "amount": 100000,
  "method": "CREDIT_CARD",
  "gateway": "MIDTRANS",
  "processingFee": 2900,
  "metadata": {}
}
```

#### GET `/api/superadmin/payments/[id]` - Get Payment Detail
**Response:** Complete payment object with invoice and subscription data

#### PUT `/api/superadmin/payments/[id]` - Update Payment
**Request Body:**
```json
{
  "status": "COMPLETED",
  "paidAt": "2025-09-28T12:00:00Z",
  "processingFee": 2900,
  "gatewayTransactionId": "TXN123456",
  "gatewayResponse": {},
  "metadata": {}
}
```

#### DELETE `/api/superadmin/payments/[id]` - Delete Payment
**Response:** Success message

#### POST `/api/superadmin/payments/[id]/refund` - Process Refund
**Request Body:**
```json
{
  "amount": 50000,
  "reason": "Customer requested refund",
  "metadata": {
    "refundedBy": "admin",
    "refundDate": "2025-09-28T12:00:00Z"
  }
}
```

---

### 2. **Invoices API** - `/api/superadmin/invoices/`

#### GET `/api/superadmin/invoices/` - List Invoices
**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search by invoice number or SPPG ID
- `status` (enum): DRAFT, SENT, VIEWED, OVERDUE, PAID, CANCELLED, REFUNDED
- `amountMin` (number): Minimum amount filter
- `amountMax` (number): Maximum amount filter
- `dateFrom` (string): Start date filter (ISO format)
- `dateTo` (string): End date filter (ISO format)
- `sortBy` (enum): issueDate, dueDate, totalAmount, status
- `sortOrder` (enum): asc, desc

#### POST `/api/superadmin/invoices/` - Create Invoice
**Request Body:**
```json
{
  "subscriptionId": "string",
  "totalAmount": 100000,
  "taxAmount": 11000,
  "issueDate": "2025-09-28",
  "dueDate": "2025-10-28",
  "billingPeriodStart": "2025-09-01",
  "billingPeriodEnd": "2025-09-30",
  "items": [
    {
      "description": "Monthly Subscription",
      "quantity": 1,
      "unitPrice": 100000,
      "metadata": {}
    }
  ]
}
```

#### GET `/api/superadmin/invoices/[id]` - Get Invoice Detail
**Response:** Complete invoice object with subscription, items, and payments

#### PUT `/api/superadmin/invoices/[id]` - Update Invoice
**Request Body:**
```json
{
  "status": "PAID",
  "paidAt": "2025-09-28T12:00:00Z",
  "totalAmount": 111000,
  "taxAmount": 11000,
  "dueDate": "2025-10-28"
}
```

#### DELETE `/api/superadmin/invoices/[id]` - Delete Invoice
**Response:** Success message (only if no completed payments)

#### POST `/api/superadmin/invoices/[id]/send` - Send Invoice
**Request Body:**
```json
{
  "email": "customer@example.com",
  "message": "Invoice terlampir untuk pembayaran langganan SPPG."
}
```

---

### 3. **Billing Analytics API** - `/api/superadmin/billing-analytics/`

#### GET `/api/superadmin/billing-analytics/` - Get Analytics Dashboard
**Query Parameters:**
- `period` (enum): 7d, 30d, 90d, 12m (default: 30d)
- `startDate` (string): Custom start date (ISO format)
- `endDate` (string): Custom end date (ISO format)
- `sppgId` (string): Filter by specific SPPG
- `tier` (enum): BASIC, STANDARD, PRO, ENTERPRISE

**Response:**
```json
{
  "summary": {
    "totalRevenue": 5000000,
    "revenueGrowth": 15.5,
    "totalPayments": 125,
    "successRate": 94.4,
    "failureRate": 5.6,
    "totalInvoices": 100,
    "invoiceCollectionRate": 89.0,
    "overdueInvoices": 11,
    "totalSubscriptions": 85,
    "activeSubscriptions": 78,
    "subscriptionGrowthRate": 91.8,
    "pendingPayments": 7,
    "cancelledSubscriptions": 7
  },
  "charts": {
    "monthlyRevenue": [
      {
        "month": "Sep 2025",
        "revenue": 1500000,
        "payments": 42
      }
    ],
    "paymentsByStatus": [
      {
        "status": "COMPLETED",
        "count": 118,
        "amount": 4720000
      }
    ],
    "revenueByTier": [
      {
        "tier": "STANDARD",
        "revenue": 3000000
      }
    ]
  },
  "recentActivity": {
    "recentPayments": [...],
    "topSPPGs": [
      {
        "sppgId": "SPPG001",
        "tier": "PRO",
        "totalRevenue": 850000,
        "totalPayments": 17
      }
    ]
  },
  "filters": {
    "period": "30d",
    "startDate": "2025-08-29T00:00:00Z",
    "endDate": "2025-09-28T23:59:59Z"
  }
}
```

#### POST `/api/superadmin/billing-analytics/export` - Export Data
**Request Body:**
```json
{
  "type": "payments", // payments, invoices, analytics
  "format": "csv", // csv, json
  "startDate": "2025-09-01",
  "endDate": "2025-09-30",
  "status": "COMPLETED",
  "sppgId": "SPPG001"
}
```

**CSV Response:** File download with proper headers
**JSON Response:** Structured data with metadata

---

## 🎯 Key Features Implemented

### **Security & Authentication**
- ✅ Role-based access control (SUPER_ADMIN only)
- ✅ Session-based authentication via NextAuth
- ✅ Request validation with Zod schemas
- ✅ Proper error handling and HTTP status codes

### **Advanced Filtering & Search**
- ✅ Multi-criteria search (ID, invoice, SPPG)
- ✅ Status-based filtering
- ✅ Amount range filtering
- ✅ Date range filtering
- ✅ Gateway and method filtering
- ✅ Sorting by multiple fields

### **Performance Optimization**
- ✅ Pagination with efficient queries
- ✅ Parallel query execution for analytics
- ✅ Optimized database joins
- ✅ Raw SQL for complex analytics queries

### **Business Logic**
- ✅ Payment status management
- ✅ Refund processing with validation
- ✅ Invoice lifecycle management
- ✅ Email sending simulation
- ✅ Revenue and growth calculations
- ✅ Success rate analytics

### **Data Export**
- ✅ CSV export with proper formatting
- ✅ JSON export with metadata
- ✅ Multiple data types (payments, invoices, analytics)
- ✅ Date range and filter support

### **Error Handling**
- ✅ Validation errors with details
- ✅ Database constraint violations
- ✅ Not found errors
- ✅ Business logic violations
- ✅ Proper HTTP status codes

---

## 🚀 Ready for Integration

All API endpoints are now complete and ready for integration with the frontend components. The APIs support:

- **Real-time analytics** for the BillingOverview component
- **Advanced filtering** for PaymentList and InvoiceList components
- **CRUD operations** for PaymentDetail and InvoiceDetail components
- **Export functionality** for data analysis and reporting
- **Business process automation** for payment and invoice management

The implementation follows enterprise-grade patterns with comprehensive error handling, type safety, and performance optimization.