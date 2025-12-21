// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import upgradeable versions instead of regular contracts
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

interface IHelper {
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

    function userPackage(
        address user
    )
        external
        view
        returns (uint, uint, uint, uint, uint, uint, uint, uint8, uint);

    function users (address _user) external view returns (
        address referrer,
        address parent

    );

    function getNFTs() external view returns (NFT[] memory);
    function idPurchasedtime(uint256 id) external view returns (uint256);
    function getusers() external view returns (address[] memory);
}

contract DataFetcherUpgradeable is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    IHelper public helper;

    struct NFTInfo {
        uint256 id;
        uint256 price;
        address _owner;
        string uri;
        uint premium;
        uint256 utilized;
        uint256 purchasedTime;
    }

    struct User {
        address _address;
        uint packageId;
        uint price;
        uint time;
        uint team;
        uint limit;
        uint purchaseTime;
        uint levelUnlock;
        uint8 directrequired;
        uint packageUpgraded;
        address referrer;
        uint joiningDate;
        uint extra1;
        uint extra2;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _owner, address _helper) public initializer {
        __Ownable_init(_owner);
        __UUPSUpgradeable_init();

        helper = IHelper(_helper);
    }

    function updateHelper(address _helper) external onlyOwner {
        helper = IHelper(_helper);
    }

    function getAllPurchasedTimes(
        uint256[] memory ids
    ) external view returns (uint256[] memory) {
        uint256[] memory arr = new uint256[](ids.length);

        for (uint i = 0; i < ids.length; i++) {
            arr[i] = helper.idPurchasedtime(ids[i]);
        }

        return arr;
    }

    function _authorizeUpgrade(address newImpl) internal override onlyOwner {}

    function getNFTs() external view returns (NFTInfo[] memory) {
        IHelper.NFT[] memory nfts = helper.getNFTs();

        // First count how many valid NFTs (owner != 0)
        uint256 count = 0;
        for (uint256 i = 0; i < nfts.length; i++) {
            if (nfts[i]._owner != address(0)) {
                count++;
            }
        }

        NFTInfo[] memory arr = new NFTInfo[](count);
        uint256 j = 0;

        for (uint256 i = 0; i < nfts.length; i++) {
            if (nfts[i]._owner != address(0)) {
                arr[j] = NFTInfo({
                    id: nfts[i].id,
                    price: nfts[i].price,
                    _owner: nfts[i]._owner,
                    uri: nfts[i].uri,
                    premium: nfts[i].premium,
                    utilized: nfts[i].utilized,
                    purchasedTime: helper.idPurchasedtime(nfts[i].id)
                });
                j++;
            }
        }

        return arr;
    }

function getUsers() external view returns (User[] memory) {
    address[] memory users = helper.getusers();

    User[] memory arr = new User[](users.length);

    for (uint256 i = 0; i < users.length; i++) {
        (
            uint id,
            uint price,
            uint time,
            uint team,
            uint limit,
            uint purchaseTime,
            uint levelUnlock,
            uint8 directrequired,
            uint packageUpgraded
        ) = helper.userPackage(users[i]);

        (address referrer, ) = helper.users(users[i]);

        arr[i] = User({
            _address: users[i],
            packageId: id,
            price: price,
            time: time,
            team: team,
            limit: limit,
            purchaseTime: purchaseTime,
            levelUnlock: levelUnlock,
            directrequired: directrequired,
            packageUpgraded: packageUpgraded,
            referrer: referrer,
            joiningDate: 0,
            extra1: 0,
            extra2: 0
        });
    }

    return arr;
}

}
