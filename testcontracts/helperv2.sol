// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

interface Ihelper {
    struct User {
        address referrer;
        address parent;
        address[] children;
        address[] indirect;
        address[] direct;
    }

    struct NFT {
        uint256 id;
        uint256 price;
        address _owner;
        string uri;
        uint premium;
        uint256 utilized;
    }

    struct Package {
        uint id;
        uint price;
        uint time;
        uint team;
        uint limit;
        uint purchaseTime;
        uint levelUnlock;
        uint8 directrequired;
        uint packageUpgraded;
    }

    function userPackage(address user) external view returns (Package memory);

    function users(
        address _user
    ) external view returns (address referrer, address parent);

    function userJoiningTime(address user) external view returns (uint);
    function userTradingTime(address user) external view returns (uint);
    function userTradingLimitTime(address user) external view returns (uint);
    function userLimitUtilized(address user) external view returns (uint);
    function userLevelIncomeBlockTime(
        address user
    ) external view returns (uint);
    function packageLevelBonus(address user) external view returns (uint);
    function tradingLevelBonus(address user) external view returns (uint);
    function tradingReferralBonus(address user) external view returns (uint);
    function packageReferralBonus(address user) external view returns (uint);
    function selfTradingProfit(address user) external view returns (uint);
    function getNFTs() external view returns (NFT[] memory);
    function getNFTused() external view returns (NFT[] memory);
    function idPurchasedtime(uint256 id) external view returns (uint256);
    function getusers() external view returns (address[] memory);
    function getUser(address _user) external view returns (User memory);
    function userRegistered(address _user) external view returns (bool);
}

