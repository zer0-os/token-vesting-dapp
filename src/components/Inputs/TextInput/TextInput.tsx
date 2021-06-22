//- React Imports
import React from 'react';

//- Style Imports
import styles from './TextInput.module.css';

//- Local Imports
import { isAlphanumeric, isNumber } from './validation';

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
	titletext?: string;
};

const imageStyle: React.CSSProperties = {
	position: 'absolute',
	width: '16px',
	height: '26px',
	top:'22px',
	left:'24px',
	backgroundSize: 'contain',
	backgroundImage: 'url(../assets/ETH-Logo.png)',
}

const titleStyle: React.CSSProperties = {
	position: 'absolute',
	top:'18px',
	left:'50px',
	fontSize: '12px',
}

const TextInput: React.FC<TextInputProps> = ({
	onChange,
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
	titletext,
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
		<div className={styles.Container}>
			{ethlogo && title && (
				<>
				<div style={imageStyle}/>
				<p style={titleStyle}>
					{titletext}
				</p>
				<input
					type={type ? type : ''}
					className={`
						${styles.TextInput} 
						${styles.ethlogo} border-blue 
						${error ? styles.Error : ''}`}
					onChange={handleChange}
					style={style}
					placeholder={placeholder}
					value={text ? text : ''}
				/>
				</>
			)}

			{ethlogo && !title && (
				<>
				<div style={imageStyle}/>
				<input
					type={type ? type : ''}
					className={`
						${styles.TextInput} 
						${styles.ethlogo} border-blue 
						${error ? styles.Error : ''}`}
					onChange={handleChange}
					style={style}
					placeholder={placeholder}
					value={text ? text : ''}
				/>
				</>
			)}

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
			{!multiline && !ethlogo && !title && (
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
			)}
			{error && errorText && (
				<span className={styles.ErrorMessage}>{errorText}</span>
			)}
		</div>
	);
};

export default TextInput;
