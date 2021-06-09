import { BigNumber } from '@ethersproject/bignumber';

export const estimateVestedAmount = (
	now: number,
	start: number,
	duration: number,
	cliff: number,
	amount: BigNumber,
) => {
	if (now < start + cliff) {
		return BigNumber.from(0);
	}

	if (now > start + duration) {
		return amount;
	}

	const vested = amount.mul(now - start).div(duration);

	return vested;
};
