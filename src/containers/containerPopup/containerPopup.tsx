import React from 'react';

import './containerPopupStyle.css';

type popupProps = {
	title: string,
    childrens?: React.ReactNode,
	style?: React.CSSProperties,
	green?: boolean,
};

const ContainerPopup: React.FC<popupProps> = ({
	title,
    childrens,
	style,
	green,
}) => {

	return (
        <div className="popup border-primary border-rounded blur" style={style}>
        	<h1 className={`text ${
				green ? 'green' : ''
			}`}>{title}</h1>

            {childrens}
      	</div>
	);
};

export default ContainerPopup;