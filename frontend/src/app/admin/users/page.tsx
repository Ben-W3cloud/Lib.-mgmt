/**
 * =============================================================================
 * Admin Users Page â€” Customer management
 * =============================================================================
 */

"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { UserManagement } from "@/components/admin/UserManagement";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title="User Management"
          subtitle="Inspect customer profiles and onboard members from the archive."
        />
        <UserManagement />
      </div>
    </AdminGuard>
  );
}
