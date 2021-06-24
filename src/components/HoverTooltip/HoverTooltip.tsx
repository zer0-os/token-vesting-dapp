//- React Imports
import { useState } from 'react';
import { Transition } from 'react-transition-group';

//- Style Imports
import styles from './HoverTooltip.module.css';

type props = {
	tooltipContent: React.ReactNode;
	tooltipStyle?: React.CSSProperties;
	children: React.ReactNode;
	style?: React.CSSProperties;
};

//- Transition Setup
// I decided to use transition-group rather than CSS because
// I wanted a simple way to remove from DOM after animation is complete
const duration = 150;

const defaultStyle: any = {
	transition: `opacity ${duration}ms ease-in-out`,
	opacity: 0,
};

const transitionStyles: any = {
	entering: { opacity: 0, display: 'block' },
	entered: { opacity: 1, display: 'block' },
	exiting: { opacity: 0, display: 'block' },
	exited: { opacity: 0, display: 'none' },
};

const HoverTooltip: React.FC<props> = ({
	tooltipContent,
	tooltipStyle,
	children,
	style,
}) => {
	const [isActive, setIsActive] = useState(false);

	const open = () => {
		setIsActive(true);
	};
	const close = () => setIsActive(false);

	return (
		<div
			style={style}
			className={styles.Wrapper}
			onMouseEnter={open}
			onMouseLeave={close}
		>
			{children}

			<Transition in={isActive} timeout={duration}>
				{(state) => (
					<div
						style={{
							...defaultStyle,
							...transitionStyles[state],
							...tooltipStyle,
						}}
						className={styles.Tooltip}
					>
						{tooltipContent}
					</div>
				)}
			</Transition>
		</div>
	);
};

export default HoverTooltip;
