import Link from "next/link";
import Image from "next/image";
import { env } from "@/lib/env";
import { LatestNewsBox } from "@/components/latest-news-box";
import { FavoriteButton } from "@/components/favorite-button";
import { authClient } from "@/lib/auth-client";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface PageProps {
	searchParams: Promise<{
		category?: string;
		query?: string;
		type?: string;
	}>;
}

export default async function Page(props: PageProps) {
	const user = await isAuthenticated();
	const searchParams = await props.searchParams;

	// Fetch initial latest news data
	const latestNews = await fetch(
		`${env.NEXT_PUBLIC_AUTH_URL}/api/latest-news?offset=0&limit=20`,
	)
		.then((res) => res.json())
		.then((data) => data?.results ?? []);

	const favorites = user
		? await prisma.favorite.findMany({
				where: { userId: user.id },
				select: { url: true },
			})
		: [];
	const favoritedUrls = new Set(favorites.map((f) => f.url));

	const url = new URL("https://newsapi.org/v2/top-headlines");

	if (searchParams.query) {
		// Switch to "everything" endpoint for search queries
		url.href = "https://newsapi.org/v2/everything";
		url.searchParams.set("q", searchParams.query);
		url.searchParams.set("sortBy", "publishedAt");
	} else {
		// Use top-headlines for category/default view
		url.searchParams.set("country", "us");
		if (searchParams.category) {
			url.searchParams.set("category", searchParams.category);
		}
	}

	url.searchParams.set("apiKey", env.NEWS_API_ORG_API_KEY);

	const news = await fetch(url.toString())
		.then((res) => res.json())
		.then((res) => res as NewsAPIResponse)
		.then((res) => res.articles.filter((article) => article.urlToImage));

	return (
		<div className="flex flex-col gap-4 w-full animate-fade-in-up">
			<h2 className="hidden md:block font-semibold text-[18px]">
				{searchParams.query
					? `Search results for "${searchParams.query}"`
					: searchParams?.category
						? `Top ${searchParams?.category} news`
						: "News"}
			</h2>
			<div className="hidden md:grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{news.flatMap((article, index) => {
					const articleElement = (
						<Link
							key={article.url}
							href={article.url}
							target="_blank"
							rel="noopener noreferrer"
							className="relative animate-fade-in-up flex flex-col gap-2 bg-white shadow-sm rounded-[8px] transition-all hover:border-primary border-transparent border"
						>
							{user && (
								<FavoriteButton
									article={article}
									isFavorited={favoritedUrls.has(article.url)}
								/>
							)}
							<Image
								src={article.urlToImage}
								alt={article.title}
								height={160}
								width={160}
								className="w-full h-40 min-h-40 object-cover rounded-t-[8px]"
							/>
							<div className="p-4 pt-2 h-full flex flex-col justify-between">
								<div className="flex flex-col gap-1">
									<span className="text-[#1E71BB] font-bold text-[12px]">
										CATEGORY
									</span>
									<h3 className="font-bold text-[16px] line-clamp-3">
										{article.title}
									</h3>
								</div>
								<p>{article.author}</p>
							</div>
						</Link>
					);

					if (index === 1 && !searchParams?.category && !searchParams?.query) {
						return [
							articleElement,
							<LatestNewsBox key="featured" initialNews={latestNews} />,
						];
					}

					return [articleElement];
				})}
			</div>
			<div className="md:hidden flex flex-col w-full gap-4">
				{searchParams?.type === "latest" ? (
					<LatestNewsBox key="featured" initialNews={latestNews} />
				) : (
					<>
						{news.map((article) => (
							<Link
								key={article.url}
								href={article.url}
								target="_blank"
								rel="noopener noreferrer"
								className="relative animate-fade-in-up flex flex-col gap-2 bg-white shadow-sm rounded-[8px] transition-all hover:border-primary border-transparent border"
							>
								{user && (
									<FavoriteButton
										article={article}
										isFavorited={favoritedUrls.has(article.url)}
									/>
								)}
								<Image
									src={article.urlToImage}
									alt={article.title}
									height={160}
									width={160}
									className="w-full h-40 min-h-40 object-cover rounded-t-[8px]"
								/>
								<div className="p-4 pt-2 h-full flex flex-col justify-between">
									<div className="flex flex-col gap-1">
										<span className="text-[#1E71BB] font-bold text-[12px]">
											CATEGORY
										</span>
										<h3 className="font-bold text-[16px] line-clamp-3">
											{article.title}
										</h3>
									</div>
									<p>{article.author}</p>
								</div>
							</Link>
						))}
					</>
				)}
			</div>
		</div>
	);
}
interface NewsAPIResponse {
	status: string;
	totalResults: number;
	articles: {
		source: {
			id: string | null;
			name: string;
		};
		author: string;
		title: string;
		description: string;
		url: string;
		urlToImage: string;
		publishedAt: string;
		content: string;
	}[];
}
