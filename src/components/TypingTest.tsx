"use client";

import { TypingGraph } from "@/components/TypingGraph";
import { TypingGraphHUD } from "@/components/TypingGraphHUD";
import { WordListSelector } from "@/components/WordListSelector";
import { TestData } from "@/types/test/TestData";
import { TestGraphValue } from "@/types/test/TestGraphValue";
import { WordList } from "@/types/wordlist/WordList";
import { WordListIdentifier } from "@/types/wordlist/WordListIdentifier";
import { useSaves } from "@/utils/saves/useSaves";
import { accuracyColor, cpmColor, wpmColor } from "@/utils/test/dataColors";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { ParentSize } from "@visx/responsive";
import dynamic from "next/dynamic";
import { useState } from "react";

const TypingArea = dynamic(() => import("@/components/TypingArea"), {
	ssr: false
});

interface TypingTestProps {
	getWordList: (id: string) => Promise<WordList>;
	wordLists: WordListIdentifier[];
	defaultList: WordList;
}

export default function TypingTest(props: TypingTestProps) {
	const [data, setData] = useState<TestGraphValue[]>([]);
	const [wordList, setWordList] = useState<WordList>(props.defaultList);
	const [done, setDone] = useState<boolean>(false);
	const [time, setTime] = useState<number>();
	const [saves, setSaves] = useSaves();

	function addData(dataPoint: TestData) {
		setData([...data, { data: dataPoint, time: new Date() }]);
	}

	const hasData = data.length > 0;
	const lastData = hasData ? data[data.length - 1].data : undefined;

	return done ? (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between">
				<h1 className="text-2xl">Results</h1>
				<button
					className="btn gap-2"
					onClick={() => {
						setData([]);
						setDone(false);
						setTime(undefined);
					}}>
					<ArrowPathIcon className="h-5 w-5" />
					Try Again
				</button>
			</div>
			<div className="h-52 w-full rounded-md border-2">
				<ParentSize>
					{({ width, height }) => (
						<TypingGraph
							width={width}
							height={height}
							data={data}
							simplify={50}></TypingGraph>
					)}
				</ParentSize>
			</div>
			<div className="flex justify-around gap-4 text-4xl font-bold">
				<span className={wpmColor(lastData!.wpm)}>
					{lastData?.wpm} WPM
				</span>
				<span className={cpmColor(lastData!.cpm)}>
					{lastData?.cpm} CPM
				</span>
				<span className={accuracyColor(lastData!.accuracy)}>
					{lastData?.accuracy}%
				</span>
				<span className="text-accent">
					{(time! / 1000).toFixed(2)}s
				</span>
			</div>
		</div>
	) : (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between">
				<WordListSelector
					getWordList={props.getWordList}
					onChange={setWordList}
					defaultList={props.defaultList}
					wordLists={props.wordLists}
				/>
				<span>
					<span className="kbd">Shift + Enter</span> to end test
				</span>
			</div>
			<div className="flex flex-col items-center gap-2">
				<div className="relative h-52 w-full rounded-md border-2">
					<TypingGraphHUD data={data} />
					<ParentSize>
						{({ width, height }) => (
							<TypingGraph
								width={width}
								height={height}
								data={data}></TypingGraph>
						)}
					</ParentSize>
				</div>
				<TypingArea
					wordList={wordList}
					onReset={() => setData([])}
					onComplete={x => {
						addData(x.data);
						setTime(x.time);
						setDone(true);
						setSaves([...saves, x]);
					}}
					onData={addData}
				/>
			</div>
		</div>
	);
}
