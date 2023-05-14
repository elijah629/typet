import { windows } from "@/utils/windows";

export const simplify = (
	array: number[],
	simplfication: number = 1
): number[] => {
	const w = windows(array, simplfication);
	return w.map(x => x.reduce((a, b) => a + b) / x.length);
};
