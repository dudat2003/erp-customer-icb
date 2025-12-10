import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

// GET /api/customers/[id]
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const customer = await prisma.customer.findUnique({ where: { id } });

		if (!customer) {
			return NextResponse.json(
				{ error: "Customer not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(customer);
	} catch {
		return NextResponse.json(
			{ error: "Failed to fetch customer" },
			{ status: 500 },
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await request.json();
		const existingCustomer = await prisma.customer.findUnique({
			where: { id },
		});

		if (!existingCustomer) {
			return NextResponse.json(
				{ error: "Customer not found" },
				{ status: 404 },
			);
		}

		if (body.customerCode) {
			const duplicate = await prisma.customer.findFirst({
				where: { customerCode: body.customerCode, NOT: { id } },
				select: { id: true },
			});
			if (duplicate) {
				return NextResponse.json(
					{ error: "Customer code already exists" },
					{ status: 400 },
				);
			}
		}

		const updated = await prisma.customer.update({
			where: { id },
			data: {
				customerCode: body.customerCode ?? undefined,
				name: body.name ?? undefined,
				taxCode: body.taxCode ?? undefined,
				businessLicenseDate: body.businessLicenseDate ?? undefined,
				representative: body.representative ?? undefined,
				position: body.position ?? undefined,
				email: body.email ?? undefined,
				phone: body.phone ?? undefined,
				address: body.address ?? undefined,
				category: body.category ?? undefined,
				assignedTo: body.assignedTo ?? undefined,
			},
		});
		return NextResponse.json(updated);
	} catch {
		return NextResponse.json(
			{ error: "Failed to update customer" },
			{ status: 500 },
		);
	}
}

// DELETE /api/customers/[id]
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		await prisma.customer.delete({ where: { id } });
		return NextResponse.json({ success: true });
	} catch (e) {
		if (
			e instanceof Prisma.PrismaClientKnownRequestError &&
			e.code === "P2025"
		) {
			return NextResponse.json(
				{ error: "Customer not found" },
				{ status: 404 },
			);
		}
		return NextResponse.json(
			{ error: "Failed to delete customer" },
			{ status: 500 },
		);
	}
}
