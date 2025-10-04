// Customer types
export interface Customer {
  id: string;
  customerCode: string;
  name: string;
  taxCode: string;
  businessLicenseDate: string;
  representative: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  category: CustomerCategory;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type CustomerCategory = "potential" | "closed" | "regular" | "promising";

export interface CreateCustomerRequest {
  customerCode: string;
  name: string;
  taxCode: string;
  businessLicenseDate: string;
  representative: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  category: CustomerCategory;
  assignedTo: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  id: string;
}

// Template types
export interface Template {
  id: string;
  name: string;
  fileName: string;
  placeholders: string[];
  content: string; // Mock content as text
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateRequest {
  name: string;
  fileName: string;
  content: string;
  placeholders: string[];
}

export interface CustomerTemplate {
  id: string;
  customerId: string;
  templateId: string;
  generatedContent: string;
  createdAt: string;
}

// Staff types
export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Constants
export const CUSTOMER_CATEGORIES = {
  potential: "KH tiềm năng",
  closed: "KH đã chốt",
  regular: "KH thường",
  promising: "KH khả quan",
} as const;

export const PLACEHOLDER_VARIABLES = [
  "{Tên khách hàng}",
  "{Mã khách hàng}",
  "{Mã số thuế}",
  "{Ngày cấp GĐKKD}",
  "{Người đại diện}",
  "{Chức vụ}",
  "{Email}",
  "{Số điện thoại}",
  "{Địa chỉ}",
  "{Mã hợp đồng}",
  "{Ngày tạo hợp đồng}",
] as const;
