import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import React from 'react';
import { MerkleTokenVesting } from '../contracts/types';
import { estimateVestedAmount, getLogger, Maybe, MaybeNull } from '../util';
import { useVestingMerkleTree } from './useVestingMerkleTree';

const logger = getLogger(`hooks::useMerkleVesting`);

interface VestingParams {
	start: number;
	duration: number;
	cliff: number;
}

export const useMerkleVesting = (
	contract: MerkleTokenVesting,
	user: Maybe<string>,
	refreshToken?: number,
) => {
	const { merkleTree } = useVestingMerkleTree(contract);

	const [hasAward, setHasAward] = React.useState<MaybeNull<boolean>>(null);
	const [hasClaimed, setHasClaimed] = React.useState<MaybeNull<boolean>>(null);
	const [awardedTokens, setAwardedTokens] =
		React.useState<MaybeNull<BigNumber>>(null);
	const [vestedTokens, setVestedTokens] =
		React.useState<MaybeNull<BigNumber>>(null);
	const [releasableTokens, setReleasableTokens] =
		React.useState<MaybeNull<BigNumber>>(null);
	const [vestingParams, setVestingParams] =
		React.useState<MaybeNull<VestingParams>>(null);
	const [token, setToken] = React.useState<MaybeNull<string>>(null);

	React.useEffect(() => {
		if (!merkleTree) {
			return;
		}

		if (!user) {
			setHasAward(false);
			setHasClaimed(null);
			setAwardedTokens(null);
			setVestedTokens(null);
			setReleasableTokens(null);
			return;
		}

		const userClaim = merkleTree.claims[user];

		if (!userClaim) {
			setHasAward(false);
			setHasClaimed(null);
			setAwardedTokens(null);
			setVestedTokens(null);
			setReleasableTokens(null);

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
				const tokenAddress = await contract.targetToken();

				const start = (await contract.vestingStart()).toNumber();
				const duration = (await contract.vestingDuration()).toNumber();
				const cliff = (await contract.vestingCliff()).sub(start).toNumber();

				if (subscribed) {
					setHasClaimed(claimed);
					setVestingParams({ start, duration, cliff });
					setToken(tokenAddress);
				}

				// User has not claimed so we will attempt to estimate how many have vested
				if (!claimed) {
					logger.debug(`User has not yet claimed award.`);

					const currentBlock = await contract.provider.getBlockNumber();

					const amountVested = estimateVestedAmount(
						currentBlock,
						start,
						duration,
						cliff,
						awardedAmount,
					);

					if (subscribed) {
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
	}, [merkleTree, contract, user, refreshToken]);

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
		logger.debug(
			`Claiming award. user=${user} ${JSON.stringify(userClaim, null, 2)}`,
		);

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
		token,
		hasAward,
		vestingParams,
		hasClaimed,
		awardedTokens,
		vestedTokens,
		releasableTokens,
		claimAward,
		releaseTokens,
	};
};
