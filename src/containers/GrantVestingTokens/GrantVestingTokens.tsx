//- GVT MAIN MENU -//
import React, { useState } from 'react';

//- Components Imports
import { ContainerGral, ContainerPopup } from 'containers/index';
import {
	FutureButton,
	RecipientButton,
	TextInput,
	InputTest,
	EthInput,
} from 'components/index';

import './GrantVestingTokens.css';

//- Styles
const addRecipientStyle: React.CSSProperties = {
	color: 'white',
	borderRadius: '5px',
	border: 'none',
};

const TotalGrantedStyle: React.CSSProperties = {
	color: 'white',
	backgroundColor: 'rgba(30, 81, 128, 1)',
	borderRadius: '5px',
	border: 'none',
};

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
		<ContainerPopup
			title={'Grand Vesting Tokens'}
			childrens={
				<>
					<hr className="glow" />

					<div
						style={{
							display: 'inline-block',
							width: '100%',
							marginTop: '20px',
							textAlign: 'left',
						}}
					>
						<p
							style={{
								fontSize: '1.2em',
								textShadow: '0px 0px 20px rgba(60, 161, 255, 0.8)',
							}}
						>
							Ethereum vesting contract address you wish to grant from:
						</p>
					</div>

					<EthInput
						title={'hello'}
						text={'0x1wjlasdi98sdff099sdwiioasoidijjafs8'}
						copyButton
						static
					/>

					<hr className="glow" />

					<div
						style={{
							display: 'inline-block',
							width: '100%',
							marginTop: '20px',
							textAlign: 'left',
						}}
					>
						<p
							style={{
								fontSize: '1.2em',
								textShadow: '0px 0px 10px rgba(60, 161, 255, 0.8)',
							}}
						>
							Ethereum address you wish to grant vesting tokens to:
						</p>
					</div>

					{/*SCROLL DIV */}
					<div className="scrollDiv">
						<InputTest />
						<InputTest />
						<InputTest />
						<InputTest />
						<InputTest />
						<InputTest />
						<InputTest />
						<InputTest />
						<InputTest />
						<InputTest />
					</div>

					<div
						style={{
							textAlign: 'initial',
						}}
					>
						{/* Input Recipient Address */}
						<TextInput
							onChange={(text) => {
								catchAddress(text);
							}}
							alphanumeric={true}
							text={address}
							placeholder={'Recipient Address'}
							ethlogo
							style={{
								float: 'left',
								width: '70%',
								opacity: '0.8',
								marginTop: '10px',
							}}
						/>

						{/* Input Amount */}
						<TextInput
							onChange={(text) => {
								catchAmount(text);
							}}
							numeric={true}
							text={amount}
							placeholder={'Amount'}
							style={{
								float: 'right',
								width: '25%',
								opacity: '0.8',
								marginTop: '10px',
							}}
						/>
					</div>

					<div
						style={{
							position: 'relative',
						}}
					>
						<RecipientButton
							style={addRecipientStyle}
							children={'+ Add Recipient'}
						/>

						<p
							style={{
								position: 'absolute',
								top: '10px',
								right: '195px',
								fontSize: '14px',
								textShadow: '0px 0px 10px rgba(60, 161, 255, 0.7)',
								opacity: '0.7',
							}}
						>
							Total Granted
						</p>

						<p
							style={{
								position: 'absolute',
								top: '6px',
								right: '17px',
								fontSize: '24px',
								textShadow: '0px 0px 10px rgba(255, 255, 255, 0.7)',
							}}
						>
							10,000.00 TEST
						</p>
					</div>

					<FutureButton children={'Send'} glow onClick={onSend} />
				</>
			}
			style={{
				paddingLeft: '50px',
				paddingRight: '50px',
				margin: '0 auto',
			}}
		/>
	);
};

export default GrantVestingTokens;
