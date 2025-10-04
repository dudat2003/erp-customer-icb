import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

// Query keys
export const staffKeys = {
  all: ["staff"] as const,
  lists: () => [...staffKeys.all, "list"] as const,
};

// Get staff list
export function useStaff() {
  return useQuery({
    queryKey: staffKeys.lists(),
    queryFn: () => apiClient.getStaff(),
    staleTime: 30 * 60 * 1000, // 30 minutes (staff data doesn't change often)
  });
}
