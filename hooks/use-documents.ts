import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { apiClient } from "@/lib/api/client";

export interface GenerateDocumentParams {
  templateId: string;
  customerId: string;
}

export interface GenerateDocumentResult {
  success: boolean;
  docxBase64: string;
  fileName: string;
}

/**
 * Hook để generate document từ template và customer
 * Trả về docxBase64 để preview
 */
export function useGenerateDocument() {
  return useMutation({
    mutationFn: (params: GenerateDocumentParams) =>
      apiClient.generateDocument({ ...params, outputFormat: "json" }),
    onError: (error: Error) => {
      toast.error(error.message || "Không thể tạo tài liệu");
    },
  });
}

/**
 * Hook để download document dưới dạng DOCX
 */
export function useDownloadDocument() {
  return useMutation({
    mutationFn: async (params: GenerateDocumentParams & { fileName?: string }) => {
      const blob = await apiClient.downloadDocument(params);
      
      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = params.fileName || `document-${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Tải file thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể tải file");
    },
  });
}
