import type { Address } from "viem";

export type Book = {
  id: bigint;
  title: string;
  author: string;
  isbn: string;
  totalCopies: bigint | number;
  availableCopies: bigint | number;
  active: boolean;
  lister: Address;
  createdAt: bigint | number;
  updatedAt: bigint | number;
};

export type CustomerProfile = {
  registered: boolean;
  fullName: string;
  email: string;
  memberCode: string;
  metadataURI: string;
  joinedAt: bigint | number;
  updatedAt: bigint | number;
  activeLoansCount: bigint | number;
  lifetimeBorrows: bigint | number;
  lifetimeReturns: bigint | number;
  totalPointsEarned: bigint;
  totalPointsPenalized: bigint;
  pointsBalance: bigint;
};

export type Loan = {
  id: bigint;
  bookId: bigint;
  customer: Address;
  borrowedAt: bigint | number;
  dueAt: bigint | number;
  returnedAt: bigint | number;
  returned: boolean;
  pointsDelta: bigint;
};

export type TxState = "idle" | "pending" | "confirming" | "success" | "error";

export function asNumber(value: bigint | number | undefined) {
  if (typeof value === "bigint") return Number(value);
  return value ?? 0;
}

export function sameAddress(a?: string, b?: string) {
  return Boolean(a && b && a.toLowerCase() === b.toLowerCase());
}

export function shortAddress(address?: string) {
  if (!address) return "No wallet";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function dateFromSeconds(value: bigint | number | undefined) {
  const seconds = asNumber(value);
  if (!seconds) return "Not set";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(seconds * 1000));
}

export function explainError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
  if (message.includes("CustomerNotRegistered")) return "Register your profile before borrowing.";
  if (message.includes("NoAvailableCopies")) return "No copies are available for this book.";
  if (message.includes("BookInactive")) return "This listing is paused by its owner.";
  if (message.includes("NotBookLister")) return "Only the listing owner can change this book.";
  if (message.includes("MaxActiveLoansReached")) return "You reached the active-loan limit.";
  if (message.includes("BorrowDurationTooLong")) return "Choose a shorter borrow duration.";
  if (message.includes("User rejected")) return "Wallet rejected the transaction.";
  return message.split("\n")[0] || "Transaction failed.";
}

