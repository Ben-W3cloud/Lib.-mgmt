/**
 * =============================================================================
 * Books Page — Browse all library books
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { useBooks } from "@/hooks/useBooks";
import { BookGrid } from "@/components/books/BookGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";

export default function BooksPage() {
  const { books, isLoading } = useBooks();
  const [search, setSearch] = useState("");

  // Client-side filtering by title, author, or ISBN
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Library Catalog"
        subtitle={`${books.filter((b) => b.active).length} books available for borrowing`}
        action={
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate/50" />
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-leather-brown/20 bg-cream text-ink-black placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-leather-brown/40 focus:border-leather-brown transition-all text-sm"
            />
          </div>
        }
      />

      <BookGrid books={filteredBooks} isLoading={isLoading} />
    </div>
  );
}
