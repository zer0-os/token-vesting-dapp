//- React Imports
import React, { useState } from 'react';

//- Component Imports
import { FutureButton, WilderIcon } from 'components';

//- Style Imports
import styles from './UnlockTokens.module.css';

type UnlockTokensProps = {
	onUnlock: () => void;
};

const UnlockTokens: React.FC<UnlockTokensProps> = ({ onUnlock }) => {
	//////////////////
	// State & Refs //
	//////////////////

	// Data
	const total = 1000000;
	const token = 'WILD';

	///////////////
	// Functions //
	///////////////

	const unlock = () => {
		if (onUnlock) onUnlock();
	};

	return (
		<div className={`${styles.Container} blur border-primary border-rounded`}>
			<WilderIcon style={{ margin: '0 auto' }} />
			<h1 style={{ marginTop: 16 }} className="glow-text-white">
				Unlock {token} Tokens
			</h1>
			<section>
				<span className={styles.Amount}>
					{token} {total.toLocaleString()}
				</span>
				<p>
					You have been granted 1,000,000 Wild Tokens, which must be unlocked
					before you can claim them. Unlocking is the process of signing the
					token issue and only needs to be done once. It incurs GAS fees.
				</p>
				<FutureButton
					onClick={unlock}
					glow
					style={{ textTransform: 'uppercase', margin: '32px auto 0 auto' }}
				>
					Unlock Tokens
				</FutureButton>
			</section>
		</div>
	);
};

export default UnlockTokens;
