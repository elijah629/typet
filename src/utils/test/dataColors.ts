export const wpmColor = (wpm: number): string => {
	if (wpm < 45) return "text-error";

	if (wpm < 65) return "text-warning";
	return "text-success";
};
export const accuracyColor = (accuracy: number): string => {
	if (accuracy < 50) return "text-error";

	if (accuracy < 70) return "text-warning";
	return "text-success";
};
export const cpmColor = (cpm: number): string => {
	if (cpm < 225) return "text-error";

	if (cpm < 325) return "text-warning";
	return "text-success";
};
