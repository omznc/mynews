"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";

const variants = {
	hidden: { x: -700, y: 0, filter: "blur(5px)" },
	enter: { x: 0, y: 0, filter: "blur(0px)" },
	exit: { x: 700, y: 0, filter: "blur(5px)" },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const path = usePathname();

	return (
		<div className="h-dvh w-full flex items-center justify-center">
			<Card className="w-full border-0 mx-aut md:border min-h-[550px] mt-10 shadow-none md:max-w-sm overflow-hidden h-fit">
				<div className="w-full p-6">
					<Button variant={"outline"} className="w-full" asChild={true}>
						<Link href="/" className="flex items-center gap-2">
							<House className="w-4 h-4" />
							Homepage
						</Link>
					</Button>
				</div>
				<AnimatePresence initial={false} mode="wait">
					<motion.div
						key={path}
						variants={variants}
						initial="hidden"
						animate="enter"
						exit="exit"
						transition={{ type: "tween", duration: 0.2 }}
					>
						<Suspense>{children}</Suspense>
					</motion.div>
				</AnimatePresence>
			</Card>
		</div>
	);
}
