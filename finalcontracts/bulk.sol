// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import upgradeable versions instead of regular contracts
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";



contract Save is Initializable, UUPSUpgradeable, OwnableUpgradeable {

    string[] public array;
    uint public arrayToStart;
    uint public unitsToEnter;
    uint[] public unitsToEnterArray;
    uint public populationSize; 

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _owner) public initializer {
        __Ownable_init(_owner);
        __UUPSUpgradeable_init();


    }

    function add(string[] memory _add) public {
        for(uint i=0; i<_add.length; i++){
            array.push(_add[i]);
        }
    }

    function removeFirst() public {
        for (uint i = 0; i < array.length - 1; i++) {
            array[i] = array[i + 1];
        }
        array.pop(); // remove last element
    }

    function getArray() public view returns(string[] memory ){
        return array;
    }

    function setArrayStart (uint _uint) public {
        arrayToStart = _uint;
    }

    function unitToEnter (uint _uint) public {
        unitsToEnterArray.push(_uint);
    }

    function _authorizeUpgrade(address newImpl) internal override onlyOwner {}

    function getUnitArray () public view returns (uint[] memory){
        return unitsToEnterArray;
    }

    function setPopulation(uint _uint) public {
        populationSize = _uint;
    }

}