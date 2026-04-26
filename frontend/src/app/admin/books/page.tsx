/**
 * =============================================================================
 * Admin Books Page — Add and manage library books
 * =============================================================================
 */

"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AddBookForm } from "@/components/admin/AddBookForm";
import { ManageBooksTable } from "@/components/admin/ManageBooksTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { BookPlus } from "lucide-react";

export default function AdminBooksPage() {
  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Manage Books"
          subtitle="Add new books and manage the library catalog"
        />

        {/* Add Book Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookPlus className="w-5 h-5 text-forest-green" />
              <h2 className="text-lg font-serif font-semibold text-dark-walnut">
                Add New Book
              </h2>
            </div>
            <p className="text-sm text-slate mt-1">
              All fields are required. The book will be immediately active and available for borrowing.
            </p>
          </CardHeader>
          <CardContent>
            <AddBookForm />
          </CardContent>
        </Card>

        {/* Manage Existing Books */}
        <div>
          <h2 className="text-lg font-serif font-semibold text-dark-walnut mb-4">
            Existing Books
          </h2>
          <ManageBooksTable />
        </div>
      </div>
    </AdminGuard>
  );
}
