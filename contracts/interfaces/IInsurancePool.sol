//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

interface IInsurancePool {

  event Deposit(address indexed _user, uint _amount, uint _timestamp);
  event Withdraw(address indexed _user, uint _amount, uint _timestamp);
  event Purchase(address indexed _user, uint _amount, uint _duration, uint _rate, uint _timestamp);

  function pricePurchase(uint _amount, uint _duration, uint _rate) external pure returns(uint);
  function comsPurchase(uint _amount, uint _duration, uint _rate) external view returns(uint);
  function getCapitalInsured() external view returns(uint);
  function getReserve() external view returns(uint);
  function getCapitalInsurer() external view returns(uint);
  function getInterestFromPurchase() external view returns(uint);
  function getInsOwner() external view returns(address);
  function getInsAmount() external view returns(uint);
  function getInsCover() external view returns(bool);
  function getContractBalance() external view returns(uint);
  function getTotalDeposit() external view returns(uint);
  function getTotalPurchase() external view returns(uint);

}
