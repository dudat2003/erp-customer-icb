import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import type { PrismaClient } from "@prisma/client";

// GET /api/templates
export async function GET() {
	try {
		const templates = await prisma.template.findMany({
			orderBy: { createdAt: "desc" },
		});
		return NextResponse.json({ data: templates, total: templates.length });
	} catch {
		return NextResponse.json(
			{ error: "Failed to fetch templates" },
			{ status: 500 },
		);
	}
}

// POST /api/templates
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const duplicate = await prisma.template.findFirst({
			where: { name: body.name },
			select: { id: true },
		});
		if (duplicate) {
			return NextResponse.json(
				{ error: "Template name already exists" },
				{ status: 400 },
			);
		}

		const created = await prisma.template.create({
			data: {
				name: body.name,
				fileName: body.fileName,
				content: body.content,
				placeholders: body.placeholders ?? [],
			},
		});

		return NextResponse.json(created, { status: 201 });
	} catch {
		return NextResponse.json(
			{ error: "Failed to create template" },
			{ status: 500 },
		);
	}
}
