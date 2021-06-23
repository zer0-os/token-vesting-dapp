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
	Confirm,
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
		const openConfirm = () => setModal(Modals.Confirm);
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

			{/* Grant Menu */}
			{modal !== undefined && modal === Modals.Grant && (
					<GrantVestingTokens onSend={openConfirm}/>
			)}

			{modal !== undefined && modal === Modals.Confirm && (
				<Overlay centered onClose={openGrantModal} open>
					<div className={`${styles.confirmModal} blur border-pink-glow border-rounded`}>
						<h1 className="glow-text-white">Are you sure?</h1>

						<div style={{
							marginTop: '40px',
							marginBottom: '42px',
						}}>
							<hr className='glow'/>
						</div>

						<p style={{
							textAlign: 'center',
						}}>
							This transaction is about to be seared <br/> upon the Blockchain. 
							There’s no going back.
						</p>

						<div style={{
								textAlign: 'center',
								marginTop: '40px',
							}}>
							<div style={{
								display: 'inline-block',
								marginRight: '40px'
							}}>
								<FutureButton alt onClick={openGrantModal} glow>
									Cancel
								</FutureButton>
							</div>

							<div style={{
								display: 'inline-block',
							}}>
								<FutureButton onClick={openGrantingModal} glow>
									Grant
								</FutureButton>
							</div>
						</div>
					</div>
				</Overlay>
			)}

			{modal !== undefined && modal === Modals.GrantInit && (
				<FutureButton glow onClick={openGrantModal}>
					Grant Vesting Token
				</FutureButton>
			)}

			{/* First View - Connect Wallet */}
			{modal === undefined && (
				<FutureButton glow onClick={openGrantInit}>
					Connect Wallet
				</FutureButton>
			)}
	</div>
	);
};

export default GrantVestedTokens;
