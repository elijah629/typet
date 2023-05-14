import { TestGraphValue } from "@/types/test/TestGraphValue";
import { accuracyColor, cpmColor, wpmColor } from "@/utils/test/dataColors";

interface TypingGraphHUDProps {
	data: TestGraphValue[];
}

export const TypingGraphHUD: React.FC<TypingGraphHUDProps> = (
	props: TypingGraphHUDProps
) => {
	const hasData = props.data.length > 0;
	const data = hasData ? props.data[props.data.length - 1].data : undefined;

	return (
		<span className="absolute right-0 z-10 w-full rounded-bl rounded-tr bg-secondary bg-opacity-70 p-2 text-center text-2xl font-bold sm:w-auto">
			{hasData ? (
				<>
					<span className={wpmColor(data!.wpm)}>
						{data!.wpm} WPM{" "}
					</span>
					<span className={cpmColor(data!.cpm)}>
						{data!.cpm} CPM{" "}
					</span>
					<span className={accuracyColor(data!.accuracy)}>
						{data!.accuracy}%
					</span>
				</>
			) : (
				<span className="text-secondary-content">Type to start</span>
			)}
		</span>
	);
};
