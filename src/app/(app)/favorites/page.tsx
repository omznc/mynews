import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FavoriteButton } from "@/components/favorite-button";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";

export default async function FavoritesPage() {
	const user = await isAuthenticated();
	if (!user) {
		redirect("/login");
	}

	const favorites = await prisma.favorite.findMany({
		where: { userId: user.id },
		orderBy: { createdAt: "desc" },
	});

	return (
		<div className="flex flex-col gap-4 w-full animate-fade-in-up">
			<h2 className="font-semibold text-[18px]">Your Favorites</h2>
			<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{favorites.map((favorite) => (
					<Link
						key={favorite.id}
						href={favorite.url}
						target="_blank"
						rel="noopener noreferrer"
						className="group relative animate-fade-in-up flex flex-col gap-2 bg-white shadow-sm rounded-[8px] transition-all hover:border-primary border-transparent border"
					>
						<FavoriteButton
							title={favorite.title}
							url={favorite.url}
							image={favorite.imageUrl}
							isFavorited={true}
						/>
						<Image
							src={favorite.imageUrl}
							alt={favorite.title}
							height={160}
							width={160}
							className="w-full h-40 min-h-40 object-cover rounded-t-[8px]"
						/>
						<div className="p-4 pt-2 h-full flex flex-col justify-between">
							<div className="flex flex-col gap-1">
								<span className="text-[#1E71BB] font-bold text-[12px]">
									Favorited{" "}
									{formatDistanceToNow(favorite.createdAt, {
										addSuffix: true,
									})}
								</span>
								<h3 className="font-bold text-[16px] line-clamp-3">
									{favorite.title}
								</h3>
							</div>
						</div>
					</Link>
				))}
			</div>
			{favorites.length === 0 && (
				<p className="text-center text-gray-500 mt-8">
					You haven't added any favorites yet
				</p>
			)}
		</div>
	);
}
