//- Global Stylesheets
import 'styles/reset.css';
import 'styles/main.css';

//- React Imports
//import React from 'react';
//import { HashRouter, Route } from 'react-router-dom';

//- Web3 Imports
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
//import { useEagerConnect } from 'lib/hooks/provider-hooks';

//- Library Imports
import NotificationProvider from 'lib/providers/NotificationProvider';
import MvpVersionProvider from 'lib/providers/MvpVersionProvider';

//- Page Imports
//import { ClaimVestedTokens, GrantVestedTokens } from 'pages';
import {GrantVestedTokens} from 'pages';

// Web3 library to query
function getLibrary(provider: any): Web3Provider {
	const library = new Web3Provider(provider);
	library.pollingInterval = 12000;
	return library;
}
/*
function App() {
	const triedEagerConnect = useEagerConnect(); // This line will try auto-connect to the last wallet

	return (
		<>
			<HashRouter>
				<Route exact path={'/grant'}>
					<GrantVestedTokens />
				</Route>
				<Route exact path={'/claim'}>
					<ClaimVestedTokens />
				</Route>
			</HashRouter>
		</>
	);
}
*/

function App(){

	return(
		<>
			<GrantVestedTokens/>
		</>
	)

}

function wrappedApp() {
	return (
		// Web3 Library Hooks
		<Web3ReactProvider getLibrary={getLibrary}>
			<MvpVersionProvider>
				<NotificationProvider>
					<App />
				</NotificationProvider>
			</MvpVersionProvider>
		</Web3ReactProvider>
	);
}

export default wrappedApp;
