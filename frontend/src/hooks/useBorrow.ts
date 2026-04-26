/**
 * =============================================================================
 * useBorrow — Mutation hooks for borrowing and returning books
 * =============================================================================
 *
 * Handles the full transaction lifecycle:
 * 1. Submit transaction
 * 2. Wait for confirmation
 * 3. Show toast notifications
 * 4. Invalidate relevant caches
 */

"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { LIBRARY_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { mapContractError } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// useBorrowBook — Mutation to call borrowBook(bookId, requestedDuration)
//
// requestedDuration must be in seconds and <= maxBorrowDuration.
// The contract awards borrowRewardPoints to the customer on borrow.
// ---------------------------------------------------------------------------
export function useBorrowBook() {
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const toastShown = useRef(false);

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const borrow = (bookId: bigint, durationSeconds: bigint) => {
    toastShown.current = false;
    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: LIBRARY_ABI,
        functionName: "borrowBook",
        args: [bookId, durationSeconds],
      },
      {
        onSuccess: () => {
          toast.success("Borrow transaction submitted!");
        },
        onError: (err) => {
          toast.error(mapContractError(err));
        },
      }
    );
  };

  // When transaction is confirmed, invalidate caches so UI updates
  useEffect(() => {
    if (isSuccess && !toastShown.current) {
      toastShown.current = true;
      toast.success("Book borrowed successfully! 📚");
      queryClient.invalidateQueries({ queryKey: ["readContract"] });
      queryClient.invalidateQueries({ queryKey: ["readContracts"] });
    }
  }, [isSuccess, queryClient]);

  return {
    borrow,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  };
}

// ---------------------------------------------------------------------------
// useReturnBook — Mutation to call returnBook(loanId)
//
// The contract calculates whether the return is on-time or late:
// - On-time: awards onTimeReturnRewardPoints
// - Late: deducts latePenaltyPerDay × days late
// ---------------------------------------------------------------------------
export function useReturnBook() {
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const toastShown = useRef(false);

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const returnBook = (loanId: bigint) => {
    toastShown.current = false;
    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: LIBRARY_ABI,
        functionName: "returnBook",
        args: [loanId],
      },
      {
        onSuccess: () => {
          toast.success("Return transaction submitted!");
        },
        onError: (err) => {
          toast.error(mapContractError(err));
        },
      }
    );
  };

  useEffect(() => {
    if (isSuccess && !toastShown.current) {
      toastShown.current = true;
      toast.success("Book returned successfully! ✓");
      queryClient.invalidateQueries({ queryKey: ["readContract"] });
      queryClient.invalidateQueries({ queryKey: ["readContracts"] });
    }
  }, [isSuccess, queryClient]);

  return {
    returnBook,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  };
}
