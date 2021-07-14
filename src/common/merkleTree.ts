import axios from 'axios';
import { VestingMerkleTree } from '../util/types';

const merkleFiles: { [address: string]: string } = {
	'0xBB249Ffa0673284A3DdAB5de157A6970f849b0FE':
		'https://ipfs.io/ipfs/QmdrErpGsuMKLTFQSmziwLuDd7FYCBCmhpfXbpW8jKFtWg',
	// wilder IDO
	'0x6E9c63AF66e1F59137214d51ab7716E8dB9D6467':
		'https://ipfs.io/ipfs/QmWpyYBmFVyt5x35mWwypirD7zt8k7apyiNuccj3mXKdAq',
	// wilder influencer
	'0xB7dFcb421412F16B25DDd4AD4bdd73D0883136D8':
		'https://ipfs.io/ipfs/QmVu6ZhopK9CfpkpuJwbR31ndriThJpkVvyitk7LGU2WsQ',
	// v3
	'0x441b52f945B6f3E7D2019f2A0a3537DBA1a7ef87':
		'https://ipfs.io/ipfs/Qme5h8NqdKAirMrVqCNaCTAXyEZJAT68WJbo8aNm3is5mu',
	// v4
	'0xD393224e6EBbFb46C6a09A6Fd8acc596f6392402':
		'https://ipfs.io/ipfs/QmT3Lb9r5M36yRfk7V6rSeYhswqE7wY172amdBnpj7ev8R',
	// brett site
	'0x1d308f379c94e668Ef90328bF0C11dFFbd5055E9':
		'https://ipfs.io/ipfs/QmPfDq18TENn736cuExu7qrv3ReGuEXWrvnGgJa2CbddsH',
	// chain swap hack
	'0x8E4C057032436498817de977Dc1aE10e3Dfd23c1':
		'https://ipfs.io/ipfs/QmYQZ6S3xRMVt6wtkFndpdCP8fZQfW6ApHcdEySFSBwSQ3'
};

export const getVestingMerkleTree = async (
	vestingAddress: string,
): Promise<VestingMerkleTree> => {
	const location = merkleFiles[vestingAddress];
	if (!location) {
		throw Error(`No merkle file for address`);
	}

	const options = {
		url: location,
	};

	try {
		const response = await axios(options);
		const merkleTree = response.data as VestingMerkleTree;
		return merkleTree;
	} catch (e) {
		throw Error(
			`Failed to fetch merkle tree from '${location}' Reason: ${e.response.data.message}`,
		);
	}
};
