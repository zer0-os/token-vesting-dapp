import axios from 'axios';
import { VestingMerkleTree } from '../util/types';

const merkleFiles: { [address: string]: string } = {
	'0xBB249Ffa0673284A3DdAB5de157A6970f849b0FE':
		'https://zero-service-gateway.azure-api.net/ipfs/QmdrErpGsuMKLTFQSmziwLuDd7FYCBCmhpfXbpW8jKFtWg',
	// wilder IDO
	'0x6E9c63AF66e1F59137214d51ab7716E8dB9D6467':
		'https://zero-service-gateway.azure-api.net/ipfs/QmWpyYBmFVyt5x35mWwypirD7zt8k7apyiNuccj3mXKdAq',
	// wilder influencer
	'0xB7dFcb421412F16B25DDd4AD4bdd73D0883136D8':
		'https://zero-service-gateway.azure-api.net/ipfs/QmVu6ZhopK9CfpkpuJwbR31ndriThJpkVvyitk7LGU2WsQ',
	// v3
	'0x441b52f945B6f3E7D2019f2A0a3537DBA1a7ef87':
		'https://zero-service-gateway.azure-api.net/ipfs/Qme5h8NqdKAirMrVqCNaCTAXyEZJAT68WJbo8aNm3is5mu',
	// v4
	'0xD393224e6EBbFb46C6a09A6Fd8acc596f6392402':
		'https://zero-service-gateway.azure-api.net/ipfs/QmT3Lb9r5M36yRfk7V6rSeYhswqE7wY172amdBnpj7ev8R',
	// brett site
	'0x1d308f379c94e668Ef90328bF0C11dFFbd5055E9':
		'https://zero-service-gateway.azure-api.net/ipfs/QmPfDq18TENn736cuExu7qrv3ReGuEXWrvnGgJa2CbddsH',
	// chain swap hack
	'0x8E4C057032436498817de977Dc1aE10e3Dfd23c1':
		'https://zero-service-gateway.azure-api.net/ipfs/QmYQZ6S3xRMVt6wtkFndpdCP8fZQfW6ApHcdEySFSBwSQ3',
	// chain swap posthack
	'0xE516ef5d103bf567238dB2A5F88781D18214fF6C':
		'https://zero-service-gateway.azure-api.net/ipfs/QmPnGMZa7n2YWyU35Qo7ph1jzsHiouonb1Km5DopmxfhGo',
	// 888
	'0x109f7B8608785201a9AAa4d75dBF03A9Fa663187':
		'https://zero-service-gateway.azure-api.net/ipfs/QmbfNeqk7wxaDZDZitSwV76xPt3GW2coW3e3k4pFizjgo6',
	// polka
	'0x0851076f0F05E008337b368fAbD6328CeFeb358B':
		'https://zero-service-gateway.azure-api.net/ipfs/QmdMz1RCnwNLba1PqmSmDQmVE7W9Jo7939ofWQ6UAY7Nq1',
	// spiro
	'0x5521D7E4D9AE2294ecDf505fd138b8924Ea7A8E2':
		'https://zero-service-gateway.azure-api.net/ipfs/QmboKEYYp3rc4q8hC5EZwqGgVJnxPEwiQ3VdAv5qJXz1iE'
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
