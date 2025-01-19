"use client";

import { getBooks } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useBooks = (filters: any = {}) => {
	const allBooks = useQuery({
		queryKey: ["books"],
		queryFn: async () => {
			const books = await getBooks();
			console.log("books", books);
			return books;
		},
	});

	const d = useQuery({
		queryKey: [
			"books",
			filters.age?.[0] || "age",
			filters.genre?.[0] || "genre",
			filters.search?.[0] || "search",
		],
		queryFn: async () => {
			const books = await getBooks();

			let filtered = books;

			if (filters?.age?.[0]) {
				filtered = filtered.filter(
					(book) => book.ageRestriction === filters.age[0],
				);
			}
			if (filters?.genre?.[0]) {
				filtered = filtered.filter(
					(book) => book.genre[0] === filters.genre[0],
				);
			}

			if (filters?.search?.[0]) {
				filtered = filtered.filter((book) =>
					book.title
						.toLowerCase()
						.includes((filters?.search?.[0] || "").toLowerCase()),
				);
			}

			return {
				recent: books,
				myBooks: filtered,
			};
		},
	});

	return {
		myBooks: d.data?.myBooks || [],
		recentBooks: allBooks.data || [],
		isLoadingRecent: allBooks.isLoading,
		...d,
		filters,
	};
};

export default useBooks;
