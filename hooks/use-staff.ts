import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Staff } from "@prisma/client";

// Query keys
export const staffKeys = {
  all: ["staff"] as const,
  lists: () => [...staffKeys.all, "list"] as const,
};

// Get staff list
export function useStaff(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
}) {
  return useQuery({
    queryKey: [...staffKeys.lists(), params],
    queryFn: () => apiClient.getStaff(params),
    staleTime: 30 * 60 * 1000, // 30 minutes (staff data doesn't change often)
  });
}

// Create staff
export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Staff>) => apiClient.createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}

// Update staff
export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Staff> }) =>
      apiClient.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}

// Delete staff
export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}
