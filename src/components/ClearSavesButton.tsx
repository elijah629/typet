import { useSaves } from "@/utils/saves/useSaves";
import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";

export function ClearSavesButton() {
	const [isOpen, setIsOpen] = useState(false);
	const [saves, setSaves] = useSaves();

	return (
		<div>
			<button
				className="btn flex items-center justify-center gap-2 text-error"
				onClick={() => setIsOpen(true)}>
				<TrashIcon className="h-5 w-5" />
				Clear
			</button>
			<Transition
				show={isOpen}
				as={Fragment}>
				<Dialog
					// initialFocus={focusRef}
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
										Clear all saves
									</Dialog.Title>
									<Dialog.Description>
										{" "}
										This will{" "}
										<span className="font-bold">
											permanently
										</span>{" "}
										delete all of your saves
									</Dialog.Description>

									<div className="card-actions justify-end">
										<button
											className="btn-error btn"
											onClick={() => {
												setIsOpen(false);
												setSaves([]);
											}}>
											Clear
										</button>
										<button
											className="btn-accent btn"
											onClick={() => setIsOpen(false)}>
											Cancel
										</button>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
}
