// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract LibraryManagement {
    // Errors
    error NotOwner();
    error EmptyTextField();
    error BookNotFound();
    error BookInactive();
    error NoAvailableCopies();
    error CustomerNotRegistered();
    error LoanNotFound();
    error LoanAlreadyClosed();
    error NotLoanBorrower();
    error ZeroAddress();
    error BorrowDurationTooLong();
    error MaxActiveLoansReached();
    error NotBookLister();
    error InvalidEmail();
    error InvalidIsbn();
    error MemberCodeAlreadyTaken();
    error PointsBelowZero();
    error LoanNotOverdue();
    error LoanNotCloseToExpiry();
    error AlreadyReviewed();
    error NotLoanParticipant();
    error AlreadyRatedThisBook();

    // Events
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);
    event BookAdded(
        uint256 indexed bookId,
        address indexed lister,
        string title,
        string author,
        string isbn,
        uint64 totalCopies,
        uint64 availableCopies
    );
    event BookCopiesUpdated(uint256 indexed bookId, uint64 totalCopies, uint64 availableCopies);
    event BookStatusUpdated(uint256 indexed bookId, bool active);
    event CustomerRegistered(address indexed customer, string fullName);
    event CustomerProfileUpdated(address indexed customer);
    event Borrowed(
        uint256 indexed loanId,
        uint256 indexed bookId,
        address indexed customer,
        uint64 borrowedAt,
        uint64 dueAt,
        uint256 rewardPoints
    );
    event Returned(
        uint256 indexed loanId,
        uint256 indexed bookId,
        address indexed customer,
        uint64 returnedAt,
        bool lateReturn,
        uint256 pointsDeltaAbs
    );
    event PointRulesUpdated(
        uint32 borrowRewardPoints,
        uint32 onTimeReturnRewardPoints,
        uint32 latePenaltyPerDay,
        uint32 extendRewardPoints
    );
    event BorrowRulesUpdated(uint64 maxBorrowDuration, uint32 maxActiveLoansPerCustomer);
    event LoanExtended(uint256 indexed loanId, uint64 newDueAt, uint32 extensionDays);
    event ReviewAdded(
        uint256 indexed bookId,
        address indexed reviewer,
        uint8 rating,
        string comment
    );

    // Ownership
    address public owner;

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    // Config
    uint64 public maxBorrowDuration = 14 days;
    uint32 public maxActiveLoansPerCustomer = 3;
    uint32 public borrowRewardPoints = 10;
    uint32 public onTimeReturnRewardPoints = 15;
    uint32 public latePenaltyPerDay = 2;
    uint32 public extendRewardPoints = 3; // points earned per extended day
    uint32 public maxExtensionDays = 7;

    // Models
    struct Book {
        uint256 id;
        string title;
        string author;
        string isbn;
        uint64 totalCopies;
        uint64 availableCopies;
        bool active;
        address lister;
        uint64 createdAt;
        uint64 updatedAt;
        string category;
        string[] tags;
    }

    struct CustomerProfile {
        bool registered;
        string fullName;
        string email;
        string memberCode;
        string metadataURI;
        uint64 joinedAt;
        uint64 updatedAt;
        uint32 activeLoansCount;
        uint64 lifetimeBorrows;
        uint64 lifetimeReturns;
        uint256 totalPointsEarned;
        uint256 totalPointsPenalized;
        int256 pointsBalance;
    }

    struct Loan {
        uint256 id;
        uint256 bookId;
        address customer;
        uint64 borrowedAt;
        uint64 dueAt;
        uint64 returnedAt;
        bool returned;
        int256 pointsDelta;
        uint32 extensionsUsed;
    }

    struct Review {
        uint256 id;
        address reviewer;
        uint8 rating;
        string comment;
        uint64 createdAt;
    }

    // Storage
    uint256 public nextBookId = 1;
    uint256 public nextLoanId = 1;
    uint256 public nextReviewId = 1;

    mapping(uint256 => Book) private books;
    ombie mapping(address => CustomerProfile) private customers;
    mapping(uint256 => Loan) private loans;
    mapping(uint256 => Review) private reviews;

    // Per-customer loan bookkeeping.
    mapping(address => uint256[]) private customerActiveLoanIds;
    mapping(address => uint256[]) private customerLoanHistoryIds;
    mapping(uint256 => uint256) private activeLoanIndexPlusOne;

    // Borrower history per book.
    mapping(uint256 => address[]) private bookBorrowers;

    // Per-book reviews
    mapping(uint256 => uint256[]) private bookReviewIds;

    // Tracking memberCode uniqueness
    mapping(string => bool) private memberCodeTaken;

    // Tracking per-reviewer per-book
    mapping(address => mapping(uint256 => bool)) private hasReviewedBook;

    // Constructor
    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // Ownership Functions
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    // Admin: Rules
    function setPointRules(
        uint32 _borrowRewardPoints,
        uint32 _onTimeReturnRewardPoints,
        uint32 _latePenaltyPerDay,
        uint32 _extendRewardPoints
    ) external onlyOwner {
        borrowRewardPoints = _borrowRewardPoints;
        onTimeReturnRewardPoints = _onTimeReturnRewardPoints;
        latePenaltyPerDay = _latePenaltyPerDay;
        extendRewardPoints = _extendRewardPoints;
        emit PointRulesUpdated(_borrowRewardPoints, _onTimeReturnRewardPoints, _latePenaltyPerDay, _extendRewardPoints);
    }

    function setBorrowRules(
        uint64 _maxBorrowDuration,
        uint32 _maxActiveLoansPerCustomer
    ) external onlyOwner {
        maxBorrowDuration = _maxBorrowDuration;
        maxActiveLoansPerCustomer = _maxActiveLoansPerCustomer;
        emit BorrowRulesUpdated(_maxBorrowDuration, _maxActiveLoansPerCustomer);
    }

    // Book Management
    function addBook(
        string calldata title,
        string calldata author,
        string calldata isbn,
        uint64 copies,
        string calldata category,
        string[] calldata tags
    ) external returns (uint256 bookId) {
        if (_isEmpty(title) || _isEmpty(author) || _isEmpty(isbn)) revert EmptyTextField();
        if (copies == 0) revert NoAvailableCopies();
        _validateIsbn(isbn);

        bookId = nextBookId++;
        books[bookId] = Book({
            id: bookId,
            title: title,
            author: author,
            isbn: isbn,
            totalCopies: copies,
            availableCopies: copies,
            active: true,
            lister: msg.sender,
            createdAt: _now64(),
            updatedAt: _now64(),
            category: category,
            tags: tags
        });

        emit BookAdded(bookId, msg.sender, title, author, isbn, copies, copies);
    }

    function addBookCopies(uint256 bookId, uint64 additionalCopies) external {
        if (additionalCopies == 0) revert NoAvailableCopies();
        Book storage book = books[bookId];
        if (book.id == 0) revert BookNotFound();
        if (book.lister != msg.sender) revert NotBookLister();

        book.totalCopies += additionalCopies;
        book.availableCopies += additionalCopies;
        book.updatedAt = _now64();

        emit BookCopiesUpdated(bookId, book.totalCopies, book.availableCopies);
    }

    function setBookActive(uint256 bookId, bool active) external {
        Book storage book = books[bookId];
        if (book.id == 0) revert BookNotFound();
        if (book.lister != msg.sender) revert NotBookLister();
        book.active = active;
        book.updatedAt = _now64();
        emit BookStatusUpdated(bookId, active);
    }

    // Customer Registration & Profiles
    function registerCustomer(
        string calldata fullName,
        string calldata email,
        string calldata memberCode,
        string calldata metadataURI
    ) external {
        _validateEmail(email);
        _upsertCustomer(msg.sender, fullName, email, memberCode, metadataURI);
    }

    function ownerUpsertCustomer(
        address customer,
        string calldata fullName,
        string calldata email,
        string calldata memberCode,
        string calldata metadataURI
    ) external onlyOwner {
        if (customer == address(0)) revert ZeroAddress();
        _validateEmail(email);
        _upsertCustomer(customer, fullName, email, memberCode, metadataURI);
    }

    function _upsertCustomer(
        address customer,
        string calldata fullName,
        string calldata email,
        string calldata memberCode,
        string calldata metadataURI
    ) internal {
        if (_isEmpty(fullName)) revert EmptyTextField();

        CustomerProfile storage profile = customers[customer];
        bool wasRegistered = profile.registered;

        if (!wasRegistered) {
            profile.registered = true;
            profile.joinedAt = _now64();
            emit CustomerRegistered(customer, fullName);
        }

        // Validate memberCode uniqueness if it changed
        if (!_isEmpty(memberCode) && 
            keccak256(abi.encodePacked(profile.memberCode)) != keccak256(abi.encodePacked(memberCode))) {
            if (memberCodeTaken[memberCode]) revert MemberCodeAlreadyTaken();
            if (!_isEmptyStr(profile.memberCode)) {
                memberCodeTaken[profile.memberCode] = false;
            }
            memberCodeTaken[memberCode] = true;
        }

        profile.fullName = fullName;
        profile.email = email;
        profile.memberCode = memberCode;
        profile.metadataURI = metadataURI;
        profile.updatedAt = _now64();

        emit CustomerProfileUpdated(customer);
    }

    // Borrow / Return
    function borrowBook(uint256 bookId, uint64 requestedDuration) external returns (uint256 loanId) {
        if (requestedDuration == 0 || requestedDuration > maxBorrowDuration) {
            revert BorrowDurationTooLong();
        }

        Book storage book = books[bookId];
        if (book.id == 0) revert BookNotFound();
        if (!book.active) revert BookInactive();
        if (book.availableCopies == 0) revert NoAvailableCopies();

        CustomerProfile storage profile = customers[msg.sender];
        if (!profile.registered) revert CustomerNotRegistered();
        if (profile.activeLoansCount >= maxActiveLoansPerCustomer) revert MaxActiveLoansReached();

        book.availableCopies -= 1;
        book.updatedAt = _now64();

        loanId = nextLoanId++;
        uint64 borrowedAt = _now64();
        uint64 dueAt = borrowedAt + requestedDuration;
        loans[loanId] = Loan({
            id: loanId,
            bookId: bookId,
            customer: msg.sender,
            borrowedAt: borrowedAt,
            dueAt: dueAt,
            returnedAt: 0,
            returned: false,
            pointsDelta: 0,
            extensionsUsed: 0
        });

        profile.activeLoansCount += 1;
        profile.lifetimeBorrows += 1;
        _creditPoints(profile, borrowRewardPoints);

        customerActiveLoanIds[msg.sender].push(loanId);
        activeLoanIndexPlusOne[loanId] = customerActiveLoanIds[msg.sender].length;
        customerLoanHistoryIds[msg.sender].push(loanId);
        bookBorrowers[bookId].push(msg.sender);

        emit Borrowed(loanId, bookId, msg.sender, borrowedAt, dueAt, borrowRewardPoints);
    }

    function extendLoan(uint256 loanId, uint32 extensionDays) external {
        if (extensionDays == 0 || extensionDays > maxExtensionDays) revert BorrowDurationTooLong();

        Loan storage loan = loans[loanId];
        if (loan.id == 0) revert LoanNotFound();
        if (loan.returned) revert LoanAlreadyClosed();
        if (loan.customer != msg.sender) revert NotLoanBorrower();

        uint64 now64 = _now64();
        if (now64 > loan.dueAt) revert LoanNotCloseToExpiry();

        uint64 extensionSeconds = uint64(extensionDays) * 1 days;
        loan.dueAt += extensionSeconds;
        loan.extensionsUsed += 1;

        CustomerProfile storage profile = customers[msg.sender];
        uint256 reward = uint256(extensionDays) * extendRewardPoints;
        _creditPoints(profile, reward);

        emit LoanExtended(loanId, loan.dueAt, extensionDays);
    }

    function returnBook(uint256 loanId) external {
        Loan storage loan = loans[loanId];
        if (loan.id == 0) revert LoanNotFound();
        if (loan.returned) revert LoanAlreadyClosed();
        if (loan.customer != msg.sender) revert NotLoanBorrower();

        CustomerProfile storage profile = customers[msg.sender];
        Book storage book = books[loan.bookId];

        loan.returned = true;
        loan.returnedAt = _now64();
        book.availableCopies += 1;
        book.updatedAt = _now64();

        _removeActiveLoan(msg.sender, loanId);
        profile.activeLoansCount -= 1;
        profile.lifetimeReturns += 1;

        bool late = loan.returnedAt > loan.dueAt;
        uint256 pointsDeltaAbs;
        if (late) {
            uint256 daysLate = _ceilDiv(loan.returnedAt - loan.dueAt, 1 days);
            pointsDeltaAbs = daysLate * latePenaltyPerDay;
            _debitPoints(profile, pointsDeltaAbs);
            loan.pointsDelta = -int256(pointsDeltaAbs);
        } else {
            pointsDeltaAbs = onTimeReturnRewardPoints;
            _creditPoints(profile, pointsDeltaAbs);
            loan.pointsDelta = int256(pointsDeltaAbs);
        }

        emit Returned(loanId, loan.bookId, msg.sender, loan.returnedAt, late, pointsDeltaAbs);
    }

    // Review System
    function addReview(uint256 bookId, uint8 rating, string calldata comment) external {
        if (bookId == 0 || books[bookId].id == 0) revert BookNotFound();
        if (rating == 0 || rating > 5) revert EmptyTextField();
        if (_isEmpty(comment)) revert EmptyTextField();
        if (hasReviewedBook[msg.sender][bookId]) revert AlreadyReviewed();

        // Verify reviewer has borrowed this book
        bool hasBorrowed;
        address[] storage borrowers = bookBorrowers[bookId];
        for (uint256 i = 0; i < borrowers.length; i++) {
            if (borrowers[i] == msg.sender) {
                hasBorrowed = true;
                break;
            }
        }
        if (!hasBorrowed) revert NotLoanParticipant();

        uint256 reviewId = nextReviewId++;
        reviews[reviewId] = Review({
            id: reviewId,
            reviewer: msg.sender,
            rating: rating,
            comment: comment,
            createdAt: _now64()
        });

        bookReviewIds[bookId].push(reviewId);
        hasReviewedBook[msg.sender][bookId] = true;

        emit ReviewAdded(bookId, msg.sender, rating, comment);
    }

    // Read API: Books
    function getBook(uint256 bookId) external view returns (Book memory) {
        Book memory book = books[bookId];
        if (book.id == 0) revert BookNotFound();
        return book;
    }

    function getBooksCount() external view returns (uint256) {
        return nextBookId - 1;
    }

    function getBooksPaginated(uint256 start, uint256 limit) external view returns (Book[] memory result, uint256 total) {
        total = nextBookId - 1;
        if (start >= total || limit == 0) return (new Book[](0), total);

        uint256 end = start + limit;
        if (end > total) end = total;
        uint256 count = end - start;

        result = new Book[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = books[start + i + 1];
        }
    }

    function getBookBorrowerHistory(uint256 bookId) external view returns (address[] memory) {
        Book memory book = books[bookId];
        if (book.id == 0) revert BookNotFound();
        return bookBorrowers[bookId];
    }

    function getBookReviewIds(uint256 bookId) external view returns (uint256[] memory) {
        if (bookId == 0 || books[bookId].id == 0) revert BookNotFound();
        return bookReviewIds[bookId];
    }

    function getReview(uint256 reviewId) external view returns (Review memory) {
        Review memory review = reviews[reviewId];
        if (review.id == 0) revert LoanNotFound();
        return review;
    }

    // Read API: Customers
    function getCustomer(address customer) external view returns (CustomerProfile memory) {
        CustomerProfile memory profile = customers[customer];
        if (!profile.registered) revert CustomerNotRegistered();
        return profile;
    }

    function getMyProfile() external view returns (CustomerProfile memory) {
        CustomerProfile memory profile = customers[msg.sender];
        if (!profile.registered) revert CustomerNotRegistered();
        return profile;
    }

    function getMyActiveLoanIds() external view returns (uint256[] memory) {
        return customerActiveLoanIds[msg.sender];
    }

    function getMyLoanHistoryIds() external view returns (uint256[] memory) {
        return customerLoanHistoryIds[msg.sender];
    }

    function getCustomerActiveLoanIds(address customer) external view returns (uint256[] memory) {
        if (!customers[customer].registered) revert CustomerNotRegistered();
        return customerActiveLoanIds[customer];
    }

    function getCustomerLoanHistoryIds(address customer) external view returns (uint256[] memory) {
        if (!customers[customer].registered) revert CustomerNotRegistered();
        return customerLoanHistoryIds[customer];
    }

    // Read API: Loans
    function getLoan(uint256 loanId) external view returns (Loan memory) {
        Loan memory loan = loans[loanId];
        if (loan.id == 0) revert LoanNotFound();
        return loan;
    }

    // Internal Helpers
    function _removeActiveLoan(address customer, uint256 loanId) internal {
        uint256 indexPlusOne = activeLoanIndexPlusOne[loanId];
        if (indexPlusOne == 0) revert LoanNotFound();
        uint256 index = indexPlusOne - 1;

        uint256[] storage active = customerActiveLoanIds[customer];
        uint256 lastIndex = active.length - 1;

        if (index != lastIndex) {
            uint256 swappedLoanId = active[lastIndex];
            active[index] = swappedLoanId;
            activeLoanIndexPlusOne[swappedLoanId] = index + 1;
        }

        active.pop();
        delete activeLoanIndexPlusOne[loanId];
    }

    function _creditPoints(CustomerProfile storage profile, uint256 amount) internal {
        profile.totalPointsEarned += amount;
        profile.pointsBalance += int256(amount);
    }

    function _debitPoints(CustomerProfile storage profile, uint256 amount) internal {
        if (profile.pointsBalance < int256(amount)) revert PointsBelowZero();
        profile.totalPointsPenalized += amount;
        profile.pointsBalance -= int256(amount);
    }

    function _isEmpty(string calldata value) internal pure returns (bool) {
        return bytes(value).length == 0;
    }

    function _isEmptyStr(string memory value) internal pure returns (bool) {
        return bytes(value).length == 0;
    }

    function _now64() internal view returns (uint64) {
        return uint64(block.timestamp);
    }

    function _ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        return a == 0 ? 0 : ((a - 1) / b) + 1;
    }

    function _validateEmail(string calldata email) internal pure {
        if (_isEmpty(email)) revert EmptyTextField();
        bytes memory emailBytes = bytes(email);
        bool hasAt;
        bool hasDotAfterAt;
        uint256 atPos;
        for (uint256 i = 0; i < emailBytes.length; i++) {
            if (emailBytes[i] == "@") {
                if (hasAt) revert InvalidEmail(); // multiple @
                hasAt = true;
                atPos = i;
            }
            if (hasAt && emailBytes[i] == "." && i > atPos + 1) {
                hasDotAfterAt = true;
            }
        }
        if (!hasAt || !hasDotAfterAt || atPos == 0 || atPos == emailBytes.length - 1) revert InvalidEmail();
    }

    function _validateIsbn(string calldata isbn) internal pure {
        if (_isEmpty(isbn)) revert EmptyTextField();
        bytes memory isbnBytes = bytes(isbn);
        uint256 len = isbnBytes.length;
        // Accept ISBN-10 or ISBN-13 (with or without hyphens)
        if (len < 10 || len > 17) revert InvalidIsbn();
        // Basic check: must contain at least 10 digits
        uint256 digitCount;
        for (uint256 i = 0; i < len; i++) {
            if (isbnBytes[i] >= "0" && isbnBytes[i] <= "9") {
                digitCount++;
            } else if (isbnBytes[i] != "-" && isbnBytes[i] != "X" && isbnBytes[i] != "x") {
                revert InvalidIsbn();
            }
        }
        if (digitCount < 10) revert InvalidIsbn();
    }
}