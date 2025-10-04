import { NextRequest, NextResponse } from "next/server";
import HTMLtoDOCX from "html-to-docx";

export async function POST(request: NextRequest) {
  try {
    const { htmlContent, fileName } = await request.json();

    if (!htmlContent || !fileName) {
      return NextResponse.json(
        { error: "HTML content and fileName are required" },
        { status: 400 }
      );
    }

    // convert html to doc
    const docxBuffer = await HTMLtoDOCX(htmlContent, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });

    // return docx file
    return new NextResponse(docxBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return NextResponse.json(
      { error: "Failed to generate DOCX file" },
      { status: 500 }
    );
  }
}
