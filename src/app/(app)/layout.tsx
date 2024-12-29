import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { HomepageNotification } from "@/components/homepage-notification/homepage-notification";
import { isAuthenticated } from "@/lib/auth";
import { CategoryButtons } from "@/components/category-buttons";
import { Header } from "@/components/header";
import { env } from "@/lib/env";

export const metadata: Metadata = {
	title: "MyNews",
	description: "Created as a part of a job application process.",
	metadataBase: new URL(env.NEXT_PUBLIC_AUTH_URL),
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
				<div className="flex gap-6 pb-6">
					<CategoryButtons className="hidden md:flex" />
					<Suspense
						fallback={
							<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								{Array.from({ length: 9 }).map((_, index) => (
									<div
										key={index}
										className="animate-pulse bg-gray-200 rounded-[8px] h-[200px] w-full"
									/>
								))}
							</div>
						}
					>
						{children}
					</Suspense>
				</div>
			</div>
		</>
	);
}
