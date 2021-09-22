import InsurancePool from './artifacts/contracts/InsurancePool.sol/InsurancePool';
import {ethers} from 'ethers';

const provider = new ethers.providers.Web3Provider(ethereum);

export default async function deploy(value) {
  await ethereum.request({ method: 'eth_requestAccounts' });
  const signer = provider.getSigner();
  const factory = new ethers.ContractFactory(InsurancePool.abi, InsurancePool.bytecode, signer);
  return factory.deploy({ value });
}