contract Helperv2 is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    IERC721Receiver
{
    struct Package {
        uint id;
        uint price;
        uint time;
        uint team;
        uint limit;
        uint levelUnlock;
        uint8 directrequired;
    }

    struct UserDetails {
        uint userJoiningTime;
        uint userTradingTime;
        uint userTradingLimitTime;
        uint userLimitUtilized;
        uint tradingLevelBonus;
        uint packageLevelBonus;
        uint userLevelIncomeBlockTime;
        uint tradingReferralBonus;
        uint packageReferralBonus;
        uint selfTradingProfit;
        uint packageUpgraded;
    }

    struct User {
        address referrer;
        address parent;
        address[] children;
        address[] indirect;
        address[] direct;
        bool registered;
        UserDetails data;
    }

    struct ticket {
        uint id;
        address user;
        uint income;
        bool filled;
        uint time;
        bool active;
        uint future1;
        uint future2;
    }

    IERC20 public paymentToken;
    Package[] public packages;
    mapping(address => Package) public userPackage;
    mapping(address => User) public users;
    address[] usersArray;

    uint public packageExpiry;
    uint public timelimit;
    Ihelper public helper;
    mapping(uint => ticket) public ticketMapping;
    uint public ticketIndex;
    uint public activeTicketIndex;
    address public adminWallet;
    mapping(address => uint) public balance;
    uint public rateHexa;
    mapping(address => bool) public stakeEligible;

    event Upgrades(uint time, uint amount, uint _type, address _user);
    event Incomes(
        uint time,
        uint amount,
        uint _type,
        address _user,
        uint level,
        uint id
    );

    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _paymentToken,
        address _helper
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        paymentToken = IERC20(_paymentToken);
        packageExpiry = 60 * 5; //60 * 24 * 15;
        packages.push(Package(0, 2 ether, packageExpiry * 1, 0, 1, 1, 0));
        packages.push(Package(1, 5 ether, packageExpiry * 1, 0, 3, 5, 2));
        packages.push(Package(2, 10 ether, packageExpiry * 2, 10, 7, 10, 3));
        packages.push(Package(3, 15 ether, packageExpiry * 3, 12, 11, 15, 4));
        packages.push(Package(4, 20 ether, packageExpiry * 4, 14, 15, 20, 5)); //100 //90
        packages.push(Package(5, 25 ether, packageExpiry * 5, 16, 20, 24, 6));
        timelimit = 60 * 45 ; //60 * 24 * 45;
        helper = Ihelper(_helper);
        rateHexa = 100;

        adminWallet = 0x8397d56A9bec2155E63F62133C8fbDA30C61A7eF;
    }

    function register(address _ref) public {
        address _user = msg.sender;
        address _referrer = _ref != address(0) ? _ref : owner();
        uint amount = packages[0].price * rateHexa;
        Package memory tx1 = packages[0];
        userPackage[_user] = tx1;
        require(
            paymentToken.allowance(msg.sender, address(this)) >= amount,
            "insufficient allowance"
        );
        require(users[_user].referrer == address(0), "zero address");
        require(_referrer != _user, "self referrer");
        require(users[_referrer].registered, "referrer not registered");
        paymentToken.transferFrom(msg.sender, address(this), amount);
        address placement = findAvailableSlot(_referrer);
        users[_user].referrer = _referrer;
        users[_user].parent = placement;
        users[_user].registered = true;
        users[placement].children.push(_user);
        users[_user].data.packageUpgraded = block.timestamp;
        users[_user].data.userJoiningTime = block.timestamp;
        users[_user].data.userTradingLimitTime = block.timestamp;
        usersArray.push(_user);
        // Direct referral list
        users[_referrer].direct.push(_user);

        // ✅ Add to referrer's indirect network

        address current = placement;
        for (uint i = 0; i < 25; i++) {
            if (current == address(0)) break;
            users[current].indirect.push(_user);
            current = users[current].parent;
        }

        if (
            block.timestamp - users[_referrer].data.packageUpgraded <= timelimit
        ) {
            paymentToken.transfer(_referrer, amount / 2);
            users[_referrer].data.packageReferralBonus += amount / 2;
            emit Incomes(block.timestamp, (amount * 2), 1, _referrer, 0, 0);
        }

        paymentToken.transfer(adminWallet, amount / 2);

        emit Upgrades(block.timestamp, amount, 0, _user);
    }

    function findAvailableSlot(
        address _root
    ) public view returns (address placement) {
        // Quick win: if root has space, return it immediately
        if (users[_root].children.length < 2) {
            placement = _root;
            return placement;
        }

        address[] memory upline = users[_root].indirect;

        for (uint i = 0; i < upline.length; i++) {
            if (users[upline[i]].children.length < 2) {
                placement = upline[i];
                return placement;
            }
        }
    }

    function buyPackage(uint8 id) public {
        uint amount = packages[id].price * rateHexa;
        address _user = msg.sender;

        require(checkEligibility(_user, id), "not eligible");
        require(id >= userPackage[_user].id, "cannot upgrade old package");
        require(users[_user].registered, "6");
        require(
            paymentToken.allowance(msg.sender, address(this)) >= amount,
            "7"
        );
        paymentToken.transferFrom(msg.sender, address(this), amount);
        Package memory tx1 = packages[id];
        users[_user].data.packageUpgraded = block.timestamp;

        userPackage[_user] = tx1;
        users[_user].data.userLimitUtilized = 0;
        users[_user].data.userTradingLimitTime = block.timestamp;

        paymentToken.transfer(adminWallet, (amount * 20) / 100);

        address up = users[_user].referrer;

        if (block.timestamp - users[up].data.packageUpgraded <= timelimit) {
            paymentToken.transfer(up, (amount * 20) / 100);
            users[up].data.packageReferralBonus += amount / 2;
            emit Incomes(block.timestamp, (amount * 20) / 100, 1, up, 0, 0);
        }

        address[] memory _uplines = getUplines(_user);

        processLevelIncome(_uplines, (amount * 60) / 100, 25, 2, 0);
        emit Upgrades(block.timestamp, amount, id, _user);
    }

    function processLevelIncome(
        address[] memory _uplines,
        uint _amount,
        uint8 levelD,
        uint8 _type,
        uint _id
    ) internal {
        uint leftOver = 0;

        for (uint i = 0; i < _uplines.length; i++) {
            address up = _uplines[i];
            bool cond = _type == 2 // Package Buy
                ? users[up].direct.length >= 2
                : // : ((userPackage[up].id == 5 && // NFT buy
                //     users[up].data.userLimitUtilized >=
                //         (userPackage[up].limit / 2)) ||
                //     userPackage[up].id != 5) &&
                userPackage[up].levelUnlock >= i &&
                    checkActive(users[up].direct) >=
                        userPackage[up].directrequired;
            uint transactionType = _type == 1 ? 2 : 3;
            if (
                cond &&
                block.timestamp - users[up].data.packageUpgraded <= timelimit &&
                userPackage[up].id > 0
            ) {
                paymentToken.transfer(up, _amount / levelD);
                if (_type == 1) {
                    users[up].data.userLimitUtilized += (_amount * 60) / levelD;
                } else {
                    users[up].data.packageLevelBonus += _amount / levelD;
                }

                emit Incomes(
                    block.timestamp,
                    _amount / levelD,
                    transactionType,
                    up,
                    i + 1,
                    _id
                );
                leftOver++;
            }
        }

        uint validLeftOver = leftOver > levelD ? levelD : leftOver;
        paymentToken.transfer(
            adminWallet,
            (_amount * (levelD - validLeftOver)) / levelD
        );
    }

    function checkActive(
        address[] memory _users
    ) public view returns (uint count) {
        for (uint i = 0; i < _users.length; i++) {
            if (
                block.timestamp - users[_users[i]].data.packageUpgraded <=
                timelimit
            ) {
                count++;
            }
        }
    }

    function getUplines(address user) public view returns (address[] memory) {
        address[] memory temp = new address[](25); // temporary
        uint8 count = 0;

        for (uint8 i = 0; i < 25; i++) {
            address parent = users[user].parent;
            if (parent == address(0)) break;
            temp[count] = parent;
            user = parent;
            count++;
        }

        // resize to actual count
        address[] memory uplines = new address[](count);
        for (uint8 j = 0; j < count; j++) {
            uplines[j] = temp[j];
        }

        return uplines;
    }

    function checkEligibility(
        address _user,
        uint8 _id
    ) public view returns (bool condition) {
        Package memory _package = packages[_id];

        //    Package memory _currentPackage = userPackage[_user];

        condition =
            block.timestamp - users[_user].data.userJoiningTime >=
                _package.time ||
            users[_user].indirect.length >= _package.team;
    }

    function trade() public {
        uint amount = 6 ether * rateHexa;

        require(
            paymentToken.allowance(msg.sender, address(this)) >= amount,
            "Allowance insufficient"
        );
        paymentToken.transferFrom(msg.sender, address(this), amount);

        ticket memory tx1 = ticket(
            ticketIndex,
            msg.sender,
            0,
            false,
            block.timestamp,
            false,
            0,
            0
        );
        ticketMapping[ticketIndex] = tx1;
        ticketIndex++;

        paymentToken.transfer(adminWallet, (amount * 10) / 100);
        address referrer = users[msg.sender].referrer == address(0)
            ? adminWallet
            : users[msg.sender].referrer;
        paymentToken.transfer(referrer, (amount * 5) / 100);
        emit Incomes(block.timestamp, (amount * 5) / 100, 0, referrer, 0, 0);
        users[referrer].data.tradingReferralBonus += (amount * 5) / 100;
        users[msg.sender].data.userLimitUtilized++;
        require(
            users[msg.sender].data.userLimitUtilized <=
                userPackage[msg.sender].limit,
            "2"
        );

        if (
            block.timestamp - users[msg.sender].data.userTradingLimitTime >
            30 minutes
        ) {
            // Reset after 3 minutes
            users[msg.sender].data.userTradingLimitTime = block.timestamp;
            users[msg.sender].data.userLimitUtilized = 0;
        }
        address[] memory _uplines = getUplines(msg.sender);

        if (_uplines.length == 25) {
            paymentToken.transfer(_uplines[24], (amount * 5) / 100);
        } else {
            paymentToken.transfer(adminWallet, (amount * 5) / 100);
        }

        processLevelIncome(_uplines, (amount * 30) / 100, 24, 1, 0);
        ticketMapping[activeTicketIndex].income += (amount * 50) / 100;
        balance[ticketMapping[activeTicketIndex].user] += (amount * 50) / 100;
        users[ticketMapping[activeTicketIndex].user].data.selfTradingProfit +=
            (amount * 50) / 100;

        if (ticketMapping[activeTicketIndex].income >= (amount * 3) / 2) {
            ticketMapping[activeTicketIndex].active = true;
            activeTicketIndex++;
        }
        stakeEligible[msg.sender] = true;
    }

    function settle(uint _ticket) public {
        trade();
        require(
            ticketMapping[_ticket].user == msg.sender &&
                !ticketMapping[_ticket].filled &&
                ticketMapping[_ticket].active,
            "you are not authorized"
        );

        ticketMapping[_ticket].filled = true;
        balance[ticketMapping[_ticket].user] -= 9 ether * rateHexa;
        paymentToken.transfer(msg.sender, 9 ether * rateHexa);
    }

    function changePackages(
        uint id,
        Package memory _package,
        uint _packageExpiry
    ) public onlyOwner {
        packageExpiry = _packageExpiry == 0 ? packageExpiry : _packageExpiry;
        packages[id] = _package;
    }

    function _authorizeUpgrade(address newImpl) internal override onlyOwner {}

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function getUser(address _user) external view returns (User memory) {
        return (users[_user]);
    }

    function getPackages() public view returns (Package[] memory) {
        return packages;
    }

    function changeWallet(address _adminWallet) public onlyOwner {
        adminWallet = _adminWallet;
    }

    function migrate(address _user) public onlyOwner {
        require(helper.userRegistered(_user), "Not registered");
        require(!users[_user].registered, "Not registered");
        // require(!users[_user].registered, "Already migrated");

        // Fetch old data
        Ihelper.User memory oldUser = helper.getUser(_user);
        Ihelper.Package memory _package = helper.userPackage(_user);

        // Migrate package
        userPackage[_user] = Package(
            _package.id,
            _package.price,
            _package.time,
            _package.team,
            packages[_package.id].limit,
            _package.levelUnlock,
            _package.directrequired
        );

        // Storage pointer
        User storage u = users[_user];

        // Migrate address-based relationships
        u.referrer = oldUser.referrer;
        u.parent = oldUser.parent;
        u.children = oldUser.children;
        u.indirect = oldUser.indirect;
        u.direct = oldUser.direct;

        // Mark registered BEFORE pushing integers (reentrancy safety)
        u.registered = true;

        // =========================
        // PUSH INTEGER VALUES
        // =========================

        u.data.userJoiningTime = block.timestamp; // 0
        u.data.userTradingTime = helper.userTradingTime(_user); // 1
        u.data.userTradingLimitTime = helper.userTradingLimitTime(_user); // 2
        u.data.userLimitUtilized = 0; // 3
        u.data.tradingLevelBonus = helper.tradingLevelBonus(_user); // 4
        u.data.packageLevelBonus = helper.packageLevelBonus(_user); // 5
        u.data.userLevelIncomeBlockTime = 0; // 6
        u.data.tradingReferralBonus = helper.tradingReferralBonus(_user); // 7
        u.data.packageReferralBonus = helper.packageReferralBonus(_user); // 8
        u.data.selfTradingProfit = helper.selfTradingProfit(_user); // 9
        u.data.packageUpgraded = _package.packageUpgraded;
    }

    function migrateBulk(address[] memory _users) public onlyOwner {
        for (uint i = 0; i < _users.length; i++) {
            migrate(_users[i]);
        }
    }
}

