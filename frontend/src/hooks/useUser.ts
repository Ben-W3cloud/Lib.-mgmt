/**
 * =============================================================================
 * useUser — Hooks for user profile and role detection
 * =============================================================================
 *
 * Provides:
 * - useMyProfile() — current user's CustomerProfile
 * - useIsRegistered() — boolean check for registration
 * - useIsOwner() — checks if connected wallet is the contract owner
 * - useRegisterCustomer() — mutation to register/update profile
 */

"use client";

import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from "wagmi";
import { LIBRARY_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { CustomerProfile } from "@/types";
import toast from "react-hot-toast";
import { mapContractError } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

// ---------------------------------------------------------------------------
// useIsOwner — Checks if the connected wallet address matches contract.owner()
// Used for conditional rendering of admin features
// ---------------------------------------------------------------------------
export function useIsOwner() {
  const { address } = useAccount();

  const { data: owner, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LIBRARY_ABI,
    functionName: "owner",
  });

  return {
    isOwner: !!address && !!owner && address.toLowerCase() === (owner as string).toLowerCase(),
    ownerAddress: owner as `0x${string}` | undefined,
    isLoading,
  };
}

// ---------------------------------------------------------------------------
// useMyProfile — Fetches the connected user's CustomerProfile
// Returns undefined if user is not registered (catches the revert)
// ---------------------------------------------------------------------------
export function useMyProfile() {
  const { address, isConnected } = useAccount();

  const { data, isLoading, isError, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LIBRARY_ABI,
    functionName: "getMyProfile",
    query: {
      enabled: isConnected && !!address,
      retry: false, // Don't retry — CustomerNotRegistered is expected for new users
    },
  });

  // The contract reverts with CustomerNotRegistered if not registered.
  // We treat that as "no profile" rather than an error.
  const profile = isError ? undefined : (data as CustomerProfile | undefined);

  return {
    profile,
    isLoading,
    isRegistered: !!profile?.registered,
    refetch,
  };
}

// ---------------------------------------------------------------------------
// useIsRegistered — Simple boolean version of registration check
// ---------------------------------------------------------------------------
export function useIsRegistered() {
  const { isRegistered, isLoading } = useMyProfile();
  return { isRegistered, isLoading };
}

// ---------------------------------------------------------------------------
// useCustomerProfile — Admin function to look up any customer by address
// ---------------------------------------------------------------------------
export function useCustomerProfile(customerAddress?: `0x${string}`) {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: LIBRARY_ABI,
    functionName: "getCustomer",
    args: customerAddress ? [customerAddress] : undefined,
    query: {
      enabled: !!customerAddress,
      retry: false,
    },
  });

  return {
    profile: isError ? undefined : (data as CustomerProfile | undefined),
    isLoading,
    isError,
    refetch,
  };
}

// ---------------------------------------------------------------------------
// useRegisterCustomer — Mutation hook for self-registration
// Calls registerCustomer(fullName, email, memberCode, metadataURI)
// ---------------------------------------------------------------------------
export function useRegisterCustomer() {
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Trigger registration transaction
  const register = (fullName: string, email: string, memberCode: string, metadataURI: string) => {
    if (!fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }

    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: LIBRARY_ABI,
        functionName: "registerCustomer",
        args: [fullName, email, memberCode, metadataURI],
      },
      {
        onSuccess: () => {
          toast.success("Registration submitted! Waiting for confirmation...");
        },
        onError: (err) => {
          toast.error(mapContractError(err));
        },
      }
    );
  };

  // Invalidate profile cache when tx confirms
  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ["readContract"] });
  }

  return {
    register,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  };
}
