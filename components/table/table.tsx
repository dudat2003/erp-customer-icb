import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
  User,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
  Image,
} from "@heroui/react";
import React, { useState, useRef } from "react";
import { useCustomers } from "@/hooks/use-customers-ls";
import { useStaff } from "@/hooks/use-staff";
import { Customer, CUSTOMER_CATEGORIES } from "@/types";
import { apiClient } from "@/lib/api/client";
import { EyeIcon } from "@/components/icons/table/eye-icon";
import { EditIcon } from "@/components/icons/table/edit-icon";
import { DeleteIcon } from "@/components/icons/table/delete-icon";
import { CustomerFormModal } from "../accounts/customer-form-modal";
import { CustomerDetailModal } from "../accounts/customer-detail-modal";

const columns = [
  { name: "STT", uid: "index" },
  { name: "MÃ KHÁCH HÀNG", uid: "customerCode" },
  { name: "THÔNG TIN KHÁCH HÀNG", uid: "customer" },
  { name: "NGÀY TẠO", uid: "createdAt" },
  { name: "PHÂN LOẠI", uid: "category" },
  { name: "NGƯỜI NHẬP", uid: "createdBy" },
  { name: "NGƯỜI PHỤ TRÁCH", uid: "assignedTo" },
  { name: "", uid: "actions" },
];

