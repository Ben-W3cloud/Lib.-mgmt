/**
 * =============================================================================
 * CONTRACT — ABI and address configuration for LibraryManagement.sol
 * =============================================================================
 *
 * The ABI is hand-parsed from the Solidity source to include every public
 * function, event, and custom error. This is the SINGLE source of truth
 * for all frontend-to-contract interactions.
 *
 * Contract address is loaded from environment variables so we can easily
 * switch between testnet and mainnet deployments.
 */

// ---------------------------------------------------------------------------
// Contract Address — set via .env.local
// ---------------------------------------------------------------------------
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

// ---------------------------------------------------------------------------
// Full ABI — every function, event, and error from LibraryManagement.sol
// ---------------------------------------------------------------------------
export const LIBRARY_ABI = [
  // =========================================================================
  // ERRORS
  // =========================================================================
  { type: "error", name: "NotOwner", inputs: [] },
  { type: "error", name: "EmptyTextField", inputs: [] },
  { type: "error", name: "BookNotFound", inputs: [] },
  { type: "error", name: "BookInactive", inputs: [] },
  { type: "error", name: "NoAvailableCopies", inputs: [] },
  { type: "error", name: "CustomerNotRegistered", inputs: [] },
  { type: "error", name: "LoanNotFound", inputs: [] },
  { type: "error", name: "LoanAlreadyClosed", inputs: [] },
  { type: "error", name: "NotLoanBorrower", inputs: [] },
  { type: "error", name: "ZeroAddress", inputs: [] },
  { type: "error", name: "BorrowDurationTooLong", inputs: [] },
  { type: "error", name: "MaxActiveLoansReached", inputs: [] },

  // =========================================================================
  // EVENTS
  // =========================================================================
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      { name: "oldOwner", type: "address", indexed: true },
      { name: "newOwner", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "BookAdded",
    inputs: [
      { name: "bookId", type: "uint256", indexed: true },
      { name: "title", type: "string", indexed: false },
      { name: "author", type: "string", indexed: false },
      { name: "isbn", type: "string", indexed: false },
      { name: "totalCopies", type: "uint64", indexed: false },
      { name: "availableCopies", type: "uint64", indexed: false },
    ],
  },
  {
    type: "event",
    name: "BookCopiesUpdated",
    inputs: [
      { name: "bookId", type: "uint256", indexed: true },
      { name: "totalCopies", type: "uint64", indexed: false },
      { name: "availableCopies", type: "uint64", indexed: false },
    ],
  },
  {
    type: "event",
    name: "BookStatusUpdated",
    inputs: [
      { name: "bookId", type: "uint256", indexed: true },
      { name: "active", type: "bool", indexed: false },
    ],
  },
  {
    type: "event",
    name: "CustomerRegistered",
    inputs: [
      { name: "customer", type: "address", indexed: true },
      { name: "fullName", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "CustomerProfileUpdated",
    inputs: [
      { name: "customer", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "Borrowed",
    inputs: [
      { name: "loanId", type: "uint256", indexed: true },
      { name: "bookId", type: "uint256", indexed: true },
      { name: "customer", type: "address", indexed: true },
      { name: "borrowedAt", type: "uint64", indexed: false },
      { name: "dueAt", type: "uint64", indexed: false },
      { name: "rewardPoints", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Returned",
    inputs: [
      { name: "loanId", type: "uint256", indexed: true },
      { name: "bookId", type: "uint256", indexed: true },
      { name: "customer", type: "address", indexed: true },
      { name: "returnedAt", type: "uint64", indexed: false },
      { name: "lateReturn", type: "bool", indexed: false },
      { name: "pointsDeltaAbs", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "PointRulesUpdated",
    inputs: [
      { name: "borrowRewardPoints", type: "uint32", indexed: false },
      { name: "onTimeReturnRewardPoints", type: "uint32", indexed: false },
      { name: "latePenaltyPerDay", type: "uint32", indexed: false },
    ],
  },
  {
    type: "event",
    name: "BorrowRulesUpdated",
    inputs: [
      { name: "maxBorrowDuration", type: "uint64", indexed: false },
      { name: "maxActiveLoansPerCustomer", type: "uint32", indexed: false },
    ],
  },

  // =========================================================================
  // READ FUNCTIONS — Public state variables
  // =========================================================================
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "maxBorrowDuration",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint64" }],
  },
  {
    type: "function",
    name: "maxActiveLoansPerCustomer",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint32" }],
  },
  {
    type: "function",
    name: "borrowRewardPoints",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint32" }],
  },
  {
    type: "function",
    name: "onTimeReturnRewardPoints",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint32" }],
  },
  {
    type: "function",
    name: "latePenaltyPerDay",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint32" }],
  },
  {
    type: "function",
    name: "nextBookId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "nextLoanId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },

  // =========================================================================
  // READ FUNCTIONS — Getters
  // =========================================================================
  {
    type: "function",
    name: "getBook",
    stateMutability: "view",
    inputs: [{ name: "bookId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "title", type: "string" },
          { name: "author", type: "string" },
          { name: "isbn", type: "string" },
          { name: "totalCopies", type: "uint64" },
          { name: "availableCopies", type: "uint64" },
          { name: "active", type: "bool" },
          { name: "createdAt", type: "uint64" },
          { name: "updatedAt", type: "uint64" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getBooksCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getBookBorrowerHistory",
    stateMutability: "view",
    inputs: [{ name: "bookId", type: "uint256" }],
    outputs: [{ name: "", type: "address[]" }],
  },
  {
    type: "function",
    name: "getCustomer",
    stateMutability: "view",
    inputs: [{ name: "customer", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "registered", type: "bool" },
          { name: "fullName", type: "string" },
          { name: "email", type: "string" },
          { name: "memberCode", type: "string" },
          { name: "metadataURI", type: "string" },
          { name: "joinedAt", type: "uint64" },
          { name: "updatedAt", type: "uint64" },
          { name: "activeLoansCount", type: "uint32" },
          { name: "lifetimeBorrows", type: "uint64" },
          { name: "lifetimeReturns", type: "uint64" },
          { name: "totalPointsEarned", type: "uint256" },
          { name: "totalPointsPenalized", type: "uint256" },
          { name: "pointsBalance", type: "int256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getMyProfile",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "registered", type: "bool" },
          { name: "fullName", type: "string" },
          { name: "email", type: "string" },
          { name: "memberCode", type: "string" },
          { name: "metadataURI", type: "string" },
          { name: "joinedAt", type: "uint64" },
          { name: "updatedAt", type: "uint64" },
          { name: "activeLoansCount", type: "uint32" },
          { name: "lifetimeBorrows", type: "uint64" },
          { name: "lifetimeReturns", type: "uint64" },
          { name: "totalPointsEarned", type: "uint256" },
          { name: "totalPointsPenalized", type: "uint256" },
          { name: "pointsBalance", type: "int256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getMyActiveLoanIds",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    type: "function",
    name: "getMyLoanHistoryIds",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    type: "function",
    name: "getCustomerActiveLoanIds",
    stateMutability: "view",
    inputs: [{ name: "customer", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    type: "function",
    name: "getCustomerLoanHistoryIds",
    stateMutability: "view",
    inputs: [{ name: "customer", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    type: "function",
    name: "getLoan",
    stateMutability: "view",
    inputs: [{ name: "loanId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "bookId", type: "uint256" },
          { name: "customer", type: "address" },
          { name: "borrowedAt", type: "uint64" },
          { name: "dueAt", type: "uint64" },
          { name: "returnedAt", type: "uint64" },
          { name: "returned", type: "bool" },
          { name: "pointsDelta", type: "int256" },
        ],
      },
    ],
  },

  // =========================================================================
  // WRITE FUNCTIONS — State-changing transactions
  // =========================================================================
  {
    type: "function",
    name: "transferOwnership",
    stateMutability: "nonpayable",
    inputs: [{ name: "newOwner", type: "address" }],
    outputs: [],
  },
  {
    type: "function",
    name: "setPointRules",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_borrowRewardPoints", type: "uint32" },
      { name: "_onTimeReturnRewardPoints", type: "uint32" },
      { name: "_latePenaltyPerDay", type: "uint32" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setBorrowRules",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_maxBorrowDuration", type: "uint64" },
      { name: "_maxActiveLoansPerCustomer", type: "uint32" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "addBook",
    stateMutability: "nonpayable",
    inputs: [
      { name: "title", type: "string" },
      { name: "author", type: "string" },
      { name: "isbn", type: "string" },
      { name: "copies", type: "uint64" },
    ],
    outputs: [{ name: "bookId", type: "uint256" }],
  },
  {
    type: "function",
    name: "addBookCopies",
    stateMutability: "nonpayable",
    inputs: [
      { name: "bookId", type: "uint256" },
      { name: "additionalCopies", type: "uint64" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setBookActive",
    stateMutability: "nonpayable",
    inputs: [
      { name: "bookId", type: "uint256" },
      { name: "active", type: "bool" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "registerCustomer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "fullName", type: "string" },
      { name: "email", type: "string" },
      { name: "memberCode", type: "string" },
      { name: "metadataURI", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "ownerUpsertCustomer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "customer", type: "address" },
      { name: "fullName", type: "string" },
      { name: "email", type: "string" },
      { name: "memberCode", type: "string" },
      { name: "metadataURI", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "borrowBook",
    stateMutability: "nonpayable",
    inputs: [
      { name: "bookId", type: "uint256" },
      { name: "requestedDuration", type: "uint64" },
    ],
    outputs: [{ name: "loanId", type: "uint256" }],
  },
  {
    type: "function",
    name: "returnBook",
    stateMutability: "nonpayable",
    inputs: [{ name: "loanId", type: "uint256" }],
    outputs: [],
  },
] as const;
