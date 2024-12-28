import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "MyNews",
	description: "Created as a part of a job application process.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.className} antialiased flex flex-col justify-start items-center bg-background`}
			>
				<NuqsAdapter>
					<Toaster />
					{children}
				</NuqsAdapter>
			</body>
		</html>
	);
}
