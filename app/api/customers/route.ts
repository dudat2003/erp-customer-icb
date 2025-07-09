import { NextRequest, NextResponse } from "next/server";
import { Customer, CreateCustomerRequest, PaginatedResponse } from "@/types";
import { mockData } from "@/lib/mock-data";

// GET /api/customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let customers = mockData.getCustomers();

    // Apply filters
    if (search) {
      customers = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          customer.customerCode.toLowerCase().includes(search.toLowerCase()) ||
          customer.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      customers = customers.filter(
        (customer) => customer.category === category
      );
    }

    // Pagination
    const total = customers.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCustomers = customers.slice(startIndex, endIndex);

    const response: PaginatedResponse<Customer> = {
      data: paginatedCustomers,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// POST /api/customers
export async function POST(request: NextRequest) {
  try {
    const body: CreateCustomerRequest = await request.json();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const customers = mockData.getCustomers();

    // Check if customer code already exists
    const existingCustomer = customers.find(
      (c: Customer) => c.customerCode === body.customerCode
    );
    if (existingCustomer) {
      return NextResponse.json(
        { error: "Customer code already exists" },
        { status: 400 }
      );
    }

    const newCustomer: Customer = {
      id: Date.now().toString(),
      ...body,
      createdBy: "System", // In real app, get from auth
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockData.addCustomer(newCustomer);

    return NextResponse.json(newCustomer, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
