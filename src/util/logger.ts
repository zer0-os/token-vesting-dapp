import logdown from 'logdown';

const loggerId = `vesting-app`;

export const getLogger = (title: string) => {
	const logger = logdown(`${loggerId}::${title}`);
	logger.state.isEnabled = true;
	return logger;
};
