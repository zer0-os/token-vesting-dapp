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
import { Contracts, Maybe } from '../util';
import { EthInput, ArrowLink, FutureButton } from 'components';

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

	//This lines must be changed so the user can set with ui 
	//wich contract wants to send transactions, hardcoded actually to test
	const contracts: Maybe<Contracts[]> = useContracts();
	const vestingContract = contracts![0];
	const { refreshToken, refresh } = useRefresh();
	const vesting = useMerkleVesting(
		vestingContract!.vesting,
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
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<h2>Token Contract</h2>
					<ArrowLink
						style={{ textAlign: 'right', marginRight: 16 }}
						href={etherscanLink}
					>
						View on Etherscan
					</ArrowLink>
				</div>
				<EthInput
					static
					text={vesting.token ?? ''}
					style={{ marginBottom: 8 }}
					title={'Token Contract'}
					copyButton
				/>
			</Box>,
		);
	}

	if (contracts![0].vesting) {
		const etherscanLink = `${getEtherscanUriForNetwork(network)}address/${
			contracts![0].vesting.address
		}`;
		items.push(
			<Box className={classes.item}>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<h2>Vesting Contract</h2>
					<ArrowLink
						style={{ textAlign: 'right', marginRight: 16 }}
						href={etherscanLink}
					>
						View on Etherscan
					</ArrowLink>
				</div>
				<EthInput
					static
					text={contracts![0].vesting.address ?? ''}
					style={{ marginBottom: 8 }}
					title={'Vesting Contract'}
					copyButton
				/>
			</Box>,
		);
	}

	if (vesting.hasAward && vesting.awardedTokens) {
		items.push(
			<Box className={classes.item}>
				<hr className="glow" style={{ marginBottom: 16 }} />
				<h2>
					You have been awarded
					{` ${Number(
						ethers.utils.formatEther(vesting.awardedTokens),
					).toLocaleString()}`}{' '}
					tokens
				</h2>
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
					style={{ lineHeight: '21.6px' }}
				>{`Tokens will start to become releasable after a cliff on ${cliffHuman} (${cliffDurationHuman} after vesting begins)`}</Box>,
			);

			items.push(
				<Box className={classes.item}>{`${Number(
					firstAvailable,
				).toLocaleString()} will be available at the cliff`}</Box>,
			);

			items.push(
				<Box className={classes.item}>{`Tokens vest at approximately ${Number(
					approxPerMonth,
				).toLocaleString()}/month after the cliff`}</Box>,
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
							<FutureButton
								style={{ marginTop: 16, marginBottom: 16 }}
								glow={claimState.state === TransactionState.Pending}
								onClick={onPressClaim}
							>
								Claim Vesting Token Award
							</FutureButton>
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
					{/* {claimState.error ? <Box>Error: {`${claimState.error}`}</Box> : null} */}
				</React.Fragment>
			);

			items.push(claimHelper);

			if (claimState.hash) {
				const claimEtherscanLink = `${getEtherscanUriForNetwork(network)}tx/${
					claimState.hash
				}`;
				items.push(
					<Box className={classes.viewTxBox}>
						<FutureButton
							glow
							onClick={() => window.open(claimEtherscanLink, '_blank')}
						>
							View Claim Transaction
						</FutureButton>
					</Box>,
				);
			}
		}

		if (vesting.vestedTokens !== null && vesting.releasableTokens !== null) {
			const alreadyReleased = truncateDecimals(
				ethers.utils.formatEther(
					vesting.vestedTokens.sub(vesting.releasableTokens),
				),
				4,
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
				<Box style={{ marginTop: 24 }} className={classes.item}>
					<h2>{`${Number(
						amountVested,
					).toLocaleString()} tokens have vested so far.`}</h2>
				</Box>,
			);
			items.push(
				<Box className={classes.item}>
					<h2>{`${Number(
						alreadyReleased,
					).toLocaleString()} have already been released.`}</h2>
				</Box>,
			);
			items.push(
				<Box className={classes.item}>
					<h2>{`${Number(
						amountReleasable,
					).toLocaleString()} can be released.`}</h2>
				</Box>,
			);

			if (Number(amountReleasable) > 0.001 && vesting.hasClaimed) {
				const releaseHelper = (
					<Box className={classes.item}>
						<Grid container direction="row">
							<Grid item>
								<FutureButton
									glow={releaseState.state === TransactionState.Pending}
									onClick={onPressRelease}
								>
									Release Tokens
								</FutureButton>
							</Grid>
							{releaseState.state === TransactionState.Submitting ? (
								<Grid item style={{ paddingLeft: '16px' }}>
									<Box>
										<CircularProgress size={24} />
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
				<FutureButton
					glow
					onClick={() => window.open(releaseEtherscanLink, '_blank')}
				>
					View Release Transaction
				</FutureButton>
			</Box>,
		);
	}

	return (
		<React.Fragment>
			<Grid container className={classes.root} style={{ paddingBottom: 64 }}>
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
