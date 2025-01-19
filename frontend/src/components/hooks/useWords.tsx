"use client";

import { useState } from "react";

const useWords = () => {
	const token =
		typeof window !== "undefined"
			? (localStorage.getItem("token") as string)
			: "";
	const words = JSON.parse(
		typeof window !== "undefined" ? localStorage.getItem(token) || "[]" : "[]",
	);

	const [myWords, setMyWords] = useState(
		words.map((word: any) => {
			return {
				word: word.word,
				translate: word.translation,
			};
		}),
	);

	const deleteWord = (word: string) => {
		// @ts-ignore
		const newWords = myWords.filter((w) => w.word !== word.word);
		setMyWords(newWords);
		localStorage.setItem(token, JSON.stringify(newWords));
	};

	return { myWords, deleteWord };
};

export default useWords;
