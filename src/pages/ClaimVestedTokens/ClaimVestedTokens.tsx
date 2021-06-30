//- React Imports
import React, { useState, useEffect } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { getNetworkFromChainId , getContractAddressesForNetwork, defaultNetwork } from 'common';
import { ethers } from 'ethers';

//- Library Imports
import { suggestWildToken } from 'lib/suggestToken';
import { getLogger, ClaimVestingInterface } from 'util/index';
import { useContracts } from 'hooks/useContracts';
import { useRefresh } from 'hooks/useRefresh';
import useNotification from 'hooks/useNotification';
import { useMerkleVesting } from 'hooks/useMerkleVesting';
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
import { MerkleTokenVesting } from 'contracts/types';

const logger = getLogger(`components::ClaimVestedTokens`);

enum Modals {
	ConnectToWallet,
	Unlock,
	Claim,
}

const ClaimVestedTokens: React.FC = () => {
	//////////
	// Web3 //
	//////////

	// Wallet data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active } = walletContext;

	const context = useWeb3React();

	const { refreshToken, refresh } = useRefresh();

  const [contractNumber,setContractNumber] = useState(0);

	const network = getNetworkFromChainId(context.chainId!);

	const claimState = useTransactionState();
	const releaseState = useTransactionState();

	const contracts = [];
	const vestingContract = [];
	const vestingArray:any[] = [];
	
	var numberOfAddresses:number = getContractAddressesForNetwork(defaultNetwork).vesting.length;

	if(account)
  numberOfAddresses = getContractAddressesForNetwork(network).vesting.length;
	
  for(var k = 0; k<numberOfAddresses;k++){
	 contracts[k] = HookGetContract(k);
	 vestingContract[k] = contracts[k]!.vesting;
	 vestingArray[k] = HookGetMerkleVesting(vestingContract[k],account,refreshToken);
  }

  var vesting = vestingArray[0]; 
  var awardedIndex: number[] = [];
  var i = 0;
  checkAddresses();
  if(awardedIndex.length > 0)
	vesting = vestingArray[awardedIndex[contractNumber]];

	//////////////////
	// State & Refs //
	//////////////////

	const { addNotification } = useNotification();

	// Page state
	const [modal, setModal] = useState<number | undefined>(undefined);
	const [claimInterfaceProps, setClaimInterfaceProps] = useState<
		ClaimVestingInterface | undefined
	>();

	///////////////
	// Functions //
	///////////////


//runs if account its changed
  useEffect(() => {
		checkAddresses();
  }, [vesting.token]);

	useEffect(() => {
		//if there isnt any other contract to toggle, you dont need to update the current contract
		if(awardedIndex.length > 0) 
		vesting = vestingArray[awardedIndex[contractNumber]];
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
		contractNumber,
	]);

	function HookGetMerkleVesting(
		merkleArg: MerkleTokenVesting,
		accountArg:string|null|undefined,
		refreshTokenArg:number
		){
		var merkleToReturn = useMerkleVesting(merkleArg,accountArg,refreshTokenArg);
		return merkleToReturn;
	}
	function HookGetContract(indexNumber: number){
		var contractToReturn = useContracts(indexNumber);
		return contractToReturn;
	}

	//checks if the addresses have awards
	function checkAddresses () {
		i = 0;
		//If an address has awards, the contract will save the index and start with one of that addresses
		while(i<vestingArray.length){
			if(vestingArray[i].hasAward)
				awardedIndex.push(i);
			i++;
		}
	}
	const addWildToMetamask = () => suggestWildToken(context.library);

	const toNumber = (amount: any) => Number(ethers.utils.formatEther(amount));

  const contractToggle = () =>{
		setContractNumber(contractNumber + 1);
		if(contractNumber == awardedIndex.length -1)
			setContractNumber(0);
	}
	
	const onButtonClick = () => {

		if (vesting.hasClaimed === false && vesting.awardedTokens) {
			// Open unlock modal
			setModal(Modals.Unlock);
		} else if (vesting.hasClaimed === true) {
			// Open claim modal
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

				setModal(Modals.Claim);
			}
		}
	};

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

		addNotification('Successfully unlocked tokens');

		claimState.setState(TransactionState.Completed);
		closeModal();
	};

	// Modals
	const closeModal = () => setModal(undefined);
	const openConnectToWalletModal = () => setModal(Modals.ConnectToWallet);

	return (
		<>
			{/* Modals */}
			{claimInterfaceProps && (
				<Overlay centered open={modal === Modals.Claim} onClose={closeModal}>
					<ReleaseTokens
						isLoading={releaseState.isSubmitting || releaseState.isProcessing}
						network={network}
						vesting={claimInterfaceProps}
						onRelease={release}
					/>
				</Overlay>
			)}

			<Overlay centered open={modal === Modals.Unlock} onClose={closeModal}>
				<UnlockTokens
					isLoading={claimState.isSubmitting || claimState.isProcessing}
					numTokens={
						vesting.awardedTokens
							? Number(ethers.utils.formatEther(vesting.awardedTokens))
							: 0
					}
					onUnlock={unlock}
				/>
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
							{vesting.token !== null && vesting.hasAward === true && (
								<>
									<FutureButton
										style={{ margin: '24px auto' }}
										glow={vesting.awardedTokens !== undefined}
										onClick={onButtonClick}
									>
										{vesting.hasClaimed === false &&
											vesting.awardedTokens &&
											'Unlock Tokens'}
										{vesting.hasClaimed === true && 'Claim Tokens'}
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

							{/* Toggle contract Button */}
							{vesting.token !== null && (
								<>
									<FutureButton
										style={{ margin: '24px auto' }}
										glow={vesting.awardedTokens !== undefined}
										onClick={contractToggle}
									>
										{vesting.hasClaimed === false &&
											vesting.awardedTokens &&
											'Toggle Contract'}
									</FutureButton>
									<TextButton
										style={{ margin: '24px auto' }}
										glow={vesting.awardedTokens !== undefined}
										onClick={() => {}}
									>
										{'Vesting Contract: ' + contracts[awardedIndex[contractNumber]]?.vesting.address}
									</TextButton>

								</>
							)}
						</>
					)}
				</main>
			</section>
		</>
	);
};

export default ClaimVestedTokens;
