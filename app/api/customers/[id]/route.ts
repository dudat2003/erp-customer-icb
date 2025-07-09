import { NextRequest, NextResponse } from "next/server";
import { Customer, UpdateCustomerRequest } from "@/types";
import { mockData } from "@/lib/mock-data";

// GET /api/customers/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const customer = mockData.getCustomerById(id);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateCustomerRequest = await request.json();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const customers = mockData.getCustomers();
    const existingCustomer = customers.find((c: Customer) => c.id === id);

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Check if customer code already exists (if updating)
    if (body.customerCode) {
      const duplicateCustomer = customers.find(
        (c: Customer) => c.customerCode === body.customerCode && c.id !== id
      );
      if (duplicateCustomer) {
        return NextResponse.json(
          { error: "Customer code already exists" },
          { status: 400 }
        );
      }
    }

    const updatedCustomer = mockData.updateCustomer(id, body);
    return NextResponse.json(updatedCustomer);
  } catch {
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const success = mockData.deleteCustomer(id);

    if (!success) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
