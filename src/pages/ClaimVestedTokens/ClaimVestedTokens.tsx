//- React Imports
import React, { useState } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

//- Library Imports
import { randomImage } from 'lib/Random';

//- Component & Container Imports
import { ConnectToWallet, FutureButton, Image, Overlay } from 'components';
import { ClaimWildTokens } from 'containers';

//- Style Imports
import styles from './ClaimVestedTokens.module.css';

enum Modals {
	ConnectToWallet,
	Claim,
}

const ClaimVestedTokens: React.FC = () => {
	//////////////////
	// State & Refs //
	//////////////////

	// Page state
	const [modal, setModal] = useState<number | undefined>(undefined);

	// Wallet data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active, chainId } = walletContext;

	///////////////
	// Functions //
	///////////////

	// Modals
	const closeModal = () => setModal(undefined);
	const openConnectToWalletModal = () => setModal(Modals.ConnectToWallet);
	const openClaimModal = () => setModal(Modals.Claim);

	return (
		<>
			{/* Modals */}
			{modal && modal === Modals.Claim && (
				<Overlay centered open onClose={closeModal}>
					<ClaimWildTokens />
				</Overlay>
			)}

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
								src={account ? randomImage(account, 56, 56) : ''}
								className={styles.Profile}
							/>
							<FutureButton glow onClick={openClaimModal}>
								Claim WILD Tokens
							</FutureButton>
						</>
					)}
				</main>
			</section>
		</>
	);
};

export default ClaimVestedTokens;
