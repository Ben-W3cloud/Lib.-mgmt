/**
 * =============================================================================
 * Admin Books Page â€” Catalog management
 * =============================================================================
 */

"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AddBookForm } from "@/components/admin/AddBookForm";
import { ManageBooksTable } from "@/components/admin/ManageBooksTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { BookPlus, Library } from "lucide-react";

export default function AdminBooksPage() {
  return (
    <AdminGuard>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title="Manage Books"
          subtitle="Add archive entries and control the catalog state."
        />

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookPlus className="h-5 w-5 text-cyan-200" />
                <h2 className="text-lg font-serif font-semibold text-[#edf0ff]">
                  Add New Book
                </h2>
              </div>
              <p className="mt-1 text-sm text-[#8e9ab8]">
                All fields are required. The entry will be immediately active
                and available for borrowing.
              </p>
            </CardHeader>
            <CardContent>
              <AddBookForm />
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Library className="h-5 w-5 text-cyan-200" />
                <h2 className="text-lg font-serif font-semibold text-[#edf0ff]">
                  Existing Books
                </h2>
              </div>
              <p className="mt-1 text-sm text-[#8e9ab8]">
                Toggle status and add copies without leaving the catalog view.
              </p>
            </CardHeader>
            <CardContent>
              <ManageBooksTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
}
