import { prisma } from "../lib/prisma/client";

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("🗑️  Clearing existing data...");
  await prisma.customer.deleteMany();
  await prisma.template.deleteMany();
  await prisma.staff.deleteMany();

  // Seed Staff
  console.log("👥 Seeding staff...");
  const staff = await prisma.staff.createMany({
    data: [
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
    ],
  });
  console.log(`✅ Created ${staff.count} staff members`);

  // Seed Customers
  console.log("🏢 Seeding customers...");
  const customers = await prisma.customer.createMany({
    data: [
      {
        id: "1",
        customerCode: "KH001",
        name: "Công ty TNHH ABC",
        taxCode: "0123456789",
        businessLicenseDate: "2020-01-15",
        representative: "Nguyễn Văn A",
        position: "Giám đốc",
        email: "contact@abc.com",
        phone: "0912345678",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        category: "closed",
        assignedTo: "1",
        createdBy: "System",
      },
      {
        id: "2",
        customerCode: "KH002",
        name: "Công ty Cổ phần XYZ",
        taxCode: "0987654321",
        businessLicenseDate: "2019-05-20",
        representative: "Trần Thị B",
        position: "Chủ tịch HĐQT",
        email: "info@xyz.com",
        phone: "0923456789",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
        category: "potential",
        assignedTo: "2",
        createdBy: "System",
      },
      {
        id: "3",
        customerCode: "KH003",
        name: "Doanh nghiệp tư nhân DEF",
        taxCode: "0456789123",
        businessLicenseDate: "2021-03-10",
        representative: "Lê Văn C",
        position: "Chủ doanh nghiệp",
        email: "owner@def.com",
        phone: "0934567890",
        address: "789 Đường DEF, Quận 3, TP.HCM",
        category: "regular",
        assignedTo: "3",
        createdBy: "System",
      },
      {
        id: "4",
        customerCode: "KH004",
        name: "Công ty TNHH MTV GHI",
        taxCode: "0789123456",
        businessLicenseDate: "2018-11-25",
        representative: "Phạm Thị D",
        position: "Giám đốc",
        email: "director@ghi.com",
        phone: "0945678901",
        address: "321 Đường GHI, Quận 4, TP.HCM",
        category: "promising",
        assignedTo: "4",
        createdBy: "System",
      },
      {
        id: "5",
        customerCode: "KH005",
        name: "Tập đoàn JKL",
        taxCode: "0654321987",
        businessLicenseDate: "2017-07-30",
        representative: "Hoàng Văn E",
        position: "Tổng giám đốc",
        email: "ceo@jkl.com",
        phone: "0956789012",
        address: "654 Đường JKL, Quận 5, TP.HCM",
        category: "closed",
        assignedTo: "1",
        createdBy: "System",
      },
    ],
  });
  console.log(`✅ Created ${customers.count} customers`);

  // Seed Templates
  console.log("📄 Seeding templates...");
  const templates = await prisma.template.createMany({
    data: [
      {
        id: "1",
        name: "Biểu mẫu đánh giá sơ bộ",
        description:
          "Biểu mẫu dùng để đánh giá sơ bộ khách hàng trước khi cấp chứng nhận",
        fileName: "danh-gia-so-bo.docx",
        placeholders: [
          "{Tên khách hàng}",
          "{Mã khách hàng}",
          "{Mã số thuế}",
          "{Người đại diện}",
          "{Email}",
          "{Số điện thoại}",
        ],
        content: `BIỂU MẪU ĐÁNH GIÁ SƠ BỘ

Tên khách hàng: {Tên khách hàng}
Mã khách hàng: {Mã khách hàng}
Mã số thuế: {Mã số thuế}
Người đại diện: {Người đại diện}
Email: {Email}
Số điện thoại: {Số điện thoại}

1. Thông tin chung về doanh nghiệp
2. Đánh giá năng lực hiện tại
3. Yêu cầu chứng nhận
4. Kế hoạch thực hiện
`,
      },
      {
        id: "2",
        name: "Hợp đồng dịch vụ chứng nhận",
        description: "Hợp đồng giữa ICB và khách hàng cho dịch vụ chứng nhận",
        fileName: "hop-dong-dich-vu.docx",
        placeholders: [
          "{Tên khách hàng}",
          "{Mã khách hàng}",
          "{Địa chỉ}",
          "{Người đại diện}",
          "{Chức vụ}",
          "{Mã hợp đồng}",
          "{Ngày tạo hợp đồng}",
        ],
        content: `HỢP ĐỒNG DỊCH VỤ CHỨNG NHẬN

Bên A (ICB): Công ty Chứng nhận ICB
Bên B: {Tên khách hàng}
Mã khách hàng: {Mã khách hàng}
Địa chỉ: {Địa chỉ}
Người đại diện: {Người đại diện}
Chức vụ: {Chức vụ}

Mã hợp đồng: {Mã hợp đồng}
Ngày ký: {Ngày tạo hợp đồng}

ĐIỀU KHOẢN HỢP ĐỒNG:
1. Phạm vi công việc
2. Thời gian thực hiện
3. Nghĩa vụ các bên
4. Thanh toán
`,
      },
      {
        id: "3",
        name: "Báo cáo kiểm toán",
        description: "Mẫu báo cáo kiểm toán hệ thống quản lý chất lượng",
        fileName: "bao-cao-kiem-toan.docx",
        placeholders: [
          "{Tên khách hàng}",
          "{Mã khách hàng}",
          "{Ngày kiểm toán}",
          "{Người đại diện}",
        ],
        content: `BÁO CÁO KIỂM TOÁN

Tên khách hàng: {Tên khách hàng}
Mã khách hàng: {Mã khách hàng}
Ngày kiểm toán: {Ngày kiểm toán}
Người đại diện: {Người đại diện}

1. Tổng quan về kiểm toán
2. Phát hiện trong quá trình kiểm toán
3. Đánh giá tổng thể
4. Khuyến nghị
`,
      },
    ],
  });
  console.log(`✅ Created ${templates.count} templates`);

  console.log("✨ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
