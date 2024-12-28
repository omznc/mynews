import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	try {
		const user = await isAuthenticated();
		if (!user) {
			return new Response("Unauthorized", { status: 401 });
		}

		const { title, url, imageUrl } = await req.json();

		await prisma.favorite.create({
			data: {
				title,
				url,
				imageUrl,
				userId: user.id,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		return new Response("Error", { status: 500 });
	}
}

export async function DELETE(req: Request) {
	try {
		const user = await isAuthenticated();
		if (!user) {
			return new Response("Unauthorized", { status: 401 });
		}

		const { url } = await req.json();

		await prisma.favorite.delete({
			where: {
				userId_url: {
					userId: user.id,
					url,
				},
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		return new Response("Error", { status: 500 });
	}
}
