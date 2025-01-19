"use client";

import useWords from "@/components/hooks/useWords";
import Icon from "@/components/icon";
import { useEffect } from "react";

const Page = () => {
	const { myWords, deleteWord } = useWords();

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (localStorage.getItem("token") === null) {
			window.location.href = "/auth/sign-in";
		}
	}, []);

	const speak = (word: string) => {
		if ("speechSynthesis" in window) {
			const utterance = new SpeechSynthesisUtterance(word);
			utterance.lang = "en-US";
			speechSynthesis.speak(utterance);
		} else {
			alert("Ваш браузер не підтримує Web Speech API");
		}
	};

	return (
		<div>
			<div className="border-[#B7B094] border-2 rounded-3xl">
				<div className="flex items-center justify-between px-6 py-4">
					<h2 className="text-4xl font-bold">Ваші слова</h2>
					<div className="flex gap-6">
						<button
							className="btn btn-ghost btn-error btn-circle"
							onClick={() => {
								(
									document.getElementById(
										"delete-all-words",
									) as HTMLDialogElement
								)?.showModal();
							}}
						>
							<Icon className="text-[28px] text-red-500" name="common/busket" />
						</button>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="table table-lg">
						<thead>
							<tr>
								<th className="text-3xl">Слово</th>
								<th className="text-3xl">Переклад</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{myWords.length === 0 && (
								<tr>
									<td colSpan={3} className="text-3xl text-center">
										Слів немає, додайте слово з книги в бібліотеці
									</td>
								</tr>
							)}
							{/* @ts-ignore */}
							{myWords.map((word) => {
								return (
									<tr key={word.word}>
										<td className="text-3xl">{word.word}</td>
										<td className="text-3xl">{word.translate}</td>
										<td>
											<div className="flex justify-end gap-6">
												<button
													onClick={() => speak(word.word)}
													className="btn btn-ghost btn-circle"
												>
													<Icon
														className="text-[28px] text-[#46754B]"
														name="common/sound"
													/>
												</button>
												<button
													className="btn btn-ghost btn-circle"
													onClick={() => deleteWord(word)}
												>
													<Icon
														className="text-[28px] text-[#46754B]"
														name="common/busket"
													/>
												</button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Page;
