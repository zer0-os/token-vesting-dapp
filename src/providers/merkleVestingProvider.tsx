import React from 'react';

interface MerkleVestingContextType {
	merkleTree: any;
}

const MerkleVestingContext = React.createContext<MerkleVestingContextType>({
	merkleTree: {},
});

type ProviderType = {
	children: React.ReactNode;
};

export const MerkleVestingProvider: React.FC<ProviderType> = ({ children }) => {
	const contextValue = {
		merkleTree: {},
	};

	return (
		<MerkleVestingContext.Provider value={contextValue}>
			{children}
		</MerkleVestingContext.Provider>
	);
};
