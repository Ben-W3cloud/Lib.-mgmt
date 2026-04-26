/**
 * =============================================================================
 * useAdmin — Hooks for all admin (owner-only) contract operations
 * =============================================================================
 *
 * Every admin hook:
 * - Checks that the connected wallet is the owner (enforced by contract)
 * - Handles transaction lifecycle (submit → confirm → toast → cache invalidation)
 * - Maps Solidity errors to user-friendly messages
 */

"use client";

import { useWriteContract, useWaitForTransactionReceipt, useReadContracts } from "wagmi";
import { LIBRARY_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { ContractConfig } from "@/types";
import { mapContractError } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect, useMemo, useRef } from "react";

// ---------------------------------------------------------------------------
// useContractConfig — Reads all public config variables in one multicall
// Returns: maxBorrowDuration, maxActiveLoansPerCustomer, point rules
// ---------------------------------------------------------------------------
export function useContractConfig() {
  const { data: results, isLoading, refetch } = useReadContracts({
    contracts: [
      { address: CONTRACT_ADDRESS, abi: LIBRARY_ABI, functionName: "maxBorrowDuration" },
      { address: CONTRACT_ADDRESS, abi: LIBRARY_ABI, functionName: "maxActiveLoansPerCustomer" },
      { address: CONTRACT_ADDRESS, abi: LIBRARY_ABI, functionName: "borrowRewardPoints" },
      { address: CONTRACT_ADDRESS, abi: LIBRARY_ABI, functionName: "onTimeReturnRewardPoints" },
      { address: CONTRACT_ADDRESS, abi: LIBRARY_ABI, functionName: "latePenaltyPerDay" },
    ],
  });

  const config: ContractConfig | undefined = useMemo(() => {
    if (!results || results.some((r) => r.status !== "success")) return undefined;
    return {
      maxBorrowDuration: results[0].result as bigint,
      maxActiveLoansPerCustomer: Number(results[1].result),
      borrowRewardPoints: Number(results[2].result),
      onTimeReturnRewardPoints: Number(results[3].result),
      latePenaltyPerDay: Number(results[4].result),
    };
  }, [results]);

  return { config, isLoading, refetch };
}

// ---------------------------------------------------------------------------
// Generic admin mutation factory — DRY pattern for all admin write operations
// ---------------------------------------------------------------------------
function useAdminMutation(successMessage: string) {
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const toastShown = useRef(false);

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess && !toastShown.current) {
      toastShown.current = true;
      toast.success(successMessage);
      // Invalidate all contract read queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["readContract"] });
      queryClient.invalidateQueries({ queryKey: ["readContracts"] });
    }
  }, [isSuccess, queryClient, successMessage]);

  return {
    writeContract,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    reset,
    toastShown,
  };
}

// ---------------------------------------------------------------------------
// useAddBook — Calls addBook(title, author, isbn, copies)
// ---------------------------------------------------------------------------
export function useAddBook() {
  const { writeContract, isPending, isSuccess, error, reset, toastShown } =
    useAdminMutation("Book added successfully! 📖");

  const addBook = (title: string, author: string, isbn: string, copies: number) => {
    toastShown.current = false;
    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: LIBRARY_ABI,
        functionName: "addBook",
        args: [title, author, isbn, BigInt(copies)],
      },
      {
        onSuccess: () => toast.success("Add book transaction submitted."),
        onError: (err) => toast.error(mapContractError(err)),
      }
    );
  };

  return { addBook, isPending, isSuccess, error, reset };
}

// ---------------------------------------------------------------------------
// useAddBookCopies — Calls addBookCopies(bookId, additionalCopies)
// ---------------------------------------------------------------------------
export function useAddBookCopies() {
  const { writeContract, isPending, isSuccess, error, reset, toastShown } =
    useAdminMutation("Copies added successfully!");

  const addCopies = (bookId: bigint, additionalCopies: number) => {
    toastShown.current = false;
    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: LIBRARY_ABI,
        functionName: "addBookCopies",
        args: [bookId, BigInt(additionalCopies)],
      },
      {
        onSuccess: () => toast.success("Transaction submitted."),
        onError: (err) => toast.error(mapContractError(err)),
      }
    );
  };

  return { addCopies, isPending, isSuccess, error, reset };
}

// ---------------------------------------------------------------------------
// useSetBookActive — Calls setBookActive(bookId, active)
// ---------------------------------------------------------------------------
export function useSetBookActive() {
  const { writeContract, isPending, isSuccess, error, reset, toastShown } =
    useAdminMutation("Book status updated!");

  const setActive = (bookId: bigint, active: boolean) => {
    toastShown.current = false;
    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: LIBRARY_ABI,
        functionName: "setBookActive",
        args: [bookId, active],
      },
      {
        onSuccess: () => toast.success("Status update submitted."),
        onError: (err) => toast.error(mapContractError(err)),
      }
    );
  };

  return { setActive, isPending, isSuccess, error, reset };
}

// ---------------------------------------------------------------------------
// useSetPointRules — Calls setPointRules(borrow, onTimeReturn, latePenalty)
// ---------------------------------------------------------------------------
export function useSetPointRules() {
  const { writeContract, isPending, isSuccess, error, reset, toastShown } =
    useAdminMutation("Point rules updated!");

  const setPointRules = (borrowReward: number, onTimeReward: number, latePenalty: number) => {
    toastShown.current = false;
    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: LIBRARY_ABI,
        functionName: "setPointRules",
        args: [borrowReward, onTimeReward, latePenalty],
      },
      {
        onSuccess: () => toast.success("Point rules update submitted."),
        onError: (err) => toast.error(mapContractError(err)),
      }
    );
  };

  return { setPointRules, isPending, isSuccess, error, reset };
}

// ---------------------------------------------------------------------------
// useSetBorrowRules — Calls setBorrowRules(maxDuration, maxActiveLoans)
// ---------------------------------------------------------------------------
export function useSetBorrowRules() {
  const { writeContract, isPending, isSuccess, error, reset, toastShown } =
    useAdminMutation("Borrow rules updated!");

  const setBorrowRules = (maxDurationSeconds: bigint, maxActiveLoans: number) => {
    toastShown.current = false;
    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: LIBRARY_ABI,
        functionName: "setBorrowRules",
        args: [maxDurationSeconds, maxActiveLoans],
      },
      {
        onSuccess: () => toast.success("Borrow rules update submitted."),
        onError: (err) => toast.error(mapContractError(err)),
      }
    );
  };

  return { setBorrowRules, isPending, isSuccess, error, reset };
}

// ---------------------------------------------------------------------------
// useOwnerUpsertCustomer — Admin registers/updates a customer
// Calls ownerUpsertCustomer(address, fullName, email, memberCode, metadataURI)
// ---------------------------------------------------------------------------
export function useOwnerUpsertCustomer() {
  const { writeContract, isPending, isSuccess, error, reset, toastShown } =
    useAdminMutation("Customer profile updated!");

  const upsertCustomer = (
    customer: `0x${string}`,
    fullName: string,
    email: string,
    memberCode: string,
    metadataURI: string
  ) => {
    toastShown.current = false;
    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: LIBRARY_ABI,
        functionName: "ownerUpsertCustomer",
        args: [customer, fullName, email, memberCode, metadataURI],
      },
      {
        onSuccess: () => toast.success("Customer update submitted."),
        onError: (err) => toast.error(mapContractError(err)),
      }
    );
  };

  return { upsertCustomer, isPending, isSuccess, error, reset };
}
