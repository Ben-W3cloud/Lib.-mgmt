/**
 * =============================================================================
 * ManageBooksTable — Admin table for managing existing books
 * =============================================================================
 *
 * Features:
 * - List all books (including inactive)
 * - Toggle active/inactive status (setBookActive)
 * - Add copies to a book (addBookCopies)
 * - View availability stats
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
import { Plus, Power, BookOpen } from "lucide-react";

export function ManageBooksTable() {
  const { books, isLoading } = useBooks();
  const { addCopies, isPending: addingCopies } = useAddBookCopies();
  const { setActive, isPending: togglingActive } = useSetBookActive();

  // Modal state for adding copies
  const [copiesModal, setCopiesModal] = useState<Book | null>(null);
  const [additionalCopies, setAdditionalCopies] = useState("");

  // Handle adding copies
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
      <div className="space-y-3">
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
        description="Add your first book using the form above."
      />
    );
  }

  return (
    <>
      <div className="space-y-3">
        {books.map((book) => (
          <div
            key={book.id.toString()}
            className="bg-cream rounded-xl border border-leather-brown/10 p-4 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow"
          >
            {/* Book info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-serif font-semibold text-dark-walnut truncate">
                  {book.title}
                </h3>
                <Badge variant={book.active ? "success" : "danger"} dot>
                  {book.active ? "Active" : "Disabled"}
                </Badge>
              </div>
              <p className="text-sm text-slate truncate">
                {book.author} · ISBN: {book.isbn}
              </p>
              <p className="text-xs text-slate/60 mt-1">
                {Number(book.availableCopies)}/{Number(book.totalCopies)} copies available
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCopiesModal(book)}
                disabled={addingCopies}
              >
                <Plus className="w-3.5 h-3.5" />
                Copies
              </Button>
              <Button
                variant={book.active ? "danger" : "gold"}
                size="sm"
                onClick={() => setActive(book.id, !book.active)}
                isLoading={togglingActive}
              >
                <Power className="w-3.5 h-3.5" />
                {book.active ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add copies modal */}
      <Modal
        isOpen={!!copiesModal}
        onClose={() => setCopiesModal(null)}
        title={`Add Copies — ${copiesModal?.title}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate">
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
