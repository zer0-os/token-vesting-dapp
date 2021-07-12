//- Global Stylesheets
import 'styles/reset.css';
import 'styles/main.css';
import 'styles/ztoken.css';

//- Web3 Imports
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

//- Library Imports
import NotificationProvider from 'providers/NotificationProvider';

//- Component Imports
import { NotificationDrawer } from 'components';

//- Page Imports
import { ClaimVestedTokens, GrantVestedTokens } from 'pages';

// Web3 library to query
function getLibrary(provider: any): ethers.providers.Web3Provider {
	const library = new ethers.providers.Web3Provider(provider);
	library.pollingInterval = 12000;
	return library;
}

function App() {
	// Console message
	console.log(
		'%cYou must to set your Owner address to get access.\nUse setOwner(address) function.\nCurrent Owner: undefined',
		'display: block; border: 3px solid #3ca1ff; border-radius: 7px; padding: 10px; margin: 8px;',
	);

	return (
		<NotificationProvider>
			<Web3ReactProvider getLibrary={getLibrary}>
				<NotificationDrawer />
				{/* @TODO Move this into a router when GrantVestedTokens is finished */}
				<GrantVestedTokens />
			</Web3ReactProvider>
		</NotificationProvider>
	);
}

export default App;
