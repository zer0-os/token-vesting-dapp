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
		vesting: [
			{
				name: 'INFINITY',
				contract: '0xD4F82Db8B85AAFb87060e56546C5bcc03fc41774',
				icon: 'assets/wild.svg',
			},
			{
				name: 'INITIAL TEAM',
				contract: '0x557f4C36add92E21bAf67971a85440B089D55033',
				icon: 'assets/wild.svg',
			},
			{
				name: 'Q1 BONUS',
				contract: '0xE506fEED9E9A4f0Ca195A48A5343c539db170e28',
				icon: 'assets/wild.svg',
			},
			{
				name: 'TEST ADDRESS',
				contract: '0x88dB17E38F901BFdFc2A8c890b70305C16a3b232',
				icon: 'assets/wild.svg',
			},
			{
				name: 'TEST ADDRESS 2',
				contract: '0xED817C535954054843DaE0b5179bbb2bE64422b1',
				icon: 'assets/wild.svg',
			},
			{
				name: 'TEST ADDRESS 3',
				contract: '0xa933534350dfC8Cdd8FeAF966Dd94757F925B64b',
				icon: 'assets/wild.svg',
			},]
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
