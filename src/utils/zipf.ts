export function zipf(s: number, N: number) {
	const distribution = [];
	let sum = 0;

	// Calculate normalization constant
	for (let i = 1; i <= N; i++) {
		sum += 1 / Math.pow(i, s);
	}

	const c = 1 / sum;

	// Generate probability distribution
	for (let i = 1; i <= N; i++) {
		const prob = c / Math.pow(i, s);
		distribution.push(prob);
	}

	return distribution;
}
