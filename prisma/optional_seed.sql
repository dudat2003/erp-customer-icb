-- Optional seed SQL for Neon/PostgreSQL
-- Run manually only if bạn muốn có dữ liệu mẫu:
-- psql "<DATABASE_URL>" -f prisma/optional_seed.sql

-- Customers
INSERT INTO "Customer" (
  id, "customerCode", name, "taxCode", "businessLicenseDate",
  representative, position, email, phone, address, category,
  "assignedTo", "createdBy", "createdAt", "updatedAt"
) VALUES
('1','KH001','Công ty TNHH ABC','0123456789','2020-01-15','Nguyễn Văn A','Giám đốc','contact@abc.com','0912345678','123 Đường ABC, Quận 1, TP.HCM','closed','1','System','2024-01-15T10:00:00Z','2024-01-15T10:00:00Z'),
('2','KH002','Công ty Cổ phần XYZ','0987654321','2019-05-20','Trần Thị B','Chủ tịch HĐQT','info@xyz.com','0923456789','456 Đường XYZ, Quận 2, TP.HCM','potential','2','System','2024-01-20T14:30:00Z','2024-01-20T14:30:00Z'),
('3','KH003','Doanh nghiệp tư nhân DEF','0456789123','2021-03-10','Lê Văn C','Chủ doanh nghiệp','owner@def.com','0934567890','789 Đường DEF, Quận 3, TP.HCM','regular','3','System','2024-02-01T09:15:00Z','2024-02-01T09:15:00Z'),
('4','KH004','Công ty TNHH MTV GHI','0789123456','2018-11-25','Phạm Thị D','Giám đốc','director@ghi.com','0945678901','321 Đường GHI, Quận 4, TP.HCM','promising','4','System','2024-02-15T16:45:00Z','2024-02-15T16:45:00Z'),
('5','KH005','Tập đoàn JKL','0654321987','2017-07-30','Hoàng Văn E','Tổng giám đốc','ceo@jkl.com','0956789012','654 Đường JKL, Quận 5, TP.HCM','closed','1','System','2024-03-01T11:20:00Z','2024-03-01T11:20:00Z')
ON CONFLICT (id) DO NOTHING;

-- Templates
INSERT INTO "Template" (
  id, name, "fileName", placeholders, content, "createdAt", "updatedAt"
) VALUES
('1','Biểu mẫu đánh giá sơ bộ','danh-gia-so-bo.docx',
  '{"{Tên khách hàng}","{Mã khách hàng}","{Mã số thuế}","{Người đại diện}","{Email}","{Số điện thoại}"}',
  'BIỂU MẪU ĐÁNH GIÁ SƠ BỘ\n\nTên khách hàng: {Tên khách hàng}\nMã khách hàng: {Mã khách hàng}\nMã số thuế: {Mã số thuế}\nNgười đại diện: {Người đại diện}\nEmail: {Email}\nSố điện thoại: {Số điện thoại}\n\n1. Thông tin chung về doanh nghiệp\n2. Đánh giá năng lực hiện tại\n3. Yêu cầu chứng nhận\n4. Kế hoạch thực hiện\n',
  '2024-01-01T10:00:00Z','2024-01-01T10:00:00Z'),
('2','Hợp đồng dịch vụ chứng nhận','hop-dong-dich-vu.docx',
  '{"{Tên khách hàng}","{Mã khách hàng}","{Địa chỉ}","{Người đại diện}","{Chức vụ}","{Mã hợp đồng}","{Ngày tạo hợp đồng}"}',
  'HỢP ĐỒNG DỊCH VỤ CHỨNG NHẬN\n\nBên A (ICB): Công ty Chứng nhận ICB\nBên B: {Tên khách hàng}\nMã khách hàng: {Mã khách hàng}\nĐịa chỉ: {Địa chỉ}\nNgười đại diện: {Người đại diện}\nChức vụ: {Chức vụ}\n\nMã hợp đồng: {Mã hợp đồng}\nNgày ký: {Ngày tạo hợp đồng}\n\nĐIỀU KHOẢN HỢP ĐỒNG:\n1. Phạm vi công việc\n2. Thời gian thực hiện\n3. Nghĩa vụ các bên\n4. Thanh toán\n',
  '2024-01-01T10:00:00Z','2024-01-01T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Staff (mẫu tham khảo)
INSERT INTO "Staff" (
  id, name, email, role, "createdAt", "updatedAt"
) VALUES
('1','Nguyễn Văn An','an.nguyen@icb.com','Trưởng phòng','2024-01-01T10:00:00Z','2024-01-01T10:00:00Z'),
('2','Trần Thị Bình','binh.tran@icb.com','Chuyên viên','2024-01-01T10:00:00Z','2024-01-01T10:00:00Z'),
('3','Lê Minh Châu','chau.le@icb.com','Chuyên viên','2024-01-01T10:00:00Z','2024-01-01T10:00:00Z'),
('4','Phạm Thị Dung','dung.pham@icb.com','Nhân viên','2024-01-01T10:00:00Z','2024-01-01T10:00:00Z')
ON CONFLICT (id) DO NOTHING;


