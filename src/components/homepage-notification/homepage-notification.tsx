"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import image from "./notification-background-image.png";

const STORAGE_KEY = "homepage-notification-dismissed";

export function HomepageNotification() {
	const [mounted, setMounted] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setMounted(true);
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		const dismissed = localStorage.getItem(STORAGE_KEY);
		if (!dismissed) {
			setIsVisible(true);
		}
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const handleDismiss = () => {
		setIsVisible(false);
		localStorage.setItem(STORAGE_KEY, "true");
	};

	if (!mounted) {
		return null;
	}

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.header
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: isMobile ? 140 : 60, opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
					className="bg-primary w-full flex items-center justify-center overflow-hidden relative"
				>
					<Image
						src={image}
						alt="notification background image"
						className="absolute md:right-[18%] min-w-[700px] md:min-w-0 w-[800px] md:w-[550px] h-full opacity-15 saturate-0"
					/>
					<div className="px-4 flex flex-col md:flex-row max-w-5xl justify-between w-full relative z-10 gap-4 md:gap-0">
						<div className="flex flex-col md:flex-row gap-1 md:gap-8 text-primary-foreground items-start md:items-center text-sm">
							<h3 className="font-bold whitespace-nowrap">
								Make MyNews your homepage
							</h3>
							<span>
								{"Every day discover what's trending on the internet!"}
							</span>
						</div>
						<div className="flex gap-4 text-primary-foreground items-center text-sm">
							<button
								type="button"
								className="font-bold hover:underline whitespace-nowrap"
								onClick={handleDismiss}
							>
								No, thanks
							</button>
							<Button
								size="sm"
								className="font-bold px-4 bg-white text-black transition-all hover:bg-neutral-200 hover:text-black whitespace-nowrap"
							>
								GET
							</Button>
						</div>
					</div>
				</motion.header>
			)}
		</AnimatePresence>
	);
}
