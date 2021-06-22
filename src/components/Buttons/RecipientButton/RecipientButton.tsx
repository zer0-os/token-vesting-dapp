import React, { useState } from 'react';

import styles from './RecipientButtonStyle.module.css';

type RecipientButtonProps = {
	onClick?: () => void;
	style?: React.CSSProperties;
	toggleable?: boolean;
	children: React.ReactNode;
	glow?: boolean;
	loading?: boolean;
};

const RecipientButton: React.FC<RecipientButtonProps> = ({
	onClick,
	style,
	toggleable,
	children,
	glow,
	loading,
}) => {
	const [hasHovered, setHovered] = useState(false);
	const [isSelected, setSelected] = useState(false);

	const handleHover = () => {
		if (!hasHovered) setHovered(true);
	};

	const handleClick = () => {
		if (loading) return;
		if (onClick) onClick();
		if (toggleable) setSelected(!isSelected);
	};

	return (
		<button
			className={`${styles.futureButton} ${isSelected ? styles.selected : ''} ${
				glow ? styles.glow : ''
			} ${loading ? styles.Loading : ''}`}
			onMouseEnter={handleHover}
			onMouseUp={handleClick}
			style={style}
		>
			<div className={styles.content}>
				{!loading && children}
				{loading && <div className={styles.Spinner}></div>}
			</div>
			<div
				className={`${styles.wash} ${
					hasHovered && !isSelected ? styles.hovered : ''
				}`}
			></div>
		</button>
	);
};

export default RecipientButton;