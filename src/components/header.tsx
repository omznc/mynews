"use client";

import { CategoryButtons } from "@/components/category-buttons";
import { useQueryState } from "nuqs";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { User } from "better-auth";
import {
	Search,
	UserIcon,
	LogOut,
	LogIn,
	X,
	Star,
	AlignJustify,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface HeaderProps {
	user: User | null;
}

export function Header(props: HeaderProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useQueryState("query", {
		shallow: false,
		clearOnDefault: true,
		defaultValue: "",
	});
	const [category, setCategory] = useQueryState("category", {
		shallow: false,
		clearOnDefault: true,
		defaultValue: "",
	});
	const [type, setType] = useQueryState("type", {
		shallow: false,
		clearOnDefault: true,
		defaultValue: "featured",
	});
	const pathname = usePathname();
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState(query || "");

	const { user } = props;

	useEffect(() => {
		setOpen(false);
		setSearchTerm("");
	}, [category, pathname]);

	useEffect(() => {
		setSearchTerm(query || "");
	}, [query]);

	const handleSearch = (e: FormEvent) => {
		e.preventDefault();
		const trimmedTerm = searchTerm.trim();
		if (!trimmedTerm) {
			return;
		}

		if (pathname !== "/") {
			router.push(`/?query=${encodeURIComponent(trimmedTerm)}`);
			return;
		}
		setOpen(false);
		setCategory("");
		setQuery(trimmedTerm);
	};

	return (
		<header className="flex flex-col md:flex-row gap-12 items-start md:items-center py-10 pb-6 md:pb-0 w-full">
			<div className="flex items-center md:w-fit w-full justify-between gap-4 px-2">
				<Link href="/">
					<svg
						width="137"
						height="31"
						viewBox="0 0 137 31"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="flex-shrink-0"
					>
						<title>MyNews Logo</title>
						<path
							d="M0.5 0.727272V24H6.68182V10.4545H6.86364L12.0455 23.8182H15.7727L20.9545 10.5455H21.1364V24H27.3182V0.727272H19.4545L14.0455 13.9091H13.7727L8.36364 0.727272H0.5ZM34.2216 30.5455C38.608 30.5455 40.6648 28.3409 41.6307 25.4545L47.9943 6.54545H41.4034L38.5398 18.6364H38.358L35.5398 6.54545H28.9943L35.1307 24.7727L34.9943 25.0909C34.5739 26.0568 33.358 26.0227 31.8125 25.4773L30.4489 29.9318C31.4261 30.3182 32.7784 30.5455 34.2216 30.5455Z"
							fill="#BB1E1E"
						/>
						<path
							d="M69.8239 0.727272H63.5057V12.9091H63.3239L55.0511 0.727272H49.6875V24H56.0057V11.7727H56.142L64.5511 24H69.8239V0.727272ZM81.267 24.3182C86.108 24.3182 89.2216 22 89.8125 18.3636H84.0852C83.7216 19.3523 82.6875 19.9091 81.4034 19.9091C79.5398 19.9091 78.4489 18.6818 78.4489 17V16.7273H89.8125V15.2727C89.8125 9.71591 86.4034 6.31818 81.1307 6.31818C75.7216 6.31818 72.267 9.90909 72.267 15.3182C72.267 20.9659 75.6761 24.3182 81.267 24.3182ZM78.4489 13.2727C78.483 11.7614 79.733 10.7273 81.267 10.7273C82.8239 10.7273 84.0057 11.7727 84.0398 13.2727H78.4489ZM95.2443 24H102.017L104.472 14.6364H104.653L107.108 24H113.881L118.244 6.54545H111.972L110.062 17.0909H109.926L107.608 6.54545H101.517L99.2898 17.1818H99.1534L97.1534 6.54545H90.8807L95.2443 24ZM136.108 12.2273C135.949 8.53409 132.881 6.31818 127.835 6.31818C122.847 6.31818 119.767 8.36364 119.79 12C119.767 14.75 121.551 16.5114 125.108 17.1364L128.199 17.6818C129.562 17.9318 130.176 18.2955 130.199 18.9545C130.176 19.6818 129.347 20.0909 128.199 20.0909C126.778 20.0909 125.778 19.4773 125.608 18.3636H119.381C119.722 21.9432 122.812 24.3182 128.153 24.3182C132.983 24.3182 136.54 21.9659 136.562 18.2273C136.54 15.6477 134.812 14.1477 131.244 13.5L127.699 12.8636C126.369 12.625 125.994 12.1477 126.017 11.6364C125.994 10.9091 126.892 10.5 127.972 10.5C129.21 10.5 130.244 11.1591 130.335 12.2273H136.108Z"
							fill="#1D1D1B"
						/>
					</svg>
				</Link>
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<AlignJustify className="md:hidden" />
					</SheetTrigger>
					<SheetContent className="min-w-full">
						<SheetHeader>
							<Link
								href="/"
								className="h-[150px] w-full flex items-center justify-center"
							>
								<svg
									width="137"
									height="31"
									viewBox="0 0 137 31"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="flex-shrink-0 scale-125"
								>
									<title>MyNews Logo</title>
									<path
										d="M0.5 0.727272V24H6.68182V10.4545H6.86364L12.0455 23.8182H15.7727L20.9545 10.5455H21.1364V24H27.3182V0.727272H19.4545L14.0455 13.9091H13.7727L8.36364 0.727272H0.5ZM34.2216 30.5455C38.608 30.5455 40.6648 28.3409 41.6307 25.4545L47.9943 6.54545H41.4034L38.5398 18.6364H38.358L35.5398 6.54545H28.9943L35.1307 24.7727L34.9943 25.0909C34.5739 26.0568 33.358 26.0227 31.8125 25.4773L30.4489 29.9318C31.4261 30.3182 32.7784 30.5455 34.2216 30.5455Z"
										fill="#BB1E1E"
									/>
									<path
										d="M69.8239 0.727272H63.5057V12.9091H63.3239L55.0511 0.727272H49.6875V24H56.0057V11.7727H56.142L64.5511 24H69.8239V0.727272ZM81.267 24.3182C86.108 24.3182 89.2216 22 89.8125 18.3636H84.0852C83.7216 19.3523 82.6875 19.9091 81.4034 19.9091C79.5398 19.9091 78.4489 18.6818 78.4489 17V16.7273H89.8125V15.2727C89.8125 9.71591 86.4034 6.31818 81.1307 6.31818C75.7216 6.31818 72.267 9.90909 72.267 15.3182C72.267 20.9659 75.6761 24.3182 81.267 24.3182ZM78.4489 13.2727C78.483 11.7614 79.733 10.7273 81.267 10.7273C82.8239 10.7273 84.0057 11.7727 84.0398 13.2727H78.4489ZM95.2443 24H102.017L104.472 14.6364H104.653L107.108 24H113.881L118.244 6.54545H111.972L110.062 17.0909H109.926L107.608 6.54545H101.517L99.2898 17.1818H99.1534L97.1534 6.54545H90.8807L95.2443 24ZM136.108 12.2273C135.949 8.53409 132.881 6.31818 127.835 6.31818C122.847 6.31818 119.767 8.36364 119.79 12C119.767 14.75 121.551 16.5114 125.108 17.1364L128.199 17.6818C129.562 17.9318 130.176 18.2955 130.199 18.9545C130.176 19.6818 129.347 20.0909 128.199 20.0909C126.778 20.0909 125.778 19.4773 125.608 18.3636H119.381C119.722 21.9432 122.812 24.3182 128.153 24.3182C132.983 24.3182 136.54 21.9659 136.562 18.2273C136.54 15.6477 134.812 14.1477 131.244 13.5L127.699 12.8636C126.369 12.625 125.994 12.1477 126.017 11.6364C125.994 10.9091 126.892 10.5 127.972 10.5C129.21 10.5 130.244 11.1591 130.335 12.2273H136.108Z"
										fill="#1D1D1B"
									/>
								</svg>
							</Link>
							<form onSubmit={handleSearch} className="relative w-full">
								<Search className="absolute top-1/2 left-3 transform opacity-40 -translate-y-1/2" />
								<Input
									key={query}
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									placeholder="Search news"
									className="h-12 rounded-lg border-none bg-white placeholder-opacity-40 pl-12"
								/>
								{query && (
									<X
										onClick={() => {
											setQuery("");
										}}
										className="absolute cursor-pointer animate-fade-in-up font-bold right-2 md:right-24 top-2 m-1 rounded-md"
									/>
								)}
							</form>
						</SheetHeader>

						<SheetHeader>
							{/* This is required for accessibility */}
							<SheetTitle className="hidden">Categories</SheetTitle>
						</SheetHeader>

						<div className="flex items-center justify-center mt-6">
							<CategoryButtons className="p-4" />
						</div>
						<div className="flex flex-col gap-4 items-center justify-center">
							{user ? (
								<button
									type="button"
									onClick={async () => {
										const resp = await authClient.signOut();
										if (!resp.error) {
											router.refresh();
										}
									}}
									className="transition-all py-4 px-4 group flex flex-row md:flex-col items-center md:justify-center rounded-md p-2 md:p-0 md:h-[75px] w-full md:w-[75px] gap-2 md:gap-1 bg-white"
								>
									<LogOut className="size-6" />
									<h4 className="transition-all font-semibold text-sm md:text-xs">
										Log out
									</h4>
								</button>
							) : (
								<Link
									href={"/login"}
									className="transition-all py-4 px-4 group flex flex-row md:flex-col items-center md:justify-center rounded-md p-2 md:p-0 md:h-[75px] w-full md:w-[75px] gap-2 md:gap-1 bg-white"
								>
									<LogIn className="size-6" />
									<h4 className="transition-all font-semibold text-sm md:text-xs">
										Log in
									</h4>
								</Link>
							)}
						</div>
					</SheetContent>
				</Sheet>
			</div>
			<form onSubmit={handleSearch} className="relative w-full max-w-[725px]">
				<Search className="absolute top-1/2 left-3 transform opacity-40 -translate-y-1/2" />
				<Input
					key={query}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Search news"
					className="h-12 rounded-lg border-none bg-white placeholder-opacity-40 pl-12"
				/>
				{searchTerm && (
					<X
						onClick={() => {
							setQuery("");
							setSearchTerm("");
						}}
						className="absolute cursor-pointer animate-fade-in-up font-bold right-24 top-2 m-1 rounded-md"
					/>
				)}
				<Button
					type="submit"
					className="absolute font-bold right-0 top-0 m-1 rounded-md"
				>
					SEARCH
				</Button>
			</form>
			<DropdownMenu>
				<DropdownMenuTrigger className="hidden md:flex justify-center hover:bg-neutral-200 transition-all items-center gap-4 bg-white border aspect-square h-12 rounded-md">
					<UserIcon className="w-6 h-6" />
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount={true}>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							{user ? (
								<>
									<p className="text-sm font-medium leading-none">
										{user?.name}
									</p>
									<p className="text-xs leading-none text-muted-foreground">
										{user?.email}
									</p>
								</>
							) : (
								<>
									<h4 className="text-sm font-medium leading-none">
										Join MyNews
									</h4>
									<p className="text-xs leading-none text-muted-foreground">
										Sign in to get personalized news, bookmarks, and more!
									</p>
								</>
							)}
						</div>
					</DropdownMenuLabel>
					{user && (
						<DropdownMenuItem asChild={true}>
							<Link href="/favorites" className="cursor-pointer">
								<Star className="w-4 h-4 mr-2" />
								Favorites
							</Link>
						</DropdownMenuItem>
					)}
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild={true}>
						{user ? (
							<button
								type="button"
								onClick={() => {
									authClient.signOut();
								}}
								className="w-full text-left inline-flex items-center gap-2"
							>
								<LogOut className="w-4 h-4 mr-2" />
								Log out
							</button>
						) : (
							<Link href="/login" className="cursor-pointer">
								<LogIn className="w-4 h-4 mr-2" />
								Log in
							</Link>
						)}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{pathname === "/" && (
				<div className="md:hidden flex items-center w-full justify-center gap-2">
					<button
						type="button"
						data-active={type === "featured"}
						onClick={() => setType("featured")}
						className="data-[active=true]:bg-[#BB1E1E1A]/10 data-[active=true]:text-primary font-semibold rounded-full py-2 px-4 flex items-center justify-center"
					>
						Featured
					</button>
					<button
						type="button"
						data-active={type === "latest"}
						onClick={() => setType("latest")}
						className="data-[active=true]:bg-[#BB1E1E1A]/10 data-[active=true]:text-primary font-semibold rounded-full py-2 px-4 flex items-center justify-center"
					>
						Latest
					</button>
				</div>
			)}
		</header>
	);
}
