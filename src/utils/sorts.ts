export function alphabeticalSort(a: string, b: string) {
	return a < b ? -1 : a > b ? 1 : 0;
}

export function lengthSort(a: string, b: string) {
	return a.length - b.length;
}
