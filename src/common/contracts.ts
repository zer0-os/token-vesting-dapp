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
				name: 'Vesting Contract 1',
				contract: '0xD0adBE472398B375096E070A1f92E4CCAf7e3582',
				icon: 'assets/wild.svg',
			},
			{
				name: 'Vesting Contract 2',
				contract: '0x4ed7d53f37F34Cd50cd9248eE12d48e1b61d71b7',
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
			},
			{
				name: 'TEST ADDRESS 4',
				contract: '0xF40d37D8d039FfC1264ebbE4f636FbEc949bFC0b',
				icon: 'assets/wild.svg',
			},
			{
				name: 'TEST ADDRESS 5',
				contract: '0xf03FbE2056a50fD9c4DB14650911B6567D3b6fC1',
				icon: 'assets/wild.svg',
			},
			{
				name: 'TEST ADDRESS 6',
				contract: '0x564A136ac337c9D989A1759567a3cFfB7FfA4d0D',
				icon: 'assets/wild.svg',
			},
			{
				name: 'TEST No Unlock 7',
				contract: '0xA295e737542505b6175905deEFeD7fC3b4E49805',
				icon: 'assets/wild.svg',
			},
			{
				name: 'TEST No Unlock 8',
				contract: '0x6f448ABa86b14EEB2e6B69971C0a70edbC4B5Cb6',
				icon: 'assets/wild.svg',
			},
			{
				name: 'TEST No Unlock 9 - Without Tokens',
				contract: '0x1d308f379c94e668Ef90328bF0C11dFFbd5055E9',
				icon: 'assets/wild.svg',
			},
			{
				name: 'TEST ADDRESS 10 - Without Tokens',
				contract: '0xB7dFcb421412F16B25DDd4AD4bdd73D0883136D8',
				icon: 'assets/wild.svg',
			},
			{
				name: 'TEST ADDRESS 11 - Without Tokens',
				contract: '0x6E9c63AF66e1F59137214d51ab7716E8dB9D6467',
				icon: 'assets/wild.svg',
			},
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
