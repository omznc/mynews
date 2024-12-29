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
import { redirect, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
	const [token, _] = useQueryState("token");
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const router = useRouter();

	if (!token) {
		redirect("/login");
	}

	return (
		<>
			<CardHeader>
				<CardTitle className="text-2xl">Reset Password</CardTitle>
				<CardDescription>
					Enter your new password to access your account.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={async (e) => {
						e.preventDefault();

						const formData = new FormData(e.currentTarget);

						const password = formData.get("password") as string;
						const confirmPassword = formData.get("confirmPassword") as string;

						if (password !== confirmPassword) {
							toast.error("Passwords do not match.");
							return;
						}

						if (password.length < 8) {
							toast.error("Password must be at least 8 characters.");
							return;
						}

						await authClient.resetPassword(
							{
								newPassword: password,
							},
							{
								onRequest: () => {
									setIsLoading(true);
								},
								onResponse: () => {
									setIsLoading(false);
								},
								onSuccess: () => {
									toast.success("Password reset successful, please sign in.");
									router.push("/login");
								},
								onError: (ctx) => {
									if (ctx.error.status === 403) {
										toast.error("Error resetting password. Please try again.");
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
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							name="password"
							required={true}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="confirmPassword">Confirm Password</Label>
						<Input
							id="confirmPassword"
							type="password"
							name="confirmPassword"
							required={true}
						/>
					</div>
					{isError && (
						<p className="text-red-500 -mb-2">
							There seems to be a problem, try again later
						</p>
					)}
					<LoaderSubmitButton isLoading={isLoading} className="w-full">
						Confirm
					</LoaderSubmitButton>
				</form>
				<div className="mt-4 text-center text-sm">
					{"Don't have an account? "}
					<Link href="/register" className="underline">
						Register
					</Link>
				</div>
			</CardContent>
		</>
	);
}
