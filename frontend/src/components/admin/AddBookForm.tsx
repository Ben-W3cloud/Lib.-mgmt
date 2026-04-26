/**
 * =============================================================================
 * AddBookForm — Admin form to add a new book to the library
 * =============================================================================
 *
 * Maps to: addBook(string title, string author, string isbn, uint64 copies)
 * All fields are required (contract reverts on empty strings or 0 copies)
 */

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAddBook } from "@/hooks/useAdmin";
import { BookPlus } from "lucide-react";

export function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [copies, setCopies] = useState("");
  const { addBook, isPending, isSuccess, reset } = useAddBook();

  // Clear form on successful submission
  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setAuthor("");
      setIsbn("");
      setCopies("");
      // Reset the mutation state after a delay so the form is usable again
      setTimeout(() => reset(), 2000);
    }
  }, [isSuccess, reset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const copiesNum = parseInt(copies, 10);
    if (!title.trim() || !author.trim() || !isbn.trim() || copiesNum <= 0) return;
    addBook(title.trim(), author.trim(), isbn.trim(), copiesNum);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Title"
          placeholder="The Great Gatsby"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isPending}
        />
        <Input
          label="Author"
          placeholder="F. Scott Fitzgerald"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          disabled={isPending}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="ISBN"
          placeholder="978-0-7432-7356-5"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          required
          disabled={isPending}
        />
        <Input
          label="Number of Copies"
          type="number"
          min="1"
          placeholder="5"
          value={copies}
          onChange={(e) => setCopies(e.target.value)}
          required
          disabled={isPending}
          hint="Must be at least 1"
        />
      </div>
      <Button type="submit" isLoading={isPending} disabled={isSuccess} size="lg">
        <BookPlus className="w-4 h-4" />
        {isSuccess ? "Book Added! ✓" : "Add Book to Library"}
      </Button>
    </form>
  );
}
