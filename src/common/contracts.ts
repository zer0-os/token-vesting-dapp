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
		vesting: [process.env.REACT_APP_VESTING_CONTRACT],
	},
	[Network.Kovan]: {
		vesting: [
			'0xa779DBc87366C46A51b87CBB0F8be497FE84C511',
			'0x1625DB76d379A6D06bd9bcAcC0D3d51078B825aF',
			'0x4B1b5A459bbD5c5406562c0839cb2586c1C66aBa',
			'0x3a340D9591b31374e55CEb1f95c08d2aaC91Be24',
			'0xd90520824daeD187B088D8d14512B611Bfbd5759',
		],
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
