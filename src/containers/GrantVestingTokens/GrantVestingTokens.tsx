//- GVT MAIN MENU -//
import React, { useEffect } from 'react';

//- Components Imports
import { EtherInput, FutureButton } from 'components';

//- Styles Imports
import '../../styles/main.css';
import styles from './GrantVestingTokens.module.css';
import { ethers } from 'ethers';
import { useState } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

type GrantVestingTokensProps = {
	varContract: string;
	onCatchContract: (value: string) => void;

	setInputs: React.ReactNode;

	amount: string;

	onSend: () => void;
	onAddRecipient?: any;

	textError?: string;

	validateValues: number | undefined;
};

const GrantVestingTokens: React.FC<GrantVestingTokensProps> = ({
	varContract,
	onCatchContract,

	setInputs,

	amount,

	onSend,
	onAddRecipient,

	validateValues,

	textError,
}) => {
	//- Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;

	const [errorState, setError] = useState(false);

	useEffect(() => {
		if (varContract !== '') {
			setTimeout(() => {
				if (textError === 'Checking...') {
					setError(false);
				} else {
					setError(true);
				}
			}, 2000);
		}
	}, [varContract, account, textError]);

	////////////
	// RENDER //
	////////////

	return (
		<div className={`${styles.Container} blur border-pink-glow border-rounded`}>
			<h1
				className="glow-text-white"
				style={{
					marginBottom: '56px',
				}}
			>
				Grant Vesting Tokens
			</h1>

			<div>
				<hr className="glow" />
			</div>

			<section>
				<h2 className="glow-text-blue">
					Ethereum vesting contract address you wish to grant from:
				</h2>

				{!errorState && (
					<EtherInput
						ethlogo
						alphanumeric
						placeholder={'Vesting Contract Address'}
						onChange={(value) => onCatchContract(value)}
						text={varContract}
					/>
				)}

				{errorState && (
					<EtherInput
						ethlogo
						alphanumeric
						placeholder={'Vesting Contract Address'}
						onChange={(value) => onCatchContract(value)}
						text={varContract}
						error
						errorText={textError}
					/>
				)}

				<div style={{ marginTop: '2px' }}>
					<div
						style={{
							display: 'inline-block',
							margin: '16px 0px 16px 16px',
						}}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<div
								style={{
									display: 'inline-block',
									width: '50px',
									height: '50px',
									backgroundColor: 'rgba(60, 161, 255, 0.15)',
									borderRadius: '100%',
									backgroundSize: 'contain',
									backgroundImage: 'url(../assets/wild.svg)',
								}}
							/>
							<p
								className="glow-text-white"
								style={{
									display: 'flex',
									fontWeight: 700,
									justifyContent: 'center',
									alignItems: 'center',
									margin: '15px 0px 0px 15px',
								}}
							>
								WILD
							</p>
						</div>
					</div>

					<div
						style={{
							display: 'inline-block',
							justifyItems: 'center',
							float: 'right',
							margin: '30px 20px 0px 0px',
						}}
					>
						<p
							className="glow-text-blue"
							style={{
								display: 'inline-block',
								marginRight: '8px',
								fontSize: '14px',
								color: 'rgba(128, 128, 128, 1)',
							}}
						>
							Total Available
						</p>

						<p
							className="glow-text-white"
							style={{
								display: 'inline-block',
								fontSize: '24px',
							}}
						>
							1,000,000.00 TEST
						</p>
					</div>
				</div>
			</section>

			<div
				style={{
					marginTop: '10px',
				}}
			>
				<hr className="glow" />
			</div>

			<section
				style={{
					marginTop: '26px',
				}}
			>
				<h2 className="glow-text-blue">
					Ethereum address you wish to grant vesting tokens to:
				</h2>

				<div className={styles.scroll}>
					{setInputs}

					<div style={{ marginTop: '10px' }}>
						<button
							id="buttonAdd"
							className="flatButton"
							style={{
								display: 'inline-block',
								width: '142px',
								height: '35px',
								backgroundColor: 'rgba(60, 161, 255, 0.15)',
								borderRadius: '8px',
								margin: '16px 0px 16px 16px',
							}}
						>
							<p
								className="glow-text-white"
								style={{
									color: '#FFFFFF',
									marginTop: '8px',
									fontSize: '16px',
								}}
								onClick={onAddRecipient}
							>
								+ Add Recipient
							</p>
						</button>

						<div
							style={{
								display: 'inline-block',
								justifyItems: 'center',
								float: 'right',
								margin: '20px',
							}}
						>
							<p
								className="glow-text-blue"
								style={{
									display: 'inline-block',
									marginRight: '8px',
									fontSize: '14px',
									color: 'rgba(128, 128, 128, 1)',
								}}
							>
								Total Granted
							</p>

							<p
								className="glow-text-white"
								style={{
									display: 'inline-block',
									fontSize: '24px',
								}}
							>
								{amount} TEST
							</p>
						</div>
					</div>
				</div>
			</section>

			<div
				style={{
					display: 'inline-block',
					width: '100%',
					textAlign: 'center',
				}}
			>
				<div
					style={{
						display: 'inline-block',
						marginTop: '10px',
					}}
				>
					{validateValues === 0 && textError === 'Checking...' && (
						<FutureButton onClick={onSend} glow>
							Send
						</FutureButton>
					)}

					{validateValues !== 0 && (
						<FutureButton onClick={() => {}}>Send</FutureButton>
					)}

					{validateValues === 0 && textError !== 'Checking...' && (
						<FutureButton onClick={() => {}}>Send</FutureButton>
					)}
				</div>
			</div>
		</div>
	);
};

export default GrantVestingTokens;
