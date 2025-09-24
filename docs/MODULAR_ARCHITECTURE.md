# 🏗️ SPPG SaaS Platform - Modular Architecture Guide

## 📁 Struktur Folder Features yang Robust

Setiap feature module harus mengikuti struktur folder yang konsisten:

```
src/features/
├── auth/                    # Authentication Feature
│   ├── components/          # React components khusus auth
│   ├── hooks/              # Custom hooks untuk auth logic
│   ├── lib/                # Utility functions & helpers
│   ├── schemas/            # Zod validation schemas
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript type definitions
│   └── index.ts            # Barrel exports
├── menu/                   # Menu Management Feature
│   ├── components/         # Menu-related components
│   ├── hooks/              # Menu hooks (CRUD, filters, etc)
│   ├── lib/                # Menu utilities & calculations
│   ├── schemas/            # Menu validation schemas
│   ├── store/              # Menu state management
│   ├── types/              # Menu type definitions
│   └── index.ts            # Barrel exports
├── inventory/              # Inventory Management Feature
├── production/             # Production Management Feature
├── distribution/           # Distribution Management Feature
├── reporting/              # Reporting & Analytics Feature
└── ...
```

## 🎯 Teknologi Stack yang Digunakan

### ✅ Frontend State Management
- **Zustand** - State management per feature
- **TanStack Query** - Server state & caching
- **React Hook Form** - Form handling dengan Zod validation

### ✅ Schema & Validation
- **Zod** - Runtime schema validation
- **TypeScript** - Static type checking

### ✅ UI & Styling
- **Shadcn/UI** - Base component library
- **Tailwind CSS** - Styling framework
- **Next Themes** - Dark mode support

### ✅ Authentication
- **NextAuth v5** - Authentication system
- **Prisma Adapter** - Database integration

### ✅ Database
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Production database

## 📋 Aturan Implementasi

### 🚫 TIDAK BOLEH:
- ❌ Mock data / hardcoded data
- ❌ Global state untuk feature-specific data
- ❌ Components di folder global untuk feature logic
- ❌ Mixed concerns dalam satu file

### ✅ WAJIB:
- ✅ Real data dari database via Prisma
- ✅ State management per feature dengan Zustand
- ✅ Zod validation untuk semua input
- ✅ TypeScript types untuk semua data structures
- ✅ Responsive & dark mode support
- ✅ TanStack Query untuk data fetching

## 🔧 Contoh Implementasi per Feature

### Feature: Menu Management

```typescript
// src/features/menu/types/menu.types.ts
export interface Menu {
  id: string
  name: string
  category: MenuCategory
  // ... other fields
}

// src/features/menu/schemas/menu.schema.ts
export const createMenuSchema = z.object({
  name: z.string().min(1, "Nama menu wajib diisi"),
  category: z.nativeEnum(MenuCategory),
  // ... other validations
})

// src/features/menu/store/menu.store.ts
export const useMenuStore = create<MenuState & MenuActions>()(
  devtools((set) => ({
    // menu-specific state
  }))
)

// src/features/menu/hooks/use-menu.ts
export function useMenus() {
  return useQuery({
    queryKey: ['menus'],
    queryFn: () => fetchMenus(), // Real API call
  })
}

// src/features/menu/index.ts
export * from './hooks/use-menu'
export * from './store/menu.store'
export * from './types/menu.types'
export * from './schemas/menu.schema'
```

## 🎨 UI Components Structure

```
src/components/ui/          # Shadcn/UI base components
├── button.tsx
├── card.tsx
├── form.tsx
└── ...

src/features/[feature]/components/  # Feature-specific components
├── menu-list.tsx
├── menu-form.tsx
├── menu-card.tsx
└── ...
```

## 📦 Import Strategy

```typescript
// ✅ Good - Feature-based imports
import { useAuth } from '@/features/auth'
import { useMenus } from '@/features/menu'

// ✅ Good - UI components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// ❌ Bad - Direct deep imports
import { useAuthStore } from '@/features/auth/store/auth.store'
```

## 🚀 Development Workflow

1. **Create Feature Structure**
   ```bash
   mkdir -p src/features/[feature-name]/{components,hooks,lib,schemas,store,types}
   ```

2. **Define Types First**
   - Create TypeScript interfaces
   - Match Prisma schema types

3. **Create Zod Schemas**
   - Validation schemas for forms
   - API request/response schemas

4. **Implement Store**
   - Feature-specific state management
   - Actions for CRUD operations

5. **Build Hooks**
   - TanStack Query for data fetching
   - Custom logic hooks

6. **Create Components**
   - Feature-specific UI components
   - Use Shadcn/UI as base

7. **Export via index.ts**
   - Clean barrel exports
   - Easy imports for other features

## 🎯 Performance Considerations

- **Code Splitting**: Each feature dapat di-lazy load
- **Bundle Size**: Optimal dengan barrel exports
- **State Management**: Isolated per feature
- **Caching**: TanStack Query untuk server state
- **Real-time**: Setup WebSocket untuk updates

---

**Terakhir diupdate**: September 25, 2025
**Status**: ✅ Ready for Implementation