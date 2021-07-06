import { ethers } from 'ethers';
import { TokenVestingController__factory } from 'contracts/types';

export function useGrantContract(address: string) {

  //Get the contract address
  let CONTRACT_ADDRESS = address;

  //Connect to Network
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  //Get Signer
  const signer = provider.getSigner();

  const grantContract = TokenVestingController__factory.connect(
    CONTRACT_ADDRESS,
    signer,
  );

  return grantContract;
}

/*
//Connect to Network
const provider = new ethers.providers.Web3Provider(window.ethereum);
console.log(provider);

//The contract address
let CONTRACT_ADDRESS = '0xC5c9AFF8457A7943169ba7F6937861060C03Be2E';

//Get Signer
const signer = provider.getSigner();
console.log(signer);

//Connect with provider
let contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
console.log(contract);

async function faso() {
  await contract.grantTokens(['0x1824cE714aEB8d4Ed40afF821e85b2f928b8d0e6'], ['100'], [false]);
}
//const txReceipt = txResponse.wait();
//console.log(txReceipt);

//contract.grantTokens(['0x1824cE714aEB8d4Ed40afF821e85b2f928b8d0e6'], ['100'], [false]);
*/