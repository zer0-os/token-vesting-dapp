import React from 'react';
import { Maybe, MaybeNull } from '../util';

export enum TransactionState {
	Pending = 0,
	Submitting = 1,
	Processing = 2,
	Completed = 3,
}

export const useTransactionState = () => {
	const [state, setState] = React.useState<TransactionState>(
		TransactionState.Pending,
	);
	const [error, setError] = React.useState<Maybe<string>>();
	const [hash, setHash] = React.useState<MaybeNull<string>>();

	const isSubmitting = state === TransactionState.Submitting;
	const isProcessing = state === TransactionState.Processing;

	return {
		state,
		setState,
		error,
		setError,
		isSubmitting,
		isProcessing,
		hash,
		setHash,
	};
};
