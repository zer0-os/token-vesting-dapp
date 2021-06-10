export function truncateDecimals(str: string, maxDecimalDigits: number) {
	if (str.includes('.')) {
		const parts = str.split('.');
		return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
	}
	return str;
}
