import React, { useState } from 'react';

import styles from './EthInput.module.css';

import ethIcon from './assets/eth.svg';

const EthInput = (props) => {
	const [text, setText] = useState(props.text || '');

	const copyContractToClipboard = () => {
		navigator.clipboard.writeText(props.value);
	};

	return (
		<div style={props.style} className={styles.wallet}>
			<img alt="ethereum icon" src={ethIcon} />
			<span>{props.title ?? 'Ethereum Address'}</span>
			<input
				onChange={(event) => {
					if (!props.static) setText(event.target.value);
				}}
				type="text"
				value={text}
			></input>
			{props.copyButton && <button onClick={copyContractToClipboard}></button>}
		</div>
	);
};

export default EthInput;
