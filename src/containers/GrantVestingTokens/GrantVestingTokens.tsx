//- GVT MAIN MENU -//
import React, { useState } from 'react';

//- Components Imports
import { EtherInput, FutureButton } from 'components';

//- Styles Imports
import '../../styles/main.css';
import styles from './GrantVestingTokens.module.css';

type GrantVestingTokensProps = {
	onSend: () => void;
};

const GrantVestingTokens: React.FC<GrantVestingTokensProps> = ({ onSend }) => {
	const [contract, catchInput] = useState('');
	const [address, catchAddress] = useState('');
	const [amount, catchAmount] = useState('');

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
					onChange={(value) => catchInput(value)}
					text={contract}
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

				<div
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
							onChange={(value) => catchAddress(value)}
							text={address}
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
							onChange={(value) => catchAmount(value)}
							text={amount}
						/>
					</div>
				</div>

				<div>
					<button
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
							0.00 TEST
						</p>
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
