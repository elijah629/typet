import { TestDataSet } from "@/types/test/TestDataSet";
import { TestGraphValue } from "@/types/test/TestGraphValue";
import { simplify } from "@/utils/simplify";
import { curveCatmullRom } from "@visx/curve";
import { Group } from "@visx/group";
import Ordinal from "@visx/legend/lib/legends/Ordinal";
import { MarkerCircle } from "@visx/marker";
import { scaleLinear, scaleOrdinal } from "@visx/scale";
import { LinePath } from "@visx/shape";
import daisyui from "daisyui";

function extent<TData>(
	data: TData[],
	valueFunction: (data: TData) => number
): [number, number] {
	const values = data.map(valueFunction);
	return [Math.min(...values), Math.max(...values)];
}

interface TypingGraphProps {
	width: number;
	height: number;
	simplify?: number;
	data: TestGraphValue[];
}

export const TypingGraph: React.FC<TypingGraphProps> = (
	props: TypingGraphProps
) => {
	const { width, height, data } = props;
	const dataSets: TestDataSet[] = [
		data.map(x => ({ value: x.data.wpm, time: x.time })),
		data.map(x => ({ value: x.data.accuracy, time: x.time }))
	];

	if (props.simplify) {
		dataSets.forEach((dataSet, i) => {
			const values = dataSet.map(data => data.value);
			const times = dataSet.map(data => data.time);
			const divisions = Math.ceil(values.length / props.simplify!);
			const simplified = simplify(values, divisions);

			const newDataSet: TestDataSet = Array.from({
				length: simplified.length
			}).map((_, i) => ({
				value: simplified[i],
				time: times[i]
			}));

			dataSets[i] = newDataSet;
		});
	}
	const margin = 20;
	const innerWidth = width - margin * 2;
	const innerHeight = height - margin * 2;

	const titles = ["WPM", "Accuracy"];
	const themeColors = daisyui.config?.theme?.extend
		?.colors as unknown as Record<string, string>;

	const ordinalColors = [
		themeColors.accent.replace("<alpha-value>", "100"),
		themeColors["base-content"].replace("<alpha-value>", "100")
	];

	const ordinalScale = scaleOrdinal({
		domain: titles,
		range: ordinalColors
	});

	return (
		<div className="relative">
			<Ordinal
				direction="row"
				className="absolute bottom-0 m-2 gap-3 rounded-md bg-secondary bg-opacity-70 p-2"
				scale={ordinalScale}></Ordinal>
			<svg
				width={width}
				height={height}>
				<MarkerCircle
					id="marker-circle"
					className="fill-accent"
					size={2}
					refX={2}
				/>
				<Group
					left={margin}
					top={margin}>
					{dataSets.map((dataSet, i) => {
						const timeScale = scaleLinear({
							range: [0, innerWidth],
							domain: extent(dataSet, d =>
								new Date(d.time).getTime()
							),
							round: true
						});
						const valueScale = scaleLinear({
							range: [innerHeight, 0],
							domain: [0, Math.max(...dataSet.map(x => x.value))],
							round: true
						});
						return (
							<LinePath
								key={i}
								stroke={ordinalColors[i]}
								strokeWidth={1}
								width={innerWidth}
								height={innerHeight}
								data={dataSet}
								x={dataPoint => timeScale(dataPoint.time) ?? 0}
								y={dataPoint =>
									valueScale(dataPoint.value) ?? 0
								}
								markerStart="url(#marker-circle)"
								markerMid="url(#marker-circle)"
								markerEnd="url(#marker-circle)"
								curve={curveCatmullRom}
							/>
						);
					})}
				</Group>
			</svg>
		</div>
	);
};
