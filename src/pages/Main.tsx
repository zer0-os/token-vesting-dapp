import { Box, Container, Grid, makeStyles } from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React from 'react';
import { ConnectButton } from '../components/ConnectButton';
import { VestingModule } from '../components/VestingModule';
import { Maybe } from '../util';

const useStyles = makeStyles({
	page: {
		padding: '16px',
		background: '#FAFAFA',
	},
	header: {
		padding: '16px',
		textAlign: 'center',
	},
	body: {
		padding: '16px',
	},
	vestingModule: {
		paddingTop: '16px',
	},
});

export const MainPage: React.FC = () => {
	const classes = useStyles();

	const context = useWeb3React<ethers.providers.Web3Provider>();
	const { active, chainId, account } = context;

	let vestingModule: Maybe<React.ReactFragment>;
	if (active && chainId && account) {
		vestingModule = <VestingModule account={account} chainId={chainId} />;
	}

	return (
		<React.Fragment>
			<Container maxWidth="sm" className={classes.page}>
				<Box className={classes.header}>
					<h1>$WILD Token Vesting</h1>
				</Box>
				<Box className={classes.body}>
					<Grid container direction="column">
						<Grid item>
							<ConnectButton />
							{!active ? <p>Please connect your wallet</p> : null}
						</Grid>

						<Grid item className={classes.vestingModule}>
							{vestingModule}
						</Grid>
					</Grid>
				</Box>
			</Container>
		</React.Fragment>
	);
};
