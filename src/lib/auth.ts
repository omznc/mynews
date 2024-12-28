import { sendEmailVerificationAction } from "@/app/(auth)/_actions/send-email-verification.action";
import PasswordReset from "@/emails/password-reset";
import { DEFAULT_FROM, resend } from "@/lib/resend";
import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { headers } from "next/headers";
import { cache } from "react";

const prisma = new PrismaClient();

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			await resend.emails.send({
				from: DEFAULT_FROM,
				to: user.email,
				subject: "Reset your password",
				react: PasswordReset({
					userName: user.name,
					resetUrl: url,
				}),
			});
		},
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			await sendEmailVerificationAction({
				to: user.email,
				name: user.name,
				inviteLink: url,
			});
		},
		sendOnSignUp: true,
	},
});

export const isAuthenticated = cache(async () => {
	const allHeaders = await headers();

	const session = await auth.api.getSession({
		headers: allHeaders,
	});

	if (!session?.user.id) {
		return null;
	}

	return session.user;
});
