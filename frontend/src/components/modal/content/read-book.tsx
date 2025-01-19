"use client";

import useBooks from "@/components/hooks/useBooks";
import { addWord, getParagraphs, getTranslation } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { InView } from "react-intersection-observer";

function chunkArray(array: any, chunkSize: number = 10) {
	let chunks = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		chunks.push(array.slice(i, i + chunkSize));
	}
	return chunks;
}

const ReadBook = () => {
	return (
		<Suspense>
			<Content />
		</Suspense>
	);
};

const Content = () => {
	const searchParams = useSearchParams();

	const { recentBooks: allBooks } = useBooks();
	const book_id = searchParams.get("book_id");

	const book = allBooks.find((book) => book.id === book_id);

	const [word, setWord] = useState("");

	const { data: bookContent } = useQuery({
		enabled: !!book?.original_text_id,
		queryKey: ["books", book?.original_text_id],
		queryFn: async () => {
			const bookFile = await getParagraphs(book.original_text_id);
			return bookFile;
		},
	});

	const { data: translateContent } = useQuery({
		enabled: !!book?.translation_ids?.[0],
		queryKey: ["books", book?.translation_ids?.[0]],
		queryFn: async () => {
			const bookFile = await getParagraphs(book.translation_ids[0]);
			return bookFile;
		},
	});

	const [page, setPage] = useState(1);

	const bookParagraphs = chunkArray(bookContent?.paragraphs || [], 10);
	let translateParagraphs = chunkArray(translateContent?.paragraphs || [], 10);
	translateParagraphs = translateParagraphs.slice(
		page - 1,
		translateParagraphs.length,
	);

	const { show } = useContextMenu({
		id: "hello",
	});

	// @ts-ignore
	async function handleItemClick() {
		const translation = await getTranslation(word);
		addWord(word, translation);
	}

	// @ts-ignore
	function displayMenu(e, word) {
		setWord(word);
		show({
			event: e,
			props: { word },
		});
	}

	return (
		<div className="overflow-hidden flex flex-col h-[86vh]">
			{book && (
				<>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<h3 className="font-bold">{book.title}</h3>
							<h4 className="text-lg font-thin">{book.author[0]}</h4>
						</div>
						<div className="mr-8">
							<div className="forn-control">
								<div className="label">
									<span className="label-text">Початкова сторінка</span>
								</div>
								<input
									className="input input-bordered"
									type="number"
									value={page}
									// @ts-ignore
									onChange={(e) => setPage(+e.target.value)}
								/>
							</div>
						</div>
					</div>
					<div className="flex flex-1 gap-4 overflow-auto text-lg">
						<div className="flex-1">
							{bookParagraphs.map((paragraphs, i) => {
								return (
									// eslint-disable-next-line react/jsx-key
									<div className="flex flex-col gap-4" key={i}>
										{paragraphs.map((paragraph: string, _j: number) => {
											return (
												<p key={1000000 + _j}>
													{paragraph.split(" ").map((word) => {
														return (
															// eslint-disable-next-line react/jsx-key
															<span
																onContextMenu={(e) =>
																	displayMenu(
																		e,
																		word
																			.replaceAll(",", "")
																			.replaceAll(".", ""),
																	)
																}
															>
																{word}{" "}
															</span>
														);
													})}
												</p>
											);
										})}
										<InView
											as="div"
											onChange={(inView) => {
												if (inView) {
													const pageSeen =
														+(localStorage.getItem(book.id) || "1") || 1;
													const maxPageSeen = Math.max(pageSeen, i + 1);
													localStorage.setItem(book.id, String(maxPageSeen));
												}
											}}
										>
											<div className="divider">{i + 1}</div>
										</InView>
									</div>
								);
							})}
						</div>
						<div className="flex flex-col flex-1 gap-4">
							{translateParagraphs.map((paragraphs, i) => {
								return (
									// eslint-disable-next-line react/jsx-key
									<div className="flex flex-col gap-4">
										{paragraphs.map((paragraph: string, _j: number) => {
											// eslint-disable-next-line react/jsx-key
											return <p>{paragraph}</p>;
										})}
										<div className="divider">{i + page}</div>
									</div>
								);
							})}
						</div>
					</div>
				</>
			)}
			<Menu id={"hello"} className="font-sans text-lg">
				{/* @ts-ignore */}
				<Item onClick={handleItemClick}>Додати слово {`"${word}"`}</Item>
			</Menu>
		</div>
	);
};

export default ReadBook;
