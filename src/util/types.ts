import { ObjectType } from 'typescript';
import { MerkleTokenVesting } from '../contracts/types';

export interface VestingMerkleClaim {
	index: number;
	amount: string;
	revocable: boolean;
	proof: string[];
}

export interface VestingMerkleTree {
	merkleRoot: string;
	tokenTotal: number;
	claims: { [account: string]: VestingMerkleClaim };
}

export type Maybe<T> = T | undefined | null;
export type MaybeNull<T> = T | null;

interface ContractValues{
	name: string,
	contract: string,
	icon: string;
}

export interface ContractAddresses {
	vesting: ContractValues[];
}

export interface Contracts {
	vesting: MerkleTokenVesting;
}

export interface ClaimVestingInterface {
	claimed: number;
	vested: number;
	total: number;
	start: number;
	duration: number;
	cliff: number;
}
