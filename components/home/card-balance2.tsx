import { Card, CardBody, Spinner } from "@heroui/react";
import React from "react";
import { Community } from "../icons/community";
import { useDashboardStats } from "@/hooks/use-stats";

export const CardBalance2 = () => {
  const { data: stats, isLoading } = useDashboardStats();

  const totalClosed = stats?.closed.total || 0;
  const customersThisMonth = stats?.closed.thisMonth || 0;

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
