//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./interfaces/IInsurancePool.sol";

contract InsurancePool is Initializable {
  using SafeMath for uint256;

  uint public depositCount;
  uint public purchaseCount;
  uint public insurersCount;

  uint public comsRate = 1;
  uint public initialReserve = 10000;

  address[] public addrInsurers;
  address[] public addrInsured;

  struct Depositor {
    address payable owner;
    uint balance;
  }

  struct Insurer {
    address payable owner;
    uint balance;
    uint interests;
  }

  struct Purchaser {
    address payable owner;
    uint balance;
    uint reserve;
  }

  struct Insured {
    address payable owner;
    uint amount;
    uint duration;
    uint rate;
    bool isCovered;
  }

  mapping(address => Insurer) public insurers;
  mapping(address => Insured) public insured;
  mapping(uint => Depositor) public deposits;
  mapping(uint => Purchaser) public purchases;

  event Deposit(address indexed _user, uint _amount, uint _timestamp);
  event Withdraw(address indexed _user, uint _amount, uint _timestamp);
  event Purchase(address indexed _user, uint _amount, uint _duration, uint _rate, uint _timestamp);

  receive() external payable { }

  function deposit() external payable {
    bool isDepositor;
    for(uint i = 0; i < depositCount; i++) {
      if(deposits[i].owner == payable(msg.sender)) {
        insurers[msg.sender].balance += msg.value;
        isDepositor = true;
      }
    }
    if(!isDepositor) {
      insurers[msg.sender] = Insurer(payable(msg.sender), msg.value, 0);
      addrInsurers.push(msg.sender);
    }

    deposits[depositCount] = Depositor(payable(msg.sender),msg.value);
    depositCount++;

    emit Deposit(msg.sender, msg.value, block.timestamp);
  }

  function withdraw(uint _amount) external payable {
    uint maxWithdraw = insurers[msg.sender].balance + insurers[msg.sender].interests;
    require(maxWithdraw > 0, "You should deposit first");
    require(_amount <= maxWithdraw, "You dont have enough deposit");

    insurers[msg.sender].balance -= _amount;
    payable(msg.sender).transfer(_amount);

    emit Withdraw(msg.sender, msg.value, block.timestamp);
  }

  function purchase(uint _amount, uint _duration) external payable {
    bool isPurchaser;
    uint _rate = 1;

    require(healthFactor() > 1, "Not enough funds to assume any new purchase");
    require(msg.value == pricePurchase(_amount, _duration, _rate), "Pay the premium price");

    insured[msg.sender] = Insured(payable(msg.sender), _amount, _duration, _rate, true);

    for(uint i = 0; i < purchaseCount; i++) {
      if(purchases[i].owner == msg.sender) isPurchaser == true;
    }
    if(!isPurchaser) addrInsured.push(msg.sender);

    purchases[purchaseCount] = Purchaser(payable(msg.sender), msg.value, comsPurchase(_amount, _duration, _rate));
    purchaseCount++;

    interestFromPurchase(_amount, _duration, _rate);

    emit Purchase(msg.sender, _amount, _duration, _rate,  block.timestamp);
  }

  function pricePurchase(uint _amount, uint _duration, uint _rate) public pure returns(uint) {
    return _amount * _duration * _rate/100;
  }

  function comsPurchase(uint _amount, uint _duration, uint _rate) public view returns(uint) {
    return _amount * _duration * _rate/100 * comsRate/100;
  }

  function interestFromPurchase(uint _amount, uint _duration, uint _rate) public {
    uint capitalInsurer = getCapitalInsurer();
    uint interests = pricePurchase(_amount, _rate, _duration) - comsPurchase(_amount, _rate, _duration);
    for(uint i = 0; i < addrInsurers.length; i++) {
      insurers[addrInsurers[i]].interests = interests * insurers[addrInsurers[i]].balance / capitalInsurer;
    }
  }

  function healthFactor() public view returns(uint) {
    uint capitalInsured = getCapitalInsured();
    uint capitalInsurer = getCapitalInsurer();
    uint reserve = getReserve();
    uint interests = getInterestFromPurchase();

    return (capitalInsurer + reserve + interests) / (capitalInsured + 1);
  }

  function getCapitalInsured() public view returns(uint) {
    uint capitalInsured = 0;
    for(uint i = 0; i < addrInsured.length; i++) {
      if(insured[addrInsured[i]].isCovered) {
        capitalInsured += insured[addrInsured[i]].amount;
      }
    }
    return capitalInsured;
  }

  function getReserve() public view returns(uint) {
    uint reserve;
    for(uint i = 0; i < purchaseCount; i++) {
      reserve += purchases[i].reserve;
    }
    return initialReserve + reserve;
  }

  function getCapitalInsurer() public view returns(uint) {
    uint capitalInsurer;
    for(uint i = 0; i < addrInsurers.length; i++) {
      capitalInsurer += insurers[addrInsurers[i]].balance;
    }
    return capitalInsurer;
  }

  function getInterestFromPurchase() public view returns(uint) {
    uint interests;
    for(uint i = 0; i < addrInsurers.length; i++) {
      interests += insurers[addrInsurers[i]].interests;
    }
    return interests;
  }

  function getMyBalance() public view returns(uint) {
    return insurers[msg.sender].balance;
  }

  function getMyInterests() public view returns(uint) {
    return insurers[msg.sender].interests;
  }

  function getMyIns() public view returns(Insured memory) {
    return insured[msg.sender];
  }

  function getInsOwner() public view returns(address) {
    return insured[msg.sender].owner;
  }

  function getInsAmount() public view returns(uint) {
    return insured[msg.sender].amount;
  }

  function getInsCover() public view returns(bool) {
    return insured[msg.sender].isCovered;
  }


  function getContractBalance() public view returns(uint) {
    return address(this).balance;
  }

  function getTotalDeposit() public view returns(uint) {
    return depositCount;
  }

  function getTotalPurchase() public view returns(uint) {
    return purchaseCount;
  }


///////////////////// CLAIMSMANGEMENT.SOL //////////////////


  address public owner;
  address[] public addrClaims;
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

  event Paid(address indexed _user, uint _amount, uint _timestamp);

  constructor() {
    owner = msg.sender;
  }

  function declareClaim() OnlyInsured external {
    require(msg.sender == getInsOwner(), "You dont have any insurance");
    require(getInsCover());

    addrClaims.push(msg.sender);
    claims[msg.sender] = Claim(msg.sender, block.timestamp, getInsAmount(), false, false);
    claimCount++;
  }

  function payClaim() external OnlyInsured {
    require(getClaimedDetails(), "Product should be in a claim state");
    require(!claims[msg.sender].isRefund);

    payable(msg.sender).transfer(claims[msg.sender].amount);
    claims[msg.sender].isRefund = true;

    emit Paid(msg.sender, claims[msg.sender].amount, block.timestamp);
  }

  function setProductState(bool _bool) external OnlyGovernance {
    isAAVEclaimed = _bool;
  }

  function getTotalClaim() public view returns(uint) {
    return claimCount;
  }

  function getTotalPaid() public view returns(uint) {
    uint totalPaid;
    for(uint i = 0; i < addrClaims.length; i++) {
      if(claims[addrClaims[i]].isRefund) totalPaid += claims[addrClaims[i]].amount;
    }
    return totalPaid;
  }

  function getClaimedDetails() public view returns(bool){
    return isAAVEclaimed;
  }

  function getMyClaim() public view returns(Claim memory){
    return claims[msg.sender];
  }

  modifier OnlyInsured {
    require(msg.sender == getInsOwner(), "You dont have any insurance");
    _;
  }

  modifier OnlyGovernance() {
    require(msg.sender == owner, "Caller is not from governance");
    _;
  }

}
