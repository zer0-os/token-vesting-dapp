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

//- Library Imports
import { randomImage } from 'lib/Random';

//- Component & Container Imports
import { ConnectToWallet, FutureButton, Image, Overlay } from 'components';
import { ReleaseTokens, UnlockTokens } from 'containers';

//- Style Imports
import styles from './ClaimVestedTokens.module.css';

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

	const network = getNetworkFromChainId(chainId ?? 0);
	const supported = isSupportedNetwork(network);

	const { refreshToken, refresh } = useRefresh();
	const { blockNumber, blockTimestamp } = useBlockTimestamp();

	const contracts = useContracts();
	const vestingContract = contracts!.vesting;
	const vesting = useMerkleVesting(
		vestingContract,
		account ?? '',
		refreshToken,
	);

	const claimState = useTransactionState();
	const releaseState = useTransactionState();

	console.log(claimState, releaseState);

	//////////////////
	// State & Refs //
	//////////////////

	// Page state
	const [modal, setModal] = useState<number | undefined>(undefined);
	const [areTokensUnlocked, setAreTokensUnlocked] = useState(false);

	///////////////
	// Functions //
	///////////////

	const release = () => {
		// @TODO link middleware here
		closeModal();
	};

	const unlock = () => {
		setAreTokensUnlocked(true);
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
			<Overlay centered open={modal === Modals.Claim} onClose={closeModal}>
				<ReleaseTokens onRelease={release} />
			</Overlay>

			<Overlay centered open={modal === Modals.Unlock} onClose={closeModal}>
				<UnlockTokens onUnlock={unlock} />
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
							<Image
								src={randomImage(account || '', 56, 56)}
								className={styles.Profile}
								onClick={openConnectToWalletModal}
							/>
							<FutureButton
								glow
								onClick={areTokensUnlocked ? openClaimModal : openUnlockModal}
							>
								{areTokensUnlocked ? 'Claim Tokens' : 'Unlock Tokens'}
							</FutureButton>
						</>
					)}
				</main>
			</section>
		</>
	);
};

export default ClaimVestedTokens;
