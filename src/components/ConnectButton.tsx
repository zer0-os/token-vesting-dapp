//- React Imports
import React from 'react';

import { FutureButton, TextButton } from 'components';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { getLogger, Maybe } from '../util';
import { InjectedConnector } from '@web3-react/injected-connector';

const injected = new InjectedConnector({});

const logger = getLogger(`components::ConnectButton`);

export const ConnectButton: React.FC = () => {
	const context = useWeb3React<ethers.providers.Web3Provider>();
	const { active, account } = context;

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
			<FutureButton style={{ margin: '0 auto' }} glow onClick={onConnect}>
				Connect Metamask
			</FutureButton>
		);
	} else {
		button = (
			<>
				<div style={{ display: 'flex' }}>
					<TextButton style={{ margin: '6px auto' }} onClick={onDisconnect}>
						Disconnect from Metamask
					</TextButton>
				</div>
			</>
		);
	}

	return <React.Fragment>{button}</React.Fragment>;
};
