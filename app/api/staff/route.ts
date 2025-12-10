import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import type { Prisma } from "@prisma/client";

// GET /api/staff
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const where: Prisma.StaffWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { role: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        role ? { role: { contains: role, mode: "insensitive" } } : {},
      ],
    };

    const [total, data] = await Promise.all([
      prisma.staff.count({ where }),
      prisma.staff.findMany({
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
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

// POST /api/staff
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const duplicate = await prisma.staff.findFirst({
      where: { email: body.email },
      select: { id: true },
    });
    if (duplicate) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const created = await prisma.staff.create({
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create staff" },
      { status: 500 }
    );
  }
}
