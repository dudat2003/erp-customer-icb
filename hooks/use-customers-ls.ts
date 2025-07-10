import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Customer } from "@/types";
import { useCallback } from "react";

const LS_KEY = "icb_customers";

function getCustomersFromLS(): Customer[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LS_KEY);
  return data ? JSON.parse(data) : [];
}

function setCustomersToLS(customers: Customer[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(customers));
}

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
    queryFn: () => {
      let customers = getCustomersFromLS();
      // Nếu chưa có data trong localStorage, khởi tạo từ mockData nếu có
      if (customers.length === 0 && typeof window !== "undefined") {
        try {
          // Lazy import để tránh lỗi vòng lặp
          const mockData = require("@/lib/mock-data");
          const defaultCustomers = mockData.mockData.getCustomers();
          setCustomersToLS(defaultCustomers);
          customers = defaultCustomers;
        } catch (e) {
          // Nếu không có mockData thì trả về mảng rỗng
        }
      }
      // Filter
      if (params?.search) {
        customers = customers.filter((c) =>
          c.name.toLowerCase().includes(params.search!.toLowerCase())
        );
      }
      if (params?.category) {
        customers = customers.filter((c) => c.category === params.category);
      }
      // Pagination
      if (params?.page !== undefined && params?.pageSize !== undefined) {
        const start = (params.page - 1) * params.pageSize;
        customers = customers.slice(start, start + params.pageSize);
      }
      return {
        data: customers,
        total: customers.length,
        page: params?.page || 1,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Get single customer
export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => getCustomersFromLS().find((c) => c.id === id),
    enabled: !!id,
  });
}

// Create customer mutation
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Customer) => {
      const customers = getCustomersFromLS();
      if (!data.id) {
        data.id = Date.now().toString();
      }
      customers.push(data);
      setCustomersToLS(customers);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

// Update customer mutation
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Customer>;
    }) => {
      const customers = getCustomersFromLS();
      const idx = customers.findIndex((c) => c.id === id);
      if (idx !== -1) {
        customers[idx] = { ...customers[idx], ...data };
        setCustomersToLS(customers);
        return customers[idx];
      }
      return null;
    },
    onSuccess: (updatedCustomer: any) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      if (updatedCustomer && updatedCustomer.id)
        queryClient.setQueryData(
          customerKeys.detail(updatedCustomer.id),
          updatedCustomer
        );
    },
  });
}

// Delete customer mutation
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      let customers = getCustomersFromLS();
      const before = customers.length;
      customers = customers.filter((c) => c.id !== id);
      setCustomersToLS(customers);
      return before !== customers.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}
