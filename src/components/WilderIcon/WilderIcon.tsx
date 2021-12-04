//- Asset Imports
import wilderIcon from './assets/zero-icon-logo.png';

//- Syle Imports
import styles from './WilderIcon.module.css';

type WilderIconProps = {
	onClick?: () => void;
	className?: string;
	style?: React.CSSProperties;
};

const WilderIcon: React.FC<WilderIconProps> = ({
	onClick,
	style,
	className,
}) => {
	return (
		<div style={style} className={`${styles.Wilder} ${className || ''}`}>
			<img alt="wilder logo" src={wilderIcon} onClick={onClick} />
		</div>
	);
};

export default WilderIcon;
