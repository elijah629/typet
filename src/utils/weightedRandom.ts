export function weightedRandom<T>(values: T[], weights: number[]): T {
	const totalWeight = weights.reduce((a, b) => a + b, 0);
	const random = Math.random() * totalWeight;
	let sum = 0;
	for (let i = 0; i < values.length; i++) {
		sum += weights[i];
		if (sum >= random) {
			return values[i];
		}
	}
	return values[values.length - 1];
}
