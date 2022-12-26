import { ethers } from 'ethers';
import { useMemo, useState } from 'react';
import { TokenVestingController__factory } from 'contracts/types';

import { useWeb3React } from '@web3-react/core';

import { GrantContract, Maybe } from '../util';

enum errorState {
	NoError = 'Checking...',
	NotOwner = 'You are not the Owner of this address.',
	NotChainId = 'No chain id detected.',
	NotSuportChainId = 'Chain id not supported.',
	NoAddress = 'Invalid vesting contract address.',
}

export function useGrantContract(address: string) {
	const context = useWeb3React<ethers.providers.Web3Provider>();

	const [isError, setError] = useState('');
	const [owner, setOwner] = useState('');

	const { account, library, chainId } = context;
	const contract = useMemo((): Maybe<GrantContract> => {
		let contracts = address;
		let signer: ethers.VoidSigner | ethers.Signer = new ethers.VoidSigner(
			ethers.constants.AddressZero,
		);

		if (library && ethers.utils.isAddress(contracts)) {
			if (!chainId) {
				//setError(errorState.NotChainId);
			} else {
				signer = library.getSigner();

				const grantContract = TokenVestingController__factory.connect(
					contracts,
					signer,
				);

				try {
					grantContract.owner().then((o) => {
						setOwner(o);
					});
				} catch (e) {
					setError(errorState.NoAddress);
				}

				if (owner === account) {
					setError(errorState.NoError);
				} else {
					setError(errorState.NotOwner);
				}
				return {
					grantableVesting: grantContract,
				};
			}
		}

		if (!contracts) {
			setError(errorState.NotSuportChainId);
		}

		if (!ethers.utils.isAddress(contracts)) {
			setError(errorState.NoAddress);
		}
	}, [address, library, chainId, account, owner]);

	return { contract, isError };
}
