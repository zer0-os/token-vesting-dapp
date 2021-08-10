//- React Imports
import React, { useState, useEffect } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { getContractAddressesForNetwork, getNetworkFromChainId } from 'common';
import { ethers } from 'ethers';

//- Library Imports
import { suggestWildToken } from 'lib/suggestToken';
import {
	getLogger,
	ClaimVestingInterface,
	ContractAddresses,
} from 'util/index';
import { useContracts } from 'hooks/useContracts';
import { useRefresh } from 'hooks/useRefresh';
import useNotification from 'hooks/useNotification';
import { useMerkleVesting } from 'hooks/useMerkleVesting';
import { Contracts, Maybe } from '../../util';
import {
	TransactionState,
	useTransactionState,
} from 'hooks/useTransactionState';

//- Component & Container Imports
import {
	ConnectToWallet,
	FutureButton,
	TextButton,
	Overlay,
	WilderIcon,
	LoadingSpinner,
} from 'components';
import { ReleaseTokens, UnlockTokens } from 'containers';

//- Style Imports
import styles from './ClaimVestedTokens.module.css';
import { useMemo } from 'react';

const logger = getLogger(`components::ClaimVestedTokens`);

enum Modals {
	ConnectToWallet,
	Menu,
	Unlock,
	Claim,
}

