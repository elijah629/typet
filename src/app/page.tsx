import TypingTest from "@/components/TypingTest";
import { WordList } from "@/types/wordlist/WordList";
import { WordListIdentifier } from "@/types/wordlist/WordListIdentifier";
import fsSync from "fs";
import fs from "fs/promises";
import dynamic from "next/dynamic";
import path from "path";

const SaveList = dynamic(() => import("@/components/SaveList"), { ssr: false });

export default async function Home() {
	async function getWordLists(): Promise<WordListIdentifier[]> {
		const jsonDir = path.join(process.cwd(), "wordlists");
		const files = await fs.readdir(jsonDir);
		const fullPaths = files.map(x => path.join(jsonDir, x));
		const contents = await Promise.all(
			fullPaths.map(x => fs.readFile(x, "utf8").then(x => JSON.parse(x)))
		);

		return contents.map(({ name, id }) => ({ name, id }));
	}
	async function getWordList(id: string): Promise<WordList> {
		"use server";
		const filePath = path.join(process.cwd(), "wordlists", `${id}.json`);
		const isReal = fsSync.existsSync(filePath);
		if (!isReal) {
			throw new Error(`WordList ${id} not found`);
		}

		const contents = await fs.readFile(filePath, "utf-8");
		return JSON.parse(contents);
	}

	const wordLists = await getWordLists();
	const defaultList = await getWordList("english");

	return (
		<div className="flex flex-col gap-4">
			<TypingTest
				getWordList={getWordList}
				wordLists={wordLists}
				defaultList={defaultList}
			/>
			<hr />
			<SaveList />
		</div>
	);
}
