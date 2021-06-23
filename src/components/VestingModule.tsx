import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { getNetworkFromChainId, isSupportedNetwork } from '../common';
import { Maybe } from '../util';
import { VestingControl } from './VestingControl';
import { EthInput, ArrowLink, TextButton } from 'components';

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
				<hr style={{ width: '100%', marginBottom: 32 }} className="glow" />
				<Grid item style={{ width: '100%' }}>
					<h2>Current Account</h2>
					<EthInput
						style={{ marginTop: 8, marginBottom: 16 }}
						static
						text={props.account || ''}
						copyButton
						title={'Current Account'}
					/>
					<Grid container>
						{supported && (
							<Grid item>
								<h2>Network</h2>
								{`${network} `}
							</Grid>
						)}
						{!supported ? (
							<Grid item>
								<b style={{ color: 'var(--color-error)' }}>
									Unsupported Network - Please switch networks in Metamask
								</b>
							</Grid>
						) : null}
					</Grid>
					<Grid item>{contents}</Grid>
				</Grid>
			</Grid>
		</React.Fragment>
	);
};
