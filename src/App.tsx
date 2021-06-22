//- Global Stylesheets
import 'styles/reset.css';
import 'styles/main.css';

//- React Imports
import { HashRouter, Route } from 'react-router-dom';

import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

import { ClaimVestedTokens } from 'pages';

// Web3 library to query
function getLibrary(provider: any): ethers.providers.Web3Provider {
	const library = new ethers.providers.Web3Provider(provider);
	library.pollingInterval = 12000;
	return library;
}

function App() {
	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<HashRouter>
				<Route exact path={'/claim'}>
					<ClaimVestedTokens />
				</Route>
			</HashRouter>
		</Web3ReactProvider>
	);
}

export default App;
