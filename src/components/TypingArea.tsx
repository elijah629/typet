"use client";

import { TestData } from "@/types/test/TestData";
import { TestResults } from "@/types/test/TestResults";
import { WordList } from "@/types/wordlist/WordList";
import { weightedRandom } from "@/utils/weightedRandom";
import { zipf } from "@/utils/zipf";
import clsx from "clsx";
import React from "react";

interface TypingAreaProps {
	wordList: WordList;
	onComplete?: (results: TestResults) => void;
	onData?: (currentResults: TestData) => void;
	onReset?: () => void;
}

interface TypingAreaState {
	content: Word[];
}

type Word = {
	letters: Letter[];
	correct?: boolean;
};

type Letter = {
	character: string;
	correct?: boolean;
	typed: boolean;
};

export default class TypingArea extends React.Component<
	TypingAreaProps,
	TypingAreaState
> {
	private wordIndex: number = 0;
	private letterIndex: number = 0;
	private startTime: number = 0;
	private mistakes: number = 0;
	private dataInterval?: number;

	private isDone: boolean = false;
	private started: boolean = false;

	private words: string[] = [];
	private lastTypedIndices: number[] = [0];

	private wordsContainerRef: React.RefObject<HTMLDivElement> =
		React.createRef();
	private caretRef: React.RefObject<HTMLDivElement> = React.createRef();

	private wordGenerator: Generator<string, string, string> =
		this.wordGeneratorMaker();

	*wordGeneratorMaker(): Generator<string, string, string> {
		const wordList = this.props.wordList.words;
		const zipfDist = zipf(1, wordList.length).map(x => 1 - x);
		while (true) {
			yield weightedRandom(wordList, zipfDist);
		}
	}

	constructor(props: TypingAreaProps) {
		super(props);

		this.words = Array.from({
			length: 100
		}).map(() => this.wordGenerator.next().value);

		this.state = {
			content: this.words.map(word => ({
				letters: word.split("").map(character => ({
					character,
					typed: false
				}))
			}))
		};

		this.addWord = this.addWord.bind(this);
		this.insert = this.insert.bind(this);
		this.delete = this.delete.bind(this);
		this.nextWord = this.nextWord.bind(this);
		this.updateCaretPosition = this.updateCaretPosition.bind(this);
		this.onDone = this.onDone.bind(this);
		this.tryStart = this.tryStart.bind(this);
		this.calculateResults = this.calculateResults.bind(this);
	}

	render(): React.ReactNode {
		return (
			<div
				className="relative max-h-24 max-w-3xl overflow-hidden rounded-md border-2 border-gray-400 outline-0 transition-colors focus:border-accent"
				tabIndex={0}
				onKeyDown={e => {
					if (this.isDone) {
						return;
					}
					e.preventDefault();
					e.stopPropagation();

					switch (e.key) {
						case "Enter":
							if (this.started) {
								if (e.shiftKey) {
									// Shift + Enter
									this.onDone();
								}
							}
							break;
						case "Backspace":
							this.tryStart();
							this.delete();
							break;
						case " ":
							this.tryStart();
							this.nextWord();
							break;
						default:
							if (e.key.length === 1) {
								this.tryStart();
								this.insert(e.key);
							}
							break;
					}

					this.updateCaretPosition();
				}}>
				<div
					style={{
						// For animations
						top: 0
					}}
					className="relative flex flex-wrap content-start transition-all"
					ref={this.wordsContainerRef}>
					<div
						className="absolute w-[.1rem] bg-accent transition-all"
						ref={this.caretRef}>
						&nbsp;
					</div>
					{this.state.content.map((word, i) => {
						const isCurrentWord = this.wordIndex === i;
						return (
							<span
								key={i}
								className={clsx(
									"m-1",
									word.correct === false
										? "underline decoration-red-500"
										: "",
									// querySelector class
									isCurrentWord ? "activeWord" : ""
								)}>
								{word.letters.map((letter, j) => {
									const isCurrentLetter =
										isCurrentWord && this.letterIndex === j;

									return (
										<span
											key={j}
											className={clsx(
												"transition-colors",
												isCurrentLetter
													? // This is used in a querySelector of the word container
													  "activeLetter"
													: "",
												!letter.typed
													? "text-gray-400"
													: "",
												letter.correct === false
													? "text-error"
													: ""
											)}>
											{letter.character}
										</span>
									);
								})}
							</span>
						);
					})}
				</div>
			</div>
		);
	}

	componentWillUnmount(): void {
		clearInterval(this.dataInterval);
	}

	componentDidUpdate(
		prevProps: Readonly<TypingAreaProps>,
		prevState: Readonly<TypingAreaState>,
		snapshot?: any
	): void {
		this.updateCaretPosition();

		if (prevProps.wordList !== this.props.wordList) {
			this.wordIndex = 0;
			this.letterIndex = 0;
			this.lastTypedIndices = [0];
			this.startTime = 0;
			this.mistakes = 0;

			this.props.onReset?.();

			this.words = Array.from({
				length: 100
			}).map(() => this.wordGenerator.next().value);

			clearInterval(this.dataInterval);

			this.setState({
				content: this.words.map(word => ({
					letters: word.split("").map(character => ({
						character,
						typed: false
					}))
				}))
			});
		}
	}

	componentDidMount(): void {
		this.updateCaretPosition();
	}

	private updateCaretPosition() {
		const wordsContainer = this.wordsContainerRef.current;

		if (!wordsContainer) {
			return;
		}

		const character = wordsContainer.querySelector(
			".activeLetter"
		) as HTMLSpanElement;

		const caret = this.caretRef.current;

		if (!caret) {
			return;
		}

		let x = 0;
		let y = 0;

		if (!character) {
			// On space
			const wordContainer = wordsContainer.querySelector(
				".activeWord"
			) as HTMLSpanElement;
			x = wordContainer.offsetWidth + wordContainer.offsetLeft;
			y = parseInt(caret.style.top);
		} else {
			x = character.offsetLeft;
			y = character.offsetTop;
		}
		const cY = parseInt(caret.style.top);
		if (cY !== y && !isNaN(cY)) {
			this.scrollWords(cY - y);
		}
		caret.style.left = x.toString() + "px";
		caret.style.top = y.toString() + "px";
	}
	private scrollWords(scrollAmount: number) {
		const wordsContainer = this.wordsContainerRef.current;
		if (!wordsContainer) {
			return;
		}
		wordsContainer.style.top =
			(scrollAmount + wordsContainer.offsetTop).toString() + "px";
	}

	private tryStart(): void {
		if (this.wordIndex === 0 && this.letterIndex === 0 && !this.started) {
			this.startTime = performance.now();
			this.started = true;
			this.dataInterval = window.setInterval(() => {
				const currentResults = this.calculateResults();
				this.props.onData?.(currentResults);
			}, 250);
		}
	}

	private insert(character: string): void {
		const content = this.state.content;
		const word = content[this.wordIndex];
		if (this.letterIndex === word.letters.length) {
			word.letters[this.letterIndex] = {
				character,
				correct: false,
				typed: true
			};
			this.mistakes++;
		} else {
			const letter = word.letters[this.letterIndex];

			const isCorrect =
				this.words[this.wordIndex][this.letterIndex] === character;

			if (!isCorrect) {
				this.mistakes++;
			}

			letter.typed = true;
			letter.correct = isCorrect;
		}
		this.lastTypedIndices[this.wordIndex] = this.letterIndex;
		this.letterIndex++;

		this.setState({
			content
		});
	}
	private delete(): void {
		if (this.letterIndex === 0 && this.wordIndex === 0) {
			return;
		}
		if (this.letterIndex === 0) {
			this.wordIndex--;

			const content = this.state.content;
			const word = content[this.wordIndex];
			word.correct = undefined;
			this.setState({
				content
			});

			this.letterIndex = this.lastTypedIndices[this.wordIndex] + 1;
			return;
		} else {
			this.letterIndex--;
		}

		this.lastTypedIndices[this.wordIndex] = this.letterIndex - 1;

		const content = this.state.content;
		const word = content[this.wordIndex];
		const letter = word.letters[this.letterIndex];
		const isAdded = this.letterIndex >= this.words[this.wordIndex].length;

		if (isAdded) {
			word.letters.pop();
		} else {
			letter.typed = false;
			delete letter.correct;
		}
		this.setState({
			content
		});
	}
	private nextWord(): void {
		const content = this.state.content;
		if (this.wordIndex === content.length - 1) {
			return;
		}
		const word = content[this.wordIndex];
		word.correct = word.letters.every(letter => letter.correct);
		if (!word.correct) {
			this.mistakes++;
		}
		this.addWord();

		this.setState({
			content
		});
		this.wordIndex++;
		this.letterIndex = 0;
		this.lastTypedIndices[this.wordIndex] = -1;
	}

	private addWord(): void {
		const content = this.state.content;
		const word = this.wordGenerator.next().value;
		this.words.push(word);
		content.push({
			letters: word.split("").map(character => ({
				character,
				typed: false
			}))
		});
		this.setState({
			content
		});
	}

	private calculateResults(): TestData {
		const words = this.state.content;
		const entries = words
			.map(x => x.letters.filter(x => x.typed).length)
			.reduce((a, b) => a + b, 0);

		const time = performance.now() - this.startTime;
		const mins = time / (60 * 1000);

		const correct = entries - this.mistakes;

		const cpm = entries / mins;
		const wpm = cpm / 5;

		const accuracy = Math.max(0, Math.round((correct / entries) * 100));

		return {
			wpm: Math.max(0, Math.round(wpm)),
			cpm: Math.max(0, Math.round(cpm)),
			accuracy
		};
	}

	private onDone() {
		const results = this.calculateResults();

		window.clearInterval(this.dataInterval);
		this.isDone = true;

		this.props.onComplete?.({
			data: results,
			time: performance.now() - this.startTime
		});
	}
}
