import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { generateContractCode } from "@/types";
import dayjs from "@/lib/dayjs";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

export async function POST(request: NextRequest) {
	try {
		const { templateId, customerId, outputFormat = "docx" } = await request.json();

		if (!templateId || !customerId) {
			return NextResponse.json(
				{ error: "Template ID và Customer ID là bắt buộc" },
				{ status: 400 },
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
				{ status: 404 },
			);
		}

		if (!customer) {
			return NextResponse.json(
				{ error: "Khách hàng không tồn tại" },
				{ status: 404 },
			);
		}

		// Check if we have original file
		if (!template.fileBase64) {
			return NextResponse.json(
				{ error: "Biểu mẫu không có file gốc. Vui lòng upload lại." },
				{ status: 400 },
			);
		}

		// Convert base64 to buffer
		const fileBuffer = Buffer.from(template.fileBase64, "base64");

		// Load the docx file using PizZip
		const zip = new PizZip(fileBuffer);

		// Create docxtemplater instance
		const doc = new Docxtemplater(zip, {
			paragraphLoop: true,
			linebreaks: true,
			delimiters: {
				start: "{",
				end: "}",
			},
		});

		// Prepare data for replacement - map Vietnamese placeholders to simple keys
		const contractCode = generateContractCode(customer.customerCode);
		const currentDate = dayjs().format("DD/MM/YYYY");

		// Data object with placeholder names (without braces)
		const data = {
			"Tên khách hàng": customer.name || "",
			"Mã khách hàng": customer.customerCode || "",
			"Mã số thuế": customer.taxCode || "",
			"Ngày cấp GĐKKD": customer.businessLicenseDate || "",
			"Người đại diện": customer.representative || "",
			"Chức vụ": customer.position || "",
			"Email": customer.email || "",
			"Số điện thoại": customer.phone || "",
			"Địa chỉ": customer.address || "",
			"Mã hợp đồng": contractCode,
			"Ngày tạo hợp đồng": currentDate,
			// Alternative formats
			"TenKhachHang": customer.name || "",
			"MaKhachHang": customer.customerCode || "",
			"MaSoThue": customer.taxCode || "",
		};

		// Render the document with data
		doc.render(data);

		// Generate output buffer
		const outputBuffer = doc.getZip().generate({
			type: "nodebuffer",
			compression: "DEFLATE",
		});

		// Generate filename
		const baseFileName = template.fileName?.replace(".docx", "") || template.name;
		const fileName = `${baseFileName}-${customer.customerCode}-${dayjs().format("YYYYMMDD")}`;

		if (outputFormat === "docx") {
			// Convert Buffer to Uint8Array for NextResponse
			const uint8Array = new Uint8Array(outputBuffer);
			return new NextResponse(uint8Array, {
				status: 200,
				headers: {
					"Content-Type":
						"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
					"Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}.docx"`,
				},
			});
		}

		// For PDF, return base64 data for client-side conversion
		// (Server-side PDF conversion requires additional setup)
		return NextResponse.json({
			success: true,
			docxBase64: outputBuffer.toString("base64"),
			fileName: `${fileName}.docx`,
			message: "Sử dụng client-side để convert sang PDF",
		});
	} catch (error) {
		console.error("Error generating document:", error);
		return NextResponse.json(
			{ error: `Không thể tạo tài liệu: ${error instanceof Error ? error.message : "Unknown error"}` },
			{ status: 500 },
		);
	}
}
