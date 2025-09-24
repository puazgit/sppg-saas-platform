# RBAC System Documentation

## Overview
Sistem Role-Based Access Control (RBAC) untuk SPPG SaaS Platform yang mendukung:
- **SuperAdmin**: Pengelola platform
- **SPPG Users**: User di SPPG dengan berbagai role sesuai bisnis proses

## Database Models

### 1. User
- `userType`: SUPERADMIN | SPPG_USER
- `sppgId`: nullable, untuk SPPG users

### 2. Role
- `name`: Nama role
- `isSystemRole`: true untuk SuperAdmin roles
- `sppgId`: null untuk system roles, filled untuk SPPG-specific roles

### 3. Permission
- `name`: Format `module.action` (e.g., "menu.create")
- `module`: Module aplikasi
- `action`: Aksi yang diizinkan

### 4. UserRole
- Many-to-many relationship antara User dan Role
- `isActive`: untuk enable/disable role

### 5. RolePermission
- Many-to-many relationship antara Role dan Permission

## Default Permissions

### System Permissions (SuperAdmin)
- `platform.manage`: Kelola platform
- `sppg.create`: Membuat SPPG baru
- `sppg.approve`: Menyetujui SPPG
- `sppg.suspend`: Menangguhkan SPPG
- `subscription.manage`: Kelola langganan
- `analytics.global`: Analytics global

### SPPG Permissions
Terbagi berdasarkan module bisnis:

#### Menu Management
- `menu.create`, `menu.read`, `menu.update`, `menu.delete`, `menu.approve`

#### Menu Planning
- `menu_planning.create`, `menu_planning.read`, `menu_planning.update`, `menu_planning.delete`, `menu_planning.approve`

#### Procurement
- `procurement.create`, `procurement.read`, `procurement.update`, `procurement.delete`, `procurement.approve`

#### Production
- `production.create`, `production.read`, `production.update`, `production.approve`

#### Distribution
- `distribution.create`, `distribution.read`, `distribution.update`, `distribution.approve`

#### Inventory & Stock
- `inventory.read`, `inventory.update`, `inventory.audit`

#### Staff Management
- `staff.create`, `staff.read`, `staff.update`, `staff.delete`

#### Reports
- `report.daily`, `report.weekly`, `report.monthly`, `report.export`

#### Distribution Points
- `distribution_point.create`, `distribution_point.read`, `distribution_point.update`, `distribution_point.delete`

## Default SPPG Roles

### 1. Admin SPPG
**Deskripsi**: Administrator SPPG dengan akses penuh  
**Permissions**: Semua permissions SPPG

### 2. Manager Operasional
**Deskripsi**: Manager dengan akses approve  
**Permissions**: Read semua module + approve permissions

### 3. Koordinator Dapur
**Deskripsi**: Koordinator produksi makanan  
**Permissions**: Menu, planning, procurement (read), production (full), inventory

### 4. Staff Dapur
**Deskripsi**: Staff produksi makanan  
**Permissions**: Menu (read), planning (read), production (create/read), inventory (read)

### 5. Koordinator Distribusi
**Deskripsi**: Koordinator distribusi makanan  
**Permissions**: Production (read), distribution (full), distribution points

### 6. Staff Distribusi
**Deskripsi**: Staff distribusi makanan  
**Permissions**: Distribution (create/read), distribution points (read)

### 7. Admin Keuangan
**Deskripsi**: Administrator keuangan  
**Permissions**: Procurement (read/approve), inventory (read/audit), reports (full)

### 8. Staff Admin
**Deskripsi**: Staff administrasi  
**Permissions**: Planning, procurement, reports, distribution points

## Usage Examples

### 1. Assign Role to User
```typescript
import { assignRoleToUser } from '@/lib/rbac'

// Assign SPPG role
await assignRoleToUser(userId, 'Admin SPPG', sppgId)

// Assign SuperAdmin role
await assignRoleToUser(userId, 'SuperAdmin Platform')
```

### 2. Check Permission
```typescript
import { userHasPermission } from '@/lib/rbac'

const canCreateMenu = await userHasPermission(userId, 'menu.create')
```

### 3. Middleware Usage
```typescript
// API Route dengan permission check
import { requirePermission } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const authCheck = await requirePermission('menu.create')(req)
  if (authCheck.status !== 200) return authCheck
  
  // Your API logic here
}
```

### 4. Create SPPG with Default Roles
```typescript
import { createSppgWithDefaultRoles } from '@/lib/rbac'

const sppg = await createSppgWithDefaultRoles({
  name: 'SPPG Jakarta Selatan',
  code: 'SPPG-JKT-SEL',
  // ... other fields
})
```

## File Structure
```
prisma/
├── seeds/
│   └── rbac-seed.ts          # RBAC seeding logic
└── seed.ts                   # Main seed file

src/lib/
├── rbac.ts                   # RBAC utility functions
└── auth.ts                   # Authorization middleware
```

## Workflow
1. **Platform Setup**: Run `prisma db seed` untuk initialize permissions dan system roles
2. **SPPG Creation**: Saat SPPG baru dibuat, otomatis dibuatkan default roles
3. **User Assignment**: Admin SPPG assign roles ke users sesuai kebutuhan
4. **Permission Check**: Setiap API call check permission user
5. **Authorization**: Middleware handle authorization di route level

## Security Features
- Separation of system roles vs SPPG roles
- Permission-based access control
- Middleware protection untuk API routes
- Audit trail melalui UserRole assignments
- Role expiration support