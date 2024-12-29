import Link from "next/link";
import Image from "next/image";
import { env } from "@/lib/env";
import { LatestNewsBox } from "@/components/latest-news-box";
import { FavoriteButton } from "@/components/favorite-button";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const revalidate = 300;

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
	// This exists so we can prerender the latest news box
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

	const section = searchParams.category || "home";
	const url = `https://api.nytimes.com/svc/topstories/v2/${section === "general" ? "home" : section}.json?api-key=${env.NEW_YORK_TIMES_API_KEY}`;

	const news = await fetch(url, {
		cache: "force-cache",
		next: {
			revalidate: 300,
		},
	})
		.then((res) => res.json())
		.then((res) => res as NYTimesResponse)
		.then((res) =>
			// I want this to look cool, so I'm filtering out articles without images
			(res.results ?? []).filter((article) => article.multimedia?.length > 0),
		);

	return (
		<div className="flex flex-col gap-4 w-full animate-fade-in-up">
			<h2 className="hidden md:block font-semibold text-[18px]">
				{searchParams.query
					? `Search results for "${searchParams.query}"`
					: searchParams?.category
						? `Top ${searchParams?.category} news`
						: "Top Stories"}
			</h2>
			<div className="hidden md:grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{news.length === 0 && (
					<p className="text-center text-gray-500 mt-8">
						No news found for this category
					</p>
				)}
				{news.flatMap((article, index) => {
					const articleElement = (
						<Link
							key={article.url}
							href={article.url}
							target="_blank"
							rel="noopener noreferrer"
							className="group relative animate-fade-in-up flex flex-col gap-2 bg-white shadow-sm hover:shadow-lg rounded-[8px] transition-all hover:border-primary border-transparent border"
						>
							{user && (
								<FavoriteButton
									title={article.title}
									url={article.url}
									image={article.multimedia[0]?.url ?? ""}
									isFavorited={favoritedUrls.has(article.url)}
								/>
							)}
							<Image
								src={article.multimedia[0]?.url!}
								alt={article.title}
								height={160}
								width={160}
								className="w-full h-40 min-h-40 object-cover rounded-t-[8px]"
							/>
							<div className="p-4 pt-2 h-full flex flex-col justify-between">
								<div className="flex flex-col gap-1">
									<span className="text-[#1E71BB] font-bold text-[12px]">
										{article.section.toUpperCase()}
									</span>
									<h3 className="font-bold text-[16px] line-clamp-3">
										{article.title}
									</h3>
								</div>
								<p>{article.byline.replace("By ", "")}</p>
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
						{news.length === 0 && (
							<p className="text-center text-gray-500 mt-8">
								No news found for this category
							</p>
						)}
						{news.map((article) => (
							<Link
								key={article.url}
								href={article.url}
								target="_blank"
								rel="noopener noreferrer"
								className="group relative animate-fade-in-up flex flex-col gap-2 bg-white shadow-sm rounded-[8px] transition-all hover:border-primary border-transparent border"
							>
								{user && (
									<FavoriteButton
										title={article.title}
										url={article.url}
										image={article.multimedia[0]?.url ?? ""}
										isFavorited={favoritedUrls.has(article.url)}
									/>
								)}
								<Image
									src={article.multimedia[0]?.url!}
									alt={article.title}
									height={160}
									width={160}
									className="w-full h-40 min-h-40 object-cover rounded-t-[8px]"
								/>
								<div className="p-4 pt-2 h-full flex flex-col justify-between">
									<div className="flex flex-col gap-1">
										<span className="text-[#1E71BB] font-bold text-[12px]">
											{article.section.toUpperCase()}
										</span>
										<h3 className="font-bold text-[16px] line-clamp-3">
											{article.title}
										</h3>
									</div>
									<p>{article.byline.replace("By ", "")}</p>
								</div>
							</Link>
						))}
					</>
				)}
			</div>
		</div>
	);
}

interface NYTimesResponse {
	status: string;
	copyright: string;
	section: string;
	last_updated: string;
	num_results: number;
	results: {
		section: string;
		subsection: string;
		title: string;
		abstract: string;
		url: string;
		uri: string;
		byline: string;
		item_type: string;
		updated_date: string;
		created_date: string;
		published_date: string;
		material_type_facet: string;
		kicker: string;
		des_facet: string[];
		org_facet: string[];
		per_facet: string[];
		geo_facet: string[];
		multimedia: Array<{
			url: string;
			format: string;
			height: number;
			width: number;
			type: string;
			subtype: string;
			caption: string;
			copyright: string;
		}>;
		short_url: string;
	}[];
}
