/**
 * =============================================================================
 * Admin Rules Page â€” Configure borrow and point rules
 * =============================================================================
 */

"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { RulesForm } from "@/components/admin/RulesForm";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AdminRulesPage() {
  return (
    <AdminGuard>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title="System Rules"
          subtitle="Tune borrow limits and point rules without leaving the archive."
        />
        <RulesForm />
      </div>
    </AdminGuard>
  );
}
