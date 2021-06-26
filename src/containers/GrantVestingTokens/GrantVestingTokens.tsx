//- GVT MAIN MENU -//
import React, { useState, MouseEvent } from 'react';

//- Components Imports
import { EtherInput, FutureButton } from 'components';

//- Styles Imports
import '../../styles/main.css';
import styles from './GrantVestingTokens.module.css';

type GrantVestingTokensProps = {
	varContract: string;
	onCatchContract: (value:string) => void;

	setInputs: React.ReactNode;

	amount: string;

	onSend: () => void;
	onAddRecipient?: any;
};

const GrantVestingTokens: React.FC<GrantVestingTokensProps> = ({ 

	varContract,
	onCatchContract,

	setInputs,
	
	amount,

	onSend,
	onAddRecipient,
}) => {

	////////////
	// RENDER //
	////////////

	return (
		<form
			className={`${styles.Container} blur border-pink-glow border-rounded`}
		>
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

				<EtherInput
					ethlogo
					alphanumeric
					placeholder={'Vesting Contract Address'}
					onChange={(value) => onCatchContract(value)}
					text={varContract}
				/>
			</section>

			<div
				style={{
					marginTop: '34px',
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
				
				<div>
					<button
						id="buttonAdd"
						className="flatButton"
						style={{
							display: 'inline-block',
							width: '142px',
							height: '35px',
							backgroundColor: 'rgba(60, 161, 255, 0.15)',
							borderRadius: '8px',
							margin: '16px',
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
					}}
				>
					<FutureButton onClick={onSend} glow>
						Send
					</FutureButton>
				</div>
			</div>
		</form>
	);
};

export default GrantVestingTokens;
