"use client";
import React from "react";
import dynamic from "next/dynamic";

import { Link } from "@heroui/react";
import NextLink from "next/link";
import { CardBalance1 } from "@/components/home/card-balance1";
import { CardBalance2 } from "@/components/home/card-balance2";
import { CardBalance3 } from "@/components/home/card-balance3";
import { CardBalance4 } from "@/components/home/card-balance4";
import { QuickActions } from "@/components/home/quick-actions";
import { CardAgents } from "@/components/home/card-agents";
import { CardTransactions } from "@/components/home/card-transactions";
import { TableWrapper } from "@/components/table/table";

const Chart = dynamic(
  () => import("../charts/steam").then((mod) => mod.Steam),
  {
    ssr: false,
  }
);

export const Content = () => (
  <div className="h-full lg:px-6">
    <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
      <div className="mt-6 gap-6 flex flex-col w-full">
        {/* Card Section Top */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Tổng quan hệ thống</h3>
          <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-4 gap-5  justify-center w-full">
            <CardBalance1 />
            <CardBalance2 />
            <CardBalance3 />
            <CardBalance4 />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Chart */}
        <div className="h-full flex flex-col gap-2">
          <h3 className="text-xl font-semibold">
            Thống kê khách hàng theo tháng
          </h3>
          <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6 ">
            <Chart />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
        <h3 className="text-xl font-semibold">Hoạt động gần đây</h3>
        <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
          <CardAgents />
          <CardTransactions />
        </div>
      </div>
    </div>

    {/* Table Latest Customers */}
    <div className="flex flex-col justify-center w-full py-5 px-4 lg:px-0  max-w-[90rem] mx-auto gap-3">
      <div className="flex  flex-wrap justify-between">
        <h3 className="text-center text-xl font-semibold">
          Khách hàng mới nhất
        </h3>
        <Link
          href="/customers"
          as={NextLink}
          color="primary"
          className="cursor-pointer"
        >
          Xem tất cả
        </Link>
      </div>
      <TableWrapper />
    </div>
  </div>
);
