import { ethers } from 'ethers';
import { useMemo } from 'react';
import { TokenVestingController__factory } from 'contracts/types';

import { useWeb3React } from '@web3-react/core';

import { GrantContract, Maybe } from '../util';
/*
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
}*/

export function useGrantContract(address: string): Maybe<GrantContract> {
  const context = useWeb3React<ethers.providers.Web3Provider>();

  const { library, active, chainId } = context;
  const contract = useMemo((): GrantContract | undefined => {

    let contracts = address;
    let signer: ethers.VoidSigner | ethers.Signer = new ethers.VoidSigner(
      ethers.constants.AddressZero,
    );

    if (library && contracts) {
      if (!chainId) {
        //throw Error('No chain id detected');
      }
      signer = library.getSigner();

      const grantContract = TokenVestingController__factory.connect(
        contracts,
        signer,
      );

      return {
        vesting: grantContract,
      };
    }

    if (!contracts) {
      //throw Error('Chain id not supported');
      return undefined;
    }

    if (!ethers.utils.isAddress(contracts)) {
      //throw Error('Invalid vesting contract address');
      return undefined;
    }

  }, [address, library, active, chainId]);

  return contract;
}