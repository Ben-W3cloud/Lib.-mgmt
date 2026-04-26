/**
 * =============================================================================
 * UTILS — Helper functions for formatting and display logic
 * =============================================================================
 */

import { SOLIDITY_ERRORS } from "@/types";

// ---------------------------------------------------------------------------
// Address formatting — truncate 0x addresses for display
// ---------------------------------------------------------------------------
export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

// ---------------------------------------------------------------------------
// Duration formatting — convert seconds to human-readable
// ---------------------------------------------------------------------------
export function formatDuration(seconds: bigint | number): string {
  const secs = Number(seconds);
  if (secs <= 0) return "0 seconds";

  const days = Math.floor(secs / 86400);
  const hours = Math.floor((secs % 86400) / 3600);
  const mins = Math.floor((secs % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hr${hours !== 1 ? "s" : ""}`);
  if (mins > 0 && days === 0) parts.push(`${mins} min${mins !== 1 ? "s" : ""}`);

  return parts.join(", ") || "< 1 minute";
}

// ---------------------------------------------------------------------------
// Duration in days — for simpler display
// ---------------------------------------------------------------------------
export function secondsToDays(seconds: bigint | number): number {
  return Math.floor(Number(seconds) / 86400);
}

export function daysToSeconds(days: number): bigint {
  return BigInt(days * 86400);
}

// ---------------------------------------------------------------------------
// Timestamp formatting — convert unix timestamp to readable date
// ---------------------------------------------------------------------------
export function formatTimestamp(timestamp: bigint): string {
  if (timestamp === 0n) return "—";
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(timestamp: bigint): string {
  if (timestamp === 0n) return "—";
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Points formatting — show +/- with color intent
// ---------------------------------------------------------------------------
export function formatPoints(points: bigint): string {
  const n = Number(points);
  if (n > 0) return `+${n}`;
  return n.toString();
}

export function formatPointsBalance(balance: bigint): string {
  return Number(balance).toLocaleString();
}

// ---------------------------------------------------------------------------
// Due date helper — calculate remaining time or overdue status
// ---------------------------------------------------------------------------
export function getDueStatus(dueAt: bigint): {
  isOverdue: boolean;
  label: string;
  urgency: "safe" | "warning" | "danger";
} {
  const now = Math.floor(Date.now() / 1000);
  const due = Number(dueAt);
  const diff = due - now;

  if (diff < 0) {
    // Overdue
    const overdueDays = Math.ceil(Math.abs(diff) / 86400);
    return {
      isOverdue: true,
      label: `${overdueDays} day${overdueDays !== 1 ? "s" : ""} overdue`,
      urgency: "danger",
    };
  }

  const daysLeft = Math.floor(diff / 86400);
  if (daysLeft <= 2) {
    return {
      isOverdue: false,
      label: `Due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`,
      urgency: "warning",
    };
  }

  return {
    isOverdue: false,
    label: `Due in ${daysLeft} days`,
    urgency: "safe",
  };
}

// ---------------------------------------------------------------------------
// Error mapping — extract user-friendly message from contract errors
// ---------------------------------------------------------------------------
export function mapContractError(error: unknown): string {
  if (!error) return "An unknown error occurred.";

  const errorString = String(error);

  // Check for known Solidity custom error names in the error message
  for (const [errorName, message] of Object.entries(SOLIDITY_ERRORS)) {
    if (errorString.includes(errorName)) {
      return message;
    }
  }

  // Common wallet errors
  if (errorString.includes("User rejected") || errorString.includes("user rejected")) {
    return "Transaction was rejected by the user.";
  }
  if (errorString.includes("insufficient funds")) {
    return "Insufficient funds for gas fees.";
  }

  return "Transaction failed. Please try again.";
}

// ---------------------------------------------------------------------------
// Book availability percentage
// ---------------------------------------------------------------------------
export function availabilityPercentage(available: bigint, total: bigint): number {
  if (total === 0n) return 0;
  return Math.round((Number(available) / Number(total)) * 100);
}

// ---------------------------------------------------------------------------
// Class name utility — join conditional classes
// ---------------------------------------------------------------------------
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
