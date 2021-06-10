import React from 'react';

export const useRefresh = () => {
	const [refreshToken, setRefreshToken] = React.useState(0);

	const refresh = () => {
		setRefreshToken(refreshToken + 1);
	};

	return { refreshToken, refresh };
};
