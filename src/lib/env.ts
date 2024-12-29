import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url().min(1),
		BETTER_AUTH_SECRET: z.string().min(1),
		RESEND_API_KEY: z.string().min(1),
		NEW_YORK_TIMES_API_KEY: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_AUTH_URL: z.string().url(),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
	},
});
