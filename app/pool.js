import {ethers} from 'ethers';
import deploy from './deploy';

const provider = new ethers.providers.Web3Provider(ethereum);
const contract = await deploy(value);

export async function addDeposit() {
  document.getElementById(depositButton).addEventListener("click", async () => {
    const signer = provider.getSigner();
    await contract.connect(signer).deposit();
  });
}

export async function withdrawCapital() {
  document.getElementById(depositButton).addEventListener("click", async () => {
    const signer = provider.getSigner();
    await contract.connect(signer).withdraw();
  });
}

export async function balanceSigner() {
    const signer = provider.getSigner();
    await contract.connect(signer).getMyBalance();
}

export async function balanceContract() {
    const signer = provider.getSigner();
    await contract.connect(signer).getContractBalance();
}
