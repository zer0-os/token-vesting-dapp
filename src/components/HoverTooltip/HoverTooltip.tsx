//- React Imports
import { useState } from 'react';

//- Style Imports
import styles from './HoverTooltip.module.css';

type props = {
	tooltipContent: React.ReactNode;
	tooltipStyle?: React.CSSProperties;
	children: React.ReactNode;
	style?: React.CSSProperties;
};

const HoverTooltip: React.FC<props> = ({
	tooltipContent,
	tooltipStyle,
	children,
	style,
}) => {
	const [isActive, setIsActive] = useState(false);
	const open = () => setIsActive(true);
	const close = () => setIsActive(false);

	return (
		<div
			style={style}
			className={styles.Wrapper}
			onMouseEnter={open}
			onMouseLeave={close}
		>
			{children}
			{isActive && (
				<div style={tooltipStyle} className={styles.Tooltip}>
					{tooltipContent}
				</div>
			)}
		</div>
	);
};

export default HoverTooltip;
