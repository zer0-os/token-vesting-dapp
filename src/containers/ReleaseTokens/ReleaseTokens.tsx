//- React Imports
import React, { useState, useEffect, useRef } from 'react';

//- Component Imports
import { FutureButton, WilderIcon, HoverTooltip } from 'components';

//- Library Imports
import moment from 'moment';
import { ClaimVestingInterface } from 'util/index';
import { useBlockTimestamp } from 'hooks/useBlockTimestamp';
import {
	getBlocksPerDay,
	getEtherscanUriForNetwork,
	getNetworkFromChainId,
	getSecondsPerBlock,
	Network,
} from 'common/index';

//- Style Imports
import styles from './ReleaseTokens.module.css';

type props = {
	network: Network;
	onRelease: () => void;
	vesting: ClaimVestingInterface;
	isLoading?: boolean;
};

const ReleaseTokens: React.FC<props> = ({
	network,
	onRelease,
	vesting,
	isLoading,
}) => {
	// Calculate key dates
	const { blockNumber, blockTimestamp } = useBlockTimestamp();

	const secondsPerBlock = getSecondsPerBlock(network);
	const blocksUntilStart = blockNumber ? vesting.start - blockNumber : 0;

	// Start
	const startTime = blockTimestamp
		? blockTimestamp + blocksUntilStart * secondsPerBlock
		: 0;
	const startTimeHuman = moment(startTime * 1000).toLocaleString();

	// Cliff
	const cliffTime = startTime + vesting.cliff * secondsPerBlock;
	const cliffHuman = moment(cliffTime * 1000).toLocaleString();

	// 50%
	const halfTime = startTime + (vesting.duration / 2) * secondsPerBlock;
	const halfHuman = moment(halfTime * 1000).toLocaleString();

	// 100%
	const endTime = startTime + vesting.duration * secondsPerBlock;
	const endHuman = moment(endTime * 1000).toLocaleString();

	//////////////////
	// State & Refs //
	//////////////////

	// Data
	const claimed = vesting.claimed;
	const vested = vesting.vested;
	const toRelease = vested - claimed;
	const total = vesting.total;

	const token = 'WILD';

	// Label refs
	const claimedLabel = useRef<HTMLSpanElement>(null);
	const vestedLabel = useRef<HTMLSpanElement>(null);
	const totalLabel = useRef<HTMLSpanElement>(null);
	const [claimedText, setClaimedText] = useState(
		`${claimed.toLocaleString()} Claimed`,
	);
	const [vestedText, setVestedText] = useState(
		`${vested.toLocaleString()} Vested`,
	);
	const [totalText, setTotalText] = useState(`${total.toLocaleString()} Total`);

	///////////////
	// Functions //
	///////////////

	// @TODO change from any type
	const releaseTokens = (event: any) => {
		event.preventDefault(); // Prevent default form submit
		if (isLoading) return;
		if (onRelease) onRelease();
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (claimedLabel.current && vestedLabel.current && totalLabel.current) {
			const c = claimedLabel.current.getBoundingClientRect();
			const v = vestedLabel.current.getBoundingClientRect();
			const t = totalLabel.current.getBoundingClientRect();

			const cConflictsWithV = c.left + c.width >= v.left;
			const vConflictsWithT = v.left + v.width >= t.left;

			var cText = '';
			var vText = '';
			var tText = '';

			// If there are no clashes
			if (claimed === vested && vested === total) {
				cText = '';
				vText = '';
				tText = `${vested.toLocaleString()} Vested of ${total.toLocaleString()} Total`;
			} else if (!cConflictsWithV && !vConflictsWithT) {
				cText = `${claimed.toLocaleString()} Claimed`;
				vText = `${vested.toLocaleString()} Vested`;
				tText = `${total.toLocaleString()} Total`;
			} else if (cConflictsWithV && vConflictsWithT) {
				tText = `${claimed.toLocaleString()} Claimed of ${total.toLocaleString()} Total`;
			} else {
				if (cConflictsWithV) {
					cText = '';
					vText = `${claimed.toLocaleString()} Claimed of ${vested.toLocaleString()} Vested`;
					tText = `${total.toLocaleString()} Total`;
				} else if (vConflictsWithT) {
					cText = `${claimed.toLocaleString()} Claimed`;
					vText = '';
					tText = `${vested.toLocaleString()} Vested of ${total.toLocaleString()} Total`;
				}
			}

			setClaimedText(cText);
			setVestedText(vText);
			setTotalText(tText);
		}
	}, [claimed, vested, total]);

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
							<span ref={claimedLabel}>{claimedText}</span>
						</div>
						{/* Vested bar */}
						<div style={{ width: `${(vested / total) * 100}%` }}>
							<span ref={vestedLabel}>{vestedText}</span>
						</div>
						{/* Total label */}
						<span ref={totalLabel}>{totalText}</span>
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
									{startTimeHuman}
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
									{cliffHuman}
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
									{halfHuman}
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
									{endHuman}
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
					<br />
					<br />
					You have claimed <b>{((claimed / total) * 100).toFixed(2)}%</b> of
					your vested tokens.
					<br />
					<br />
					You are eligible to release <b>{toRelease.toLocaleString()}</b> tokens
					now.
				</p>
				<FutureButton
					onClick={() => {}}
					glow
					style={{ textTransform: 'uppercase', margin: '32px auto 0 auto' }}
					loading={isLoading}
				>
					Release Tokens
				</FutureButton>
			</section>
		</form>
	);
};

export default ReleaseTokens;
