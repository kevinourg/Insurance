//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/IInsurancePool.sol";

contract ClaimsManagement {
  using SafeMath for uint256;

  address public owner;
  uint public claimCount = 0;
  bool public isAAVEclaimed;
  IInsurancePool pool;

  struct Claim {
    address owner;
    uint dateClaim;
    uint amount;
    bool isClaimed;
    bool isRefund;
  }

  mapping(address => Claim) public claims;

  constructor() {
    owner = msg.sender;
  }

  function declareClaim() external {
    //require(msg.sender == pool.getInsOwner(), "You dont have any insurance");
    //require(pool.getInsCover());
    //claims[msg.sender] = Claim(msg.sender, block.timestamp, pool.getInsAmount(), false, false);
    claimCount++;
  }

  function getClaimedDetails() public OnlyInsured view returns(bool){
    return isAAVEclaimed;
  }

  function setProductState(bool _bool) private OnlyGovernance {
    isAAVEclaimed = _bool;
  }

  function payClaim() external OnlyInsured {
    require(getClaimedDetails(), "Product should be in a claim state");
    require(!claims[msg.sender].isRefund);
    payable(msg.sender).transfer(claims[msg.sender].amount);
    claims[msg.sender].isRefund = true;
  }

  function getTotalClaim() public view returns(uint) {
    return claimCount;
  }

  modifier OnlyInsured {
    require(msg.sender == pool.getInsOwner(), "You dont have any insurance");
    _;
  }

  modifier OnlyGovernance() {
    require(msg.sender == owner, "Caller is not from governance");
    _;
  }

}
