import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { getNetworkFromChainId, isSupportedNetwork } from '../common';
import { Maybe } from '../util';
import { VestingControl } from './VestingControl';

interface Props {
	account: string;
	chainId: number;
}

const useStyles = makeStyles({
	root: {},
});

export const VestingModule: React.FC<Props> = (props) => {
	const classes = useStyles();

	const network = getNetworkFromChainId(props.chainId);
	const supported = isSupportedNetwork(network);

	let contents: Maybe<React.ReactFragment> = undefined;

	if (supported) {
		contents = <VestingControl account={props.account} network={network} />;
	}

	return (
		<React.Fragment>
			<Grid container className={classes.root}>
				<Grid item>
					<p>
						<b>Current Account: </b>
						{`${props.account}`}
					</p>
					<Grid container>
						<Grid item>
							<b>Network: </b>
							{`${network} `}
						</Grid>
						{!supported ? (
							<Grid item style={{ paddingLeft: '32px' }}>
								<b style={{ color: 'red' }}>Unsupported Network</b>
							</Grid>
						) : null}
					</Grid>
					{!supported ? (
						<Grid item>
							<h3>Unsupported Network</h3>
							<p>Please connect to a different network</p>
						</Grid>
					) : null}
					<Grid item>{contents}</Grid>
				</Grid>
			</Grid>
		</React.Fragment>
	);
};
