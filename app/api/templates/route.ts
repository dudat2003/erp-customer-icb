import { NextRequest, NextResponse } from "next/server";
import { Template, CreateTemplateRequest } from "@/types";
import { mockData } from "@/lib/mock-data";

// GET /api/templates
export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const templates = mockData.getTemplates();
    return NextResponse.json(templates);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// POST /api/templates
export async function POST(request: NextRequest) {
  try {
    const body: CreateTemplateRequest = await request.json();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const templates = mockData.getTemplates();

    // Check if template name already exists
    const existingTemplate = templates.find(
      (t: Template) => t.name === body.name
    );
    if (existingTemplate) {
      return NextResponse.json(
        { error: "Template name already exists" },
        { status: 400 }
      );
    }

    const newTemplate: Template = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockData.addTemplate(newTemplate);

    return NextResponse.json(newTemplate, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
