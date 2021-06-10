import React from 'react';
import { getVestingMerkleTree } from '../common';
import { MerkleTokenVesting } from '../contracts/types';
import { getLogger, Maybe, VestingMerkleTree } from '../util';

const logger = getLogger(`hooks::useVestingMerkleTree`);

export const useVestingMerkleTree = (contract: MerkleTokenVesting) => {
	const [merkleTree, setMerkleTree] =
		React.useState<Maybe<VestingMerkleTree>>();

	React.useEffect(() => {
		const getTree = async () => {
			try {
				const tree = await getVestingMerkleTree(contract.address);
				setMerkleTree(tree);
				logger.debug(
					`Finished loading vesting merkle tree for ${contract.address}`,
				);
			} catch (e) {
				logger.error(`Unable to get merkle tree for ${contract.address}`);
				logger.debug(e);
			}
		};

		getTree();
	}, [contract.address]);

	return {
		merkleTree,
	};
};
