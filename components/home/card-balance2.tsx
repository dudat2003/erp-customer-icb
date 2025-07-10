import { Card, CardBody, Spinner } from "@heroui/react";
import React from "react";
import { Community } from "../icons/community";
import { useCustomers } from "@/hooks/use-customers-ls";

export const CardBalance2 = () => {
  const { data: customersData, isLoading } = useCustomers({
    page: 1,
    pageSize: 100,
    category: "closed",
  });

  const closedCustomers = customersData?.data || [];
  const totalClosed = closedCustomers.length;
  const now = new Date();
  const thisMonth = now.getMonth() + 1;
  const thisYear = now.getFullYear();
  const customersThisMonth = closedCustomers.filter((c) => {
    const created = new Date(c.createdAt);
    return (
      created.getMonth() + 1 === thisMonth && created.getFullYear() === thisYear
    );
  }).length;
  const customersLastMonth = closedCustomers.filter((c) => {
    const created = new Date(c.createdAt);
    return (
      created.getMonth() + 1 === (thisMonth === 1 ? 12 : thisMonth - 1) &&
      created.getFullYear() === (thisMonth === 1 ? thisYear - 1 : thisYear)
    );
  }).length;
  const growthRate =
    customersLastMonth === 0
      ? customersThisMonth > 0
        ? "+100%"
        : "0%"
      : `${(
          ((customersThisMonth - customersLastMonth) / customersLastMonth) *
          100
        ).toFixed(1)}%`;

  return (
    <Card className="xl:max-w-sm bg-success-50 rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5">
        <div className="flex gap-2.5">
          <Community />
          <div className="flex flex-col">
            <span className=" ">Khách hàng đã chốt</span>
            <span className="  text-xs"></span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className=" text-xl font-semibold">
            {isLoading ? (
              <Spinner />
            ) : (
              `${totalClosed.toLocaleString("vi-VN")} khách hàng`
            )}
          </span>
          <span className="text-success text-xs">{growthRate}</span>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <div>
              <span className="font-semibold text-success-600 text-xs">
                {"↑"}
              </span>
              <span className="text-xs">{customersThisMonth}</span>
            </div>
            <span className=" text-xs">Tháng này</span>
          </div>

          <div>
            <div>
              <span className="font-semibold text-success-600 text-xs">
                {"↑"}
              </span>
              <span className="text-xs">{totalClosed}</span>
            </div>
            <span className=" text-xs">Tổng cộng</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
