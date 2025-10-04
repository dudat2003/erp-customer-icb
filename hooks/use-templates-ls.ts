import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Template } from "@/types";

const LS_KEY = "icb_templates";

function getTemplatesFromLS(): Template[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LS_KEY);
  return data ? JSON.parse(data) : [];
}

function setTemplatesToLS(templates: Template[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(templates));
}

export const templateKeys = {
  all: ["templates"] as const,
  lists: () => [...templateKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...templateKeys.lists(), params] as const,
  details: () => [...templateKeys.all, "detail"] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
};

export function useTemplates(params?: { search?: string }) {
  return useQuery({
    queryKey: templateKeys.list(params),
    queryFn: () => {
      let templates = getTemplatesFromLS();
      // Nếu chưa có data trong localStorage, khởi tạo từ mockData nếu có
      if (templates.length === 0 && typeof window !== "undefined") {
        try {
          const mockData = require("@/lib/mock-data");
          const defaultTemplates = mockData.mockData.getTemplates();
          setTemplatesToLS(defaultTemplates);
          templates = defaultTemplates;
        } catch (e) {}
      }
      // Filter
      if (params?.search) {
        templates = templates.filter((t) =>
          t.name.toLowerCase().includes(params.search!.toLowerCase())
        );
      }
      return {
        data: templates,
        total: templates.length,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => getTemplatesFromLS().find((t) => t.id === id),
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Template) => {
      const templates = getTemplatesFromLS();
      if (!data.id) {
        data.id = Date.now().toString();
      }
      templates.push(data);
      setTemplatesToLS(templates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      let templates = getTemplatesFromLS();
      const before = templates.length;
      templates = templates.filter((t) => t.id !== id);
      setTemplatesToLS(templates);
      return before !== templates.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}
