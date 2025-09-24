# 📋 KESEPAKATAN IMPLEMENTASI - SPPG SaaS Platform

**Dokumen Panduan Utama untuk Semua Pengembangan**  
**Terakhir diupdate**: September 25, 2025  
**Status**: ✅ FINAL - Wajib diikuti oleh semua developer

---

## 🎯 **KESEPAKATAN UTAMA**

### **1. 🏗️ STRUKTUR MODULAR ROBUST**
- **Features Global** di `src/features/` untuk business logic
- **Setiap feature** memiliki struktur lengkap:
  ```
  src/features/[feature-name]/
  ├── components/    # React components khusus feature
  ├── hooks/        # Custom hooks (TanStack Query, logic)
  ├── lib/          # Utility functions & helpers
  ├── schemas/      # Zod validation schemas
  ├── store/        # Zustand state management per feature
  ├── types/        # TypeScript type definitions
  └── index.ts      # Barrel exports untuk clean imports
  ```

### **2. 🎨 TECH STACK WAJIB**
- **✅ Zod** - Schema validation untuk semua input/output
- **✅ Zustand** - State management per feature (bukan global)
- **✅ TanStack Query** - Data fetching, caching, server state
- **✅ React Hook Form** - Form handling dengan Zod integration
- **✅ NextAuth v5** - Authentication system
- **✅ Shadcn/UI** - Base component library
- **✅ Next Themes** - Dark mode support
- **✅ TypeScript** - Strict typing di semua level

### **3. 🚫 LARANGAN MUTLAK**
- **❌ TIDAK BOLEH** menggunakan mock data / hardcoded data
- **❌ TIDAK BOLEH** global store untuk feature-specific data
- **❌ TIDAK BOLEH** mixed concerns dalam satu file
- **❌ TIDAK BOLEH** components di folder global untuk feature logic

### **4. 🔄 HYBRID ROUTE APPROACH**
```
src/
├── features/              # Global business logic features
│   ├── auth/             # Shared authentication
│   ├── menu/             # Menu management
│   ├── inventory/        # Inventory management
│   ├── production/       # Production management
│   ├── analytics/        # Analytics & reporting
│   └── billing/          # Billing & subscriptions
├── app/
│   ├── (marketing)/      # Public landing pages
│   │   └── components/   # Marketing-specific components
│   ├── sppg/            # SPPG user routes
│   │   ├── components/   # SPPG-specific page components
│   │   ├── dashboard/    # Uses features with SPPG permissions
│   │   ├── menu/         # Page menggunakan src/features/menu
│   │   └── layout.tsx    # SPPG-specific layout
│   ├── superadmin/      # SuperAdmin routes  
│   │   ├── components/   # SuperAdmin-specific page components
│   │   ├── dashboard/    # Uses features with SuperAdmin permissions
│   │   ├── analytics/    # Page menggunakan src/features/analytics
│   │   └── layout.tsx    # SuperAdmin-specific layout
│   └── api/             # API routes
```

### **5. 💾 DATA MANAGEMENT**
- **Real Data Only** - Semua data dari database via Prisma
- **Role-based Data Access** - Features handle permissions internally
- **TanStack Query** untuk semua server state management
- **Optimistic Updates** untuk UX yang responsive
- **Error Handling** yang konsisten di semua features

### **6. 🎛️ STATE MANAGEMENT STRATEGY**
```typescript
// ✅ Feature-specific store
// src/features/menu/store/menu.store.ts
export const useMenuStore = create<MenuState & MenuActions>()(
  devtools((set) => ({
    // menu-specific state only
  }))
)

// ✅ Server state dengan TanStack Query
// src/features/menu/hooks/use-menu.ts
export function useMenus() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['menus', user?.sppgId],
    queryFn: () => fetchMenus(user), // Real API call
  })
}
```

### **7. 🔐 AUTHENTICATION & AUTHORIZATION**
- **NextAuth v5** dengan Prisma adapter
- **Role-based permissions** di level feature
- **Route protection** dengan middleware
- **Session management** yang secure

### **8. 📱 UI/UX REQUIREMENTS**
- **Responsive Design** - Mobile-first approach
- **Dark Mode** support dengan next-themes
- **Shadcn/UI** sebagai base components
- **Custom components** di feature-specific folders
- **Consistent Design System** di semua features

### **9. 📊 DATABASE & SCHEMA**
- **Prisma ORM** untuk type-safe database access
- **81 Models + 45 Enums** - Schema sudah FINAL
- **Multi-tenant architecture** dengan data isolation
- **Real-time updates** untuk collaborative features

### **10. 🚀 PERFORMANCE & OPTIMIZATION**
- **Code Splitting** per feature
- **Lazy Loading** untuk routes
- **Bundle Optimization** dengan barrel exports
- **Caching Strategy** dengan TanStack Query
- **Image Optimization** dengan Next.js Image

---

## 🎯 **IMPORT STRATEGY**
```typescript
// ✅ BENAR - Feature-based imports
import { useAuth } from '@/features/auth'
import { useMenus, MenuList } from '@/features/menu'
import { Button } from '@/components/ui/button'

// ❌ SALAH - Deep imports
import { useAuthStore } from '@/features/auth/store/auth.store'
import { MenuCard } from '@/features/menu/components/menu-card'
```

## 📁 **FOLDER STRUCTURE FINAL**
```
src/
├── features/              # Business logic features (GLOBAL)
├── components/ui/         # Shadcn/UI base components
├── app/                   # Next.js App Router
│   ├── (marketing)/       # Public routes
│   ├── sppg/             # SPPG protected routes + components
│   ├── superadmin/       # SuperAdmin protected routes + components  
│   └── api/              # API endpoints
├── lib/                   # Global utilities
├── providers/             # Global providers
└── stores/ (KOSONG)       # Tidak digunakan, store ada di features
```

## 🔄 **DEVELOPMENT WORKFLOW**
1. **Schema First** - Define types dari Prisma schema
2. **Zod Schemas** - Create validation schemas  
3. **Feature Store** - Zustand state management
4. **Hooks & API** - TanStack Query integration
5. **Components** - Feature-specific UI components
6. **Pages** - Route components yang menggunakan features
7. **Testing** - Unit & integration tests

## 🎯 **ROLE-BASED FEATURE ACCESS**
```typescript
// Features handle role permissions internally
export function useMenus(options?: { view?: 'sppg' | 'superadmin' }) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['menus', user?.sppgId, options?.view],
    queryFn: () => {
      if (user?.userType === 'SUPERADMIN') {
        return fetchAllMenus() // SuperAdmin sees all SPPGs
      }
      return fetchMenusBySppg(user?.sppgId) // SPPG sees only theirs
    }
  })
}
```

---

## ⚠️ **PENTING: COMPLIANCE WAJIB**

**Semua developer WAJIB mengikuti kesepakatan ini:**

1. **✅ Baca dokumen ini** sebelum memulai development
2. **✅ Follow struktur modular** yang telah ditetapkan
3. **✅ Gunakan tech stack** yang telah disepakati
4. **✅ Tidak menggunakan** mock data atau hardcode
5. **✅ Implement role-based** permissions di features
6. **✅ Test semua implementation** sesuai workflow
7. **✅ Review code** sesuai dengan kesepakatan ini

## 🚀 **STATUS KESEPAKATAN**

**✅ FINAL** - Dokumen ini adalah **PANDUAN UTAMA** untuk semua pengembangan SPPG SaaS Platform.

**Setiap perubahan pada kesepakatan ini harus mendapat persetujuan dari semua stakeholder.**

---

**© 2025 SPPG SaaS Platform Development Team**