export const TableWrapper = () => {
  const {
    data: customersData,
    isLoading,
    refetch,
  } = useCustomers({
    page: 1,
    pageSize: 10,
  });

  const { data: staffData, isLoading: isStaffLoading } = useStaff();
  const staff = staffData || [];

  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Refs for modals
  const editFormRef = useRef<any>(null);
  const detailModalRef = useRef<any>(null);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const customers = customersData?.data || [];

  // Helper function to get staff name by ID
  const getStaffNameById = (staffId: string): string => {
    console.log("Staff ID:", staffId, "Staff data:", staff);
    if (isStaffLoading) return "Đang tải...";
    const staffMember = staff.find((s) => s.id === staffId);
    return staffMember ? staffMember.name : `ID: ${staffId}`;
  };

  const handleViewCustomer = (customer: Customer) => {
    if (detailModalRef.current) {
      detailModalRef.current.openModal(customer);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    if (editFormRef.current) {
      editFormRef.current.openModal(customer);
    }
  };

  const handleEditFromDetail = (customer: Customer) => {
    if (editFormRef.current) {
      editFormRef.current.openModal(customer);
    }
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
    onDeleteModalOpen();
  };

  const confirmDeleteCustomer = async () => {
    if (customerToDelete) {
      try {
        setIsDeleting(true);

        // Call API to delete customer
        await apiClient.deleteCustomer(customerToDelete.id);

        // Close modal and reset state
        onDeleteModalClose();
        setCustomerToDelete(null);

        // Refresh the customers list
        refetch();

        // Show success notification
        alert("Khách hàng đã được xóa thành công!");
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Có lỗi xảy ra khi xóa khách hàng!");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDownloadTemplate = (customer: Customer) => {
    // TODO: Implement template download
    console.log("Download template for:", customer);
  };

  const handlePrintTemplate = (customer: Customer) => {
    // TODO: Implement template print
    console.log("Print template for:", customer);
  };

  const renderCell = (customer: Customer, columnKey: string, index: number) => {
    switch (columnKey) {
      case "index":
        return (
          <div className="flex items-center">
            <span className="text-bold text-sm">{index + 1}</span>
          </div>
        );
      case "customerCode":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{customer.customerCode}</p>
          </div>
        );
      case "customer":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: `https://i.pravatar.cc/150?u=${customer.id}`,
            }}
            description={customer.email}
            name={customer.name}
            className="cursor-pointer"
            onClick={() => handleViewCustomer(customer)}
          >
            {customer.name}
          </User>
        );
      case "category":
        return (
          <Chip
            className="capitalize"
            color={
              customer.category === "potential"
                ? "warning"
                : customer.category === "closed"
                ? "success"
                : customer.category === "regular"
                ? "primary"
                : "secondary"
            }
            size="sm"
            variant="flat"
          >
            {CUSTOMER_CATEGORIES[customer.category]}
          </Chip>
        );
      case "createdAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">
              {new Date(customer.createdAt).toLocaleDateString("vi-VN")}
            </p>
            <p className="text-xs text-default-400">
              {new Date(customer.createdAt).toLocaleTimeString("vi-VN")}
            </p>
          </div>
        );
      case "createdBy":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{customer.createdBy}</p>
          </div>
        );
      case "assignedTo":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">
              {getStaffNameById(customer.assignedTo)}
            </p>
          </div>
        );
      case "actions":
        return (
          <>
            <div className="flex items-center gap-4">
              <div>
                <Tooltip content="Chi tiết">
                  <button
                    onClick={() => handleViewCustomer(customer)}
                    className="cursor-pointer"
                  >
                    <EyeIcon size={20} fill="#979797" />
                  </button>
                </Tooltip>
              </div>
              <div>
                <Tooltip content="Chỉnh sửa" color="secondary">
                  <button
                    onClick={() => handleEditCustomer(customer)}
                    className="cursor-pointer"
                  >
                    <EditIcon size={20} fill="#979797" />
                  </button>
                </Tooltip>
              </div>
              <div>
                <Tooltip content="Xóa" color="danger">
                  <button
                    onClick={() => handleDeleteCustomer(customer)}
                    className="cursor-pointer"
                  >
                    <DeleteIcon size={20} fill="#FF0080" />
                  </button>
                </Tooltip>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (isLoading || isStaffLoading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div>Đang tải danh sách khách hàng...</div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <Table aria-label="Bảng danh sách khách hàng">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={customers}>
            {(customer) => (
              <TableRow key={customer.id}>
                {(columnKey) => {
                  const index = customers.findIndex(
                    (c) => c.id === customer.id
                  );
                  return (
                    <TableCell>
                      {renderCell(customer, columnKey as string, index)}
                    </TableCell>
                  );
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal xác nhận xóa khách hàng */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} size="md">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <DeleteIcon size={24} fill="#FF0080" />
                  <span>Xác nhận xóa khách hàng</span>
                </div>
              </ModalHeader>
              <ModalBody>
                {customerToDelete && (
                  <div className="space-y-4">
                    <p className="">
                      Bạn có chắc chắn muốn xóa khách hàng này không?
                    </p>
                    <div className=" bg-default-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Image
                          src={`https://i.pravatar.cc/150?u=${customerToDelete.id}`}
                          alt="Avatar"
                          className="w-12 h-12 rounded-full"
                          width={48}
                          height={48}
                        />
                        <div>
                          <p className="font-semibold text-lg">
                            {customerToDelete.name}
                          </p>
                          <p className="text-sm  ">
                            {customerToDelete.customerCode} •{" "}
                            {customerToDelete.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                      <p className="text-red-700 text-sm">
                        <strong>Lưu ý:</strong> Hành động này không thể hoàn
                        tác. Tất cả dữ liệu liên quan đến khách hàng sẽ bị xóa
                        vĩnh viễn.
                      </p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onDeleteModalClose}
                >
                  Hủy bỏ
                </Button>
                <Button
                  color="danger"
                  onPress={confirmDeleteCustomer}
                  className="bg-red-600 hover:bg-red-700"
                  isLoading={isDeleting}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Đang xóa..." : "Xóa khách hàng"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Customer Detail Modal */}
      <CustomerDetailModal ref={detailModalRef} onEdit={handleEditFromDetail} />

      {/* Customer Edit Form Modal */}
      <div style={{ display: "none" }}>
        <CustomerFormModal ref={editFormRef} onSuccess={refetch} />
      </div>
    </>
  );
};
