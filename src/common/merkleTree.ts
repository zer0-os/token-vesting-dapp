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
	// brett site
	'0xa779DBc87366C46A51b87CBB0F8be497FE84C511':
		'https://ipfs.io/ipfs/QmbakE2GeWcSCXWob4hdkVU3VKmStLuFjvdDr6B77bhhAd',
	//Leo contract 1
	'0x1625DB76d379A6D06bd9bcAcC0D3d51078B825aF':
		'https://ipfs.io/ipfs/QmPfDq18TENn736cuExu7qrv3ReGuEXWrvnGgJa2CbddsH',
	//Leo contract 2
	'0x4B1b5A459bbD5c5406562c0839cb2586c1C66aBa':
		'https://ipfs.io/ipfs/QmZ7gpkxijGHLec8UngyU1Jiu74qrg8w9h34i62cNm9Z8Q',
	//Leo contract 3
	'0x3a340D9591b31374e55CEb1f95c08d2aaC91Be24':
		'https://ipfs.io/ipfs/QmRAK2ACP2Xpg7LLQxP74t1941Da24GDeubFUq9bcYJzuX',
	//Leo contract 4
	'0xd90520824daeD187B088D8d14512B611Bfbd5759':
		'https://ipfs.io/ipfs/QmUQgDSja2k4dnrqjnYYkoqXpNqcYwXWWfnjQFertM4MYA',
	//Leo contract 5
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
