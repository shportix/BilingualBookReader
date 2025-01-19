"use client";

import { useRef } from "react";

const DeleteAllWords = () => {
	const modal = useRef<HTMLDivElement>(null);

	const closeDialog = () => modal.current?.closest("dialog")?.close();

	const deleteAllWords = async () => {
		closeDialog();
	};

	return (
		<div ref={modal} className="py-4">
			<h3 className="text-xl">
				Ви дійсно хочете <span className="text-red-400">видалити</span> всі
				слова?
			</h3>
			<div className="flex gap-4 mt-4">
				<button onClick={closeDialog} className="flex-1 btn btn-lg btn-primary">
					Ні, залишити
				</button>
				<button
					onClick={deleteAllWords}
					className="flex-1 btn btn-lg btn-error"
				>
					Так, видалити
				</button>
			</div>
		</div>
	);
};

export default DeleteAllWords;
