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
import { Button } from "@components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryState } from "nuqs";

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const router = useRouter();

	const [redirectTo] = useQueryState("redirectTo");
	const [message, setMessage] = useQueryState("message");

	useEffect(() => {
		if (message) {
			toast.info(decodeURIComponent(message));
			setMessage(null, { shallow: true });
		}
	}, [message, setMessage]);

	const handleSuccessfulLogin = () => {
		const inviteUrl = document.cookie
			.split("; ")
			.find((row) => row.startsWith("inviteUrl="))
			?.split("=")[1];

		if (inviteUrl) {
			document.cookie = "inviteUrl=; max-age=0; path=/";
			window.location.href = decodeURIComponent(inviteUrl);
			return;
		}

		router.push(redirectTo ? redirectTo : "/");
	};

	return (
		<>
			<CardHeader>
				<CardTitle className="text-2xl">Sign In</CardTitle>
				<CardDescription>
					Enter your email and password to access your account.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={async (e) => {
						e.preventDefault();

						const formData = new FormData(e.currentTarget);

						const email = formData.get("email") as string;
						const password = formData.get("password") as string;

						await authClient.signIn.email(
							{
								email,
								password,
							},
							{
								onRequest: () => {
									setIsLoading(true);
								},
								onResponse: () => {
									setIsLoading(false);
								},
								onSuccess: handleSuccessfulLogin,
								onError: (ctx) => {
									if (ctx.error.status === 403) {
										toast.error(
											"Your account is not verified. Please check your email.",
										);
									} else {
										setIsError(true);
									}
								},
							},
						);
					}}
					className="grid gap-4"
				>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							name="email"
							placeholder="mail@example.com"
							suppressHydrationWarning
							required={true}
						/>
					</div>
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
							<Button
								type="button"
								onClick={async () => {
									setIsForgotPasswordLoading(true);
									const emailInput = document.getElementById(
										"email",
									) as HTMLInputElement;
									if (!emailInput?.value || emailInput?.value === "") {
										toast.error("Enter your email to reset your password.");
										setIsForgotPasswordLoading(false);
										return;
									}
									if (!emailInput?.checkValidity()) {
										toast.error("Enter a valid email.");
										setIsForgotPasswordLoading(false);

										return;
									}

									await authClient.forgetPassword({
										email: emailInput.value,
										redirectTo: "/reset-password",
									});
									toast.success(
										"If you have an account, we will send you an email to reset your password.",
									);
									setIsForgotPasswordLoading(false);
								}}
								variant="ghost"
								className="ml-auto inline-block text-sm underline"
								disabled={isForgotPasswordLoading || isLoading}
							>
								{isForgotPasswordLoading
									? "Just a moment..."
									: "Forgot password?"}
							</Button>
						</div>
						<Input
							id="password"
							type="password"
							name="password"
							required={true}
						/>
					</div>
					{isError && <p className="text-red-500 -mb-2">Invalid credentials</p>}
					<LoaderSubmitButton isLoading={isLoading} className="w-full">
						Sign In
					</LoaderSubmitButton>
				</form>
				<div className="mt-4 text-center text-sm">
					{"Don't have an account? "}
					<Link
						href={
							redirectTo
								? `/register?redirectTo=${encodeURIComponent(redirectTo)}`
								: "/register"
						}
						className="underline"
					>
						Register
					</Link>
				</div>
			</CardContent>
		</>
	);
}
