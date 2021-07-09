//- by Alejo Viola

//- React Imports
import React, { useState, useEffect } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

//- Contract Connection Imports
import { logger, utils } from 'ethers';

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
import { TransactionState, useTransactionState } from 'hooks/useTransactionState';

//- Style Imports
import styles from './GrantVestedTokens.module.css';
import { useOwner } from 'hooks/useOwner';
import { TokenVestingController } from 'contracts/types';
import { GrantContract, Maybe } from '../../util';

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

	const transactionState = useTransactionState();

	//- Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { active } = walletContext;

	useEffect(() => { }, [active]);

	//- Variable that Catch the Contract Address
	const [contract, catchContract] = useState('');

	const grantContract: Maybe<GrantContract> = useGrantContract(contract);

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

	////////////////////////
	// Transaction Values //
	////////////////////////
	const addressToSend: string[] = [];
	const amountToSend: string[] = [];
	const boolToSend: boolean[] = [];

	const [validate, validateValues] = useState<number | undefined>(undefined);

	//- Check Transaction and set the Modal
	const CheckTransaction = () => {

		enum checker {
			Done,
			FailContract,
			FailAddress,
			FailAmount,
		}

		if (contract.length !== 42) {
			console.error('You must set a Contract with 42 characteres to Grant.');
			validateValues(checker.FailContract);
		} else if (values.find(i => i.address == '' || i.address == undefined)) {
			console.error('You must complete all the Recipient Address to Grant.');
			validateValues(checker.FailAddress);
		} else if (values.find(i => i.amount == '' || i.amount == undefined || i.amount == '0')) {
			console.error('You must complete all the Amount to Grant.');
			validateValues(checker.FailAmount);
		} else {
			openConfirm();
		}
	}

	//- Send Transaction
	const SendTransaction = async () => {
		values.forEach((i) => {
			addressToSend.push(i.address);
			amountToSend.push(utils.parseEther(i.amount).toString());
			boolToSend.push(false);
		});

		console.log(addressToSend);
		console.log(amountToSend);
		console.log(boolToSend);

		logger.debug('User attempting to Grant Tokens');
		transactionState.setError(undefined);
		transactionState.setState(TransactionState.Submitting);

		try {
			const tx = await grantContract!.vesting.grantTokens(addressToSend, amountToSend, boolToSend);

			openGrantingModal();
			//transactionState.setState(TransactionState.Processing);

			await tx.wait();
		} catch (e) {
			transactionState.setError(e.message ? e.message : e);
			transactionState.setState(TransactionState.Pending);
			return;
		}

		openGrantedModal();
	}

	//- Set Owner State
	const owner = useOwner();

	useEffect(() => {
		if (owner == 1) {
			openGrantInit();
		} else if (owner == 2) {
			openNotAuthorized();
		}
	}, [owner]);

	/////////////////////
	// Inputs Function //
	/////////////////////

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

	////////////
	// Render //
	////////////

	return (
		<>
			{active && (
				<>
					{modal !== undefined && modal === Modals.NotAuthorized && (
						<div className={styles.Container}>
							<div
								className={`${styles.confirmModal} blur border-pink-glow border-rounded`}
							>
								<h1
									className="glow-text-white"
								>
									Oops!
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
									You are not authorized to grant TEST <br />
									vesting tokens to another address.
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
										<FutureButton onClick={openConnectWallet} glow>
											Dismiss
										</FutureButton>
									</div>
								</div>
							</div>
						</div>
					)}

					{modal !== undefined && modal === Modals.Granted && owner == 1 && (
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

					{modal !== undefined && modal === Modals.Granting && owner == 1 && (
						<div className={styles.Container}>
							<div
								className={`${styles.confirmModal} blur border-pink-glow border-rounded`}
							>
								<h1 className="glow-text-white">Granting...</h1>
							</div>
						</div>
					)}

					{/* Grant Menu */}
					{modal !== undefined && modal === Modals.Grant && owner == 1 && (
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

					{modal !== undefined && modal === Modals.Confirm && owner == 1 && (
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
											<FutureButton onClick={SendTransaction} glow>
												Grant
											</FutureButton>
										</div>
									</div>
								</div>
							</Overlay>
						</div>
					)}

					{modal !== undefined && modal === Modals.GrantInit && owner == 1 && (
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
