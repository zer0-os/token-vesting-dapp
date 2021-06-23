//- React Imports
import React, { useState } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { getNetworkFromChainId, isSupportedNetwork } from 'common';
import { useContracts } from 'hooks/useContracts';
import { useRefresh } from 'hooks/useRefresh';
import { useBlockTimestamp } from 'hooks/useBlockTimestamp';
import { useMerkleVesting } from 'hooks/useMerkleVesting';
import {
	TransactionState,
	useTransactionState,
} from 'hooks/useTransactionState';
import { ethers } from 'ethers';

//- Library Imports
import { randomImage } from 'lib/Random';
import {
	estimateVestedAmount,
	getLogger,
	truncateDecimals,
	ClaimVestingInterface,
} from 'util/index';

//- Component & Container Imports
import {
	ConnectToWallet,
	FutureButton,
	Image,
	Overlay,
	WilderIcon,
} from 'components';
import { ReleaseTokens, UnlockTokens } from 'containers';

//- Style Imports
import styles from './ClaimVestedTokens.module.css';

const logger = getLogger(`components::ClaimVestedTokens`);

enum Modals {
	ConnectToWallet,
	Unlock,
	Claim,
}

const ClaimVestedTokens: React.FC = () => {
	//////////
	// Web3 //
	//////////

	// Wallet data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active, chainId } = walletContext;

	const context = useWeb3React();

	const { refreshToken, refresh } = useRefresh();
	const contracts = useContracts();
	const vestingContract = contracts!.vesting;
	const vesting = useMerkleVesting(vestingContract, account, refreshToken);

	const network = getNetworkFromChainId(context.chainId!);

	const claimState = useTransactionState();
	const releaseState = useTransactionState();

	//////////////////
	// State & Refs //
	//////////////////

	// Page state
	const [modal, setModal] = useState<number | undefined>(undefined);
	const [areTokensUnlocked, setAreTokensUnlocked] = useState(false);
	const [claimInterfaceProps, setClaimInterfaceProps] = useState<
		ClaimVestingInterface | undefined
	>();

	///////////////
	// Functions //
	///////////////

	const toNumber = (amount: any) => Number(ethers.utils.formatEther(amount));

	const onButtonClick = () => {
		if (vesting.hasClaimed === false && vesting.awardedTokens) {
			// Open unlock modal
			setModal(Modals.Unlock);
		} else if (vesting.hasClaimed === true) {
			// Open claim modal
			if (
				vesting.vestedTokens &&
				vesting.vestedTokens &&
				vesting.releasableTokens &&
				vesting.awardedTokens &&
				vesting.vestingParams
			) {
				setClaimInterfaceProps({
					claimed: toNumber(vesting.vestedTokens.sub(vesting.releasableTokens)),
					vested: toNumber(vesting.vestedTokens),
					total: toNumber(vesting.awardedTokens),
					start: vesting.vestingParams.start,
					duration: vesting.vestingParams.duration,
					cliff: vesting.vestingParams.cliff,
				});

				setModal(Modals.Claim);
			}
		}
	};

	const release = async () => {
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
		closeModal();
	};

	const unlock = async () => {
		logger.debug(`User attempting to claim tokens`);
		claimState.setError(undefined);
		claimState.setState(TransactionState.Submitting);

		try {
			const tx = await vesting.claimAward();

			claimState.setState(TransactionState.Processing);
			claimState.setHash(tx.hash);

			await tx.wait();
		} catch (e) {
			console.log(e);
			claimState.setError(e.message ? e.message : e);
			claimState.setState(TransactionState.Pending);
			return;
		}

		claimState.setState(TransactionState.Completed);
		closeModal();
	};

	// Modals
	const closeModal = () => setModal(undefined);
	const openConnectToWalletModal = () => setModal(Modals.ConnectToWallet);
	const openClaimModal = () => setModal(Modals.Claim);
	const openUnlockModal = () => setModal(Modals.Unlock);

	return (
		<>
			{/* Modals */}
			{claimInterfaceProps && (
				<Overlay centered open={modal === Modals.Claim} onClose={closeModal}>
					<ReleaseTokens
						network={network}
						vesting={claimInterfaceProps}
						onRelease={release}
					/>
				</Overlay>
			)}

			<Overlay centered open={modal === Modals.Unlock} onClose={closeModal}>
				<UnlockTokens
					numTokens={
						vesting.awardedTokens
							? Number(ethers.utils.formatEther(vesting.awardedTokens))
							: 0
					}
					onUnlock={unlock}
				/>
			</Overlay>

			<Overlay
				centered
				open={modal === Modals.ConnectToWallet}
				onClose={closeModal}
			>
				<ConnectToWallet onConnect={closeModal} />
			</Overlay>

			{/* Page Content */}
			<section className={styles.Container}>
				<main className={styles.Buttons}>
					{/* Connect To Wallet */}
					{!active && (
						<FutureButton glow onClick={openConnectToWalletModal}>
							Connect Wallet
						</FutureButton>
					)}

					{/* Wallet Conected */}
					{active && (
						<>
							<WilderIcon
								className={styles.Profile}
								onClick={openConnectToWalletModal}
							/>
							{vesting.token !== null && vesting.hasAward && (
								<FutureButton glow onClick={onButtonClick}>
									{vesting.hasClaimed === false && 'Claim Tokens'}
									{vesting.hasClaimed === true && 'Unlock Tokens'}
								</FutureButton>
							)}
							{!vesting.hasAward && <h2>You have no tokens to claim</h2>}
						</>
					)}
				</main>
			</section>
		</>
	);
};

export default ClaimVestedTokens;
