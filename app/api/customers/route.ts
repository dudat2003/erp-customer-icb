import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import type { Prisma } from "@prisma/client";

// GET /api/customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const where: Prisma.CustomerWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                {
                  customerCode: { contains: search, mode: "insensitive" },
                },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        category ? { category } : {},
      ],
    };

    const [total, data] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const response = {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// POST /api/customers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const duplicate = await prisma.customer.findFirst({
      where: { customerCode: body.customerCode },
      select: { id: true },
    });
    if (duplicate) {
      return NextResponse.json(
        { error: "Customer code already exists" },
        { status: 400 }
      );
    }

    const created = await prisma.customer.create({
      data: {
        customerCode: body.customerCode,
        name: body.name,
        taxCode: body.taxCode,
        businessLicenseDate: body.businessLicenseDate,
        representative: body.representative,
        position: body.position,
        email: body.email,
        phone: body.phone,
        address: body.address,
        category: body.category,
        assignedTo: body.assignedTo,
        createdBy: "System",
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}

// PUT should be handled in /api/customers/[id]
