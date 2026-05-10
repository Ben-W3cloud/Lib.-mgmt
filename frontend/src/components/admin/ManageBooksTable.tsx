/**
 * =============================================================================
 * ManageBooksTable â€” Admin catalog management cards
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { Book } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useBooks } from "@/hooks/useBooks";
import { useAddBookCopies, useSetBookActive } from "@/hooks/useAdmin";
import { BookCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookCover } from "@/components/books/BookCover";
import { Plus, Power, BookOpen } from "lucide-react";

export function ManageBooksTable() {
  const { books, isLoading } = useBooks();
  const { addCopies, isPending: addingCopies } = useAddBookCopies();
  const { setActive, isPending: togglingActive } = useSetBookActive();

  const [copiesModal, setCopiesModal] = useState<Book | null>(null);
  const [additionalCopies, setAdditionalCopies] = useState("");

  const handleAddCopies = () => {
    if (!copiesModal) return;
    const count = parseInt(additionalCopies, 10);
    if (count <= 0) return;
    addCopies(copiesModal.id, count);
    setCopiesModal(null);
    setAdditionalCopies("");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No books yet"
        description="Add your first archive entry using the form above."
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {books.map((book) => (
          <div
            key={book.id.toString()}
            className="grid gap-4 rounded-2xl border border-white/10 bg-[#0f1729] p-4 md:grid-cols-[92px_1fr_auto]"
          >
            <BookCover
              title={book.title}
              author={book.author}
              isbn={book.isbn}
              seed={book.id.toString()}
              size="sm"
              className="max-w-[92px]"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-serif text-lg font-semibold text-[#edf0ff]">
                  {book.title}
                </h3>
                <Badge variant={book.active ? "success" : "danger"} dot>
                  {book.active ? "Active" : "Disabled"}
                </Badge>
              </div>
              <p className="mt-1 truncate text-sm text-[#8e9ab8]">
                {book.author} · ISBN: {book.isbn}
              </p>
              <p className="mt-2 text-xs text-[#7080a4]">
                {Number(book.availableCopies)}/{Number(book.totalCopies)} copies available
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCopiesModal(book)}
                disabled={addingCopies}
              >
                <Plus className="h-3.5 w-3.5" />
                Copies
              </Button>
              <Button
                variant={book.active ? "danger" : "gold"}
                size="sm"
                onClick={() => setActive(book.id, !book.active)}
                isLoading={togglingActive}
              >
                <Power className="h-3.5 w-3.5" />
                {book.active ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!copiesModal}
        onClose={() => setCopiesModal(null)}
        title={`Add Copies - ${copiesModal?.title ?? ""}`}
      >
        <div className="space-y-4 text-[#edf0ff]">
          <p className="text-sm text-[#8e9ab8]">
            Current copies: {copiesModal ? Number(copiesModal.totalCopies) : 0}
          </p>
          <Input
            label="Additional Copies"
            type="number"
            min="1"
            placeholder="5"
            value={additionalCopies}
            onChange={(e) => setAdditionalCopies(e.target.value)}
          />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setCopiesModal(null)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddCopies} isLoading={addingCopies} className="flex-1">
              Add Copies
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
