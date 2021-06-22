//- React Imports
import React, { useState, useEffect } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useEagerConnect } from 'lib/hooks/provider-hooks';

//- Component Imports
import { FutureButton, Overlay, ConnectToWallet } from 'components';
import { GrantVestingTokens } from 'containers';

//- Style Imports
import styles from './GrantVestedTokens.module.css';

enum Modals {
	ConnectToWallet,
	GrantInit,
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
	const triedEagerConnect = useEagerConnect(); // This line will try auto-connect to the last wallet

	useEffect(() => {}, [active]);

	//////////////
	// Function //
	//////////////

	//- Modals States
		const closeModal = () => setModal(undefined);

		// Wallet flow
		const openConnectWallet = () => setModal(Modals.ConnectToWallet);

		// Grant flow
		const openGrantInit = () => setModal(Modals.GrantInit);
		const openGrantModal = () => setModal(Modals.Grant);
		const openGrantingModal = () => setModal(Modals.Granting);
		const openGrantedModal = () => setModal(Modals.Granted);

	return (
	<div className={styles.Container}>

			{modal !== undefined && modal === Modals.ConnectToWallet && (
				<Overlay centered onClose={closeModal} open>
					<ConnectToWallet onConnect={openGrantInit} />
				</Overlay>
			)}

			{modal !== undefined && modal === Modals.Granted && (
				<Overlay onClose={openGrantInit} open>
					<p>Granted</p>
				</Overlay>
			)}

			{modal !== undefined && modal === Modals.Granting && (
				<Overlay onClose={openGrantInit} open>
					<FutureButton onClick={openGrantedModal}>Granting</FutureButton>
				</Overlay>
			)}

			{modal !== undefined && modal === Modals.Grant && (
				<Overlay centered onClose={openGrantInit} open>
					<GrantVestingTokens onSend={openGrantingModal} />
				</Overlay>
			)}

			{modal !== undefined && modal === Modals.GrantInit && (
				<FutureButton glow onClick={openGrantModal}>
					Grant Vesting Token
				</FutureButton>
			)}

			{modal === undefined && (
				<FutureButton glow onClick={openConnectWallet}>
					Connect Wallet
				</FutureButton>
			)}
	</div>
	);
};

export default GrantVestedTokens;
