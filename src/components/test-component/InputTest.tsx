import {TextInput} from '../index';

const InputTest = () => {

	return (
        <div 
			style={{
				position: 'relative',
				height: '60px',
			}}>

			{/* Input Recipient Address */}
				<TextInput 
					onChange={(text) => {}} 
					alphanumeric={true} text={'0x1wjlasdi98sdff099sdwiioasoidijjafs8'} 
					placeholder={'Recipient Address'}
					ethlogo
					title
					titletext={'Ethereum Address'}

					style={{
						position: 'absolute',
						left: '0px',
						width: '70%',
						opacity: '0.8',
						marginTop: '10px',
					}}
				/>

			{/* Input Amount */}			
				<TextInput 
					onChange={(text) => {}} 
					numeric={true} text={'1,000'} 
					placeholder={'Amount'}

					style={{
						position: 'absolute',
						right: '0px',
						width: '25%',
						opacity: '0.8',
						marginTop: '10px',
					}}
				/>
		</div>
	);
};

export default InputTest;