//Mock data generated for ICB ERP system
import { Customer, Template } from "@/types";

const customers: Customer[] = [
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
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
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
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
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
    createdAt: "2024-02-01T09:15:00Z",
    updatedAt: "2024-02-01T09:15:00Z",
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
    createdAt: "2024-02-15T16:45:00Z",
    updatedAt: "2024-02-15T16:45:00Z",
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
    createdAt: "2024-03-01T11:20:00Z",
    updatedAt: "2024-03-01T11:20:00Z",
  },
];

const templates: Template[] = [
  {
    id: "1",
    name: "Biểu mẫu đánh giá sơ bộ",
    fileName: "danh-gia-so-bo.docx",
    placeholders: [
      "{Tên khách hàng}",
      "{Mã khách hàng}",
      "{Mã số thuế}",
      "{Người đại diện}",
      "{Email}",
      "{Số điện thoại}",
    ],
    content: `
BIỂU MẪU ĐÁNH GIÁ SƠ BỘ

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
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Hợp đồng dịch vụ chứng nhận",
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
    content: `
HỢP ĐỒNG DỊCH VỤ CHỨNG NHẬN

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
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
];

export const mockData = {
  // Customers
  getCustomers: () => customers,
  addCustomer: (customer: Customer) => {
    customers.push(customer);
    return customer;
  },
  updateCustomer: (id: string, updates: Partial<Customer>) => {
    const index = customers.findIndex((c) => c.id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updates };
      return customers[index];
    }
    return null;
  },
  deleteCustomer: (id: string) => {
    const index = customers.findIndex((c) => c.id === id);
    if (index !== -1) {
      customers.splice(index, 1);
      return true;
    }
    return false;
  },
  getCustomerById: (id: string) => customers.find((c) => c.id === id),

  // Templates
  getTemplates: () => templates,
  addTemplate: (template: Template) => {
    templates.push(template);
    return template;
  },
  deleteTemplate: (id: string) => {
    const index = templates.findIndex((t) => t.id === id);
    if (index !== -1) {
      templates.splice(index, 1);
      return true;
    }
    return false;
  },
};
