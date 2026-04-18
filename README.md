# LibraryManagement Smart Contract

A simple Solidity repository containing a single on-chain library management contract: `LibraryManagement`.

## Overview

`LibraryManagement` is a full-featured library system built in Solidity for Ethereum-compatible chains. It supports:

- Owner-managed book inventory with copy tracking and active/inactive book status
- Customer registration with profile metadata
- Borrow and return lifecycle with loan tracking and due dates
- Reward points for borrowing and on-time return
- Penalties for late returns
- Read-only APIs for books, customers, loans, and borrower history

## Contract

- File: `library.sol`
- Contract: `LibraryManagement`
- Compiler: `pragma solidity ^0.8.24`
- License: `MIT`

## Key Features

### Book Management

- `addBook(title, author, isbn, copies)`
- `addBookCopies(bookId, additionalCopies)`
- `setBookActive(bookId, active)`
- `getBook(bookId)`
- `getBooksCount()`
- `getBookBorrowerHistory(bookId)`

### Customer Management

- `registerCustomer(fullName, email, memberCode, metadataURI)`
- `ownerUpsertCustomer(customer, fullName, email, memberCode, metadataURI)`
- `getCustomer(customer)`
- `getMyProfile()`
- `getMyActiveLoanIds()`
- `getMyLoanHistoryIds()`

### Borrowing & Returning

- `borrowBook(bookId, requestedDuration)`
- `returnBook(loanId)`
- Reward points for borrow events and on-time returns
- Penalty points for late returns

### Admin Rules

- `setPointRules(borrowRewardPoints, onTimeReturnRewardPoints, latePenaltyPerDay)`
- `setBorrowRules(maxBorrowDuration, maxActiveLoansPerCustomer)`

## Usage

1. Compile `library.sol` with Solidity `0.8.24` or newer.
2. Deploy `LibraryManagement` from the owner account.
3. Add books and configure loan/point rules as the contract owner.
4. Register customers, then allow them to borrow and return books.

## Notes

- The contract emits events for ownership transfer, book management, customer registration, borrow, and return actions.
- Errors are defined using custom revert types for gas-efficient validation.
- Borrow duration is capped by `maxBorrowDuration`, and customers are limited by `maxActiveLoansPerCustomer`.

## Development

For implementation details and full NatSpec documentation, review `library.sol`.
