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
        uint32 latePenaltyPerDay
    );
    event BorrowRulesUpdated(uint64 maxBorrowDuration, uint32 maxActiveLoansPerCustomer);

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
        int256 pointsDelta; // +reward or -penalty applied on return
    }

    // Storage
    uint256 public nextBookId = 1;
    uint256 public nextLoanId = 1;

    mapping(uint256 => Book) private books;
    mapping(address => CustomerProfile) private customers;
    mapping(uint256 => Loan) private loans;

    // Per-customer loan bookkeeping.
    mapping(address => uint256[]) private customerActiveLoanIds;
    mapping(address => uint256[]) private customerLoanHistoryIds;
    mapping(uint256 => uint256) private activeLoanIndexPlusOne; // loanId => index + 1

    // Optional borrower history per book.
    mapping(uint256 => address[]) private bookBorrowers;

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
    /**
     * @notice Update point reward/penalty rules.
     */
    function setPointRules(
        uint32 _borrowRewardPoints,
        uint32 _onTimeReturnRewardPoints,
        uint32 _latePenaltyPerDay
    ) external onlyOwner {
        borrowRewardPoints = _borrowRewardPoints;
        onTimeReturnRewardPoints = _onTimeReturnRewardPoints;
        latePenaltyPerDay = _latePenaltyPerDay;
        emit PointRulesUpdated(_borrowRewardPoints, _onTimeReturnRewardPoints, _latePenaltyPerDay);
    }

    /**
     * @notice Update borrowing limits.
     * @param _maxBorrowDuration Maximum borrow length in seconds (e.g., 14 days).
     * @param _maxActiveLoansPerCustomer Maximum simultaneously active loans per customer.
     */
    function setBorrowRules(
        uint64 _maxBorrowDuration,
        uint32 _maxActiveLoansPerCustomer
    ) external onlyOwner {
        maxBorrowDuration = _maxBorrowDuration;
        maxActiveLoansPerCustomer = _maxActiveLoansPerCustomer;
        emit BorrowRulesUpdated(_maxBorrowDuration, _maxActiveLoansPerCustomer);
    }

    // Book Management (permissionless — anyone may list, only lister manages own listing)
    /**
     * @notice Add a new book to the library. Caller becomes the book's lister.
     */
    function addBook(
        string calldata title,
        string calldata author,
        string calldata isbn,
        uint64 copies
    ) external returns (uint256 bookId) {
        if (_isEmpty(title) || _isEmpty(author) || _isEmpty(isbn)) revert EmptyTextField();
        if (copies == 0) revert NoAvailableCopies();

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
            updatedAt: _now64()
        });

        emit BookAdded(bookId, msg.sender, title, author, isbn, copies, copies);
    }

    /**
     * @notice Increase copies for an existing book. Only the original lister may do this.
     */
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

    /**
     * @notice Enable or disable borrowing for a specific book. Only the original lister may do this.
     */
    function setBookActive(uint256 bookId, bool active) external {
        Book storage book = books[bookId];
        if (book.id == 0) revert BookNotFound();
        if (book.lister != msg.sender) revert NotBookLister();
        book.active = active;
        book.updatedAt = _now64();
        emit BookStatusUpdated(bookId, active);
    }

    // Customer Registration & Profiles
    /**
     * @notice Register yourself as a library customer.
     */
    function registerCustomer(
        string calldata fullName,
        string calldata email,
        string calldata memberCode,
        string calldata metadataURI
    ) external {
        _upsertCustomer(msg.sender, fullName, email, memberCode, metadataURI);
    }

    /**
     * @notice Register or update a customer's profile as owner (admin onboarding).
     */
    function ownerUpsertCustomer(
        address customer,
        string calldata fullName,
        string calldata email,
        string calldata memberCode,
        string calldata metadataURI
    ) external onlyOwner {
        if (customer == address(0)) revert ZeroAddress();
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

        profile.fullName = fullName;
        profile.email = email;
        profile.memberCode = memberCode;
        profile.metadataURI = metadataURI;
        profile.updatedAt = _now64();

        emit CustomerProfileUpdated(customer);
    }

    // Borrow / Return
    /**
     * @notice Borrow a book copy.
     * @param bookId Book to borrow.
     * @param requestedDuration Borrow duration in seconds (must be <= maxBorrowDuration).
     */
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

        // Allocate inventory.
        book.availableCopies -= 1;
        book.updatedAt = _now64();

        // Open loan.
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
            pointsDelta: 0
        });

        // Customer stats + tracking.
        profile.activeLoansCount += 1;
        profile.lifetimeBorrows += 1;
        _creditPoints(profile, borrowRewardPoints);

        customerActiveLoanIds[msg.sender].push(loanId);
        activeLoanIndexPlusOne[loanId] = customerActiveLoanIds[msg.sender].length;
        customerLoanHistoryIds[msg.sender].push(loanId);
        bookBorrowers[bookId].push(msg.sender);

        emit Borrowed(loanId, bookId, msg.sender, borrowedAt, dueAt, borrowRewardPoints);
    }

    /**
     * @notice Return a borrowed book.
     * @param loanId Active loan ID.
     */

    function returnBook(uint256 loanId) external {
        Loan storage loan = loans[loanId];
        if (loan.id == 0) revert LoanNotFound();
        if (loan.returned) revert LoanAlreadyClosed();
        if (loan.customer != msg.sender) revert NotLoanBorrower();

        CustomerProfile storage profile = customers[msg.sender];
        Book storage book = books[loan.bookId];

        // Close loan + inventory update.
        loan.returned = true;
        loan.returnedAt = _now64();
        book.availableCopies += 1;
        book.updatedAt = _now64();

        // Active loan bookkeeping removal (swap and pop).
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

    // Read API: Books
    function getBook(uint256 bookId) external view returns (Book memory) {
        Book memory book = books[bookId];
        if (book.id == 0) revert BookNotFound();
        return book;
    }

    function getBooksCount() external view returns (uint256) {
        return nextBookId - 1;
    }

    function getBookBorrowerHistory(uint256 bookId) external view returns (address[] memory) {
        Book memory book = books[bookId];
        if (book.id == 0) revert BookNotFound();
        return bookBorrowers[bookId];
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
        profile.totalPointsPenalized += amount;
        profile.pointsBalance -= int256(amount);
    }

    function _isEmpty(string calldata value) internal pure returns (bool) {
        return bytes(value).length == 0;
    }

    function _now64() internal view returns (uint64) {
        return uint64(block.timestamp);
    }

    function _ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        return a == 0 ? 0 : ((a - 1) / b) + 1;
    }
}
