import { TestResults } from "@/types/test/TestResults";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";

export function useSaves() {
	return useLocalStorage<TestResults[]>("saves", []);
}

export function useReadSaves() {
	return useReadLocalStorage<TestResults[]>("saves");
}
