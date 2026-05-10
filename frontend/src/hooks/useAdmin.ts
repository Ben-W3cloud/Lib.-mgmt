/**
 * =============================================================================
 * useAdmin â€” Hooks for all admin (owner-only) contract operations
 * =============================================================================
 */

"use client";

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContracts,
} from "wagmi";
import { LIBRARY_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { ContractConfig } from "@/types";
import { mapContractError } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect, useMemo, useRef } from "react";

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

function useAdminMutation(successMessage: string) {
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const toastShownRef = useRef(false);

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.success(successMessage);
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
    toastShownRef,
  };
}

export function useAddBook() {
  const { writeContract, isPending, isSuccess, error, reset, toastShownRef } =
    useAdminMutation("Book added successfully!");

  const addBook = (title: string, author: string, isbn: string, copies: number) => {
    toastShownRef.current = false;
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

export function useAddBookCopies() {
  const { writeContract, isPending, isSuccess, error, reset, toastShownRef } =
    useAdminMutation("Copies added successfully!");

  const addCopies = (bookId: bigint, additionalCopies: number) => {
    toastShownRef.current = false;
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

export function useSetBookActive() {
  const { writeContract, isPending, isSuccess, error, reset, toastShownRef } =
    useAdminMutation("Book status updated!");

  const setActive = (bookId: bigint, active: boolean) => {
    toastShownRef.current = false;
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

export function useSetPointRules() {
  const { writeContract, isPending, isSuccess, error, reset, toastShownRef } =
    useAdminMutation("Point rules updated!");

  const setPointRules = (borrowReward: number, onTimeReward: number, latePenalty: number) => {
    toastShownRef.current = false;
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

export function useSetBorrowRules() {
  const { writeContract, isPending, isSuccess, error, reset, toastShownRef } =
    useAdminMutation("Borrow rules updated!");

  const setBorrowRules = (maxDurationSeconds: bigint, maxActiveLoans: number) => {
    toastShownRef.current = false;
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

export function useOwnerUpsertCustomer() {
  const { writeContract, isPending, isSuccess, error, reset, toastShownRef } =
    useAdminMutation("Customer profile updated!");

  const upsertCustomer = (
    customer: `0x${string}`,
    fullName: string,
    email: string,
    memberCode: string,
    metadataURI: string
  ) => {
    toastShownRef.current = false;
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
