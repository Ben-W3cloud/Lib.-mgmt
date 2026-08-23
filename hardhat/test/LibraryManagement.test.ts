import { network } from "hardhat";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const { viem, networkHelpers } = await network.create();

const [deployer, alice, bob, carol, dave] = await viem.getWalletClients();
const library = await viem.deployContract("LibraryManagement");

const ONE_DAY = 86_400n;
const SEVEN_DAYS = 7n * ONE_DAY;
const FOURTEEN_DAYS = 14n * ONE_DAY;

function big(value: unknown): bigint {
  return BigInt(value as string | number | bigint);
}

describe("LibraryManagement", function () {
  it("sets the deployer as owner", async function () {
    const owner = await library.read.owner();
    assert.equal(owner.toLowerCase(), deployer.account.address.toLowerCase());
  });

  it("has default config values", async function () {
    assert.equal(big(await library.read.maxBorrowDuration()), FOURTEEN_DAYS);
    assert.equal(big(await library.read.maxActiveLoansPerCustomer()), 3n);
    assert.equal(big(await library.read.borrowRewardPoints()), 10n);
    assert.equal(big(await library.read.onTimeReturnRewardPoints()), 15n);
    assert.equal(big(await library.read.latePenaltyPerDay()), 2n);
    assert.equal(big(await library.read.extendRewardPoints()), 3n);
    assert.equal(big(await library.read.maxExtensionDays()), 7n);
  });

  describe("Book Management", function () {
    it("adds a book with category and tags", async function () {
      await library.write.addBook([
        "Test Book",
        "Test Author",
        "978-3-16-148410-0",
        5n,
        "fiction",
        ["fantasy", "adventure"],
      ]);

      const book = await library.read.getBook([1n]);
      assert.equal(book.title, "Test Book");
      assert.equal(book.author, "Test Author");
      assert.equal(book.isbn, "978-3-16-148410-0");
      assert.equal(book.category, "fiction");
      assert.deepEqual(book.tags, ["fantasy", "adventure"]);
      assert.equal(book.totalCopies, 5n);
      assert.equal(book.availableCopies, 5n);
      assert.equal(book.active, true);
      assert.equal(book.lister.toLowerCase(), deployer.account.address.toLowerCase());

      const count = await library.read.getBooksCount();
      assert.equal(big(count), 1n);
    });

    it("rejects an invalid ISBN", async function () {
      await viem.assertions.revertWithCustomError(
        library.write.addBook(["Bad ISBN", "Author", "not-an-isbn", 1n, "", []]),
        library,
        "InvalidIsbn",
      );
    });

    it("rejects an empty title", async function () {
      await viem.assertions.revertWithCustomError(
        library.write.addBook(["", "Author", "978-0-123-45678-9", 1n, "", []]),
        library,
        "EmptyTextField",
      );
    });

    it("rejects zero copies", async function () {
      await viem.assertions.revertWithCustomError(
        library.write.addBook(["Title", "Author", "978-0-123-45678-9", 0n, "", []]),
        library,
        "NoAvailableCopies",
      );
    });

    it("lets only the lister add copies or pause the listing", async function () {
      await viem.assertions.revertWithCustomError(
        library.write.addBookCopies([1n, 1n], { account: alice.account }),
        library,
        "NotBookLister",
      );
      await viem.assertions.revertWithCustomError(
        library.write.setBookActive([1n, false], { account: alice.account }),
        library,
        "NotBookLister",
      );

      await library.write.addBookCopies([1n, 2n]);
      const bookAfterCopies = await library.read.getBook([1n]);
      assert.equal(big(bookAfterCopies.totalCopies), 7n);
      assert.equal(big(bookAfterCopies.availableCopies), 7n);

      await library.write.setBookActive([1n, false]);
      await viem.assertions.revertWithCustomError(
        library.write.borrowBook([1n, SEVEN_DAYS], { account: alice.account }),
        library,
        "BookInactive",
      );
      await library.write.setBookActive([1n, true]);
      const bookReactivated = await library.read.getBook([1n]);
      assert.equal(bookReactivated.active, true);
      assert.equal(big(bookReactivated.availableCopies), 7n);
    });
  });

  describe("Customer Registration", function () {
    it("registers a customer with valid data", async function () {
      await library.write.registerCustomer(
        ["Alice", "alice@example.com", "ALC001", ""],
        { account: alice.account },
      );

      const profile = await library.read.getCustomer([alice.account.address]);
      assert.equal(profile.registered, true);
      assert.equal(profile.fullName, "Alice");
      assert.equal(profile.email, "alice@example.com");
      assert.equal(profile.memberCode, "ALC001");
    });

    it("rejects an invalid email", async function () {
      await viem.assertions.revertWithCustomError(
        library.write.registerCustomer(["Carol", "invalid-email", "CAR001", ""], {
          account: carol.account,
        }),
        library,
        "InvalidEmail",
      );
    });

    it("rejects a duplicate member code", async function () {
      await viem.assertions.revertWithCustomError(
        library.write.ownerUpsertCustomer([
          deployer.account.address,
          "Deployer",
          "deployer@example.com",
          "ALC001",
          "",
        ]),
        library,
        "MemberCodeAlreadyTaken",
      );
    });
  });

  describe("Borrowing and Returning", function () {
    it("borrows a book and credits points", async function () {
      await library.write.borrowBook([1n, SEVEN_DAYS], { account: alice.account });

      const book = await library.read.getBook([1n]);
      assert.equal(big(book.availableCopies), 6n);

      const profile = await library.read.getCustomer([alice.account.address]);
      assert.equal(big(profile.activeLoansCount), 1n);
      assert.equal(big(profile.lifetimeBorrows), 1n);
      assert.equal(big(profile.pointsBalance), 10n);

      const activeIds = await library.read.getMyActiveLoanIds({
        account: alice.account,
      });
      assert.deepEqual(activeIds.map(big), [1n]);
    });

    it("rejects borrowing without registration", async function () {
      await viem.assertions.revertWithCustomError(
        library.write.borrowBook([1n, SEVEN_DAYS], { account: dave.account }),
        library,
        "CustomerNotRegistered",
      );
    });

    it("extends a loan and credits extension rewards", async function () {
      await library.write.extendLoan([1n, 3n], { account: alice.account });

      const loan = await library.read.getLoan([1n]);
      assert.equal(big(loan.extensionsUsed), 1n);
      assert.equal(big(loan.dueAt), big(loan.borrowedAt) + 10n * ONE_DAY);

      const profile = await library.read.getCustomer([alice.account.address]);
      assert.equal(big(profile.pointsBalance), 19n);
    });

    it("rejects extensions beyond maxExtensionDays", async function () {
      await viem.assertions.revertWithCustomError(
        library.write.extendLoan([1n, 10n], { account: alice.account }),
        library,
        "BorrowDurationTooLong",
      );
    });

    it("returns a book on time and earns the return reward", async function () {
      await library.write.returnBook([1n], { account: alice.account });

      const book = await library.read.getBook([1n]);
      assert.equal(big(book.availableCopies), 7n);

      const profile = await library.read.getCustomer([alice.account.address]);
      // 10 (borrow) + 9 (extension) + 15 (on-time return)
      assert.equal(big(profile.totalPointsEarned), 34n);
      assert.equal(big(profile.pointsBalance), 34n);
      assert.equal(big(profile.activeLoansCount), 0n);
      assert.equal(big(profile.lifetimeReturns), 1n);

      const loan = await library.read.getLoan([1n]);
      assert.equal(loan.returned, true);
      assert.equal(big(loan.pointsDelta), 15n);
    });

    it("charges a late penalty on overdue returns", async function () {
      await library.write.registerCustomer(["Bob", "bob@example.com", "BOB001", ""], {
        account: bob.account,
      });
      await library.write.borrowBook([1n, ONE_DAY], { account: bob.account });

      let profile = await library.read.getCustomer([bob.account.address]);
      assert.equal(big(profile.pointsBalance), 10n);

      // Warp 36h: 12h past the 24h due date, still within day 2 of lateness.
      await networkHelpers.time.increase(36n * 60n * 60n);

      // Past due: extension window closed.
      await viem.assertions.revertWithCustomError(
        library.write.extendLoan([2n, 3n], { account: bob.account }),
        library,
        "LoanNotCloseToExpiry",
      );

      await library.write.returnBook([2n], { account: bob.account });

      // Returned 12h into the second late day = 2 days late * 2 points/day.
      profile = await library.read.getCustomer([bob.account.address]);
      assert.equal(big(profile.totalPointsPenalized), 4n);
      assert.equal(big(profile.pointsBalance), 6n);

      const loan = await library.read.getLoan([2n]);
      assert.equal(loan.returned, true);
      assert.equal(big(loan.pointsDelta), -4n);
    });

    it("enforces the active-loan limit", async function () {
      await library.write.registerCustomer(
        ["Carol", "carol@example.com", "CAR001", ""],
        { account: carol.account },
      );

      await library.write.borrowBook([1n, SEVEN_DAYS], { account: carol.account });
      await library.write.borrowBook([1n, SEVEN_DAYS], { account: carol.account });
      await library.write.borrowBook([1n, SEVEN_DAYS], { account: carol.account });

      await viem.assertions.revertWithCustomError(
        library.write.borrowBook([1n, SEVEN_DAYS], { account: carol.account }),
        library,
        "MaxActiveLoansReached",
      );

      const profile = await library.read.getCustomer([carol.account.address]);
      assert.equal(big(profile.activeLoansCount), 3n);
    });
  });

  describe("Review System", function () {
    it("lets a borrower review a borrowed book", async function () {
      // Bob borrowed and returned book 1.
      await library.write.addReview([1n, 4, "Late but great"], {
        account: bob.account,
      });

      const reviewIds = await library.read.getBookReviewIds([1n]);
      assert.equal(reviewIds.length, 1);

      const review = await library.read.getReview([1n]);
      assert.equal(review.reviewer.toLowerCase(), bob.account.address.toLowerCase());
      assert.equal(review.rating, 4);
      assert.equal(review.comment, "Late but great");

      const borrowerHistory = await library.read.getBookBorrowerHistory([1n]);
      assert.ok(
        borrowerHistory.some((wallet) => wallet.toLowerCase() === bob.account.address.toLowerCase()),
      );
    });

    it("rejects duplicate reviews", async function () {
      await viem.assertions.revertWithCustomError(
        library.write.addReview([1n, 5, "Again"], { account: bob.account }),
        library,
        "AlreadyReviewed",
      );
    });

    it("rejects reviews from wallets that never borrowed the book", async function () {
      await viem.assertions.revertWithCustomError(
        library.write.addReview([1n, 3, "Never borrowed"], { account: dave.account }),
        library,
        "NotLoanParticipant",
      );
    });
  });

  describe("Pagination", function () {
    it("paginates the catalog", async function () {
      for (let i = 0; i < 5; i++) {
        await library.write.addBook([
          `Book ${i + 2}`,
          "Author",
          `978-0-123-4567${i}-9`,
          1n,
          "fiction",
          [],
        ]);
      }

      const [firstPage, total] = await library.read.getBooksPaginated([0n, 3n]);
      assert.equal(big(total), 6n);
      assert.equal(firstPage.length, 3);
      assert.equal(big(firstPage[0].id), 1n);

      const [secondPage] = await library.read.getBooksPaginated([3n, 3n]);
      assert.equal(secondPage.length, 3);
      assert.equal(big(secondPage[0].id), 4n);
    });
  });

  describe("Admin Functions", function () {
    it("updates point rules", async function () {
      await library.write.setPointRules([20n, 25n, 3n, 5n]);

      assert.equal(await library.read.borrowRewardPoints(), 20n);
      assert.equal(await library.read.onTimeReturnRewardPoints(), 25n);
      assert.equal(await library.read.latePenaltyPerDay(), 3n);
      assert.equal(await library.read.extendRewardPoints(), 5n);
    });

    it("rejects admin calls from non-owners", async function () {
      await viem.assertions.revertWithCustomError(
        library.write.setPointRules([20n, 25n, 3n, 5n], { account: alice.account }),
        library,
        "NotOwner",
      );

      await viem.assertions.revertWithCustomError(
        library.write.setBorrowRules([SEVEN_DAYS, 2n], { account: alice.account }),
        library,
        "NotOwner",
      );

      await viem.assertions.revertWithCustomError(
        library.write.transferOwnership([alice.account.address], {
          account: alice.account,
        }),
        library,
        "NotOwner",
      );
    });
  });
});
