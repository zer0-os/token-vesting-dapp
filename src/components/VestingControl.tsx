import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { Network } from '../common';
import { useContracts } from '../hooks/useContracts';
import { useMerkleVesting } from '../hooks/useMerkleVesting';

interface Props {
	account: string;
	network: Network;
}

const useStyles = makeStyles({
	root: {},
});

export const VestingControl: React.FC<Props> = (props) => {
	const classes = useStyles();
	const contracts = useContracts();
	const vestingContract = contracts!.vesting;
	const vesting = useMerkleVesting(vestingContract, props.account);

	return (
		<React.Fragment>
			<Grid container className={classes.root}></Grid>
		</React.Fragment>
	);
};
