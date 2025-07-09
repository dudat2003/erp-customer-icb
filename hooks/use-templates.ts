import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { CreateTemplateRequest } from "@/types";

export const templateKeys = {
  all: ["templates"] as const,
  lists: () => [...templateKeys.all, "list"] as const,
};

export function useTemplates() {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: () => apiClient.getTemplates(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTemplateRequest) => apiClient.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
    onError: (error: Error) => {},
  });
}

// Delete template mutation
export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
    onError: (error: Error) => {},
  });
}
