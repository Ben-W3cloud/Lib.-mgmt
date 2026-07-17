"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { contractConfig, IS_CONTRACT_CONFIGURED } from "@/lib/contract";
import type { Book, CustomerProfile, Loan } from "@/lib/types";

export function useBooks() {
  const countQuery = useReadContract({
    ...contractConfig,
    functionName: "getBooksCount",
    query: { enabled: IS_CONTRACT_CONFIGURED },
  });

  const count = typeof countQuery.data === "bigint" ? Number(countQuery.data) : 0;
  const ids = Array.from({ length: count }, (_, index) => BigInt(index + 1));

  const booksQuery = useReadContracts({
    contracts: ids.map((id) => ({ ...contractConfig, functionName: "getBook", args: [id] })),
    query: { enabled: IS_CONTRACT_CONFIGURED && ids.length > 0 },
  });

  const books = (booksQuery.data ?? [])
    .map((item) => (item.status === "success" ? (item.result as unknown as Book) : undefined))
    .filter((book): book is Book => Boolean(book));

  return {
    books,
    count,
    isLoading: countQuery.isLoading || booksQuery.isLoading,
    isError: countQuery.isError || booksQuery.isError,
    error: countQuery.error ?? booksQuery.error,
    refetch: () => {
      void countQuery.refetch();
      void booksQuery.refetch();
    },
  };
}

export function useProfile(address?: `0x${string}`) {
  return useReadContract({
    ...contractConfig,
    functionName: "getCustomer",
    args: address ? [address] : undefined,
    query: { enabled: IS_CONTRACT_CONFIGURED && Boolean(address), retry: false },
  }) as ReturnType<typeof useReadContract> & { data?: CustomerProfile };
}

export function useLoanIds(enabled: boolean, account?: `0x${string}`) {
  const active = useReadContract({
    ...contractConfig,
    functionName: "getMyActiveLoanIds",
    account,
    query: { enabled: IS_CONTRACT_CONFIGURED && enabled && Boolean(account), retry: false },
  });
  const history = useReadContract({
    ...contractConfig,
    functionName: "getMyLoanHistoryIds",
    account,
    query: { enabled: IS_CONTRACT_CONFIGURED && enabled && Boolean(account), retry: false },
  });
  return { active, history };
}

export function useLoans(ids: readonly bigint[] | undefined, enabled: boolean) {
  const loansQuery = useReadContracts({
    contracts: (ids ?? []).map((id) => ({ ...contractConfig, functionName: "getLoan", args: [id] })),
    query: { enabled: IS_CONTRACT_CONFIGURED && enabled && Boolean(ids?.length), retry: false },
  });

  const loans = (loansQuery.data ?? [])
    .map((item) => (item.status === "success" ? (item.result as unknown as Loan) : undefined))
    .filter((loan): loan is Loan => Boolean(loan));

  return { ...loansQuery, loans };
}

