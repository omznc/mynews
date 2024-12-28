import type { Metadata } from "next";
import type { ReactNode } from "react";
import { HomepageNotification } from "@/components/homepage-notification/homepage-notification";
import { isAuthenticated } from "@/lib/auth";
import { CategoryButtons } from "@/components/category-buttons";
import { Header } from "@/components/header";

export const metadata: Metadata = {
	title: "MyNews",
	description: "Created as a part of a job application process.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const user = await isAuthenticated();
	return (
		<>
			<HomepageNotification />
			<div className="w-full max-w-5xl px-4">
				<Header user={user} />
				<hr className="hidden md:block border-t my-6" />
				<div className="flex gap-6">
					<CategoryButtons className="hidden md:flex" />
					{children}
				</div>
			</div>
		</>
	);
}
