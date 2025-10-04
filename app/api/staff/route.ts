import { NextResponse } from "next/server";
import { Staff } from "@/types";

// Mock staff data
const MOCK_STAFF: Staff[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "an.nguyen@icb.com",
    role: "Trưởng phòng",
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    email: "binh.tran@icb.com",
    role: "Chuyên viên",
  },
  {
    id: "3",
    name: "Lê Minh Châu",
    email: "chau.le@icb.com",
    role: "Chuyên viên",
  },
  {
    id: "4",
    name: "Phạm Thị Dung",
    email: "dung.pham@icb.com",
    role: "Nhân viên",
  },
];

// GET /api/staff
export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    return NextResponse.json(MOCK_STAFF);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}
