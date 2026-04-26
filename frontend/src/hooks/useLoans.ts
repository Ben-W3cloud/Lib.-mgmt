/**
 * =============================================================================
 * useLoans — Hooks for reading loan data (active + history)
 * =============================================================================
 *
 * Strategy:
 * 1. Fetch loan IDs via getMyActiveLoanIds() / getMyLoanHistoryIds()
 * 2. For each loan ID, call getLoan(id) via multicall
 * 3. Optionally enrich each loan with its Book data
 */

"use client";

import { useReadContract, useReadContracts, useAccount } from "wagmi";
import { LIBRARY_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { Loan, EnrichedLoan, Book } from "@/types";
import { useMemo } from "react";

// ---------------------------------------------------------------------------
// useMyActiveLoanIds — Fetches the current user's active loan IDs
// ---------------------------------------------------------------------------
export function useMyActiveLoanIds() {
  const { isConnected } = useAccount();

  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LIBRARY_ABI,
    functionName: "getMyActiveLoanIds",
    query: { enabled: isConnected },
  });

  return {
    loanIds: (data as bigint[]) ?? [],
    isLoading,
    refetch,
  };
}

// ---------------------------------------------------------------------------
// useMyLoanHistoryIds — Fetches the current user's full loan history IDs
// ---------------------------------------------------------------------------
export function useMyLoanHistoryIds() {
  const { isConnected } = useAccount();

  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LIBRARY_ABI,
    functionName: "getMyLoanHistoryIds",
    query: { enabled: isConnected },
  });

  return {
    loanIds: (data as bigint[]) ?? [],
    isLoading,
    refetch,
  };
}

// ---------------------------------------------------------------------------
// useLoansFromIds — Given an array of loan IDs, fetch all Loan structs
// Uses multicall for efficiency
// ---------------------------------------------------------------------------
export function useLoansFromIds(loanIds: bigint[]) {
  const contracts = useMemo(() => {
    return loanIds.map((id) => ({
      address: CONTRACT_ADDRESS,
      abi: LIBRARY_ABI,
      functionName: "getLoan" as const,
      args: [id] as const,
    }));
  }, [loanIds]);

  const { data: results, isLoading } = useReadContracts({
    contracts,
    query: { enabled: loanIds.length > 0 },
  });

  const loans: Loan[] = useMemo(() => {
    if (!results) return [];
    return results
      .filter((r) => r.status === "success" && r.result)
      .map((r) => r.result as unknown as Loan);
  }, [results]);

  return { loans, isLoading };
}

// ---------------------------------------------------------------------------
// useEnrichedLoans — Loans enriched with their associated Book data
// Two-step process:
// 1. Fetch all Loans
// 2. Fetch all unique Books referenced by those loans
// ---------------------------------------------------------------------------
export function useEnrichedLoans(loanIds: bigint[]) {
  const { loans, isLoading: loansLoading } = useLoansFromIds(loanIds);

  // Collect unique book IDs from all loans to fetch
  const bookIds = useMemo(() => {
    const ids = new Set<bigint>();
    loans.forEach((l) => ids.add(l.bookId));
    return Array.from(ids);
  }, [loans]);

  // Fetch all referenced books via multicall
  const bookContracts = useMemo(() => {
    return bookIds.map((id) => ({
      address: CONTRACT_ADDRESS,
      abi: LIBRARY_ABI,
      functionName: "getBook" as const,
      args: [id] as const,
    }));
  }, [bookIds]);

  const { data: bookResults, isLoading: booksLoading } = useReadContracts({
    contracts: bookContracts,
    query: { enabled: bookIds.length > 0 },
  });

  // Build a lookup map: bookId → Book
  const bookMap = useMemo(() => {
    const map = new Map<string, Book>();
    if (!bookResults) return map;
    bookResults.forEach((r) => {
      if (r.status === "success" && r.result) {
        const book = r.result as unknown as Book;
        map.set(book.id.toString(), book);
      }
    });
    return map;
  }, [bookResults]);

  // Combine Loan + Book data
  const enrichedLoans: EnrichedLoan[] = useMemo(() => {
    return loans.map((loan) => ({
      ...loan,
      book: bookMap.get(loan.bookId.toString()),
    }));
  }, [loans, bookMap]);

  return {
    loans: enrichedLoans,
    isLoading: loansLoading || booksLoading,
  };
}

// ---------------------------------------------------------------------------
// useMyActiveLoans — Convenience hook: active loan IDs → enriched loans
// ---------------------------------------------------------------------------
export function useMyActiveLoans() {
  const { loanIds, isLoading: idsLoading, refetch } = useMyActiveLoanIds();
  const { loans, isLoading: loansLoading } = useEnrichedLoans(loanIds);

  return {
    loans,
    isLoading: idsLoading || loansLoading,
    refetch,
  };
}

// ---------------------------------------------------------------------------
// useMyLoanHistory — Convenience hook: history loan IDs → enriched loans
// ---------------------------------------------------------------------------
export function useMyLoanHistory() {
  const { loanIds, isLoading: idsLoading, refetch } = useMyLoanHistoryIds();
  const { loans, isLoading: loansLoading } = useEnrichedLoans(loanIds);

  return {
    loans,
    isLoading: idsLoading || loansLoading,
    refetch,
  };
}
