"use client";
import { LoaderSubmitButton } from "@/components/loader-submit-button";
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const router = useRouter();

	return (
		<>
			<CardHeader>
				<CardTitle className="text-2xl">Register</CardTitle>
				<CardDescription>
					Enter your email and password to create an account.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={async (e) => {
						e.preventDefault();

						const formData = new FormData(e.currentTarget);
						const email = formData.get("email") as string;
						const password = formData.get("password") as string;
						const name = formData.get("name") as string;

						if (password.length < 8) {
							toast.error("Password must be at least 8 characters.");
							return;
						}

						const success = await authClient.signUp.email(
							{
								email,
								password,
								name,
							},
							{
								onRequest: () => {
									setIsLoading(true);
								},
								onResponse: () => {
									setIsLoading(false);
								},
								onError: () => {
									setIsError(true);
								},
							},
						);

						if (success.error) {
							return;
						}

						toast.success(
							"Registration successful! Please check your email to verify your account.",
						);

						router.push("/login");
					}}
					className="grid gap-4"
				>
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							type="text"
							name="name"
							id="name"
							placeholder="Name"
							autoComplete="name"
							required={true}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							type="email"
							name="email"
							id="email"
							placeholder="Email"
							autoComplete="email"
							required={true}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							type="password"
							name="password"
							id="password"
							placeholder="Password"
							autoComplete="current-password"
							required={true}
						/>
					</div>

					{isError && (
						<p className="text-red-500 -mb-2">
							Invalid data or user already exists
						</p>
					)}
					<LoaderSubmitButton isLoading={isLoading} className="w-full">
						Register
					</LoaderSubmitButton>
				</form>
				<div className="mt-4 text-center text-sm">
					{"Already have an account? "}
					<Link
						suppressHydrationWarning={true}
						href="/login"
						className="underline"
					>
						Sign in
					</Link>
				</div>
			</CardContent>
		</>
	);
}
