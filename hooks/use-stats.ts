import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export const statsKeys = {
  all: ["stats"] as const,
  dashboard: () => [...statsKeys.all, "dashboard"] as const,
};

export interface DashboardStats {
  potential: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: string;
  };
  closed: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: string;
  };
  regular: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: string;
  };
  promising: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: string;
  };
  totalCustomers: number;
  totalPlaceholders: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: statsKeys.dashboard(),
    queryFn: () => apiClient.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
