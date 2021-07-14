//- React Imports
import React, { useState, useEffect } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { getNetworkFromChainId } from 'common';
import { ethers } from 'ethers';

//- Library Imports
import { suggestWildToken } from 'lib/suggestToken';
import { getLogger, ClaimVestingInterface } from 'util/index';
import { useContracts } from 'hooks/useContracts';
import { useRefresh } from 'hooks/useRefresh';
import useNotification from 'hooks/useNotification';
import { useMerkleVesting } from 'hooks/useMerkleVesting';
import {
	TransactionState,
	useTransactionState,
} from 'hooks/useTransactionState';

//- Component & Container Imports
import {
	ConnectToWallet,
	FutureButton,
	TextButton,
	Overlay,
	WilderIcon,
	LoadingSpinner,
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
	const { account, active } = walletContext;

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

	const { addNotification } = useNotification();

	// Page state
	const [modal, setModal] = useState<number | undefined>(undefined);
	const [claimInterfaceProps, setClaimInterfaceProps] = useState<
		ClaimVestingInterface | undefined
	>();

	///////////////
	// Functions //
	///////////////

	useEffect(() => {
		if (
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
		}
	}, [
		vesting.vestedTokens,
		vesting.releasableTokens,
		vesting.awardedTokens,
		vesting.vestingParams,
	]);

	const addWildToMetamask = () => suggestWildToken(context.library);

	const toNumber = (amount: any) => Number(ethers.utils.formatEther(amount));

	const onButtonClick = () => {
		if (vesting.hasClaimed === false && vesting.awardedTokens) {
			// Open unlock modal
			setModal(Modals.Unlock);
		} else if (vesting.hasClaimed === true) {
			// Open claim modal
			if (
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

		const claimAmount = toNumber(vesting.releasableTokens);

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

		addNotification(`Successfully claimed ${claimAmount} WILD tokens`);

		refresh();
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
			claimState.setError(e.message ? e.message : e);
			claimState.setState(TransactionState.Pending);
			return;
		}

		setTimeout(() => {
			refresh();
		}, 1000);

		addNotification('Successfully unlocked tokens');

		claimState.setState(TransactionState.Completed);
		closeModal();
	};

	// Modals
	const closeModal = () => setModal(undefined);
	const openConnectToWalletModal = () => setModal(Modals.ConnectToWallet);

	return (
		<>
			{/* Modals */}
			{claimInterfaceProps && (
				<Overlay centered open={modal === Modals.Claim} onClose={closeModal}>
					<ReleaseTokens
						isLoading={releaseState.isSubmitting || releaseState.isProcessing}
						network={network}
						vesting={claimInterfaceProps}
						onRelease={release}
					/>
				</Overlay>
			)}

			<Overlay centered open={modal === Modals.Unlock} onClose={closeModal}>
				<UnlockTokens
					isLoading={claimState.isSubmitting || claimState.isProcessing}
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

							{/* Loading Icon */}
							{vesting.token === null && vesting.hasAward !== false && (
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<LoadingSpinner />
								</div>
							)}

							{/* Action Button */}
							{vesting.token !== null && vesting.hasAward === true && (
								<>
									<FutureButton
										style={{ margin: '24px auto' }}
										glow={vesting.awardedTokens !== undefined}
										onClick={onButtonClick}
									>
										{vesting.hasClaimed === false &&
											vesting.awardedTokens &&
											'Unlock Tokens'}
										{vesting.hasClaimed === true && 'Claim Tokens'}
									</FutureButton>
									<TextButton
										style={{
											margin: '24px auto',
											textAlign: 'center',
											paddingLeft: 13,
										}}
										onClick={addWildToMetamask}
									>
										Add WILD token to Metamask
									</TextButton>
								</>
							)}

							{/* No tokens message */}
							{vesting.hasAward === false && (
								<h2>You have no tokens to claim</h2>
							)}
						</>
					)}
				</main>
			</section>
		</>
	);
};

export default ClaimVestedTokens;
