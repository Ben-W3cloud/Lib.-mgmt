/**
 * =============================================================================
 * TYPES — Strict TypeScript interfaces derived from LibraryManagement.sol
 * =============================================================================
 *
 * Every type here mirrors a Solidity struct or config variable exactly.
 * We use bigint for uint256/int256 and number for uint32/uint64 values
 * that are small enough. Wagmi/viem return bigint for all Solidity uints,
 * so we keep them as bigint and convert only in display logic.
 */

// ---------------------------------------------------------------------------
// Book — mirrors the Book struct in the contract
// ---------------------------------------------------------------------------
export interface Book {
  id: bigint;
  title: string;
  author: string;
  isbn: string;
  totalCopies: bigint;
  availableCopies: bigint;
  active: boolean;
  createdAt: bigint; // unix timestamp (seconds)
  updatedAt: bigint;
}

// ---------------------------------------------------------------------------
// CustomerProfile — mirrors the CustomerProfile struct
// ---------------------------------------------------------------------------
export interface CustomerProfile {
  registered: boolean;
  fullName: string;
  email: string;
  memberCode: string;
  metadataURI: string;
  joinedAt: bigint;
  updatedAt: bigint;
  activeLoansCount: number; // uint32 — safe as JS number
  lifetimeBorrows: bigint;
  lifetimeReturns: bigint;
  totalPointsEarned: bigint;
  totalPointsPenalized: bigint;
  pointsBalance: bigint; // int256 — can be negative
}

// ---------------------------------------------------------------------------
// Loan — mirrors the Loan struct
// ---------------------------------------------------------------------------
export interface Loan {
  id: bigint;
  bookId: bigint;
  customer: `0x${string}`;
  borrowedAt: bigint;
  dueAt: bigint;
  returnedAt: bigint;
  returned: boolean;
  pointsDelta: bigint; // int256 — positive for rewards, negative for penalties
}

// ---------------------------------------------------------------------------
// Enriched types — Loan combined with its Book for display purposes
// ---------------------------------------------------------------------------
export interface EnrichedLoan extends Loan {
  book?: Book;
}

// ---------------------------------------------------------------------------
// Contract configuration — public state variables
// ---------------------------------------------------------------------------
export interface ContractConfig {
  maxBorrowDuration: bigint; // in seconds
  maxActiveLoansPerCustomer: number;
  borrowRewardPoints: number;
  onTimeReturnRewardPoints: number;
  latePenaltyPerDay: number;
}

// ---------------------------------------------------------------------------
// Solidity custom error names — used to map errors to user-friendly messages
// ---------------------------------------------------------------------------
export const SOLIDITY_ERRORS: Record<string, string> = {
  NotOwner: "You are not the contract owner.",
  EmptyTextField: "Required text fields cannot be empty.",
  BookNotFound: "The requested book does not exist.",
  BookInactive: "This book is currently disabled for borrowing.",
  NoAvailableCopies: "No copies are currently available.",
  CustomerNotRegistered: "You must register before performing this action.",
  LoanNotFound: "The specified loan could not be found.",
  LoanAlreadyClosed: "This loan has already been returned.",
  NotLoanBorrower: "Only the original borrower can return this book.",
  ZeroAddress: "Address cannot be zero.",
  BorrowDurationTooLong: "Requested borrow duration exceeds the maximum allowed.",
  MaxActiveLoansReached: "You have reached the maximum number of active loans.",
};

// ---------------------------------------------------------------------------
// Transaction states — for UI feedback during blockchain transactions
// ---------------------------------------------------------------------------
export type TransactionStatus = "idle" | "confirming" | "pending" | "success" | "error";

export interface TransactionState {
  status: TransactionStatus;
  hash?: `0x${string}`;
  error?: string;
}
