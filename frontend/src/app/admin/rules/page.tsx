/**
 * =============================================================================
 * Admin Rules Page — Configure borrow and point rules
 * =============================================================================
 */

"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { RulesForm } from "@/components/admin/RulesForm";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AdminRulesPage() {
  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="System Rules"
          subtitle="Configure point rewards, penalties, and borrowing limits"
        />
        <RulesForm />
      </div>
    </AdminGuard>
  );
}
