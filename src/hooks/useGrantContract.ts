import { ethers } from 'ethers';
import { useMemo } from 'react';
import { TokenVestingController__factory } from 'contracts/types';

import { useWeb3React } from '@web3-react/core';

import { GrantContract, Maybe } from '../util';

//- If returns null, will show an error in the UI

export function useGrantContract(address: string): Maybe<GrantContract> {
	const context = useWeb3React<ethers.providers.Web3Provider>();

	const { library, active, chainId } = context;
	const contract = useMemo((): Maybe<GrantContract> => {
		let contracts = address;
		let signer: ethers.VoidSigner | ethers.Signer = new ethers.VoidSigner(
			ethers.constants.AddressZero,
		);

		if (!contracts) {
			return null;
		}

		if (!ethers.utils.isAddress(contracts)) {
			return null;
		}

		if (library && ethers.utils.isAddress(contracts)) {
			if (!chainId) {
				return null;
			} else {
				signer = library.getSigner();

				const grantContract = TokenVestingController__factory.connect(
					contracts,
					signer,
				);

				return {
					grantableVesting: grantContract,
				};
			}
		}
	}, [address, library, active, chainId]);

	return contract;
}