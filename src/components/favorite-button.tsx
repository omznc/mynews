"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { MouseEvent } from "react";

interface FavoriteButtonProps {
	article: {
		title: string;
		url: string;
		urlToImage: string;
	};
	isFavorited?: boolean;
}

export function FavoriteButton({
	article,
	isFavorited = false,
}: FavoriteButtonProps) {
	const [optimisticFavorited, setOptimisticFavorited] = useState(isFavorited);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const toggleFavorite = (e: MouseEvent) => {
		e.preventDefault();

		setOptimisticFavorited(!optimisticFavorited);

		startTransition(async () => {
			try {
				const response = await fetch("/api/favorites", {
					method: optimisticFavorited ? "DELETE" : "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						title: article.title,
						url: article.url,
						imageUrl: article.urlToImage,
					}),
				});

				if (!response.ok) {
					setOptimisticFavorited(optimisticFavorited);
				}
			} catch {
				setOptimisticFavorited(optimisticFavorited);
			} finally {
				router.refresh();
			}
		});
	};

	return (
		<button
			type="button"
			onClick={toggleFavorite}
			disabled={isPending}
			className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
		>
			<Star
				className={`h-4 w-4 ${
					optimisticFavorited
						? "fill-yellow-400 stroke-yellow-400"
						: "stroke-gray-600"
				}`}
			/>
		</button>
	);
}
