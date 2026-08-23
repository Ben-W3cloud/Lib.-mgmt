import { describe, it, expect } from "vitest";
import { asNumber, sameAddress, shortAddress, dateFromSeconds, explainError } from "@/lib/types";

describe("Utility functions", () => {
  describe("asNumber", () => {
    it("should convert bigint to number", () => {
      expect(asNumber(42n)).toBe(42);
    });

    it("should return number as-is", () => {
      expect(asNumber(42)).toBe(42);
    });

    it("should return 0 for undefined", () => {
      expect(asNumber(undefined)).toBe(0);
    });
  });

  describe("sameAddress", () => {
    it("should match case-insensitive addresses", () => {
      expect(sameAddress("0xABC", "0xabc")).toBe(true);
    });

    it("should return false for different addresses", () => {
      expect(sameAddress("0xABC", "0xDEF")).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(sameAddress(undefined, "0xABC")).toBe(false);
    });
  });

  describe("shortAddress", () => {
    it("should truncate long addresses", () => {
      expect(shortAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe("0x1234...5678");
    });

    it("should return placeholder for empty input", () => {
      expect(shortAddress(undefined)).toBe("No wallet");
    });
  });

  describe("dateFromSeconds", () => {
    it("should format a valid timestamp", () => {
      // Jan 15, 2024 12:00 UTC
      const result = dateFromSeconds(1705315200n);
      expect(result).toContain("Jan");
      expect(result).not.toBe("Not set");
    });

    it("should return 'Not set' for undefined", () => {
      expect(dateFromSeconds(undefined)).toBe("Not set");
    });

    it("should return 'Not set' for 0", () => {
      expect(dateFromSeconds(0n)).toBe("Not set");
    });
  });

  describe("explainError", () => {
    it("should map custom errors to user-friendly messages", () => {
      expect(explainError(new Error("CustomerNotRegistered"))).toBe("Register your profile before borrowing.");
      expect(explainError(new Error("NoAvailableCopies"))).toBe("No copies are available for this book.");
      expect(explainError(new Error("BookInactive"))).toBe("This listing is paused by its owner.");
      expect(explainError(new Error("NotBookLister"))).toBe("Only the listing owner can change this book.");
      expect(explainError(new Error("MaxActiveLoansReached"))).toBe("You reached the active-loan limit.");
      expect(explainError(new Error("BorrowDurationTooLong"))).toBe("Choose a shorter borrow duration.");
      expect(explainError(new Error("PointsBelowZero"))).toBe("Insufficient points for this action.");
      expect(explainError(new Error("InvalidEmail"))).toBe("Please enter a valid email address.");
      expect(explainError(new Error("InvalidIsbn"))).toBe("Please enter a valid ISBN (10 or 13 digits).");
      expect(explainError(new Error("MemberCodeAlreadyTaken"))).toBe("This member code is already taken.");
      expect(explainError(new Error("LoanNotCloseToExpiry"))).toBe("Loan must be near expiry to extend.");
      expect(explainError(new Error("AlreadyReviewed"))).toBe("You've already reviewed this book.");
      expect(explainError(new Error("User rejected"))).toBe("Wallet rejected the transaction.");
    });

    it("should return raw message for unknown errors", () => {
      expect(explainError(new Error("Something else"))).toBe("Something else");
    });

    it("should handle non-Error objects", () => {
      expect(explainError("string error")).toBe("string error");
      expect(explainError(null)).toBe("Transaction failed.");
    });
  });
});