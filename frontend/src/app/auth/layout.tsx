import { type ReactNode } from "react";
import "@/globals.css";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { fontsVariables } from "@/lib/font";
import dayjs from "dayjs";
import Image from "next/image";

export default function RootLayout({
	children,
	params: { locale },
}: {
	children: ReactNode;
	params: { locale: string };
}) {
	dayjs.locale(locale);
	return (
		<html lang={locale}>
			<body className={cn(fontsVariables, "relative h-full", "font-sans")}>
				<Image
					className="absolute z-0 inset-x-0 top-0 w-full h-[400px]"
					width={2000}
					height={350}
					src="/content/bg-line-2.png"
					alt="line"
				/>
				<ThemeProvider>
					<div className="flex min-h-screen p-6 bg-[#fff8de]">
						<div className="flex items-center justify-center flex-1 p-4">
							<div className="relative z-10 w-full max-w-sm p-4 rounded-lg">
								{children}
							</div>
						</div>
					</div>
				</ThemeProvider>
				<Image
					className="absolute z-0 inset-x-0 bottom-0 w-full h-[400px]"
					width={2000}
					height={350}
					src="/content/bg-line-1.png"
					alt="line"
				/>
			</body>
		</html>
	);
}
