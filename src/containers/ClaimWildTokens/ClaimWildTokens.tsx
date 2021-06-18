//- React Imports
import React, { useState } from 'react';

//- Component Imports
import { FutureButton, TextInput } from 'components';

//- Style Imports
import styles from './ClaimWildTokens.module.css';

const ClaimWildTokens = () => {
	//////////////////
	// State & Refs //
	//////////////////

	// Data
	const claimed = 250000;
	const vested = 750000;
	const total = 1000000;

	const dateStart = 1623290784;
	const dateCliff = 1623291084;

	// Page state
	const [amountToRelease, setAmountToRelease] = useState<number | undefined>(
		undefined,
	);

	///////////////
	// Functions //
	///////////////

	const releaseTokens = () => {
		console.log('release');
	};

	const onInputChange = (text: string) => {
		if (text.length === 0) setAmountToRelease(undefined);
		try {
			const e = parseFloat(text);
			if (e > 0) setAmountToRelease(e);
		} catch (e) {
			console.warn('Invalid input - numbers only');
		}
	};

	return (
		<form className={`${styles.Container} blur border-primary border-rounded`}>
			<h1 className="glow-text-white">Claim WILD Tokens</h1>
			<section>
				<h2>Tokens You Own</h2>
				<div>
					<div className={styles.ProgressBar}>
						{/* Claimed bar */}
						<div style={{ width: `${(claimed / total) * 100}%` }}>
							<span>{claimed.toLocaleString()} Claimed</span>
						</div>
						{/* Vested bar */}
						<div style={{ width: `${(vested / total) * 100}%` }}>
							<span>{vested.toLocaleString()} Vested</span>
						</div>
						{/* Total label */}
						<span>{total.toLocaleString()} Total</span>
					</div>
				</div>
			</section>
			<section>
				<h2>Vesting Timeline</h2>
				<div>
					<div className={styles.Timeline}>
						{/* Claimed bar */}
						<div>
							<span>Start</span>
						</div>
						{/* Vested bar */}
						<div style={{ left: '15%' }}>
							<span>Cliff</span>
						</div>
						<div style={{ left: '50%' }}>
							<span>50% Vested</span>
						</div>
						<div style={{ right: 0 }}></div>
						<span>100% Vested</span>
					</div>
				</div>
			</section>
			<section>
				<h2>Tokens To Release</h2>
				<TextInput
					onChange={onInputChange}
					text={amountToRelease ? Number(amountToRelease).toString() : ''}
					style={{ width: 304 }}
				/>
				<p>
					You can release tokens that have vested but not yet been claimed.
					You’ve claimed {claimed.toLocaleString()} out of{' '}
					{vested.toLocaleString()} vested tokens, so you can release up to{' '}
					{(vested - claimed).toLocaleString()} now.
				</p>
				<FutureButton
					onClick={releaseTokens}
					glow={amountToRelease ? amountToRelease > 0 : false}
					style={{ textTransform: 'uppercase', margin: '0 auto' }}
				>
					Release Tokens
				</FutureButton>
			</section>
		</form>
	);
};

export default ClaimWildTokens;
