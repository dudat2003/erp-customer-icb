import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  PaginatedResponse,
  Staff,
  Template,
  CreateTemplateRequest,
} from "@/types";

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
  }): Promise<PaginatedResponse<Customer>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.category) searchParams.append("category", params.category);

    const query = searchParams.toString();
    const endpoint = `/customers${query ? `?${query}` : ""}`;

    return this.request<PaginatedResponse<Customer>>(endpoint);
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.request<Customer>(`/customers/${id}`);
  }

  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    return this.request<Customer>("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(
    id: string,
    data: UpdateCustomerRequest
  ): Promise<Customer> {
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
  async getStaff(): Promise<Staff[]> {
    return this.request<Staff[]>("/staff");
  }

  // Template API
  async getTemplates(): Promise<Template[]> {
    return this.request<Template[]>("/templates");
  }

  async createTemplate(data: CreateTemplateRequest): Promise<Template> {
    return this.request<Template>("/templates", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteTemplate(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/templates/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
