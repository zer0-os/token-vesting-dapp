import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React from 'react';
import {
	defaultNetwork,
	getContractAddressesForNetwork,
	getNetworkFromChainId,
} from '../common';
import { MerkleTokenVesting__factory } from '../contracts/types';
import { ContractAddresses, Contracts, Maybe } from '../util';

export function useContracts(): Maybe<Contracts> {
	const context = useWeb3React<ethers.providers.Web3Provider>();

	const { library, active, chainId } = context;
	const contract = React.useMemo((): Contracts | null => {
		let contracts: Maybe<ContractAddresses>;
		let signer: ethers.VoidSigner | ethers.Signer = new ethers.VoidSigner(
			ethers.constants.AddressZero,
		);
		if (!library) {
			contracts = getContractAddressesForNetwork(defaultNetwork);
		} else {
			if (!chainId) {
				throw Error(`No chain id detected`);
			}

			contracts = getContractAddressesForNetwork(
				getNetworkFromChainId(chainId),
			);
			signer = library.getSigner();
		}

		if (!contracts) {
			throw Error(`Chain id not supported`);
		}

		if (!ethers.utils.isAddress(contracts.vesting)) {
			throw Error(`invalid vesting contract address`);
		}

		const vestingContract = MerkleTokenVesting__factory.connect(
			contracts.vesting,
			signer,
		);

		return {
			vesting: vestingContract,
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active, library, chainId]);
	return contract;
}
