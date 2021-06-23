//- React Imports
import React, { useState } from 'react';

//- Component Imports
import { FutureButton, WilderIcon, HoverTooltip } from 'components';

//- Style Imports
import styles from './ReleaseTokens.module.css';

type props = {
	onRelease: () => void;
};

const ReleaseTokens: React.FC<props> = ({ onRelease }) => {
	//////////////////
	// State & Refs //
	//////////////////

	// Data
	const claimed = 250000;
	const vested = 750000;
	const toRelease = vested - claimed;
	const total = 1000000;

	const dateStart = 1623290784;
	const dateCliff = 1623291084;

	const token = 'WILD';
	const amountToRelease = 500000;

	const [errors, setErrors] = useState<string[]>([]);

	///////////////
	// Functions //
	///////////////

	// @TODO change from any type
	const releaseTokens = (event: any) => {
		event.preventDefault(); // Prevent default form submit
		if (amountToRelease) {
			setErrors([]);
			if (onRelease) onRelease();
		} else {
			setErrors(['amount']);
		}
	};

	/////////////////////
	// React Fragments //
	/////////////////////

	return (
		<form
			onSubmit={releaseTokens}
			className={`${styles.Container} blur border-primary border-rounded`}
		>
			<WilderIcon style={{ margin: '0 auto' }} />
			<h1 style={{ marginTop: 16 }} className="glow-text-white">
				Claim {token} Tokens
			</h1>
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
						<HoverTooltip
							tooltipContent={
								<p
									style={{
										textAlign: 'center',
										padding: 0,
										lineHeight: '24px',
									}}
								>
									Wed 29 June 2021
									<br />
									19:06PM
								</p>
							}
						>
							<div>
								<span>Start</span>
							</div>
						</HoverTooltip>
						{/* Vested bar */}
						<HoverTooltip
							style={{ left: '15%' }}
							tooltipContent={
								<p
									style={{
										textAlign: 'center',
										padding: 0,
										lineHeight: '24px',
									}}
								>
									Wed 29 June 2021
									<br />
									19:06PM
								</p>
							}
						>
							<div>
								<span>Cliff</span>
							</div>
						</HoverTooltip>

						<HoverTooltip
							style={{ left: '50%' }}
							tooltipContent={
								<p
									style={{
										textAlign: 'center',
										padding: 0,
										lineHeight: '24px',
									}}
								>
									Wed 29 June 2021
									<br />
									19:06PM
								</p>
							}
						>
							<div>
								<span>50% Vested</span>
							</div>
						</HoverTooltip>

						<HoverTooltip
							style={{ right: 0 }}
							tooltipContent={
								<p
									style={{
										textAlign: 'center',
										padding: 0,
										lineHeight: '24px',
									}}
								>
									Wed 29 June 2021
									<br />
									19:06PM
								</p>
							}
						>
							<div></div>
							<span>100% Vested</span>
						</HoverTooltip>
					</div>
				</div>
			</section>
			<section>
				<h2>Tokens To Release</h2>
				<span className={styles.Amount}>
					{token} {toRelease.toLocaleString()}
				</span>
				<p>
					You can release tokens that have vested but not yet been claimed.
					You’ve claimed {claimed.toLocaleString()} out of{' '}
					{vested.toLocaleString()} vested tokens, so you can release up to{' '}
					{toRelease.toLocaleString()} now.
				</p>
				<FutureButton
					onClick={() => {}}
					glow
					style={{ textTransform: 'uppercase', margin: '32px auto 0 auto' }}
				>
					Release Tokens
				</FutureButton>
			</section>
		</form>
	);
};

export default ReleaseTokens;
