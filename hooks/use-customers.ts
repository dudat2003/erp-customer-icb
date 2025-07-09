import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { CreateCustomerRequest, UpdateCustomerRequest } from "@/types";
import { message } from "antd";

// Query keys
export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

// Get customers with pagination and filters
export function useCustomers(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
}) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => apiClient.getCustomers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single customer
export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => apiClient.getCustomer(id),
    enabled: !!id,
  });
}

// Create customer mutation
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => apiClient.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      message.success("Tạo khách hàng thành công");
    },
    onError: (error: Error) => {
      message.error(error.message || "Tạo khách hàng thất bại");
    },
  });
}

// Update customer mutation
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerRequest }) =>
      apiClient.updateCustomer(id, data),
    onSuccess: (updatedCustomer) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.setQueryData(
        customerKeys.detail(updatedCustomer.id),
        updatedCustomer
      );
      message.success("Cập nhật khách hàng thành công");
    },
    onError: (error: Error) => {
      message.error(error.message || "Cập nhật khách hàng thất bại");
    },
  });
}

// Delete customer mutation
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      message.success("Xóa khách hàng thành công");
    },
    onError: (error: Error) => {
      message.error(error.message || "Xóa khách hàng thất bại");
    },
  });
}
