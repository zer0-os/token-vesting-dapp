//- React Imports
import React from 'react';

//- Style Imports
import styles from './EtherInput.module.css';

//- Local Imports
import { isAlphanumeric, isNumber } from './validation';

import ethIcon from './assets/eth.svg';
import cross from './assets/cross.svg';

// TODO: Implement max characters (props.max)

type TextInputProps = {
	onChange: (text: string) => void;
	error?: boolean;
	errorText?: string;
	placeholder?: string;
	type?: string;
	text?: string;
	multiline?: boolean;
	style?: React.CSSProperties;
	resizable?: boolean;
	alphanumeric?: boolean; // If we want only alphanumeric characters
	numeric?: boolean;

	ethlogo?: boolean;
	title?: boolean;

	cross?: boolean;
	setKey?: number;
	onDelete?: () => void;
};

const EtherInput: React.FC<TextInputProps> = ({
	onChange,
	onDelete,
	error,
	errorText,
	placeholder,
	type,
	text,
	multiline,
	style,
	resizable,
	alphanumeric,
	numeric,
	ethlogo,
	title,
	cross,
}) => {
	const handleChange = (event: any) => {
		const newValue = event.target.value;
		if (validate(newValue) && onChange) return onChange(event.target.value);
	};

	const validate = (str: string) => {
		if (alphanumeric && !isAlphanumeric(str)) return false;
		if (numeric && !isNumber(str)) return false;
		return true;
	};

	return (
		<div
			className={`${styles.Container} 
						${ethlogo ? styles.ethlogo : ''}
						${text ? styles.title : ''}
						${cross ? styles.Deleter : ''}
						`}
		>
			{multiline && (
				<textarea
					className={`${styles.TextInput} border-blue ${
						error ? styles.Error : ''
					}`}
					onChange={handleChange}
					style={{
						...style,
						resize: resizable ? 'vertical' : 'none',
					}}
					placeholder={placeholder}
					value={text ? text : ''}
				/>
			)}
			{!multiline && (
				<>
					{ethlogo && <img alt="ethereum icon" src={ethIcon} />}
					{cross && <button className={styles.DeleteButton} onClick={onDelete}></button>}
					{text && (<span className={`${error ? styles.ErrorHolder : styles.GreyHolder}`}>{placeholder}</span>)}
					<input
						type={type ? type : ''}
						className={`${styles.TextInput} border-blue ${
							error ? styles.Error : ''
						}`}
						onChange={handleChange}
						style={style}
						placeholder={placeholder}
						value={text ? text : ''}
					/>
				</>
			)}
			{error && errorText && (
				<div>
					<span className={styles.ErrorMessage}>{errorText}</span>
				</div>
			)}

			<div className={`${styles.colorChart}`}></div>
		</div>
	);
};

export default EtherInput;
