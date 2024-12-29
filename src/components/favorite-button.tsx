"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { MouseEvent } from "react";

interface FavoriteButtonProps {
	title: string;
	url: string;
	image?: string;
	isFavorited?: boolean;
}

export function FavoriteButton({
	title,
	url,
	image,
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
						title: title,
						url: url,
						imageUrl: image,
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
			className={cn(
				"absolute top-2 right-2 p-2 rounded-lg hover:scale-110 transition-transform",
				{
					"group-hover:opacity-100 opacity-0 transition-all pointer-events-none group-hover:pointer-events-auto":
						!optimisticFavorited,
					"opacity-100": optimisticFavorited,
				},
			)}
		>
			<Star
				className={cn("h-4 w-4 drop-shadow-md transition-all", {
					"fill-yellow-400 stroke-yellow-400": optimisticFavorited,
					"stroke-white fill-neutral-500": !optimisticFavorited,
				})}
			/>
		</button>
	);
}
