/**
 * =============================================================================
 * Books Page â€” Browse the archive catalog
 * =============================================================================
 */

"use client";

import { useMemo, useState } from "react";
import { useBooks } from "@/hooks/useBooks";
import { BookGrid } from "@/components/books/BookGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Library, Search, BookOpen, Layers3 } from "lucide-react";

export default function BooksPage() {
  const { books, isLoading } = useBooks();
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const active = books.filter((book) => book.active);
    const availableCopies = books.reduce((sum, book) => sum + Number(book.availableCopies), 0);
    const totalCopies = books.reduce((sum, book) => sum + Number(book.totalCopies), 0);
    return {
      total: books.length,
      active: active.length,
      availableCopies,
      totalCopies,
    };
  }, [books]);

  const filteredBooks = books.filter((book) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.isbn.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Library Catalog"
        subtitle="Browse the archive, inspect each file, and borrow from the active collection."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Records"
          value={isLoading ? "..." : stats.total}
          icon={Library}
          accent="bg-cyan-300/10 text-cyan-200"
        />
        <StatCard
          label="Active Titles"
          value={isLoading ? "..." : stats.active}
          icon={BookOpen}
          accent="bg-emerald-400/10 text-emerald-300"
        />
        <StatCard
          label="Copies in Archive"
          value={isLoading ? "..." : `${stats.availableCopies}/${stats.totalCopies}`}
          icon={Layers3}
          accent="bg-violet-300/10 text-violet-200"
        />
      </div>

      <Card className="mt-6 border-white/10 bg-white/[0.04]">
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200/70">
                Search archive
              </p>
              <h2 className="mt-2 font-serif text-2xl text-[#edf0ff]">
                Filter by title, author, or ISBN
              </h2>
            </div>

            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-200/70" />
              <Input
                placeholder="Search the archive..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-[#8e9ab8]">
            <Search className="h-4 w-4 text-cyan-200" />
            {search.trim() ? (
              <span>
                Showing {filteredBooks.length} of {books.length} records
              </span>
            ) : (
              <span>All active books are displayed by default.</span>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <BookGrid books={filteredBooks} isLoading={isLoading} />
      </div>
    </div>
  );
}
