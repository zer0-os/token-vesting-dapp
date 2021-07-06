//- by Alejo Viola

//- React Imports
import React, { useState, useEffect } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

//- Contract Connection Imports
import { ethers } from 'ethers';

//- Component Imports
import {
	FutureButton,
	Overlay,
	ConnectToWallet,
	EtherInput
} from 'components';
import { GrantVestingTokens } from 'containers';

//- Hooks Import
import { useGrantContract } from 'hooks/useGrantContract';

//- Style Imports
import styles from './GrantVestedTokens.module.css';
import { useOwner } from 'hooks/useOwner';

const imageStyle: React.CSSProperties = {
	display: 'inline-block',
	width: '56px',
	height: '56px',
	margin: '25px',
	backgroundSize: 'contain',
	backgroundImage: 'url(../assets/user.png)',
};

enum Modals {
	ConnectToWallet,
	GrantInit,
	Grant,
	Confirm,
	Granting,
	Granted,
	NotAuthorized,
}

declare global {
	interface Window {
		ethereum: any;
	}
}

const GrantVestedTokens: React.FC = () => {
	//////////////////
	// State & Refs //
	//////////////////

	// - Page State
	const [modal, setModal] = useState<number | undefined>(undefined);

	//- Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active, chainId } = walletContext;

	const context = useWeb3React();

	useEffect(() => { }, [active]);

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

	const openNotAuthorized = () => setModal(Modals.NotAuthorized);

	//- Check Transaction and set the Modal
	const CheckTransaction = () => {
		let check = useGrantContract(contract);

		if (check !== 'Error') {
			openConfirm();
		}
	}

	//- Set Owner State
	const owner = useOwner();

	useEffect(() => {
		if (owner == 1) {
			openGrantInit();
		} else if (owner == 2) {
			openNotAuthorized();
		}
	}, [owner])

	/////////////////////
	// Inputs Function //
	/////////////////////

	//- Variable that Catch the Contract Address
	const [contract, catchContract] = useState('');

	//- Set variable that render the number of Inputs
	//- The first Input ID is 0
	const [values, setValues] = useState([{ id: 0, address: '', amount: '' }]);

	//- Function that create new Input
	const handleClick = (event: MouseEvent) => {
		event.preventDefault();

		setValues([
			...values,
			{
				id: values.length,
				address: '',
				amount: '',
			},
		]);
	};

	const [amounte, catchAmount] = useState('0.00');

	//- Format Number
	const formatNumber = (number: number) => {
		return new Intl.NumberFormat().format(number);
	}

	//- Catch and summarise the amount every time has been render
	useEffect(() => {
		let summarise = 0;

		values.map((i) => {
			if (i.amount !== '' && parseInt(i.amount) !== NaN) {
				summarise = summarise + parseInt(i.amount);
				catchAmount(String(formatNumber(summarise)) + '.00');
			} else if (i.amount == '') {
				catchAmount(String(formatNumber(summarise)) + '.00');
			}
		});
	}, [values]);

	////////////////////////
	// Transaction Values //
	////////////////////////
	const [addressToSend, setAddressToSend] = useState([{}]);
	const [amountToSend, setAmountToSend] = useState([{}]);
	const [boolToSend, setBoolToSend] = useState([{}]);

	const createValues = () => {

	}

	////////////
	// Render //
	////////////

	return (
		<>
			{active && (
				<>
					{modal !== undefined && modal === Modals.Granted && (
						<div className={styles.Container}>
							<div
								className={`${styles.confirmModal} blur border-pink-glow border-rounded`}
							>
								<h1
									className="glow-text-blue"
									style={{
										color: 'var(--color-green-2)',
									}}
								>
									Granted
								</h1>

								<div
									style={{
										marginTop: '40px',
										marginBottom: '42px',
									}}
								>
									<hr className="glow" />
								</div>

								<p
									style={{
										textAlign: 'center',
									}}
								>
									{amounte} TEST Tokens were successfully
									<br />
									granted.
								</p>

								<div
									style={{
										textAlign: 'center',
										marginTop: '40px',
									}}
								>
									<div
										style={{
											display: 'inline-block',
										}}
									>
										<FutureButton onClick={openGrantInit} glow>
											Dismiss
										</FutureButton>
									</div>
								</div>
							</div>
						</div>
					)}

					{modal !== undefined && modal === Modals.Granting && (
						<div className={styles.Container}>
							<Overlay centered onClose={openGrantedModal} open>
								<div
									className={`${styles.confirmModal} blur border-pink-glow border-rounded`}
								>
									<h1 className="glow-text-white">Granting...</h1>
								</div>
							</Overlay>
						</div>
					)}

					{/* Grant Menu */}
					{modal !== undefined && modal === Modals.Grant && (
						<div className={styles.gvt}>
							<GrantVestingTokens
								varContract={contract}
								onCatchContract={catchContract}
								setInputs={
									//- Render the Inputs that the Variable
									values.map((input) => (
										<div
											key={input.id}
											style={{
												marginTop: '24px',
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<div
												style={{
													width: '381px',
												}}
											>
												<EtherInput
													ethlogo
													alphanumeric
													placeholder={'Recipient Address'}
													onChange={(value) => {
														let change = [...values];
														let item = { ...change[input.id], address: value };
														change[input.id] = item;
														setValues(change);
													}}
													text={input.address}
												/>
											</div>

											<div
												style={{
													width: '160px',
												}}
											>
												<EtherInput
													numeric
													placeholder={'Amount'}
													onChange={(value) => {
														let change = [...values];
														let item = { ...change[input.id], amount: value };
														change[input.id] = item;
														setValues(change);
													}}
													text={input.amount}
												/>
											</div>
										</div>
									))
								}
								amount={amounte}
								onAddRecipient={handleClick}
								onSend={CheckTransaction}
							/>
						</div>
					)}

					{modal !== undefined && modal === Modals.Confirm && (
						<div className={styles.Container}>
							<Overlay centered onClose={openGrantModal} open>
								<div
									className={`${styles.confirmModal} blur border-pink-glow border-rounded`}
								>
									<h1 className="glow-text-white">Are you sure?</h1>

									<div
										style={{
											marginTop: '40px',
											marginBottom: '42px',
										}}
									>
										<hr className="glow" />
									</div>

									<p
										style={{
											textAlign: 'center',
										}}
									>
										This transaction is about to be seared <br /> upon the
										Blockchain. There’s no going back.
									</p>

									<div
										style={{
											textAlign: 'center',
											marginTop: '40px',
										}}
									>
										<div
											style={{
												display: 'inline-block',
												marginRight: '40px',
											}}
										>
											<FutureButton alt onClick={openGrantModal} glow>
												Cancel
											</FutureButton>
										</div>

										<div
											style={{
												display: 'inline-block',
											}}
										>
											<FutureButton onClick={openGrantingModal} glow>
												Grant
											</FutureButton>
										</div>
									</div>
								</div>
							</Overlay>
						</div>
					)}

					{modal !== undefined && modal === Modals.GrantInit && (
						<div className={styles.Container}>
							<div
								style={{
									textAlign: 'center',
								}}
							>
								<div style={imageStyle} />
								<FutureButton glow onClick={openGrantModal}>
									Grant Vesting Token
								</FutureButton>
							</div>
						</div>
					)}
				</>
			)}

			{modal !== undefined && modal === Modals.ConnectToWallet && (
				<div className={styles.Container}>
					<Overlay centered onClose={closeModal} open>
						<ConnectToWallet onConnect={openGrantInit} />
					</Overlay>
				</div>
			)}

			{/* First View - Connect Wallet */}
			{!active && modal === undefined && (
				<>
					{modal === undefined && (
						<div className={styles.Container}>
							<FutureButton glow onClick={openConnectWallet}>
								Connect Wallet
							</FutureButton>
						</div>
					)}
				</>
			)}
		</>
	);
};

export default GrantVestedTokens;
