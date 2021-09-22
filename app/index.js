// import {ethers} from 'ethers';
// import deploy from './deploy';
// import addDeposit from './pool';
// import withdrawCapital from './pool';
// import loadDatas from './loadDatas';
import './index.scss';

const server = 'http://localhost:50700';


// async function newDeposit() {
//   const value = ethers.utils.parseUnits(document.getElementById("depositAmount").value, "ether");
//   const contract = await deploy();
//   addDeposit();
//   const req = `${server}/send/${ethers.utils.formatUnits(value, "ether")}`;
//   const request = new Request(req, { method: 'POST' });
//   try {
//     await fetch(request);
//   }
//   catch(err) {
//     console.log(err);
//   }
// }
//
// async function newWithdraw() {
//   const value = ethers.utils.parseUnits(document.getElementById("withdrawAmount").value, "ether");
//   const contract = await deploy(value);
//   withdrawCapital();
//   const req = `${server}/send/${ethers.utils.formatUnits(value, "ether")}`;
//   const request = new Request(req, { method: 'POST' });
//   try {
//     await fetch(request);
//   }
//   catch(err) {
//     console.log(err);
//   }
// }
//
// document.getElementById("depositButton").addEventListener("click", newDeposit);
// document.getElementById("withdrawButton").addEventListener("click", newWithdraw);
// loadDatas();
