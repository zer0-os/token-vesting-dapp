//- Global Stylesheets
import 'styles/reset.css';
import 'styles/main.css';
import 'styles/ztoken.css';

//- Web3 Imports
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

//- Page Imports
import { ClaimVestedTokens, MainPage } from 'pages';

// Web3 library to query
function getLibrary(provider: any): ethers.providers.Web3Provider {
	const library = new ethers.providers.Web3Provider(provider);
	library.pollingInterval = 12000;
	return library;
}

function App() {
	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			{/* @TODO Move this into a router when GrantVestedTokens is finished */}
			<ClaimVestedTokens />
		</Web3ReactProvider>
	);
}

export default App;
