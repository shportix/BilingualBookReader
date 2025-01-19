"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ePub from "epubjs";
import Image from "next/image";
import Confetti from "react-confetti";
import { addBook } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import useBooks from "@/components/hooks/useBooks";

const schemaAddBookStep1 = z.object({
	book: z
		.any()
		.refine((file) => !!file, `Завантажте файл`)
		.refine((file) => {
			return ["application/epub+zip"].includes(file?.type);
		}, "Тільки формати .epub підтримуються"),
	translate: z
		.any()
		.refine((file) => !!file, `Завантажте файл`)
		.refine((file) => {
			return ["application/epub+zip"].includes(file?.type);
		}, "Тільки формати .epub підтримуються"),
});

const schemaAddBookStep2 = z.object({
	name: z.string().min(1, "Назва книги не може бути порожньою"),
	age: z.string().min(1, "Вік не може бути порожнім"),
	author: z.string().min(1, "Автор не може бути порожнім"),
	genre: z.string().min(1, "Жанр не може бути порожнім"),
});

type AddBookStep1 = z.infer<typeof schemaAddBookStep1>;
export type AddBookStep2 = z.infer<typeof schemaAddBookStep2>;

const AddBook = () => {
	const [step, setStep] = useState(1);

	const {
		handleSubmit: handleSubmitStep1,
		formState: { errors: errorsStep1 },
		reset: resetStep1,
		getValues: getValuesStep1,
	} = useForm<AddBookStep1>({
		resolver: zodResolver(schemaAddBookStep1),
	});

	const {
		register: registerStep2,
		handleSubmit: handleSubmitStep2,
		formState: { errors: errorsStep2 },
		reset: resetStep2,
		getValues: getValuesStep2,
		setError: setErrorStep2,
	} = useForm<AddBookStep2>({
		resolver: zodResolver(schemaAddBookStep2),
	});

	const onSubmitStep1 = async (data: AddBookStep1) => {
		try {
			resetStep2({
				name: data.translate.name || data.book.name || "",
				age: "",
				author: data.translate.author || data.book.author || "",
				genre: "",
			});
			setStep((step) => step + 1);
			//
		} catch (err) {
			//
		} finally {
			//
		}
	};

	const queryClient = useQueryClient();

	const modal = useRef<HTMLDivElement>(null);
	const closeDialog = () => modal.current?.closest("dialog")?.close();

	const x = useBooks();

	const onSubmitStep2 = async (data: AddBookStep2) => {
		try {
			await addBook({
				...data,
				preview: getValuesStep1("book")?.coverUrl || "",
				origin: getValuesStep1("book")?.file,
				translation_0: getValuesStep1("translate")?.file,
			});
			// revalidate query books
			x.filters?.age?.[1]?.("");
			x.filters?.genre?.[1]?.("");
			x.filters?.search?.[1]?.("");
			queryClient.refetchQueries({ queryKey: ["books", "age", "genre"] });

			setStep((step) => step + 1);
			//
		} catch (err) {
			// @ts-ignore
			setErrorStep2("root", { message: err.message });
			//
		} finally {
			//
		}
	};

	// @ts-ignore
	const handleUpload = async (e, fileName: "book" | "translate") => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = async (event) => {
				// @ts-ignore
				const epub = ePub(event.target.result as ArrayBuffer);
				const coverUrl = await epub.coverUrl();
				const book = epub.renderTo("viewer", { width: 600, height: 800 });
				const locations = await book.book.locations.generate(1024);
				const pages = locations.length;

				epub.loaded.metadata.then((metadata: any) => {
					resetStep1({
						...getValuesStep1(),
						[fileName]: {
							name: metadata.title,
							type: file.type,
							author: metadata.creator,
							size: file.size,
							coverUrl: coverUrl || "",
							file,
							pages,
						},
					});
				});
			};
			reader.readAsArrayBuffer(file);
		}
	};

	const coverUrlBook = getValuesStep1("book")?.coverUrl;
	const coverUrlTranslate = getValuesStep1("translate")?.coverUrl;

	const modalStep = useRef<HTMLDivElement>(null);

	return (
		<div className="mt-8" ref={modal}>
			{step === 1 && (
				<form onSubmit={handleSubmitStep1(onSubmitStep1)}>
					<div className="flex gap-4 text-secondary-content">
						<div className="flex-1">
							{coverUrlBook !== "" &&
								coverUrlBook !== null &&
								coverUrlBook !== undefined && (
									<div>
										<Image
											className="object-cover rounded-2xl h-[289px]"
											src={coverUrlBook}
											alt="cover book"
											width={225}
											height={289}
										/>
										<button
											type="button"
											onClick={() => {
												resetStep1({
													...getValuesStep1(),
													book: null,
												});
											}}
											className="w-full btn btn-secondary"
										>
											Придрати
										</button>
									</div>
								)}
							{coverUrlBook === "" && (
								<div>
									<div className="h-[289px] flex rounded-2xl justify-center items-center text-lg bg-[#46754b] bg-opacity-50">
										Обкладинка не знайдена
									</div>
									<button
										type="button"
										onClick={() => {
											resetStep1({
												...getValuesStep1(),
												book: null,
											});
										}}
										className="w-full btn btn-secondary"
									>
										Придрати
									</button>
								</div>
							)}
							{(coverUrlBook === null || coverUrlBook === undefined) && (
								<label
									htmlFor="book"
									className={cn(
										"flex-1 cursor-pointer text-lg border-dotted flex-col border-[#46754B] h-[337px] flex items-center justify-center border-4",
										errorsStep1.book?.message && "border-error text-error",
									)}
								>
									<p className="font-bold">Перетягніть файл, </p>
									<p>щоб додати книгу</p>
									<input
										onChange={(e) => handleUpload(e, "book")}
										name="book"
										id="book"
										hidden
										type="file"
									/>
								</label>
							)}

							{errorsStep1?.book?.message && (
								// @ts-ignore
								<p className="text-sm text-error">{errorsStep1.book.message}</p>
							)}
						</div>

						<div className="flex-1">
							{coverUrlTranslate !== "" &&
								coverUrlTranslate !== null &&
								coverUrlTranslate !== undefined && (
									<div>
										<Image
											className="object-cover rounded-2xl h-[289px]"
											src={coverUrlTranslate}
											alt="cover translate"
											width={225}
											height={289}
										/>
										<button
											type="button"
											onClick={() => {
												resetStep1({
													...getValuesStep1(),
													translate: null,
												});
											}}
											className="w-full btn btn-secondary"
										>
											Придрати
										</button>
									</div>
								)}
							{coverUrlTranslate === "" && (
								<div>
									<div className="h-[289px] rounded-2xl flex justify-center items-center text-lg bg-[#46754b] bg-opacity-50">
										Обкладинка не знайдена
									</div>
									<button
										type="button"
										onClick={() => {
											resetStep1({
												...getValuesStep1(),
												translate: null,
											});
										}}
										className="w-full btn btn-secondary"
									>
										Придрати
									</button>
								</div>
							)}
							{(coverUrlTranslate === null ||
								coverUrlTranslate === undefined) && (
								<label
									htmlFor="translate"
									className={cn(
										"flex-1 cursor-pointer text-lg border-dotted flex-col border-[#46754B] h-[337px] flex items-center justify-center border-4",
										errorsStep1.translate?.message && "border-error text-error",
									)}
								>
									<p className="font-bold">Перетягніть файл, </p>
									<p>щоб додати переклад</p>
									<input
										onChange={(e) => handleUpload(e, "translate")}
										name="translate"
										id="translate"
										hidden
										type="file"
									/>
								</label>
							)}
							{errorsStep1?.translate?.message && (
								<p className="text-sm text-error">
									{/* @ts-ignore */}
									{errorsStep1.translate.message}
								</p>
							)}
						</div>
					</div>
					<button className="w-full mt-4 btn btn-primary">Далі</button>
				</form>
			)}
			{step === 2 && (
				<form onSubmit={handleSubmitStep2(onSubmitStep2)}>
					<div className="flex flex-col gap-4">
						<div className="flex flex-1 gap-2">
							<label className="w-full form-control">
								<div className="label">
									<span className="label-text">Назва книги</span>
								</div>
								<input
									className={cn(
										"input",
										errorsStep2.name?.message && "input-error input-bordered",
									)}
									placeholder="Назва книги"
									{...registerStep2("name")}
								/>
								{errorsStep2.name?.message && (
									<p className="text-sm text-error">
										{errorsStep2.name.message}
									</p>
								)}
							</label>

							<label className="w-full form-control">
								<div className="label">
									<span className="label-text">Вік</span>
								</div>
								<select
									className={cn(
										"select",
										errorsStep2.age?.message && "select-error select-bordered",
									)}
									{...registerStep2("age")}
								>
									<option value="+0">0+</option>
									<option value="+6">6+</option>
									<option value="+12">12+</option>
									<option value="+16">16+</option>
									<option value="+18">18+</option>
								</select>
								{errorsStep2.age?.message && (
									<p className="text-sm text-error">
										{errorsStep2.age.message}
									</p>
								)}
							</label>
						</div>
						<div className="flex flex-1 gap-2">
							<label className="w-full form-control">
								<div className="label">
									<span className="label-text">Автор</span>
								</div>
								<input
									className={cn(
										"input",
										errorsStep2.author?.message && "input-error input-bordered",
									)}
									placeholder="Автор"
									{...registerStep2("author")}
								/>
								{errorsStep2.author?.message && (
									<p className="text-sm text-error">
										{errorsStep2.author.message}
									</p>
								)}
							</label>

							<label className="w-full form-control">
								<div className="label">
									<span className="label-text">Жанр</span>
								</div>
								<select
									className={cn(
										"select",
										errorsStep2.genre?.message &&
											"select-error select-bordered",
									)}
									{...registerStep2("genre")}
								>
									<option value=""></option>
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
								{errorsStep2.genre?.message && (
									<p className="text-sm text-error">
										{errorsStep2.genre.message}
									</p>
								)}
							</label>
						</div>
					</div>
					<div className="mt-4">
						{errorsStep2.root?.message && (
							<p className="text-sm text-error">{errorsStep2.root.message}</p>
						)}
						<div className="flex gap-2">
							<button
								className="flex-1 btn btn-secondary"
								onClick={() => setStep((step) => step - 1)}
							>
								Назад
							</button>
							<button className="flex-1 btn btn-primary">Додати</button>
						</div>
					</div>
				</form>
			)}
			{step === 3 && (
				<div
					ref={modalStep}
					className="h-[250px] flex items-center overflow-hidden"
				>
					<div className="-mt-6">
						<h1 className="text-secondary-content">
							Ви успішно додали книгу до бібліотеки!
						</h1>
						<p className="text-sm">
							Ми раді, що ви з нами. Бажаємо вам чудового навчання та натхнення
							від читання!
						</p>
						<Confetti width={510} height={330} />
						<button
							className="w-full mt-4 btn btn-primary"
							onClick={() => {
								closeDialog();
								setStep(1);
							}}
						>
							ГУД
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default AddBook;
