import { SuperAdminLayoutProvider } from "@/features/superadmin"

interface SuperAdminLayoutProps {
  children: React.ReactNode
}

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <SuperAdminLayoutProvider>
        {children}
      </SuperAdminLayoutProvider>
    </div>
  )
}
