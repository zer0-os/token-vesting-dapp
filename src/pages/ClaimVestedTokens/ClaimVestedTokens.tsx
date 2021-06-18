//- React Imports
import React from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

//- Component Imports
import { ConnectToWallet } from 'components';

//- Style Imports
import styles from './ClaimVestedTokens.module.css';

const ClaimVestedTokens: React.FC = () => {
	//- Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active, chainId } = walletContext;

	return (
		<section className={styles.Container}>
			<div className={styles.Buttons}>
				<p>Claim Vested Tokens</p>
			</div>
		</section>
	);
};

export default ClaimVestedTokens;
