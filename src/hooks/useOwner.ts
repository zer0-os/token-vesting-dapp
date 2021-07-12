//- by Alejo Viola and Leo

import { useEffect, useState } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

enum OwnerState {
	Disconnected = 0,
	Autorized = 1,
	NoAuthorized = 2,
}

export const useOwner = () => {
	//- Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;

	const [owner, set] = useState('');

	const setOwner = (address: string) => {
		console.log(
			'%cYou have setted the Owner as: ' + address,
			'display: block; border: 3px solid #3ca1ff; border-radius: 7px; padding: 10px; margin: 8px;',
		);
		set(address);
	};

	// Global function so it can be called in the console
	(global as any).setOwner = setOwner;

	const [isOwner, setIsOwner] = useState(0);

	useEffect(() => {
		if (!account) {
			setIsOwner(OwnerState.Disconnected);
		} else if (owner == account) {
			setIsOwner(OwnerState.Autorized);
		} else {
			setIsOwner(OwnerState.NoAuthorized);
		}
	}, [account]);

	return isOwner;
};
