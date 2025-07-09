import { NextRequest, NextResponse } from "next/server";
import { mockData } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = mockData.templates.find((t) => t.id === id);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const templateIndex = mockData.templates.findIndex((t) => t.id === id);

    if (templateIndex === -1) {
      return NextResponse.json(
        { error: "Biểu mẫu không tồn tại" },
        { status: 404 }
      );
    }

    mockData.templates.splice(templateIndex, 1);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
