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
		vesting: [
			{
				name: 'Wilder IDO',
				contract: '0x6E9c63AF66e1F59137214d51ab7716E8dB9D6467',
				icon: 'assets/wild.svg',
			},
			{
				name: 'Wilder Influencer',
				contract: '0xB7dFcb421412F16B25DDd4AD4bdd73D0883136D8',
				icon: 'assets/wild.svg',
			},
			{
				name: 'Wilder Individuals',
				contract: '0x441b52f945B6f3E7D2019f2A0a3537DBA1a7ef87',
				icon: 'assets/wild.svg',
			},
			{
				name: 'Wilder Funds',
				contract: '0xD393224e6EBbFb46C6a09A6Fd8acc596f6392402',
				icon: 'assets/wild.svg',
			},
			{
				name: 'Chainswap Hack',
				contract: '0x8E4C057032436498817de977Dc1aE10e3Dfd23c1',
				icon: 'assets/wild.svg',
			},
			{
				name: 'Chainswap Hack',
				contract: '0xE516ef5d103bf567238dB2A5F88781D18214fF6C',
				icon: 'assets/wild.svg',
			},
		]
	} as ContractAddresses,
	[Network.Kovan]: {
		vesting: [
			{
				name: 'Test0',
				contract: '0xBB249Ffa0673284A3DdAB5de157A6970f849b0FE',
				icon: 'assets/wild.svg',
			},
			{
				name: 'Alejo Test1',
				contract: '0x557f4C36add92E21bAf67971a85440B089D55033',
				icon: 'assets/wild.svg',
			},
			{
				name: 'Alejo Test2',
				contract: '0xE506fEED9E9A4f0Ca195A48A5343c539db170e28',
				icon: 'assets/wild.svg',
			},
			{
				name: 'Alejo Test3',
				contract: '0x88dB17E38F901BFdFc2A8c890b70305C16a3b232',
				icon: 'assets/wild.svg',
			},
			{
				name: 'TAlejo Test4',
				contract: '0xED817C535954054843DaE0b5179bbb2bE64422b1',
				icon: 'assets/wild.svg',
			},
			{
				name: 'Alejo Test5',
				contract: '0xa933534350dfC8Cdd8FeAF966Dd94757F925B64b',
				icon: 'assets/wild.svg',
			},
			{
				name: 'Test Site',
				contract: '0x1d308f379c94e668Ef90328bF0C11dFFbd5055E9',
				icon: 'assets/wild.svg',
			},
		]
	}
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
