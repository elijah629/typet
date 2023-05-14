export const windows = <T>(array: T[], size: number = 1): T[][] =>
	Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
		array.slice(i * size, i * size + size).filter(x => x !== undefined)
	);
