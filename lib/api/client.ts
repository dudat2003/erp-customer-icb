import type { Customer, Staff, Template } from "@prisma/client";

// Base API client
class ApiClient {
  private baseUrl = "/api";

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Something went wrong");
    }

    return response.json();
  }

  // Customer API
  async getCustomers(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
  }): Promise<{ data: Customer[]; total: number }> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.category) searchParams.append("category", params.category);

    const query = searchParams.toString();
    const endpoint = `/customers${query ? `?${query}` : ""}`;

    return this.request<{ data: Customer[]; total: number }>(endpoint);
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.request<Customer>(`/customers/${id}`);
  }

  async createCustomer(data: Customer): Promise<Customer> {
    return this.request<Customer>("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: string, data: Customer): Promise<Customer> {
    return this.request<Customer>(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCustomer(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/customers/${id}`, {
      method: "DELETE",
    });
  }

  // Staff API
  async getStaff(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
  }): Promise<{ data: Staff[]; total: number }> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.role) searchParams.append("role", params.role);

    const query = searchParams.toString();
    const endpoint = `/staff${query ? `?${query}` : ""}`;

    return this.request<{ data: Staff[]; total: number }>(endpoint);
  }

  async createStaff(data: Partial<Staff>): Promise<Staff> {
    return this.request<Staff>("/staff", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateStaff(id: string, data: Partial<Staff>): Promise<Staff> {
    return this.request<Staff>(`/staff/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteStaff(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/staff/${id}`, {
      method: "DELETE",
    });
  }

  // Template API
  async getTemplates(): Promise<{ data: Template[]; total: number }> {
    return this.request<{ data: Template[]; total: number }>("/templates");
  }

  async getTemplate(id: string): Promise<Template> {
    return this.request<Template>(`/templates/${id}`);
  }

  async createTemplate(data: Template): Promise<Template> {
    return this.request<Template>("/templates", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTemplate(id: string, data: Partial<Template>): Promise<Template> {
    return this.request<Template>(`/templates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTemplate(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/templates/${id}`, {
      method: "DELETE",
    });
  }

  // Document Generation API
  async generateDocument(params: {
    templateId: string;
    customerId: string;
    outputFormat?: "json" | "docx";
  }): Promise<{ success: boolean; docxBase64: string; fileName: string }> {
    return this.request<{
      success: boolean;
      docxBase64: string;
      fileName: string;
    }>("/documents/generate-from-template", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async downloadDocument(params: {
    templateId: string;
    customerId: string;
  }): Promise<Blob> {
    const url = `${this.baseUrl}/documents/generate-from-template`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...params, outputFormat: "docx" }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Không thể tải file");
    }

    return response.blob();
  }

  // Stats API
  async getDashboardStats(): Promise<any> {
    return this.request<any>("/stats/dashboard");
  }
}

export const apiClient = new ApiClient();
