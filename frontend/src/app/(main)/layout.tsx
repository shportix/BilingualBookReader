"use client";

import { fontsVariables } from "@/lib/font";
import Link from "next/link";
import { type ReactNode } from "react";
import "@/globals.css";
import { ThemeProvider } from "next-themes";
import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import ModalBuilder from "@/components/modal/builder";
import Providers from "@/components/query-provider";
import { useRouter } from "next/navigation";
import Header from "@/components/header";

export default function RootLayout({
	children,
	params: { locale },
}: {
	children: ReactNode;
	params: { locale: string };
}) {
	dayjs.locale(locale);
	const router = useRouter();
	return (
		<html lang={locale}>
			<body className={cn(fontsVariables, "font-sans")}>
				<Providers>
					<ThemeProvider>
						<div className="flex items-stretch min-h-screen">
							<div className="bg-[#FFF8DE] hidden sm:flex flex-col flex-1 border-r-2 border-[#B7B094] border-opacity-50 p-7 max-w-52 md:max-w-80 w-full">
								<div className="fixed flex flex-col flex-1 w-32  h-[95%] gap-10 md:w-64">
									<div>
										<div className="flex justify-center">
											<div className="flex items-center gap-4">
												<Icon
													name="common/logo"
													className="text-[32px] text-[#46754B]"
												/>
												<h1 className="text-[#46754B] text-[32px] font-extrabold">
													BiBOOK
												</h1>
											</div>
										</div>
									</div>
									<div className="flex flex-col flex-1 gap-3">
										<Link href="/" className="btn btn-ghost">
											<div className="flex items-center gap-4">
												<Icon
													className="text-[40px] text-[#46754B]"
													name="common/books"
												/>
												<span className="text-2xl text-secondary-content">
													Бібліотека
												</span>
											</div>
										</Link>
										<Link href="/dictionary" className="btn btn-ghost">
											<div className="flex items-center gap-4">
												<Icon
													className="text-[40px] text-[#46754B]"
													name="common/dictionary"
												/>
												<span className="text-2xl text-secondary-content">
													Словник
												</span>
											</div>
										</Link>
										<Link href="/profile" className="btn btn-ghost">
											<div className="flex items-center gap-4">
												<Icon
													className="text-[40px] text-[#46754B]"
													name="common/gear"
												/>
												<span className="text-2xl text-secondary-content">
													Профіль
												</span>
											</div>
										</Link>
									</div>
									<div>
										<a
											href="#"
											className="w-full btn btn-ghost"
											onClick={() => {
												localStorage.removeItem("token");
												router.push("/auth/sign-in");
											}}
										>
											<div className="flex items-center gap-4">
												<Icon
													className="text-[40px] text-[#46754B]"
													name="common/exit"
												/>
												<span className="text-2xl text-secondary-content">
													Вихід
												</span>
											</div>
										</a>
									</div>
								</div>
							</div>
							<Header>{children}</Header>
						</div>
					</ThemeProvider>
					<ModalBuilder />
				</Providers>
			</body>
		</html>
	);
}
