import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { Prisma, type PrismaClient } from "@prisma/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.template.findUnique({ where: { id } });

    if (!template) {
      return NextResponse.json(
        { error: "Biểu mẫu không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.template.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Biểu mẫu không tồn tại" },
        { status: 404 }
      );
    }

    // Check duplicate name if name is being changed
    if (body.name && body.name !== existing.name) {
      const duplicate = await prisma.template.findFirst({
        where: { name: body.name, NOT: { id } },
        select: { id: true },
      });
      if (duplicate) {
        return NextResponse.json(
          { error: "Tên biểu mẫu đã tồn tại" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.template.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        description: body.description ?? undefined,
        fileName: body.fileName ?? undefined,
        content: body.content ?? undefined,
        placeholders: body.placeholders ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Biểu mẫu không tồn tại" },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.template.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Biểu mẫu không tồn tại" },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
