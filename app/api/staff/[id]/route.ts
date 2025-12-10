import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const staff = await prisma.staff.findUnique({ where: { id } });
		if (!staff) {
			return NextResponse.json({ error: "Staff not found" }, { status: 404 });
		}
		return NextResponse.json(staff);
	} catch {
		return NextResponse.json({ error: "Failed" }, { status: 500 });
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await request.json();
		const updated = await prisma.staff.update({
			where: { id },
			data: {
				name: body.name ?? undefined,
				email: body.email ?? undefined,
				role: body.role ?? undefined,
			},
		});
		return NextResponse.json(updated);
	} catch (e) {
		if (
			e instanceof Prisma.PrismaClientKnownRequestError &&
			e.code === "P2025"
		) {
			return NextResponse.json({ error: "Staff not found" }, { status: 404 });
		}
		return NextResponse.json({ error: "Failed" }, { status: 500 });
	}
}

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		await prisma.staff.delete({ where: { id } });
		return NextResponse.json({ success: true });
	} catch (e) {
		if (
			e instanceof Prisma.PrismaClientKnownRequestError &&
			e.code === "P2025"
		) {
			return NextResponse.json({ error: "Staff not found" }, { status: 404 });
		}
		return NextResponse.json({ error: "Failed" }, { status: 500 });
	}
}