interface IHelperV2 {
    struct ticket {
        uint id;
        address user;
        uint income;
        bool filled;
        uint time;
        bool active;
        uint future1;
        uint future2;
    }

    function ticketIndex() external view returns (uint);
    function ticketMapping(uint) external view returns (ticket memory);
}

contract DataFetcherUpgradeable is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    IHelperV2 public helper;

    address[] public oldUsers;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _helper) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        helper = IHelperV2(_helper);
    }

    function updateHelper(address _helper) external onlyOwner {
        helper = IHelperV2(_helper);
    }

    function getTicketsByUser(
        address _user
    ) public view returns (IHelperV2.ticket[] memory) {
        uint totalTickets = helper.ticketIndex();

        // First pass: count matching tickets
        uint count = 0;
        for (uint i = 0; i < totalTickets; i++) {
            IHelperV2.ticket memory tx2 = helper.ticketMapping(i);
            if (tx2.user == _user) {
                count++;
            }
        }

        // Allocate exact-sized array
        IHelperV2.ticket[] memory userTickets = new IHelperV2.ticket[](count);

        // Second pass: fill array
        uint j = 0;
        for (uint i = 0; i < totalTickets; i++) {
            IHelperV2.ticket memory tx1 = helper.ticketMapping(i);
            if (tx1.user == _user) {
                userTickets[j] = tx1;
                j++;
            }
        }

        return userTickets;
    }

    function _authorizeUpgrade(address newImpl) internal override onlyOwner {}
}
