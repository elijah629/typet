import { WordList } from "@/types/wordlist/WordList";
import { WordListIdentifier } from "@/types/wordlist/WordListIdentifier";
import { alphabeticalSort, lengthSort } from "@/utils/sorts";
import { Dialog, Transition } from "@headlessui/react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";

interface WordListSelectorProps {
	getWordList: (id: string) => Promise<WordList>;
	onChange?: (list: WordList) => void;
	wordLists: WordListIdentifier[];
	defaultList: WordList;
}

export const WordListSelector: React.FC<WordListSelectorProps> = (
	props: WordListSelectorProps
) => {
	const [wordList, setWordList] = useState<WordList>(props.defaultList);
	const [isOpen, setIsOpen] = useState(false);

	const wordLists: WordListIdentifier[] = props.wordLists.sort(
		(a, b) => lengthSort(a.name, b.name) || alphabeticalSort(a.name, b.name)
	);

	const { onChange } = props;

	useEffect(() => {
		onChange?.(wordList);
	}, [wordList, onChange]);

	return (
		<div>
			<button
				onClick={() => setIsOpen(true)}
				className="btn gap-2">
				<GlobeAltIcon className="h-5 w-5" />
				{wordList.name}
			</button>
			<Transition
				show={isOpen}
				as={Fragment}>
				<Dialog
					onClose={() => setIsOpen(false)}
					className="relative z-50">
					{/* The backdrop, rendered as a fixed sibling to the panel container */}
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<div
							className="fixed inset-0 bg-black/30"
							aria-hidden="true"
						/>
					</Transition.Child>

					{/* Full-screen container */}
					<div className="fixed inset-0 flex items-center justify-center p-4">
						{/* The actual dialog panel  */}
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95">
							<Dialog.Panel className="card max-h-full w-full max-w-md overflow-auto rounded-md bg-primary text-primary-content">
								<div className="card-body">
									<Dialog.Title className="card-title">
										Select wordlist
									</Dialog.Title>
									<div className="flex flex-col gap-2">
										{wordLists.map(wordList => (
											<button
												key={wordList.id}
												className="text-md btn justify-between text-accent"
												onClick={async () => {
													setIsOpen(false);
													setWordList(
														await props.getWordList(
															wordList.id
														)
													);
												}}>
												{wordList.name}
												<span className="text-xs normal-case text-primary">
													{wordList.id}
												</span>
											</button>
										))}
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};
