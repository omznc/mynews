"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Loader } from "lucide-react";

interface Article {
	url: string;
	published_date: string;
	title: string;
}

interface LatestNewsBoxProps {
	initialNews: Article[];
}

// This was built from scratch, but I'd usually use https://swr.vercel.app/, or even TanStack Query
export function LatestNewsBox({ initialNews }: LatestNewsBoxProps) {
	const [news, setNews] = useState<Article[]>(initialNews);
	const [reachedEnd, setReachedEnd] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [offset, setOffset] = useState(initialNews.length);
	const containerRef = useRef<HTMLDivElement>(null);

	const fetchNews = async () => {
		if (isLoading) {
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/latest-news?offset=${offset}&limit=20`,
			);
			const data = await response.json();
			if (!data?.results) {
				setReachedEnd(true);
				return;
			}
			setNews((prev) => [...prev, ...(data?.results ?? [])]);
			setOffset((prev) => prev + 20);
		} catch (error) {
			console.error("Error fetching news:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (reachedEnd) {
			return;
		}
		const container = containerRef.current;
		if (!container) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && !isLoading) {
					fetchNews();
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(container);
		return () => observer.disconnect();
	}, [isLoading, reachedEnd]);

	return (
		<div className="flex transition-all animate-fade-in-up justify-between bg-white flex-col w-full min-w-full md:w-fit md:row-span-2 rounded-[8px]">
			<div className="flex items-center gap-2 p-4 pb-4">
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Latest news</title>
					<circle
						opacity="0.24"
						cx="10"
						cy="10"
						r="10"
						fill="#BB1E1E"
						className="animate-[pulse_2s_ease-in-out_infinite]"
					/>
					<circle
						cx="10"
						cy="10"
						r="5"
						fill="#BB1E1E"
						className="animate-[pulse_4s_ease-in-out_infinite]"
					/>
				</svg>
				<h2 className="text-[16px] font-semibold font-medium select-none">
					Latest news
				</h2>
			</div>

			<div className="flex flex-col gap-4 overflow-y-scroll overflow-x-hidden p-4 h-full max-h-[550px] divide-y">
				{news.map((item, index) => (
					<div key={item.url} className="group">
						<time
							className={cn(
								"text-[10px] font-bold block text-blue-600 mb-1 pt-4",
								{
									"pt-0": index === 0,
								},
							)}
						>
							{(() => {
								const date = new Date(item.published_date);
								const now = new Date();
								if (date.toDateString() === now.toDateString()) {
									return date.toLocaleTimeString("en-US", {
										hour: "2-digit",
										minute: "2-digit",
									});
								}
								return formatDistanceToNow(date, { addSuffix: true });
							})()}
						</time>
						<Link
							href={item.url}
							className="text-[16px] font-medium line-clamp-3 text-gray-900 hover:text-gray-600 transition-colors"
						>
							{item.title}
						</Link>
					</div>
				))}
				<div
					ref={containerRef}
					className="h-6 flex items-center justify-center"
				>
					{isLoading && (
						<Loader className="w-6 h-6 my-6 animate-spin text-blue-600" />
					)}
					{reachedEnd && (
						<p className="text-[14px] text-gray-500 my-6">No more news</p>
					)}
				</div>
			</div>

			<Link
				href="/latest"
				className="inline-flex gap-2 items-center border-t text-[14px] p-4 text-blue-600 hover:text-blue-800"
			>
				See all news
				<svg
					width="7"
					height="12"
					viewBox="0 0 7 12"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Arrow right</title>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M1.48025 0.45193C1.30001 0.271688 1.00778 0.271688 0.827537 0.45193L0.338002 0.941466C0.15776 1.12171 0.157759 1.41394 0.338001 1.59418L4.66256 5.91874C4.70762 5.9638 4.70762 6.03686 4.66256 6.08192L0.338328 10.4061C0.158085 10.5864 0.158086 10.8786 0.338328 11.0589L0.827537 11.5481C1.00778 11.7283 1.30001 11.7283 1.48025 11.5481L6.37561 6.65271C6.73609 6.29223 6.73609 5.70777 6.37561 5.34729L1.48025 0.45193Z"
						fill="#1D1D1B"
					/>
				</svg>
			</Link>
		</div>
	);
}
