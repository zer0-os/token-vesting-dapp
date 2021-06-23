//- React Imports
import React, { useState, useEffect } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

//- Component Imports
import { FutureButton, Overlay } from 'components';
import { GrantVestingTokens } from 'containers';

//- Style Imports
import styles from './GrantVestedTokens.module.css';

enum Modals {
	ConnectToWallet,
	Grant,
	Granting,
	Granted,
}

const GrantVestedTokens: React.FC = () => {
	//////////////////
	// State & Refs //
	//////////////////

	const [modal, setModal] = useState<number | undefined>(undefined);

	//- Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active, chainId } = walletContext;

	useEffect(() => {}, [active]);

	//////////////
	// Function //
	//////////////

	const closeModal = () => setModal(Modals.Grant);

	// Wallet flow
	const openConnectWallet = () => setModal(Modals.ConnectToWallet);

	// Grant flow
	const openGrantModal = () => setModal(Modals.Grant);
	const openGrantingModal = () => setModal(Modals.Granting);
	const openGrantedModal = () => setModal(Modals.Granted);

	return (
		<>
			{modal != undefined && modal === Modals.Granted && (
				<Overlay onClose={closeModal} open>
					<p>Granted</p>
				</Overlay>
			)}

			{modal != undefined && modal === Modals.Granting && (
				<Overlay onClose={closeModal} open>
					<FutureButton onClick={openGrantedModal}>Granting</FutureButton>
				</Overlay>
			)}

			{modal != undefined && modal === Modals.Grant && (
				<Overlay centered onClose={closeModal} open>
					<GrantVestingTokens onSend={openGrantingModal} />
				</Overlay>
			)}

			{/* Page Content */}
			<div className={styles.Container}>
				<div className={styles.Buttons}>
					{/* Connect To Wallet */}
					{!active && (
						<FutureButton glow onClick={openConnectWallet}>
							Connect Wallet
						</FutureButton>
					)}

					{/* Wallet Conected */}
					{active && (
						<FutureButton glow onClick={openGrantModal}>
							Grant Vesting Token
						</FutureButton>
					)}
				</div>
			</div>
		</>
	);
};

export default GrantVestedTokens;
