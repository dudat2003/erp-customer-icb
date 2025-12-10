import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { generateContractCode } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { templateId, customerId } = await request.json();

    if (!templateId || !customerId) {
      return NextResponse.json(
        { error: "Template ID và Customer ID là bắt buộc" },
        { status: 400 }
      );
    }

    // Fetch template and customer
    const [template, customer] = await Promise.all([
      prisma.template.findUnique({ where: { id: templateId } }),
      prisma.customer.findUnique({ where: { id: customerId } }),
    ]);

    if (!template) {
      return NextResponse.json(
        { error: "Biểu mẫu không tồn tại" },
        { status: 404 }
      );
    }

    if (!customer) {
      return NextResponse.json(
        { error: "Khách hàng không tồn tại" },
        { status: 404 }
      );
    }

    // Replace placeholders in content
    let content = template.content || "";

    const placeholderMap: { [key: string]: string } = {
      "{Tên khách hàng}": customer.name || "",
      "{Mã khách hàng}": customer.customerCode || "",
      "{Mã số thuế}": customer.taxCode || "",
      "{Ngày cấp GĐKKD}": customer.businessLicenseDate || "",
      "{Người đại diện}": customer.representative || "",
      "{Chức vụ}": customer.position || "",
      "{Email}": customer.email || "",
      "{Số điện thoại}": customer.phone || "",
      "{Địa chỉ}": customer.address || "",
      "{Mã hợp đồng}": generateContractCode(customer.customerCode),
      "{Ngày tạo hợp đồng}": new Date().toLocaleDateString("vi-VN"),
    };

    // Replace all placeholders
    Object.entries(placeholderMap).forEach(([placeholder, value]) => {
      content = content.replace(new RegExp(placeholder, "g"), value);
    });

    // Convert to HTML for better formatting
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<style>
		body { font-family: 'Times New Roman', serif; line-height: 1.6; padding: 40px; }
		h1 { text-align: center; font-size: 18pt; font-weight: bold; margin-bottom: 30px; }
		p { margin: 10px 0; white-space: pre-wrap; }
	</style>
</head>
<body>
	${content
    .split("\n\n")
    .map((para) => {
      const trimmed = para.trim();
      if (!trimmed) return "";
      // Check if it's a title (all caps or starts with certain patterns)
      if (
        trimmed === trimmed.toUpperCase() &&
        trimmed.length < 100 &&
        !trimmed.includes(":")
      ) {
        return `<h1>${trimmed}</h1>`;
      }
      return `<p>${trimmed}</p>`;
    })
    .join("\n")}
</body>
</html>
		`;

    return NextResponse.json({
      success: true,
      htmlContent,
      fileName: `${template.fileName?.replace(".docx", "") || template.name}-${
        customer.customerCode
      }.docx`,
      customer: {
        id: customer.id,
        name: customer.name,
        customerCode: customer.customerCode,
      },
      template: {
        id: template.id,
        name: template.name,
      },
    });
  } catch (error) {
    console.error("Error generating document:", error);
    return NextResponse.json(
      { error: "Không thể tạo tài liệu" },
      { status: 500 }
    );
  }
}
