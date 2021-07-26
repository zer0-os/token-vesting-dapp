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
	'0x1d308f379c94e668Ef90328bF0C11dFFbd5055E9':
		'https://ipfs.io/ipfs/QmPfDq18TENn736cuExu7qrv3ReGuEXWrvnGgJa2CbddsH',
		
	// Alejo Address 1
	'0xD4F82Db8B85AAFb87060e56546C5bcc03fc41774':
		'https://ipfs.io/ipfs/QmcE7DPLy9yqYhK18styiTtNdv5n9P5dLiSywzic7SHvoN',
	// Alejo Address 2
	'0x557f4C36add92E21bAf67971a85440B089D55033':
		'https://ipfs.io/ipfs/QmcE7DPLy9yqYhK18styiTtNdv5n9P5dLiSywzic7SHvoN',
	// Alejo Address 3
	'0xE506fEED9E9A4f0Ca195A48A5343c539db170e28':
		'https://ipfs.io/ipfs/QmcE7DPLy9yqYhK18styiTtNdv5n9P5dLiSywzic7SHvoN',
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
