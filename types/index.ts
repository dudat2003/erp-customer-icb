// ============================================
// RE-EXPORT PRISMA GENERATED TYPES
// ============================================
// Thay vì tự định nghĩa, ta sử dụng types được Prisma auto-generate
export type { Customer, Staff, Template, Prisma } from "@prisma/client";

// ============================================
// DERIVED TYPES & DTOs
// ============================================
// Types này derive từ Prisma models hoặc là custom cho UI/API

import type { Prisma } from "@prisma/client";

// Customer category type - derived từ schema field
export type CustomerCategory = "potential" | "closed" | "regular" | "promising";

// Request types cho API
export type CreateCustomerRequest = Omit<
  Prisma.CustomerCreateInput,
  "id" | "createdAt" | "updatedAt"
>;

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  id: string;
}

export type CreateTemplateRequest = Omit<
  Prisma.TemplateCreateInput,
  "id" | "createdAt" | "updatedAt"
>;

export interface UpdateTemplateRequest extends Partial<CreateTemplateRequest> {
  id: string;
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

//
// ============================================
// CONSTANTS
// ============================================
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

// Helper function to generate contract code
export const generateContractCode = (customerCode: string): string => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  return `HD-${customerCode}-${timestamp}`;
};
