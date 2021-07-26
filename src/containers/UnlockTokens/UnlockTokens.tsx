//- React Imports
import React, { useState } from 'react';

//- Component Imports
import { FutureButton, WilderIcon } from 'components';

//- Style Imports
import styles from './UnlockTokens.module.css';

type UnlockTokensProps = {
	onUnlock: () => void;
	isLoading?: boolean;
	numTokens: number;
};

const UnlockTokens: React.FC<UnlockTokensProps> = ({
	onUnlock,
	numTokens,
	isLoading,
}) => {
	//////////////////
	// State & Refs //
	//////////////////

	// Data
	const total = Number(numTokens).toLocaleString();
	const token = 'WILD';

	///////////////
	// Functions //
	///////////////

	const unlock = () => {
		if (onUnlock) onUnlock();
	};

	return (
		<div className={`${styles.Container} blur`}>
			<WilderIcon style={{ margin: '0 auto' }} />
			<h1 style={{ marginTop: 16 }} className="glow-text-white">
				Unlock {token} Tokens
			</h1>
			<section>
				<span className={styles.Amount}>
					{token} {total}
				</span>
				<p>
					You have been granted {total} Wild Tokens, which must be unlocked
					before you can claim them. Unlocking is the process of signing the
					token issue and only needs to be done once. It incurs GAS fees.
				</p>
				<FutureButton
					onClick={unlock}
					glow
					loading={isLoading}
					style={{ textTransform: 'uppercase', margin: '32px auto 0 auto' }}
				>
					Unlock Tokens
				</FutureButton>
			</section>
		</div>
	);
};

export default UnlockTokens;
