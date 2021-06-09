import { Web3ReactProvider } from '@web3-react/core';
import { MainPage } from './pages/Main';
import { ethers } from 'ethers';

// Web3 library to query
function getLibrary(provider: any): ethers.providers.Web3Provider {
	const library = new ethers.providers.Web3Provider(provider);
	library.pollingInterval = 12000;
	return library;
}

function App() {
	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<MainPage />
		</Web3ReactProvider>
	);
}

export default App;
