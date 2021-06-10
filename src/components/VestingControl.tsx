import React from 'react';
import {
	Box,
	Button,
	CircularProgress,
	Grid,
	makeStyles,
} from '@material-ui/core';
import {
	getBlocksPerDay,
	getEtherscanUriForNetwork,
	getNetworkFromChainId,
	getSecondsPerBlock,
	Network,
} from '../common';
import { useContracts } from '../hooks/useContracts';
import { useMerkleVesting } from '../hooks/useMerkleVesting';
import { ethers } from 'ethers';
import { estimateVestedAmount, getLogger, truncateDecimals } from '../util';
import {
	TransactionState,
	useTransactionState,
} from '../hooks/useTransactionState';
import { useRefresh } from '../hooks/useRefresh';
import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import { useBlockTimestamp } from '../hooks/useBlockTimestamp';

interface Props {
	account: string;
	network: Network;
}

const logger = getLogger(`components::VestingControl`);

const useStyles = makeStyles({
	root: {},
	viewTxBox: {
		paddingTop: '16px',
	},
	item: {
		paddingTop: '16px',
	},
});

export const VestingControl: React.FC<Props> = (props) => {
	const context = useWeb3React();
	const classes = useStyles();
	const contracts = useContracts();
	const vestingContract = contracts!.vesting;
	const { refreshToken, refresh } = useRefresh();
	const vesting = useMerkleVesting(
		vestingContract,
		props.account,
		refreshToken,
	);
	const { blockNumber, blockTimestamp } = useBlockTimestamp();

	const network = getNetworkFromChainId(context.chainId!);

	const claimState = useTransactionState();
	const releaseState = useTransactionState();

	const onPressClaim = async () => {
		logger.debug(`User attempting to claim tokens`);
		claimState.setError(undefined);
		claimState.setState(TransactionState.Submitting);

		try {
			const tx = await vesting.claimAward();

			claimState.setState(TransactionState.Processing);
			claimState.setHash(tx.hash);

			await tx.wait();
		} catch (e) {
			claimState.setError(e.message ? e.message : e);
			claimState.setState(TransactionState.Pending);
			return;
		}

		claimState.setState(TransactionState.Completed);

		refresh();
	};

	const onPressRelease = async () => {
		logger.debug(`User attempting to release tokens`);
		releaseState.setError(undefined);
		releaseState.setState(TransactionState.Submitting);

		try {
			const tx = await vesting.releaseTokens();

			releaseState.setState(TransactionState.Processing);
			releaseState.setHash(tx.hash);

			await tx.wait();
		} catch (e) {
			releaseState.setError(e.message ? e.message : e);
			releaseState.setState(TransactionState.Pending);
			return;
		}

		releaseState.setState(TransactionState.Pending);

		refresh();
	};

	const items: React.ReactFragment[] = [];

	if (vesting.hasAward === null) {
		items.push(<Box className={classes.item}>Loading...</Box>);
	} else if (vesting.hasAward === false) {
		items.push(<Box className={classes.item}>You have no vesting tokens</Box>);
	}

	if (vesting.token) {
		const etherscanLink = `${getEtherscanUriForNetwork(network)}address/${
			vesting.token
		}`;
		items.push(
			<Box className={classes.item}>
				<b>Token Contract: </b>
				<a
					target="_blank"
					rel="noreferrer"
					href={etherscanLink}
				>{`${vesting.token}`}</a>
			</Box>,
		);
	}

	if (contracts?.vesting) {
		const etherscanLink = `${getEtherscanUriForNetwork(network)}address/${
			contracts.vesting.address
		}`;
		items.push(
			<Box className={classes.item}>
				<b>Vesting Contract: </b>
				<a
					target="_blank"
					rel="noreferrer"
					href={etherscanLink}
				>{`${contracts.vesting.address}`}</a>
			</Box>,
		);
	}

	if (vesting.hasAward && vesting.awardedTokens) {
		items.push(
			<Box className={classes.item}>
				You have been awarded
				{` ${ethers.utils.formatEther(vesting.awardedTokens)}`} tokens
			</Box>,
		);

		if (vesting.vestingParams && blockTimestamp && blockNumber) {
			const { start, duration, cliff } = vesting.vestingParams;
			const blocksPerDay = getBlocksPerDay(network);
			const t0 = start + cliff;
			const v0 = estimateVestedAmount(
				t0,
				start,
				duration,
				cliff,
				vesting.awardedTokens,
			);
			const t1 = t0 + blocksPerDay;
			const v1 = estimateVestedAmount(
				t1,
				start,
				duration,
				cliff,
				vesting.awardedTokens,
			);
			const approxPerMonth = truncateDecimals(
				ethers.utils.formatEther(v1.sub(v0).mul(30)),
				4,
			);
			const secondsPerBlock = getSecondsPerBlock(network);
			const blocksUntilStart = start - blockNumber;
			const startTime = blockTimestamp + blocksUntilStart * secondsPerBlock;

			const startTimeHuman = moment(startTime * 1000).toLocaleString();
			items.push(
				<Box
					className={classes.item}
				>{`Tokens start vesting on ${startTimeHuman}`}</Box>,
			);

			const firstAvailable = truncateDecimals(ethers.utils.formatEther(v0), 4);

			const cliffTime = startTime + cliff * secondsPerBlock;
			const cliffHuman = moment(cliffTime * 1000).toLocaleString();
			const cliffDurationHuman = moment
				.duration(cliff * secondsPerBlock)
				.humanize();

			items.push(
				<Box
					className={classes.item}
				>{`Tokens will start to become releasable after a cliff on ${cliffHuman} (${cliffDurationHuman} after vesting begins)`}</Box>,
			);

			items.push(
				<Box
					className={classes.item}
				>{`${firstAvailable} will be available at the cliff`}</Box>,
			);

			items.push(
				<Box
					className={classes.item}
				>{`Tokens vest at approximately ${approxPerMonth}/month after the cliff`}</Box>,
			);
		}

		if (vesting.hasClaimed === false) {
			const claimHelper = (
				<React.Fragment>
					<Box className={classes.item}>
						You must claim before you can release vested tokens.
					</Box>
					<Grid container direction="row">
						<Grid item>
							<Button
								variant="contained"
								color="primary"
								disabled={claimState.state !== TransactionState.Pending}
								onClick={onPressClaim}
							>
								Claim Vesting Token Award
							</Button>
						</Grid>
						{claimState.state === TransactionState.Submitting ? (
							<Grid item style={{ paddingLeft: '16px' }}>
								<Box>
									Waiting to submit <CircularProgress size={24} />
								</Box>
							</Grid>
						) : null}
						{claimState.state === TransactionState.Processing ? (
							<Grid item style={{ paddingLeft: '16px' }}>
								<Box>
									Waiting to be mined <CircularProgress size={24} />
								</Box>
							</Grid>
						) : null}
					</Grid>
					{claimState.error ? <Box>Error: {`${claimState.error}`}</Box> : null}
				</React.Fragment>
			);

			items.push(claimHelper);

			if (claimState.hash) {
				const claimEtherscanLink = `${getEtherscanUriForNetwork(network)}tx/${
					claimState.hash
				}`;
				items.push(
					<Box className={classes.viewTxBox}>
						<Button
							target="_blank"
							rel="noreferrer"
							href={claimEtherscanLink}
							variant="outlined"
						>
							View Claim Transaction
						</Button>
					</Box>,
				);
			}
		}

		if (vesting.vestedTokens !== null && vesting.releasableTokens !== null) {
			const alreadyReleased = vesting.vestedTokens.sub(
				vesting.releasableTokens,
			);

			const amountVested = truncateDecimals(
				ethers.utils.formatEther(vesting.vestedTokens),
				4,
			);

			const amountReleasable = truncateDecimals(
				ethers.utils.formatEther(vesting.releasableTokens),
				4,
			);

			items.push(
				<Box
					className={classes.item}
				>{`${amountVested} tokens have vested so far.`}</Box>,
			);
			items.push(
				<Box
					className={classes.item}
				>{`${alreadyReleased} have already been released.`}</Box>,
			);
			items.push(
				<Box
					className={classes.item}
				>{`${amountReleasable} can be released.`}</Box>,
			);

			if (Number(amountReleasable) > 0.001 && vesting.hasClaimed) {
				const releaseHelper = (
					<Box className={classes.item}>
						<Grid container direction="row">
							<Grid item>
								<Button
									variant="contained"
									color="primary"
									disabled={releaseState.state !== TransactionState.Pending}
									onClick={onPressRelease}
								>
									{`Release Tokens`}
								</Button>
							</Grid>
							{releaseState.state === TransactionState.Submitting ? (
								<Grid item style={{ paddingLeft: '16px' }}>
									<Box>
										Waiting to submit <CircularProgress size={24} />
									</Box>
								</Grid>
							) : null}
							{releaseState.state === TransactionState.Processing ? (
								<Grid item style={{ paddingLeft: '16px' }}>
									<Box>
										Waiting to be mined <CircularProgress size={24} />
									</Box>
								</Grid>
							) : null}
						</Grid>
						{releaseState.error ? (
							<Box>Error: {`${releaseState.error}`}</Box>
						) : null}
					</Box>
				);

				items.push(releaseHelper);
			}
		}
	}

	if (releaseState.hash) {
		const releaseEtherscanLink = `${getEtherscanUriForNetwork(network)}tx/${
			releaseState.hash
		}`;
		items.push(
			<Box className={classes.viewTxBox}>
				<Button
					target="_blank"
					rel="noreferrer"
					href={releaseEtherscanLink}
					variant="outlined"
				>
					View Release Transaction
				</Button>
			</Box>,
		);
	}

	return (
		<React.Fragment>
			<Grid container className={classes.root}>
				{items.map((e: React.ReactFragment, index: number) => {
					return (
						<Grid item key={index} style={{ width: '100%' }}>
							{e}
						</Grid>
					);
				})}
			</Grid>
		</React.Fragment>
	);
};