const ClaimVestedTokens: React.FC = () => {
	//////////
	// Web3 //
	//////////

	// Wallet data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active, chainId } = walletContext;

	const context = useWeb3React();

	const { refreshToken, refresh } = useRefresh();

	const [contractNumber, setContractNumber] = useState(0);
	const [loading, setLoading] = useState(false);

	const network = getNetworkFromChainId(context.chainId!);

	const claimState = useTransactionState();
	const releaseState = useTransactionState();

	const contracts: Maybe<Contracts[]> = useContracts();

	let vesting = useMerkleVesting(
		contracts![contractNumber].vesting,
		account,
		refreshToken,
	);

	//////////////////
	// State & Refs //
	//////////////////

	const { addNotification } = useNotification();

	// Page state
	const [modal, setModal] = useState<number | undefined>(undefined);
	const [claimInterfaceProps, setClaimInterfaceProps] = useState<
		ClaimVestingInterface | undefined
	>();

	const [stop, setStop] = useState(false);

	///////////////
	// Functions //
	///////////////

	//The Array does contains the buttons of address
	const MenuItems: any = [];

	const [contractData, setContractData] = useState<ContractAddresses>();

	useMemo(() => {
		setContractData(
			getContractAddressesForNetwork(getNetworkFromChainId(chainId!)),
		);
	}, [chainId]);

	var itemsCenter: boolean = true;

	if (modal === Modals.Claim || modal === Modals.Unlock) {
		contractData!.vesting.forEach((value, i) => {
			if (i > 4) {
				itemsCenter = false;
			}
			MenuItems.push(
				<li
					key={i}
					onClick={() => {
						if (i !== contractNumber) {
							contractToggle(i);
						}
					}}
					className={`${styles.MenuItem} 
					${contractNumber === i ? styles.MenuItemSelected : ''}`}
				>
					<div className={'glow-box-accent-1'}>
						<img
							className={'glow-box-accent-1'}
							alt={value + 'Logo'}
							src={contractData!.vesting[i].icon}
						/>
					</div>
					<p>{contractData!.vesting[i].name}</p>
				</li>,
			);
		});
	}

	useEffect(() => {
		if (
			vesting.vestedTokens &&
			vesting.releasableTokens &&
			vesting.awardedTokens &&
			vesting.vestingParams
		) {
			setClaimInterfaceProps({
				claimed: toNumber(vesting.vestedTokens.sub(vesting.releasableTokens)),
				vested: toNumber(vesting.vestedTokens),
				total: toNumber(vesting.awardedTokens),
				start: vesting.vestingParams.start,
				duration: vesting.vestingParams.duration,
				cliff: vesting.vestingParams.cliff,
			});
		}
	}, [
		vesting.vestedTokens,
		vesting.releasableTokens,
		vesting.awardedTokens,
		vesting.vestingParams,
	]);

	//If full fetch happens, change to action button
	useEffect(() => {
		setLoading(false);
	}, [vesting.fullFetch]);

	//If half fetch happens and hasnt claimed, change to action button
	useEffect(() => {
		if (vesting.hasClaimed === false) setLoading(false);
	}, [vesting.partialFetch]);

	const addWildToMetamask = () => suggestWildToken(context.library);

	const toNumber = (amount: any) => Number(ethers.utils.formatEther(amount));

	//toggle contract, and set the loading icon on
	const contractToggle = (number: number) => {
		setStop(false);
		setLoading(true);
		setContractNumber(number);
	};

	useEffect(() => {
		if (
			modal !== undefined &&
			vesting.hasClaimed === false &&
			vesting.awardedTokens
		) {
			// Open unlock modal
			setModal(Modals.Unlock);
		} else if (stop === false && vesting.hasClaimed === true) {
			// Open claim modal
			if (
				modal !== undefined &&
				vesting.vestedTokens &&
				vesting.releasableTokens &&
				vesting.awardedTokens &&
				vesting.vestingParams
			) {
				setClaimInterfaceProps({
					claimed: toNumber(vesting.vestedTokens.sub(vesting.releasableTokens)),
					vested: toNumber(vesting.vestedTokens),
					total: toNumber(vesting.awardedTokens),
					start: vesting.vestingParams.start,
					duration: vesting.vestingParams.duration,
					cliff: vesting.vestingParams.cliff,
				});
				setStop(true);
				setModal(Modals.Claim);
			}
		}
	}, [vesting, claimState, loading, stop, modal]);

	const release = async () => {
		logger.debug(`User attempting to release tokens`);
		releaseState.setError(undefined);
		releaseState.setState(TransactionState.Submitting);

		const claimAmount = toNumber(vesting.releasableTokens);

		try {
			const tx = await vesting.releaseTokens();

			releaseState.setState(TransactionState.Processing);
			releaseState.setHash(tx.hash);

			await tx.wait();
		} catch (e) {
			releaseState.setError(e.message ? e.message : e);
			releaseState.setState(TransactionState.Pending);
			return;
		}

		releaseState.setState(TransactionState.Pending);

		addNotification(`Successfully claimed ${claimAmount} WILD tokens`);

		refresh();
	};

	const unlock = async () => {
		logger.debug(`User attempting to claim tokens`);
		claimState.setError(undefined);
		claimState.setState(TransactionState.Submitting);

		try {
			const tx = await vesting.claimAward();
			claimState.setState(TransactionState.Processing);
			claimState.setHash(tx.hash);

			await tx.wait();
		} catch (e) {
			claimState.setError(e.message ? e.message : e);
			claimState.setState(TransactionState.Pending);
			return;
		}
		closeModal();
		addNotification('Successfully unlocked tokens');

		claimState.setState(TransactionState.Completed);
	};

	// Modals
	const closeModal = () => setModal(undefined);
	const openConnectToWalletModal = () => setModal(Modals.ConnectToWallet);

	return (
		<>
			{/* Modals */}
			<Overlay
				centered
				open={
					modal === Modals.Menu ||
					modal === Modals.Unlock ||
					modal === Modals.Claim
				}
				onClose={closeModal}
			>
				<div
					className={`${styles.ContainerClaim} blur border-primary border-rounded`}
				>
					<div className={`${styles.MenuToken}`}>
						<div className={`${itemsCenter ? styles.HeightCorrector : ''}`}>
							<ul>{MenuItems}</ul>
						</div>
					</div>
					<div className={`${styles.ContentContainer}`}>
						<div className={`${styles.ClaimContent}`}>
							{/* Loading Icon */}
							{loading === true && vesting.hasAward === true && (
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<LoadingSpinner />
								</div>
							)}

							{claimInterfaceProps &&
								modal === Modals.Claim &&
								loading === false && (
									<ReleaseTokens
										isLoading={
											releaseState.isSubmitting || releaseState.isProcessing
										}
										network={network}
										vesting={claimInterfaceProps}
										onRelease={release}
									/>
								)}

							{modal === Modals.Unlock && loading === false && (
								<UnlockTokens
									isLoading={claimState.isSubmitting || claimState.isProcessing}
									numTokens={
										vesting.awardedTokens
											? Number(ethers.utils.formatEther(vesting.awardedTokens))
											: 0
									}
									onUnlock={unlock}
								/>
							)}
						</div>
					</div>
				</div>
			</Overlay>

			<Overlay
				centered
				open={modal === Modals.ConnectToWallet}
				onClose={closeModal}
			>
				<ConnectToWallet onConnect={closeModal} />
			</Overlay>

			{/* Page Content */}
			<section className={styles.Container}>
				<main className={styles.Buttons}>
					{/* Connect To Wallet */}
					{!active && (
						<FutureButton glow onClick={openConnectToWalletModal}>
							Connect Wallet
						</FutureButton>
					)}

					{/* Wallet Conected */}
					{active && (
						<>
							<WilderIcon
								className={styles.Profile}
								onClick={openConnectToWalletModal}
							/>
							{/* Loading Icon */}
							{vesting.token === null && vesting.hasAward !== false && (
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<LoadingSpinner />
								</div>
							)}

							{/* Action Button */}
							{vesting.token !== null &&
								vesting.hasAward === true &&
								loading === false && (
									<>
										<FutureButton
											style={{ margin: '24px auto' }}
											glow={vesting.awardedTokens !== undefined}
											onClick={() => {
												if (vesting.awardedTokens !== undefined) {
													setStop(false);
													setModal(Modals.Menu);
												}
											}}
										>
											Claim Tokens
										</FutureButton>
										<TextButton
											style={{
												margin: '24px auto',
												textAlign: 'center',
												paddingLeft: 13,
											}}
											onClick={addWildToMetamask}
										>
											Add WILD token to Metamask
										</TextButton>
									</>
								)}

							{/* No tokens message */}
							{vesting.hasAward === false && (
								<h2>You have no tokens to claim</h2>
							)}
						</>
					)}
				</main>
			</section>
		</>
	);
};

export default ClaimVestedTokens;
