//React Imports
import { useState, useEffect } from 'react';

//
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

import { Contracts, Maybe, VestingMerkleTree } from '../../util';
import { ContractAddresses } from 'util/index';
import { getContractAddressesForNetwork, getNetworkFromChainId } from 'common';
import { getVestingMerkleTree } from '../../common';
import { useContracts } from 'hooks/useContracts';

interface ContractData {
	tree: VestingMerkleTree;
	id: number;
	name: string;
	contract: string;
	icon: string;
}

const toNumber = (amount: any) => Number(ethers.utils.formatEther(amount));

export function useContractMenu(): ContractData[] {
	// Wallet data
	const walletContext = useWeb3React<ethers.providers.Web3Provider>();
	const { chainId, account } = walletContext;
	const [contractData, setContractData] = useState<ContractAddresses>();
	const contracts: Maybe<Contracts[]> = useContracts();

	const [contractList, setContractList] = useState<ContractData[]>([]);

	useEffect(() => {
		const getAddresses = async () => {
			let get = await getContractAddressesForNetwork(
				getNetworkFromChainId(chainId!),
			);
			setContractData(get);
		};
		getAddresses();
	}, [chainId]);

	useEffect(() => {
		let list: ContractData[] = [];

		if (contractData?.vesting) {
			contractData!.vesting.forEach(async (value, i) => {
				const tree = await getVestingMerkleTree(value.contract);

				const userClaim = tree.claims[account!];

				if (userClaim?.index) {
					const unlocked = await contracts![i].vesting.isClaimed(
						userClaim.index,
					);
					const vested = await contracts![i].vesting.getVestedAmount(account!);
					const releasable = await contracts![i].vesting.getReleasableAmount(
						account!,
					);

					if (
						(userClaim && unlocked === false) ||
						(userClaim &&
							toNumber(vested) - toNumber(vested.sub(releasable)) > 0)
					) {
						list.push({
							id: i,
							tree,
							contract: value.contract,
							name: value.name,
							icon: value.icon,
						});
						setContractList(list);
					}
				}
			});
		}
	}, [contractData, account]);

	return contractList;
}
