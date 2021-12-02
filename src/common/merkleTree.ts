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
	// chain swap hack
	'0x8E4C057032436498817de977Dc1aE10e3Dfd23c1':
		'https://ipfs.io/ipfs/QmYQZ6S3xRMVt6wtkFndpdCP8fZQfW6ApHcdEySFSBwSQ3',
	// chain swap posthack
	'0xE516ef5d103bf567238dB2A5F88781D18214fF6C':
		'https://ipfs.io/ipfs/QmPnGMZa7n2YWyU35Qo7ph1jzsHiouonb1Km5DopmxfhGo',
	// 888
	'0x109f7B8608785201a9AAa4d75dBF03A9Fa663187':
		'https://ipfs.io/ipfs/QmbfNeqk7wxaDZDZitSwV76xPt3GW2coW3e3k4pFizjgo6',
	// polka
	'0x0851076f0F05E008337b368fAbD6328CeFeb358B':
		'https://ipfs.io/ipfs/QmdMz1RCnwNLba1PqmSmDQmVE7W9Jo7939ofWQ6UAY7Nq1',
	// Alejo Address 1
	'0xD4F82Db8B85AAFb87060e56546C5bcc03fc41774':
		'https://ipfs.io/ipfs/QmcE7DPLy9yqYhK18styiTtNdv5n9P5dLiSywzic7SHvoN',
	// Alejo Address 2
	'0x557f4C36add92E21bAf67971a85440B089D55033':
		'https://ipfs.io/ipfs/QmcE7DPLy9yqYhK18styiTtNdv5n9P5dLiSywzic7SHvoN',
	// Alejo Address 3
	'0xE506fEED9E9A4f0Ca195A48A5343c539db170e28':
		'https://ipfs.io/ipfs/QmcE7DPLy9yqYhK18styiTtNdv5n9P5dLiSywzic7SHvoN',
	// Alejo Address 4
	'0x88dB17E38F901BFdFc2A8c890b70305C16a3b232':
		'https://ipfs.io/ipfs/QmcE7DPLy9yqYhK18styiTtNdv5n9P5dLiSywzic7SHvoN',
	// Alejo Address 5
	'0xED817C535954054843DaE0b5179bbb2bE64422b1':
		'https://ipfs.io/ipfs/QmcE7DPLy9yqYhK18styiTtNdv5n9P5dLiSywzic7SHvoN',
	// Alejo Address 6
	'0xa933534350dfC8Cdd8FeAF966Dd94757F925B64b':
		'https://ipfs.io/ipfs/QmcE7DPLy9yqYhK18styiTtNdv5n9P5dLiSywzic7SHvoN',
	'0x564A136ac337c9D989A1759567a3cFfB7FfA4d0D':
		'https://ipfs.io/ipfs/QmcE7DPLy9yqYhK18styiTtNdv5n9P5dLiSywzic7SHvoN',
	'0xf03FbE2056a50fD9c4DB14650911B6567D3b6fC1':
		'https://ipfs.io/ipfs/QmcE7DPLy9yqYhK18styiTtNdv5n9P5dLiSywzic7SHvoN',
	'0xF40d37D8d039FfC1264ebbE4f636FbEc949bFC0b':
		'https://ipfs.io/ipfs/QmcE7DPLy9yqYhK18styiTtNdv5n9P5dLiSywzic7SHvoN',
	'0xA295e737542505b6175905deEFeD7fC3b4E49805':
		'https://ipfs.io/ipfs/QmcE7DPLy9yqYhK18styiTtNdv5n9P5dLiSywzic7SHvoN',
	'0x6f448ABa86b14EEB2e6B69971C0a70edbC4B5Cb6':
		'https://ipfs.io/ipfs/QmcE7DPLy9yqYhK18styiTtNdv5n9P5dLiSywzic7SHvoN',
	'0xD0adBE472398B375096E070A1f92E4CCAf7e3582':
		'https://ipfs.io/ipfs/QmejrtU5qTeTnbCmMpXAGPRvPz9h5JqLAHmDThRFGhQ57N',
	'0x4ed7d53f37F34Cd50cd9248eE12d48e1b61d71b7':
		'https://ipfs.io/ipfs/QmejrtU5qTeTnbCmMpXAGPRvPz9h5JqLAHmDThRFGhQ57N',
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
