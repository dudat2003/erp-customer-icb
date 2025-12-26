import { Card, CardBody } from "@heroui/react";
import type { Customer } from "@prisma/client";
import { useCustomers } from "@/hooks/use-customers";
import { formatDate } from "@/lib/dayjs";

export const CardTransactions = () => {
  const { data: customersData, isLoading } = useCustomers({
    page: 1,
    pageSize: 5,
  });

  const recentCustomers = customersData?.data || [];

  return (
    <Card className=" bg-default-50 rounded-xl shadow-md px-4 py-6 w-full">
      <CardBody className="py-5 gap-6">
        <div className="flex gap-2.5 justify-center">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">
              {"📋"} Khách hàng gần đây
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 flex-col">
          <span className="text-xs text-center">
            {isLoading ? "Đang tải..." : " "}
          </span>

          <div className="flex flex-col gap-4 w-full">
            {isLoading ? (
              <div className="text-center text-xs">Đang tải...</div>
            ) : (
              recentCustomers.map((customer: Customer) => (
                <div key={customer.id} className="flex items-center gap-3">
                  <div className="flex flex-col flex-1">
                    <span className="text-xs font-semibold">
                      {customer.name}
                    </span>
                    <span className="text-xs text-default-500">
                      {customer.email}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-xs font-semibold ${
                        customer.category === "potential"
                          ? "text-warning"
                          : customer.category === "closed"
                          ? "text-success"
                          : customer.category === "regular"
                          ? "text-primary"
                          : "text-secondary"
                      }`}
                    >
                      {customer.category === "potential"
                        ? "KH Tiềm năng"
                        : customer.category === "closed"
                        ? "KH Đã chốt"
                        : customer.category === "regular"
                        ? "KH Thường"
                        : "KH Khả quan"}
                    </span>
                    <span className="text-xs text-default-400">
                      {formatDate(customer.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
