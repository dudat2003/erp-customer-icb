"use client";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import Link from "next/link";
import React, { useState } from "react";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
import { SearchIcon } from "@/components/icons/searchicon";
import { TableWrapper } from "@/components/table/table";
import { CustomerFormModal } from "@/components/customers/customer-form-modal";
import { CUSTOMER_CATEGORIES } from "@/types";

export const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Trang chủ</span>
          </Link>
          <span> / </span>{" "}
        </li>

        <li className="flex gap-2">
          <UsersIcon />
          <span>Khách hàng</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Danh sách Khách hàng</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Tìm kiếm theo tên, mã KH, email..."
            aria-label="Tìm kiếm khách hàng"
            value={searchTerm}
            onValueChange={setSearchTerm}
            startContent={<SearchIcon />}
            isClearable
            onClear={() => setSearchTerm("")}
          />
          <Select
            placeholder="Phân loại"
            aria-label="Lọc theo phân loại khách hàng"
            className="max-w-xs"
            selectedKeys={categoryFilter ? [categoryFilter] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              setCategoryFilter(selected ? String(selected) : "");
            }}
          >
            <SelectItem key="">Tất cả</SelectItem>
            <SelectItem key="potential">
              {CUSTOMER_CATEGORIES.potential}
            </SelectItem>
            <SelectItem key="closed">{CUSTOMER_CATEGORIES.closed}</SelectItem>
            <SelectItem key="regular">{CUSTOMER_CATEGORIES.regular}</SelectItem>
            <SelectItem key="promising">
              {CUSTOMER_CATEGORIES.promising}
            </SelectItem>
          </Select>
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <CustomerFormModal />
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper searchTerm={searchTerm} categoryFilter={categoryFilter} />
      </div>
    </div>
  );
};
