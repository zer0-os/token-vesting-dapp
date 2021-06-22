//- Asset Imports
import wilderIcon from './assets/wilder-icon.png';

//- Syle Imports
import styles from './WilderIcon.module.css';

type WilderIconProps = {
	onClick?: () => void;
	style?: React.CSSProperties;
};

const WilderIcon: React.FC<WilderIconProps> = ({ onClick, style }) => {
	return (
		<div style={style} className={styles.Wilder}>
			<img alt="wilder logo" src={wilderIcon} onClick={onClick} />
		</div>
	);
};

export default WilderIcon;
