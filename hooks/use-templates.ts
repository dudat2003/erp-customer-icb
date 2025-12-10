import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Template } from "@prisma/client";
import toast from "react-hot-toast";

import { apiClient } from "@/lib/api/client";

export const templateKeys = {
  all: ["templates"] as const,
  lists: () => [...templateKeys.all, "list"] as const,
  details: () => [...templateKeys.all, "detail"] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
};

export function useTemplates() {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: () => apiClient.getTemplates(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => apiClient.getTemplate(id),
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Template) => apiClient.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      toast.success("Tạo biểu mẫu thành công!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể tạo biểu mẫu");
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Template> }) =>
      apiClient.updateTemplate(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.setQueryData(templateKeys.detail(updated.id), updated);
      toast.success("Cập nhật biểu mẫu thành công!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể cập nhật biểu mẫu");
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      toast.success("Xóa biểu mẫu thành công!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể xóa biểu mẫu");
    },
  });
}
