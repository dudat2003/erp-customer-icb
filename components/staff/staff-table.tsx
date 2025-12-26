"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Chip,
  Pagination,
} from "@heroui/react";
import React, { useState } from "react";
import { EditIcon } from "@/components/icons/table/edit-icon";
import { DeleteIcon } from "@/components/icons/table/delete-icon";
import { useDeleteStaff } from "@/hooks/use-staff";
import type { Staff } from "@prisma/client";
import { formatDate } from "@/lib/dayjs";
import toast from "react-hot-toast";

interface StaffTableProps {
  staff: Staff[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  formModalRef: React.RefObject<any>;
}

const columns = [
  { name: "TÊN", uid: "name" },
  { name: "EMAIL", uid: "email" },
  { name: "CHỨC VỤ", uid: "role" },
  { name: "NGÀY TẠO", uid: "createdAt" },
  { name: "THAO TÁC", uid: "actions" },
];

export const StaffTable: React.FC<StaffTableProps> = ({
  staff,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onRefresh,
  formModalRef,
}) => {
  const deleteStaff = useDeleteStaff();
  const [isDeleting, setIsDeleting] = useState(false);
  const totalPages = Math.ceil(total / pageSize);

  const handleEdit = (staffMember: Staff) => {
    if (formModalRef.current) {
      formModalRef.current.openModal(staffMember);
    }
  };

  const handleDelete = async (staffMember: Staff) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa nhân viên "${staffMember.name}"? Hành động này không thể hoàn tác.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteStaff.mutateAsync(staffMember.id);
      toast.success("Xóa nhân viên thành công!");
      onRefresh();
    } catch (error) {
      toast.error("Không thể xóa nhân viên");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderCell = (staffMember: Staff, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{staffMember.name}</p>
          </div>
        );
      case "email":
        return (
          <div className="flex flex-col">
            <p className="text-sm">{staffMember.email}</p>
          </div>
        );
      case "role":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={staffMember.role ? "primary" : "default"}
          >
            {staffMember.role || "Chưa có"}
          </Chip>
        );
      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-sm">{formatDate(staffMember.createdAt)}</p>
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center gap-4">
            <div>
              <Tooltip content="Chỉnh sửa">
                <button onClick={() => handleEdit(staffMember)}>
                  <EditIcon size={20} fill="#979797" />
                </button>
              </Tooltip>
            </div>
            <div>
              <Tooltip content="Xóa" color="danger">
                <button
                  onClick={() => handleDelete(staffMember)}
                  disabled={isDeleting}
                >
                  <DeleteIcon size={20} fill="#FF0080" />
                </button>
              </Tooltip>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Table aria-label="Staff table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={staff} emptyContent="Không có nhân viên nào">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={currentPage}
            total={totalPages}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
