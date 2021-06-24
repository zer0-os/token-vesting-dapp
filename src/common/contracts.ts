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
	[Network.Mainnet]: {
		vesting: process.env.REACT_APP_VESTING_CONTRACT,
	},
	[Network.Kovan]: {
		vesting: '0xa779DBc87366C46A51b87CBB0F8be497FE84C511',
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
