import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React from 'react';
import { MaybeNull } from '../util';

export const useBlockTimestamp = () => {
	const context = useWeb3React<ethers.providers.Web3Provider>();
	const [blockNumber, setBlockNumber] = React.useState<MaybeNull<number>>(null);
	const [blockTimestamp, setBlockTimestamp] =
		React.useState<MaybeNull<number>>(null);

	React.useEffect(() => {
		let isSubscribed = true;

		const fetchBlockData = async () => {
			if (!context.library) {
				return;
			}

			const currentBlockNumber = await context.library.getBlockNumber();
			const currentBlock = await context.library.getBlock(currentBlockNumber);
			const currentBlockTimestamp = currentBlock.timestamp;

			if (isSubscribed) {
				setBlockNumber(currentBlockNumber);
				setBlockTimestamp(currentBlockTimestamp);
			}
		};

		fetchBlockData();

		return () => {
			isSubscribed = false;
		};
	}, [context.library]);

	return { blockNumber, blockTimestamp };
};
