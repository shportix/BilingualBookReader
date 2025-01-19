"use client";

import Image from "next/image";
import Icon from "@/components/icon";
import useBooks from "@/components/hooks/useBooks";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Home = () => {
	useEffect(() => {
		if (typeof window === "undefined") return;
		if (localStorage.getItem("token") === null) {
			window.location.href = "/auth/sign-in";
		}
	}, []);

	return (
		<Suspense>
			<Content />
		</Suspense>
	);
};

const Content = () => {
	const router = useRouter();

	const searchParams = useSearchParams();

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [age, setAge] = useState("");
	const [genre, setGenre] = useState("");

	const setSearch = (value: string) => {
		router.replace(`?search=${value}`, { scroll: false });
	};

	const { recentBooks, myBooks, isLoading, isLoadingRecent } = useBooks({
		age: [age, setAge],
		genre: [genre, setGenre],
		search: [searchParams.get("search") || "", setSearch],
	});

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h2 className="text-4xl font-bold">Продовжити читання</h2>
				<div className="rounded-3xl flex-wrap border gap-10 grid xl:grid-rows-2 2xl:grid-rows-1 grid-cols-1 grid-rows-4 xl:grid-cols-2 2xl:grid-cols-4 px-6 py-3 border-[#B7B094]">
					{isLoadingRecent &&
						Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className="flex gap-4 p-2 rounded-lg bg-opacity-10 bg-primary"
							>
								<div className="rounded-lg bg-primary w-[200px] h-[300px] skeleton bg-opacity-10"></div>
								<div className="flex flex-col flex-1 gap-4 bg-primary bg-opacity-10 h-[300px] w-[150px] skeleton"></div>
							</div>
						))}
					{!isLoadingRecent &&
						recentBooks.slice(0, 4).map((book) => {
							const seenPage = +(localStorage.getItem(book.id) || "0") || 0;
							const progress = Math.round((seenPage / book.totalPages) * 100);
							return (
								<div
									onClick={() => {
										// change query in url
										router.replace(`?book_id=${book.id}`, { scroll: false });

										(
											document.getElementById("read-book") as HTMLDialogElement
										)?.showModal();
									}}
									className="flex animate-appear gap-4 p-2 flex-col sm:flex-row transition-colors hover:bg-[#fff8de] rounded-lg cursor-pointer"
									key={book.title}
								>
									<div className="rounded-lg">
										<Image
											className="rounded-[inherit] h-[250px] sm:h-full object-cover"
											width={200}
											height={300}
											alt={book.title}
											src={`data:image/png;base64,${book.image}`}
										/>
									</div>
									<div className="flex flex-col flex-1 gap-4">
										<div className="font-bold">{book.title}</div>
										<div className="text-xl">{book.author}</div>
										<div className="w-full mt-2 rounded-md bg-[#E0DBC9]">
											<div
												className="h-2 bg-[#D9B148] rounded-md"
												style={{
													width: `${progress}%`,
												}}
											></div>
										</div>
										<div className="flex-1"></div>
										<div>
											<div className="rounded-3xl p-3 border flex flex-col gap-2 border-[#B7B094] border-opacity-50">
												<div className="flex justify-between gap-4">
													<div className="text-[#D9B148] font-bold">
														{book.totalPages}
													</div>
													<div className="text-lg font-thin">Сторінок</div>
												</div>
												<div className="flex justify-between gap-4">
													<div className="text-[#D9B148] font-bold">
														{progress}%
													</div>
													<div className="flex items-center text-lg font-thin">
														Прочитано
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
				</div>
			</div>
			<div className="border-[#B7B094] border-2 rounded-3xl">
				<div className="flex items-center justify-between px-6 py-4">
					<h2 className="text-4xl font-bold">Ваша бібліотека</h2>
					<div className="flex gap-8">
						{isFilterOpen && (
							<div className="flex gap-4 animate-appear">
								<select
									className="select select-primary"
									value={age}
									onChange={(e) => setAge(e.target.value)}
								>
									<option value="" disabled>
										Вік
									</option>
									<option value="+0">+0</option>
									<option value="+6">+6</option>
									<option value="+12">+12</option>
									<option value="+16">+16</option>
									<option value="+18">+18</option>
								</select>
								<select
									className="select select-primary"
									value={genre}
									onChange={(e) => setGenre(e.target.value)}
								>
									<option value="" disabled>
										Жанр
									</option>
									<option value="fantasy">Фентезі</option>
									<option value="detective">Детектив</option>
									<option value="romance">Романтика</option>
									<option value="horror">Жахи</option>
									<option value="thriller">Трилер</option>
									<option value="adventure">Пригоди</option>
									<option value="mystery">Містика</option>
									<option value="science">Наукова література</option>
									<option value="biography">Біографія</option>
									<option value="history">Історія</option>
									<option value="drama">Драма</option>
									<option value="comedy">Комедія</option>
									<option value="action">Бойовик</option>
									<option value="poetry">Поезія</option>
									<option value="satire">Сатира</option>
									<option value="tragedy">Трагедія</option>
									<option value="novel">Роман</option>
									<option value="fable">Байка</option>
									<option value="essay">Есе</option>
									<option value="legend">Легенда</option>
									<option value="myth">Міф</option>
									<option value="novella">Новела</option>
									<option value="parable">Парабола</option>
									<option value="poem">Поема</option>
									<option value="screenplay">Сценарій</option>
								</select>
							</div>
						)}
						<div className="flex gap-6">
							<button
								className="btn btn-ghost btn-circle"
								onClick={() => {
									setIsFilterOpen(!isFilterOpen);
									if (isFilterOpen) {
										setAge("");
										setGenre("");
									}
								}}
							>
								{isFilterOpen ? (
									<Icon
										className="text-[32px] text-[#46754B]"
										name="common/filter"
									/>
								) : (
									<Icon
										className="text-[50px] text-[#46754B]"
										name="common/filter-outline"
									/>
								)}
							</button>
							<button
								className="btn btn-ghost btn-circle"
								onClick={() => {
									(
										document.getElementById("add-book") as HTMLDialogElement
									)?.showModal();
								}}
							>
								<Icon
									className="text-[28px] text-[#46754B]"
									name="common/add"
								/>
							</button>
						</div>
					</div>
				</div>
				<div className="border-t-2 grid gap-8 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 2xl:grid-cols-5 border-[inherit] px-6 py-3">
					{isLoading &&
						Array.from({ length: 4 }).map((_, i) => (
							<div key={i}>
								<div className="rounded-lg bg-primary w-full h-[370px] skeleton bg-opacity-10"></div>
								<div className="flex mt-2 flex-col flex-1 gap-4 bg-primary bg-opacity-10 h-[35px] w-3/4 skeleton"></div>
								<div className="flex mt-1 flex-col flex-1 gap-4 bg-primary bg-opacity-10 h-[25px] w-1/2 skeleton"></div>
							</div>
						))}
					{myBooks.map((book) => {
						return (
							<div
								className="flex animate-appear cursor-pointer flex-col p-2 transition-colors hover:bg-[#fff8de] rounded-lg"
								key={book.title}
								onClick={() => {
									// change query in url
									router.replace(`?book_id=${book.id}`, { scroll: false });

									(
										document.getElementById("read-book") as HTMLDialogElement
									)?.showModal();
								}}
							>
								<div className="rounded-2xl">
									<Image
										className="w-full h-[380px] object-cover rounded-[inherit]"
										width={200}
										height={200}
										src={`data:image/png;base64,${book.image}`}
										alt={book.title}
									/>
								</div>
								<div>
									<h3 className="font-bold">{book.title}</h3>
									<p>{book.progressPages}%</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Home;
