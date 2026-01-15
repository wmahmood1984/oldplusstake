// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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

    struct queIncome {
        address user;
        uint id;
        uint income;
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
    function getNFTs(address user) external view returns (NFT[] memory);
    function getNFTused() external view returns (NFT[] memory);
    function idPurchasedtime(uint256 id) external view returns (uint256);
    function getusers() external view returns (address[] memory);
    function getUser(address _user) external view returns (User memory);
    function userRegistered(address _user) external view returns (bool);
    function getNFTque() external view returns (queIncome[] memory);
    function stakeAndBurn(address _user) external;
}

interface Ihelperv2 {
        function stakeEligible(address user) external view returns (bool);
}

contract Staking is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    Ihelper public helper;
    IERC20 public paymentToken;
    uint public APR;
    Ihelperv2 public helperv2;

    struct Stake {
        uint id;
        address user;
        uint256 amount;
        uint256 time;
        uint256 lastClaimTime;
        uint256 claimable;
        uint256 amountClaimed;
    }

    struct Claim {
        uint time;
        address user;
        uint amountClaimed;
    }

    mapping(uint => Stake) public stakeMapping;
    uint public stakeIndex;
    mapping(address=>Claim[]) public claimMapping;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _helper, address _token, address _helperv2) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        helper = Ihelper(_helper);
        paymentToken = IERC20(_token);
        helperv2 = Ihelperv2(_helperv2);
        APR = 50;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function changeAPR(uint _apr) public onlyOwner {
        APR = _apr;
    }

    function getData(
        address _user
    ) public view returns (uint marketTotal, uint burnt, uint que,
    uint marketCount, uint burntCount, uint queCount) {
        // ---------- MARKET NFT PREMIUM ----------
        Ihelper.NFT[] memory market = helper.getNFTs(_user);
        for (uint i = 0; i < market.length; i++) {
            marketTotal += market[i].premium;
        }

        marketCount = market.length;

        // ---------- BURNT NFT PREMIUM ----------
        Ihelper.NFT[] memory allBurnt = helper.getNFTused();
        for (uint i = 0; i < allBurnt.length; i++) {
            if (allBurnt[i]._owner == _user) {
                burnt += allBurnt[i].premium;
                burntCount++;
            }
        }

        // ---------- NFT QUE PREMIUM ----------
        Ihelper.queIncome[] memory allQue = helper.getNFTque();
        uint QUE_PREMIUM = 30 ether; // 30 * 10^18

        for (uint i = 0; i < allQue.length; i++) {
            if (allQue[i].user == _user) {
                que += (QUE_PREMIUM - allQue[i].income);
                queCount++;    
                // else: fully paid, add nothing
            }
        }
    }

    function stake() public {
        require(helperv2.stakeEligible(msg.sender),"Please get the trade done on new module");
        (uint a, uint b, uint c,,,) = getData(msg.sender);
        uint amount = a + b + c;
        helper.stakeAndBurn(msg.sender);
        stakeMapping[stakeIndex] = Stake({
            id: stakeIndex,
            user: msg.sender,
            amount: amount,
            time: block.timestamp,
            lastClaimTime: block.timestamp,
            claimable: 0,
            amountClaimed: 0
        });
        stakeIndex++;

        helper.stakeAndBurn(msg.sender);
    }

    function getAmounts(uint _id) public view returns (uint claimable) {
        uint amount = stakeMapping[_id].amount;
        uint daysPassed = (block.timestamp - stakeMapping[_id].time) /
            (60 * 60 * 24);
        claimable = (amount * APR * daysPassed) / 1000;
    }

    function claim(uint _id) public {
        address user = stakeMapping[_id].user;
        require(user==msg.sender,"you are not authorized");
        uint amount = getAmounts(_id);
        stakeMapping[_id].claimable = amount;
        uint claimable = amount - stakeMapping[_id].amountClaimed;
        stakeMapping[_id].amountClaimed = amount;
        paymentToken.transfer(user,claimable);
        claimMapping[user].push(Claim(block.timestamp,user,claimable));
    }

    function getTicketsByUser(
        address _user
     ) public view returns (Stake[] memory) {
        uint count = 0;
        for (uint i = 0; i < stakeIndex; i++) {
            Stake memory tx2 = stakeMapping[i];
            if (tx2.user == _user) {
                count++;
            }
        }

        // Allocate exact-sized array
        Stake[] memory userStake = new Stake[](count);

        // Second pass: fill array
        uint j = 0;
        for (uint i = 0; i < stakeIndex; i++) {
            Stake memory tx1 = stakeMapping[i];
            if (tx1.user == _user) {
                tx1.claimable = getAmounts(tx1.id);
                userStake[j] = tx1;
                j++;
            }
        }

        return userStake;
    }

    function getClaims(address _claimer) public view returns (Claim[] memory) {
        return claimMapping[_claimer];
    }
}
