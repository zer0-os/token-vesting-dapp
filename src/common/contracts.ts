import { network } from 'lib/connectors';
import { ContractAddresses } from '../util';

export enum Network {
	Mainnet = 'Mainnet',
	Kovan = 'Kovan',
	Unknown = 'Unknown',
}

export const defaultNetwork = Network.Kovan;

type ContractAddressMap = {
	[network in Network]: ContractAddresses;
};

const contractAddresses: ContractAddressMap = {
	[Network.Kovan]: {
		name: ['INFINITY', 'INITIAL TEAM', 'Q1 BONUS'],
		vesting: [
			'0xD4F82Db8B85AAFb87060e56546C5bcc03fc41774',
			'0x557f4C36add92E21bAf67971a85440B089D55033',
			'0xE506fEED9E9A4f0Ca195A48A5343c539db170e28',
		],
		icon: ['assets/wild.svg', 'assets/wild.svg', 'assets/wild.svg'],
	},
} as ContractAddressMap;

export const getContractAddressesForNetwork = (
	network: Network,
): ContractAddresses => {
	const addresses = contractAddresses[network];
	return addresses;
};

export const getNetworkFromChainId = (chainId: number) => {
	switch (chainId) {
		case 1:
			return Network.Mainnet;
		case 42:
			return Network.Kovan;
	}

	return Network.Unknown;
};

export const isSupportedNetwork = (network: Network) => {
	if (contractAddresses[network]) {
		return true;
	}

	return false;
};
