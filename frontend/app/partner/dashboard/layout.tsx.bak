/**
 * Partner Dashboard Layout
 * Purpose: Protect partner dashboard routes with PartnerAuth
 * Location: app/partner/dashboard/layout.tsx
 */

import { PartnerAuth } from '@/components/auth'

export default function PartnerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PartnerAuth>
      <main className="min-h-screen bg-sand-gray/10">
        {children}
      </main>
    </PartnerAuth>
  )
} 