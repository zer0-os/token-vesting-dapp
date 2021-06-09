//- React Imports
import React from 'react';

import { Button } from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { getLogger, Maybe } from '../util';
import { InjectedConnector } from '@web3-react/injected-connector';

const injected = new InjectedConnector({
	supportedChainIds: [1, 3, 4, 5, 42],
});

const logger = getLogger(`components::ConnectButton`);

export const ConnectButton: React.FC = () => {
	const context = useWeb3React<ethers.providers.Web3Provider>();
	const { active } = context;

	let button: Maybe<React.ReactFragment>;

	const onConnect = async () => {
		await context.activate(injected, (e) => {
			logger.error(`Failed to connect ${e}`);
		});
	};

	const onDisconnect = async () => {
		await context.deactivate();
	};

	if (!active) {
		button = (
			<Button variant="contained" color="primary" onClick={onConnect}>
				Connect Metamask
			</Button>
		);
	} else {
		button = (
			<Button variant="outlined" color="secondary" onClick={onDisconnect}>
				Disconnect Metamask
			</Button>
		);
	}

	return <React.Fragment>{button}</React.Fragment>;
};
