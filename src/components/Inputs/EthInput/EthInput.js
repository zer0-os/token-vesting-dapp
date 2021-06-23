import React from 'react';

import styles from './EthInput.module.css';

import ethIcon from './assets/eth.svg';

const EthInput = (props) => {
	const [text, setText] = React.useState('');

	React.useEffect(() => {
		setText(props.text);
	}, [props.text]);

	const copyContractToClipboard = () => {
		navigator.clipboard.writeText(props.text);
	};

	return (
		<div style={props.style} className={styles.wallet}>
			<img alt="ethereum icon" src={ethIcon} />
			<span>{props.title ?? 'Ethereum Address'}</span>
			<input
				spellCheck="false"
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
