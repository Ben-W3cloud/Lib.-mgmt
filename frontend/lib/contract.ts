import { zeroAddress, type Abi, type Address } from "viem";

export const libraryManagementAbi = [
  // Book management
  { type: "function", name: "addBook", stateMutability: "nonpayable", inputs: [
    { name: "title", type: "string" }, { name: "author", type: "string" }, 
    { name: "isbn", type: "string" }, { name: "copies", type: "uint64" },
    { name: "category", type: "string" }, { name: "tags", type: "string[]" }
  ], outputs: [{ name: "bookId", type: "uint256" }] },
  { type: "function", name: "addBookCopies", stateMutability: "nonpayable", inputs: [
    { name: "bookId", type: "uint256" }, { name: "additionalCopies", type: "uint64" }
  ], outputs: [] },
  { type: "function", name: "borrowBook", stateMutability: "nonpayable", inputs: [
    { name: "bookId", type: "uint256" }, { name: "requestedDuration", type: "uint64" }
  ], outputs: [{ name: "loanId", type: "uint256" }] },
  { type: "function", name: "returnBook", stateMutability: "nonpayable", inputs: [
    { name: "loanId", type: "uint256" }
  ], outputs: [] },
  { type: "function", name: "setBookActive", stateMutability: "nonpayable", inputs: [
    { name: "bookId", type: "uint256" }, { name: "active", type: "bool" }
  ], outputs: [] },
  { type: "function", name: "registerCustomer", stateMutability: "nonpayable", inputs: [
    { name: "fullName", type: "string" }, { name: "email", type: "string" },
    { name: "memberCode", type: "string" }, { name: "metadataURI", type: "string" }
  ], outputs: [] },
  { type: "function", name: "ownerUpsertCustomer", stateMutability: "nonpayable", inputs: [
    { name: "customer", type: "address" }, { name: "fullName", type: "string" },
    { name: "email", type: "string" }, { name: "memberCode", type: "string" },
    { name: "metadataURI", type: "string" }
  ], outputs: [] },
  { type: "function", name: "extendLoan", stateMutability: "nonpayable", inputs: [
    { name: "loanId", type: "uint256" }, { name: "extensionDays", type: "uint32" }
  ], outputs: [] },
  { type: "function", name: "addReview", stateMutability: "nonpayable", inputs: [
    { name: "bookId", type: "uint256" }, { name: "rating", type: "uint8" },
    { name: "comment", type: "string" }
  ], outputs: [] },
  { type: "function", name: "setPointRules", stateMutability: "nonpayable", inputs: [
    { name: "_borrowRewardPoints", type: "uint32" },
    { name: "_onTimeReturnRewardPoints", type: "uint32" },
    { name: "_latePenaltyPerDay", type: "uint32" },
    { name: "_extendRewardPoints", type: "uint32" }
  ], outputs: [] },
  { type: "function", name: "setBorrowRules", stateMutability: "nonpayable", inputs: [
    { name: "_maxBorrowDuration", type: "uint64" },
    { name: "_maxActiveLoansPerCustomer", type: "uint32" }
  ], outputs: [] },
  { type: "function", name: "transferOwnership", stateMutability: "nonpayable", inputs: [
    { name: "newOwner", type: "address" }
  ], outputs: [] },

  // View functions
  { type: "function", name: "getBook", stateMutability: "view", inputs: [
    { name: "bookId", type: "uint256" }
  ], outputs: [{ name: "", type: "tuple", components: [
    { name: "id", type: "uint256" }, { name: "title", type: "string" },
    { name: "author", type: "string" }, { name: "isbn", type: "string" },
    { name: "totalCopies", type: "uint64" }, { name: "availableCopies", type: "uint64" },
    { name: "active", type: "bool" }, { name: "lister", type: "address" },
    { name: "createdAt", type: "uint64" }, { name: "updatedAt", type: "uint64" },
    { name: "category", type: "string" }, { name: "tags", type: "string[]" }
  ] }] },
  { type: "function", name: "getBooksCount", stateMutability: "view", inputs: [], outputs: [
    { name: "", type: "uint256" }
  ] },
  { type: "function", name: "getBooksPaginated", stateMutability: "view", inputs: [
    { name: "start", type: "uint256" }, { name: "limit", type: "uint256" }
  ], outputs: [
    { name: "result", type: "tuple[]", components: [
      { name: "id", type: "uint256" }, { name: "title", type: "string" },
      { name: "author", type: "string" }, { name: "isbn", type: "string" },
      { name: "totalCopies", type: "uint64" }, { name: "availableCopies", type: "uint64" },
      { name: "active", type: "bool" }, { name: "lister", type: "address" },
      { name: "createdAt", type: "uint64" }, { name: "updatedAt", type: "uint64" },
      { name: "category", type: "string" }, { name: "tags", type: "string[]" }
    ] },
    { name: "total", type: "uint256" }
  ] },
  { type: "function", name: "getCustomer", stateMutability: "view", inputs: [
    { name: "customer", type: "address" }
  ], outputs: [{ name: "", type: "tuple", components: [
    { name: "registered", type: "bool" }, { name: "fullName", type: "string" },
    { name: "email", type: "string" }, { name: "memberCode", type: "string" },
    { name: "metadataURI", type: "string" }, { name: "joinedAt", type: "uint64" },
    { name: "updatedAt", type: "uint64" }, { name: "activeLoansCount", type: "uint32" },
    { name: "lifetimeBorrows", type: "uint64" }, { name: "lifetimeReturns", type: "uint64" },
    { name: "totalPointsEarned", type: "uint256" },
    { name: "totalPointsPenalized", type: "uint256" },
    { name: "pointsBalance", type: "int256" }
  ] }] },
  { type: "function", name: "getMyProfile", stateMutability: "view", inputs: [], outputs: [
    { name: "", type: "tuple", components: [
      { name: "registered", type: "bool" }, { name: "fullName", type: "string" },
      { name: "email", type: "string" }, { name: "memberCode", type: "string" },
      { name: "metadataURI", type: "string" }, { name: "joinedAt", type: "uint64" },
      { name: "updatedAt", type: "uint64" }, { name: "activeLoansCount", type: "uint32" },
      { name: "lifetimeBorrows", type: "uint64" }, { name: "lifetimeReturns", type: "uint64" },
      { name: "totalPointsEarned", type: "uint256" },
      { name: "totalPointsPenalized", type: "uint256" },
      { name: "pointsBalance", type: "int256" }
    ] }
  ] },
  { type: "function", name: "getLoan", stateMutability: "view", inputs: [
    { name: "loanId", type: "uint256" }
  ], outputs: [{ name: "", type: "tuple", components: [
    { name: "id", type: "uint256" }, { name: "bookId", type: "uint256" },
    { name: "customer", type: "address" }, { name: "borrowedAt", type: "uint64" },
    { name: "dueAt", type: "uint64" }, { name: "returnedAt", type: "uint64" },
    { name: "returned", type: "bool" }, { name: "pointsDelta", type: "int256" },
    { name: "extensionsUsed", type: "uint32" }
  ] }] },
  { type: "function", name: "getMyActiveLoanIds", stateMutability: "view", inputs: [], outputs: [
    { name: "", type: "uint256[]" }
  ] },
  { type: "function", name: "getMyLoanHistoryIds", stateMutability: "view", inputs: [], outputs: [
    { name: "", type: "uint256[]" }
  ] },
  { type: "function", name: "getCustomerActiveLoanIds", stateMutability: "view", inputs: [
    { name: "customer", type: "address" }
  ], outputs: [{ name: "", type: "uint256[]" }] },
  { type: "function", name: "getCustomerLoanHistoryIds", stateMutability: "view", inputs: [
    { name: "customer", type: "address" }
  ], outputs: [{ name: "", type: "uint256[]" }] },
  { type: "function", name: "getBookBorrowerHistory", stateMutability: "view", inputs: [
    { name: "bookId", type: "uint256" }
  ], outputs: [{ name: "", type: "address[]" }] },
  { type: "function", name: "getBookReviewIds", stateMutability: "view", inputs: [
    { name: "bookId", type: "uint256" }
  ], outputs: [{ name: "", type: "uint256[]" }] },
  { type: "function", name: "getReview", stateMutability: "view", inputs: [
    { name: "reviewId", type: "uint256" }
  ], outputs: [{ name: "", type: "tuple", components: [
    { name: "id", type: "uint256" }, { name: "reviewer", type: "address" },
    { name: "rating", type: "uint8" }, { name: "comment", type: "string" },
    { name: "createdAt", type: "uint64" }
  ] }] },
  { type: "function", name: "maxBorrowDuration", stateMutability: "view", inputs: [], outputs: [
    { name: "", type: "uint64" }
  ] },
  { type: "function", name: "owner", stateMutability: "view", inputs: [], outputs: [
    { name: "", type: "address" }
  ] },
] as const satisfies Abi;

const rawAddress = process.env.NEXT_PUBLIC_LIBRARY_ADDRESS as Address | undefined;

export const CONTRACT_ADDRESS = rawAddress && /^0x[a-fA-F0-9]{40}$/.test(rawAddress) ? rawAddress : zeroAddress;
export const IS_CONTRACT_CONFIGURED = CONTRACT_ADDRESS !== zeroAddress;
export const CONTRACT_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111);

export const contractConfig = {
  address: CONTRACT_ADDRESS,
  abi: libraryManagementAbi,
} as const;