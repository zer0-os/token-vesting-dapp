import React from 'react';
import { getVestingMerkleTree } from '../common';
import { Contracts, getLogger, Maybe, VestingMerkleTree } from '../util';

const logger = getLogger(`hooks::useVestingMerkleTree`);

export const useVestingMerkleTree = (contract: Contracts) => {
	const [merkleTree, setMerkleTree] = React.useState<
		Maybe<VestingMerkleTree>
	>();

	React.useEffect(() => {
		const getTree = async () => {
			try {
				const tree = await getVestingMerkleTree(contract.vesting.address);
				setMerkleTree(tree);
				logger.debug(
					`Finished loading vesting merkle tree for ${contract.vesting.address}`,
				);
			} catch (e) {
				logger.error(
					`Unable to get merkle tree for ${contract.vesting.address}`,
				);
				logger.debug(e);
			}
		};

		getTree();
	}, [contract.vesting.address]);

	return {
		merkleTree,
	};
};
