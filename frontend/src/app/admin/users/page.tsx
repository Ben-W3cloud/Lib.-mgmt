/**
 * =============================================================================
 * Admin Users Page — Customer management
 * =============================================================================
 */

"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { UserManagement } from "@/components/admin/UserManagement";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="User Management"
          subtitle="Look up customers and manage registrations"
        />
        <UserManagement />
      </div>
    </AdminGuard>
  );
}
