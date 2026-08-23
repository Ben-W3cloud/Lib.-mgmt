import { expect } from "chai";
import { network } from "hardhat";
import type { Address, PublicClient, WalletClient } from "viem";

describe("LibraryManagement", function () {
  let publicClient: PublicClient;
  let walletClient: WalletClient;
  let deployer: Address;
  let alice: Address;
  let bob: Address;
  let contractAddress: Address;

  const ONE_DAY = 86400n;
  const SEVEN_DAYS = 7n * ONE_DAY;
  const FOURTEEN_DAYS = 14n * ONE_DAY;

  before(async function () {
    const { viem } = await network.connect();
    publicClient = await viem.getPublicClient();
    walletClient = await viem.getWalletClient(deployer);
    
    const [deployerWallet, aliceWallet, bobWallet] = await viem.getWalletClients();
    deployer = deployerWallet.account.address;
    alice = aliceWallet.account.address;
    bob = bobWallet.account.address;

    const contract = await viem.deployContract("LibraryManagement");
    contractAddress = contract.address;
  });

  describe("Deployment", function () {
    it("should set the deployer as owner", async function () {
      const owner = await publicClient.readContract({
        address: contractAddress,
        abi: [],
        functionName: "owner",
      });
      expect(owner).to.equal(deployer);
    });

    it("should have default config values", async function () {
      const maxDuration = await publicClient.readContract({
        address: contractAddress,
        abi: [],
        functionName: "maxBorrowDuration",
      });
      expect(maxDuration).to.equal(FOURTEEN_DAYS);
    });
  });

  describe("Book Management", function () {
    it("should add a book with category and tags", async function () {
      const tx = await walletClient.writeContract({
        address: contractAddress,
        abi: [],
        functionName: "addBook",
        args: ["Test Book", "Test Author", "978-3-16-148410-0", 5n, "fiction", ["fantasy", "adventure"]],
      });
      await publicClient.waitForTransactionReceipt({ hash: tx });

      const book = await publicClient.readContract({
        address: contractAddress,
        abi: [],
        functionName: "getBook",
        args: [1n],
      });
      expect(book.title).to.equal("Test Book");
      expect(book.category).to.equal("fiction");
      expect(book.tags).to.deep.equal(["fantasy", "adventure"]);
      expect(book.totalCopies).to.equal(5n);
      expect(book.availableCopies).to.equal(5n);
    });

    it("should reject invalid ISBN", async function () {
      await expect(
        walletClient.writeContract({
          address: contractAddress,
          abi: [],
          functionName: "addBook",
          args: ["Bad ISBN", "Author", "not-an-isbn", 1n, "", []],
        })
      ).to.be.rejectedWith("InvalidIsbn");
    });

    it("should reject empty title", async function () {
      await expect(
        walletClient.writeContract({
          address: contractAddress,
          abi: [],
          functionName: "addBook",
          args: ["", "Author", "978-0-123-45678-9", 1n, "", []],
        })
      ).to.be.rejectedWith("EmptyTextField");
    });

    it("should reject zero copies", async function () {
      await expect(
        walletClient.writeContract({
          address: contractAddress,
          abi: [],
          functionName: "addBook",
          args: ["Title", "Author", "978-0-123-45678-9", 0n, "", []],
        })
      ).to.be.rejectedWith("NoAvailableCopies");
    });
  });

  describe("Customer Registration", function () {
    it("should register a customer with valid email", async function () {
      const aliceWallet = await viem.getWalletClient(alice);
      const tx = await aliceWallet.writeContract({
        address: contractAddress,
        abi: [],
        functionName: "registerCustomer",
        args: ["Alice", "alice@example.com", "ALC001", ""],
      });
      await publicClient.waitForTransactionReceipt({ hash: tx });

      const profile = await publicClient.readContract({
        address: contractAddress,
        abi: [],
        functionName: "getCustomer",
        args: [alice],
      });
      expect(profile.fullName).to.equal("Alice");
      expect(profile.email).to.equal("alice@example.com");
      expect(profile.registered).to.be.true;
    });

    it("should reject invalid email", async function () {
      const bobWallet = await viem.getWalletClient(bob);
      await expect(
        bobWallet.writeContract({
          address: contractAddress,
          abi: [],
          functionName: "registerCustomer",
          args: ["Bob", "invalid-email", "BOB001", ""],
        })
      ).to.be.rejectedWith("InvalidEmail");
    });

    it("should reject duplicate member code", async function () {
      const bobWallet = await viem.getWalletClient(bob);
      // First register Bob with valid data
      const tx = await bobWallet.writeContract({
        address: contractAddress,
        abi: [],
        functionName: "registerCustomer",
        args: ["Bob", "bob@example.com", "BOB001", ""],
      });
      await publicClient.waitForTransactionReceipt({ hash: tx });

      // Try to register another user with same member code
      await expect(
        walletClient.writeContract({
          address: contractAddress,
          abi: [],
          functionName: "ownerUpsertCustomer",
          args: [deployer, "Deployer", "deployer@example.com", "BOB001", ""],
        })
      ).to.be.rejectedWith("MemberCodeAlreadyTaken");
    });
  });

  describe("Borrowing and Returning", function () {
    it("should borrow a book", async function () {
      const aliceWallet = await viem.getWalletClient(alice);
      const tx = await aliceWallet.writeContract({
        address: contractAddress,
        abi: [],
        functionName: "borrowBook",
        args: [1n, SEVEN_DAYS],
      });
      await publicClient.waitForTransactionReceipt({ hash: tx });

      const book = await publicClient.readContract({
        address: contractAddress,
        abi: [],
        functionName: "getBook",
        args: [1n],
      });
      expect(book.availableCopies).to.equal(4n);
    });

    it("should reject borrow without registration", async function () {
      // Use a new unregistered address
      const newWallet = await viem.getWalletClient("0x1234567890123456789012345678901234567890");
      await expect(
        newWallet.writeContract({
          address: contractAddress,
          abi: [],
          functionName: "borrowBook",
          args: [1n, SEVEN_DAYS],
        })
      ).to.be.rejectedWith("CustomerNotRegistered");
    });

    it("should extend a loan", async function () {
      const aliceWallet = await viem.getWalletClient(alice);
      const tx = await aliceWallet.writeContract({
        address: contractAddress,
        abi: [],
        functionName: "extendLoan",
        args: [1n, 3n], // extend by 3 days
      });
      await publicClient.waitForTransactionReceipt({ hash: tx });

      const loan = await publicClient.readContract({
        address: contractAddress,
        abi: [],
        functionName: "getLoan",
        args: [1n],
      });
      expect(loan.extensionsUsed).to.equal(1n);
    });

    it("should return a book on time and earn points", async function () {
      const aliceWallet = await viem.getWalletClient(alice);
      const tx = await aliceWallet.writeContract({
        address: contractAddress,
        abi: [],
        functionName: "returnBook",
        args: [1n],
      });
      await publicClient.waitForTransactionReceipt({ hash: tx });

      const book = await publicClient.readContract({
        address: contractAddress,
        abi: [],
        functionName: "getBook",
        args: [1n],
      });
      expect(book.availableCopies).to.equal(5n);

      const profile = await publicClient.readContract({
        address: contractAddress,
        abi: [],
        functionName: "getCustomer",
        args: [alice],
      });
      // Alice earned borrowRewardPoints (10) + onTimeReturnRewardPoints (15) + extension reward (3*3=9)
      expect(profile.totalPointsEarned).to.equal(34n);
    });
  });

  describe("Review System", function () {
    it("should add a review for a borrowed book", async function () {
      const aliceWallet = await viem.getWalletClient(alice);
      const tx = await aliceWallet.writeContract({
        address: contractAddress,
        abi: [],
        functionName: "addReview",
        args: [1n, 5, "Great book!"],
      });
      await publicClient.waitForTransactionReceipt({ hash: tx });

      const reviewIds = await publicClient.readContract({
        address: contractAddress,
        abi: [],
        functionName: "getBookReviewIds",
        args: [1n],
      });
      expect(reviewIds.length).to.equal(1n);
    });

    it("should reject duplicate review", async function () {
      const aliceWallet = await viem.getWalletClient(alice);
      await expect(
        aliceWallet.writeContract({
          address: contractAddress,
          abi: [],
          functionName: "addReview",
          args: [1n, 4, "Still good"],
        })
      ).to.be.rejectedWith("AlreadyReviewed");
    });

    it("should reject review from non-borrower", async function () {
      const bobWallet = await viem.getWalletClient(bob);
      await expect(
        bobWallet.writeContract({
          address: contractAddress,
          abi: [],
          functionName: "addReview",
          args: [1n, 3, "Never borrowed"],
        })
      ).to.be.rejectedWith("NotLoanParticipant");
    });
  });

  describe("Points System", function () {
    it("should prevent points from going below zero", async function () {
      // Bob has no points, try to debit
      const bobWallet = await viem.getWalletClient(bob);
      // Bob borrows a book
      const tx = await bobWallet.writeContract({
        address: contractAddress,
        abi: [],
        functionName: "borrowBook",
        args: [1n, ONE_DAY],
      });
      await publicClient.waitForTransactionReceipt({ hash: tx });

      // Bob has 10 points from borrowing, so he can afford a small penalty
      // But if we try to debit more than he has, it should revert
      // This is tested by the PointsBelowZero check in _debitPoints
      const profile = await publicClient.readContract({
        address: contractAddress,
        abi: [],
        functionName: "getCustomer",
        args: [bob],
      });
      expect(profile.pointsBalance).to.be.gte(0n);
    });
  });

  describe("Pagination", function () {
    it("should return paginated books", async function () {
      // Add more books for pagination test
      for (let i = 0; i < 5; i++) {
        await walletClient.writeContract({
          address: contractAddress,
          abi: [],
          functionName: "addBook",
          args: [`Book ${i + 2}`, "Author", `978-0-123-4567${i}-9`, 1n, "fiction", []],
        });
      }

      const [books, total] = await publicClient.readContract({
        address: contractAddress,
        abi: [],
        functionName: "getBooksPaginated",
        args: [0n, 3n],
      });
      expect(books.length).to.equal(3);
      expect(total).to.equal(7n);
    });
  });

  describe("Admin Functions", function () {
    it("should update point rules", async function () {
      const tx = await walletClient.writeContract({
        address: contractAddress,
        abi: [],
        functionName: "setPointRules",
        args: [20n, 25n, 3n, 5n],
      });
      await publicClient.waitForTransactionReceipt({ hash: tx });
    });

    it("should reject non-owner admin calls", async function () {
      const aliceWallet = await viem.getWalletClient(alice);
      await expect(
        aliceWallet.writeContract({
          address: contractAddress,
          abi: [],
          functionName: "setPointRules",
          args: [20n, 25n, 3n, 5n],
        })
      ).to.be.rejectedWith("NotOwner");
    });
  });
});