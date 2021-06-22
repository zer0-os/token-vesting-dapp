//- General Container
import React from 'react';

const containerStyle: React.CSSProperties = {
	width: '100vw',
	height: '100vh',
	textAlign: 'center',

	display: 'table-cell',
	verticalAlign: 'middle',
};

type ContainerProps = {
	children?: React.ReactNode;
};

const ContainerGral: React.FC<ContainerProps> = ({ children }) => {
	return <div style={containerStyle}>{children}</div>;
};

export default ContainerGral;
