"use client";
import { Button, Input, Spinner } from "@heroui/react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { StaffFormModal } from "@/components/staff/staff-form-modal";
import { StaffTable } from "@/components/staff/staff-table";
import { useStaff } from "@/hooks/use-staff";

export const Staff = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, refetch } = useStaff({
    page: currentPage,
    pageSize,
    search: searchTerm,
  });

  const formModalRef = useRef<any>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

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
          <span>Nhân viên</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Danh sách Nhân viên</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Tìm kiếm nhân viên"
            value={searchTerm}
            onValueChange={handleSearch}
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <StaffFormModal ref={formModalRef} onSuccess={refetch} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <StaffTable
          staff={data?.data || []}
          total={data?.total || 0}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onRefresh={refetch}
          formModalRef={formModalRef}
        />
      )}
    </div>
  );
};
