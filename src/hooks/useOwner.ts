//- by Alejo Viola and Leo

import React, { useEffect, useState } from "react";
import { TokenVestingController } from "contracts/types";

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

enum OwnerState {
  Disconnected = 0,
  Autorized = 1,
  NoAuthorized = 2,
}

export const useOwner = () => {

  //- Wallet Data
  const walletContext = useWeb3React<Web3Provider>();
  const { account } = walletContext;

  const OWNER = '0x728f7ee36Fb640535327b2b1C2695854998053A8';

  const [isOwner, setIsOwner] = useState(0);

  useEffect(() => {
    if (!account) {
      setIsOwner(OwnerState.Disconnected);
    } else if (OWNER == account) {
      setIsOwner(OwnerState.Autorized);
    } else {
      setIsOwner(OwnerState.NoAuthorized);
    }
  }, [account]);

  return isOwner;
}