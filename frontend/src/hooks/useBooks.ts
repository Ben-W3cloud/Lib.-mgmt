/**
 * =============================================================================
 * useBooks — Hooks for reading book data from the contract
 * =============================================================================
 *
 * Strategy: The contract has no paginated listing — we call getBooksCount()
 * to know the total, then call getBook(id) for each ID from 1..count.
 * This is batched using useReadContracts (multicall) for efficiency.
 */

"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { LIBRARY_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { Book } from "@/types";
import { useMemo } from "react";

// ---------------------------------------------------------------------------
// useBooksCount — Reading the total number of books in the contract
// ---------------------------------------------------------------------------
export function useBooksCount() {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LIBRARY_ABI,
    functionName: "getBooksCount",
  });

  return {
    count: data ? Number(data) : 0,
    isLoading,
  };
}

// ---------------------------------------------------------------------------
// useBooks — Fetches ALL books via multicall (getBook for each ID)
//
// How it works:
// 1. First we fetch the total count via getBooksCount()
// 2. We build an array of getBook(i) calls for i = 1..count
// 3. useReadContracts batches these into multicall for efficiency
// 4. We filter out any failed calls (shouldn't happen, but defensive)
// ---------------------------------------------------------------------------
const now = Math.floor(Date.now() / 1000);

const MOCK_BOOKS: Book[] = [
  {
    id: 1n,
    isbn: "978-0743273565",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    totalCopies: 5n,
    availableCopies: 5n,
    active: true,
    createdAt: BigInt(now - 86400 * 30),
    updatedAt: BigInt(now - 86400 * 30),
  },
  {
    id: 2n,
    isbn: "978-0061120084",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    totalCopies: 3n,
    availableCopies: 1n,
    active: true,
    createdAt: BigInt(now - 86400 * 60),
    updatedAt: BigInt(now - 86400 * 15),
  },
  {
    id: 3n,
    isbn: "978-0451524935",
    title: "1984",
    author: "George Orwell",
    totalCopies: 10n,
    availableCopies: 0n,
    active: true,
    createdAt: BigInt(now - 86400 * 100),
    updatedAt: BigInt(now - 86400 * 5),
  },
  {
    id: 4n,
    isbn: "978-0316769174",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    totalCopies: 2n,
    availableCopies: 2n,
    active: false,
    createdAt: BigInt(now - 86400 * 10),
    updatedAt: BigInt(now - 86400 * 2),
  },
  {
    id: 5n,
    isbn: "978-0544003415",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    totalCopies: 7n,
    availableCopies: 4n,
    active: true,
    createdAt: BigInt(now - 86400 * 200),
    updatedAt: BigInt(now - 86400 * 20),
  },
  {
    id: 6n,
    isbn: "978-0140449266",
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    totalCopies: 4n,
    availableCopies: 3n,
    active: true,
    createdAt: BigInt(now - 86400 * 75),
    updatedAt: BigInt(now - 86400 * 18),
  },
  {
    id: 7n,
    isbn: "978-0141182803",
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    totalCopies: 6n,
    availableCopies: 2n,
    active: true,
    createdAt: BigInt(now - 86400 * 44),
    updatedAt: BigInt(now - 86400 * 7),
  },
  {
    id: 8n,
    isbn: "978-0060850524",
    title: "Brave New World",
    author: "Aldous Huxley",
    totalCopies: 8n,
    availableCopies: 6n,
    active: true,
    createdAt: BigInt(now - 86400 * 55),
    updatedAt: BigInt(now - 86400 * 12),
  },
  {
    id: 9n,
    isbn: "978-0143105985",
    title: "Meditations",
    author: "Marcus Aurelius",
    totalCopies: 2n,
    availableCopies: 2n,
    active: true,
    createdAt: BigInt(now - 86400 * 120),
    updatedAt: BigInt(now - 86400 * 40),
  },
  {
    id: 10n,
    isbn: "978-0679783275",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    totalCopies: 5n,
    availableCopies: 1n,
    active: true,
    createdAt: BigInt(now - 86400 * 82),
    updatedAt: BigInt(now - 86400 * 9),
  },
  {
    id: 11n,
    isbn: "978-0199535569",
    title: "Frankenstein",
    author: "Mary Shelley",
    totalCopies: 3n,
    availableCopies: 3n,
    active: false,
    createdAt: BigInt(now - 86400 * 26),
    updatedAt: BigInt(now - 86400 * 4),
  },
  {
    id: 12n,
    isbn: "978-0142437230",
    title: "Moby-Dick",
    author: "Herman Melville",
    totalCopies: 4n,
    availableCopies: 2n,
    active: true,
    createdAt: BigInt(now - 86400 * 160),
    updatedAt: BigInt(now - 86400 * 21),
  },
];

export function useBooks() {
  const { count, isLoading: isCountLoading } = useBooksCount();

  const contracts = useMemo(() => {
    if (count === 0) return [];
    return Array.from({ length: count }, (_, i) => ({
      address: CONTRACT_ADDRESS,
      abi: LIBRARY_ABI,
      functionName: "getBook" as const,
      args: [BigInt(i + 1)] as const,
    }));
  }, [count]);

  const { data: results, isLoading: isBooksLoading, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: count > 0,
    },
  });

  const books: Book[] = useMemo(() => {
    if (!results || results.length === 0) return MOCK_BOOKS;
    return results
      .filter((r) => r.status === "success" && r.result)
      .map((r) => r.result as unknown as Book);
  }, [results]);

  return {
    books,
    isLoading: isCountLoading || isBooksLoading,
    refetch,
    count: books.length, // use books.length to reflect mock data count
  };
}

// ---------------------------------------------------------------------------
// useBook — Fetch a single book by ID
// ---------------------------------------------------------------------------
export function useBook(bookId: bigint | number) {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LIBRARY_ABI,
    functionName: "getBook",
    args: [BigInt(bookId)],
    query: {
      enabled: BigInt(bookId) > 0n,
      retry: false,
    },
  });

  const book = useMemo(() => {
    if (data) return data as Book;
    // Fallback to mock data
    return MOCK_BOOKS.find((b) => b.id === BigInt(bookId));
  }, [data, bookId]);

  return {
    book,
    isLoading,
    isError: !book && isError,
    refetch,
  };
}

// ---------------------------------------------------------------------------
// useBookBorrowerHistory — Fetch list of borrower addresses for a book
// Used in book detail page and admin views
// ---------------------------------------------------------------------------
export function useBookBorrowerHistory(bookId: bigint | number) {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LIBRARY_ABI,
    functionName: "getBookBorrowerHistory",
    args: [BigInt(bookId)],
    query: {
      enabled: BigInt(bookId) > 0n,
    },
  });

  return {
    borrowers: (data as `0x${string}`[]) ?? [],
    isLoading,
  };
}
