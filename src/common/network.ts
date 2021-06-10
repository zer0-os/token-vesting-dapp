import { Network } from './contracts';

export const getSecondsPerBlock = (network: Network) => {
	switch (network) {
		case Network.Mainnet:
			return 13;
		case Network.Kovan:
			return 4;
	}

	return 10;
};

const oneDayInSeconds = 60 * 60 * 24;

export const getBlocksPerDay = (network: Network) => {
	const secondsPerBlock = getSecondsPerBlock(network);
	const blocksPerDay = oneDayInSeconds * secondsPerBlock;

	return blocksPerDay;
};

export const getEtherscanUriForNetwork = (network: Network) => {
	let prefix = '';
	switch (network) {
		case Network.Kovan:
			prefix = 'kovan.';
			break;
	}

	const uri = `https://${prefix}etherscan.io/`;

	return uri;
};
