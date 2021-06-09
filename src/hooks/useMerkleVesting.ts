import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import React from 'react';
import { MerkleTokenVesting } from '../contracts/types';
import { estimateVestedAmount, getLogger, Maybe } from '../util';
import { useVestingMerkleTree } from './useVestingMerkleTree';

const logger = getLogger(`hooks::useMerkleVesting`);

export const useMerkleVesting = (
	contract: MerkleTokenVesting,
	user: Maybe<string>,
) => {
	const { merkleTree } = useVestingMerkleTree(contract);

	const [hasAward, setHasAward] = React.useState<Maybe<boolean>>(null);
	const [hasClaimed, setHasClaimed] = React.useState<Maybe<boolean>>(undefined);
	const [awardedTokens, setAwardedTokens] =
		React.useState<Maybe<BigNumber>>(undefined);
	const [vestedTokens, setVestedTokens] =
		React.useState<Maybe<BigNumber>>(undefined);
	const [releasableTokens, setReleasableTokens] =
		React.useState<Maybe<BigNumber>>(undefined);

	React.useEffect(() => {
		if (!merkleTree) {
			return;
		}

		if (!user) {
			setHasAward(false);
			setHasClaimed(undefined);
			setAwardedTokens(undefined);
			setVestedTokens(undefined);
			setReleasableTokens(undefined);
			return;
		}

		const userClaim = merkleTree.claims[user];

		if (!userClaim) {
			setHasAward(false);
			setHasClaimed(undefined);
			setAwardedTokens(undefined);
			setVestedTokens(undefined);
			setReleasableTokens(undefined);

			logger.debug(`No user claim found.`);
			return;
		}

		const awardedAmount = BigNumber.from(userClaim.amount);
		setHasAward(true);
		setAwardedTokens(awardedAmount);

		let subscribed = true;
		const fetchValuesFromContract = async () => {
			try {
				const claimed = await contract.isClaimed(userClaim.index);

				// User has not claimed so we will attempt to estimate how many have vested
				if (!claimed) {
					logger.debug(`User has not yet claimed award.`);

					const currentBlock = await contract.provider.getBlockNumber();
					const start = await contract.vestingStart();
					const duration = await contract.vestingDuration();
					const cliff = await contract.vestingCliff();

					const amountVested = estimateVestedAmount(
						currentBlock,
						start.toNumber(),
						duration.toNumber(),
						cliff.toNumber(),
						awardedAmount,
					);

					if (subscribed) {
						setHasClaimed(false);
						setVestedTokens(amountVested);
						setReleasableTokens(amountVested);
					}

					return;
				}

				// Find out from smart contract how much has vested
				const vested = await contract.getVestedAmount(user);
				const releasable = await contract.getReleasableAmount(user);

				logger.debug(`Finished fetching all vesting data from smart contract.`);

				if (subscribed) {
					setVestedTokens(vested);
					setReleasableTokens(releasable);
				}
			} catch (e) {
				logger.error(`Failed to fetch vesting data for ${user}`);
				logger.debug(e);
			}
		};

		fetchValuesFromContract();

		return () => {
			subscribed = false;
		};
	}, [merkleTree, contract, user]);

	const claimAward = async (): Promise<ethers.ContractTransaction> => {
		if (!merkleTree) {
			throw Error(`No merkle tree`);
		}

		if (!user) {
			throw Error(`No user`);
		}

		const userClaim = merkleTree.claims[user];

		if (!userClaim) {
			throw Error(`No user claim`);
		}

		const tx = await contract.claimAward(
			userClaim.index,
			user,
			userClaim.amount,
			userClaim.revocable,
			userClaim.proof,
		);

		return tx;
	};

	const releaseTokens = async (): Promise<ethers.ContractTransaction> => {
		if (!user) {
			throw Error(`No user`);
		}

		const tx = await contract.release(user);

		return tx;
	};

	return {
		hasAward,
		hasClaimed,
		awardedTokens,
		vestedTokens,
		releasableTokens,
		claimAward,
		releaseTokens,
	};
};
