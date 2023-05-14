"use client";

import { ClearSavesButton } from "@/components/ClearSavesButton";
import { useReadSaves } from "@/utils/saves/useSaves";
import { accuracyColor, cpmColor, wpmColor } from "@/utils/test/dataColors";

const SaveList: React.FC = () => {
	const saves = useReadSaves();
	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between">
				<h1 className="text-2xl">Previous results</h1>
				<ClearSavesButton />
			</div>
			{Boolean(saves?.length) ? (
				<div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
					{saves?.map((x, i) => (
						<div
							className="flex flex-col rounded-md border-2 p-2 font-bold"
							key={i}>
							<span className={wpmColor(x.data.wpm)}>
								{x.data.wpm} WPM
							</span>
							<span className={cpmColor(x.data.cpm)}>
								{x.data.cpm} CPM
							</span>
							<span className={accuracyColor(x.data.accuracy)}>
								{x.data.accuracy}%
							</span>
							<span className="text-accent">
								{(x.time! / 1000).toFixed(2)}s
							</span>
						</div>
					))}
				</div>
			) : (
				<>No results, try starting a test</>
			)}
		</div>
	);
};

export default SaveList;
