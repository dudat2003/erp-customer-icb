import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Chip,
  Card,
  CardBody,
  CardHeader,
} from "@heroui/react";
import { useState, forwardRef, useImperativeHandle } from "react";
import type { Customer } from "@prisma/client";
import { useStaff } from "@/hooks/use-staff";
import { CUSTOMER_CATEGORIES } from "@/types";
import { formatDate } from "@/lib/dayjs";
import { GenerateDocumentModal } from "@/components/shared/generate-document-modal";

interface CustomerDetailModalProps {
  onEdit?: (customer: Customer) => void;
}

export const CustomerDetailModal = forwardRef<
  { openModal: (customer: Customer) => void },
  CustomerDetailModalProps
>(({ onEdit }, ref) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const { data: staffData } = useStaff();
  const staff = staffData?.data || [];

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    openModal: (customerData: Customer) => {
      setCustomer(customerData);
      onOpen();
    },
  }));

  // Helper function to get staff name by ID
  const getStaffNameById = (staffId: string | null): string => {
    const staffMember = staff.find((s) => s.id === staffId);
    return staffMember ? staffMember.name : `ID: ${staffId}`;
  };

  // State for generate document modal
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  const handleEditCustomer = () => {
    if (customer && onEdit) {
      onEdit(customer);
      onOpenChange(); // Close detail modal
    }
  };

  if (!customer) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        placement="top-center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-blue-700">
                      Chi tiết khách hàng
                    </h3>
                    <p className="text-sm text-default-500">
                      Mã khách hàng: {customer.customerCode}
                    </p>
                  </div>
                  <Chip
                    color={
                      customer.category === "potential"
                        ? "warning"
                        : customer.category === "closed"
                        ? "success"
                        : customer.category === "regular"
                        ? "primary"
                        : "secondary"
                    }
                    variant="flat"
                    size="lg"
                  >
                    {customer.category
                      ? CUSTOMER_CATEGORIES[
                          customer.category as keyof typeof CUSTOMER_CATEGORIES
                        ]
                      : "N/A"}
                  </Chip>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Thông tin cơ bản */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <h4 className="font-semibold text-blue-600">
                        Thông tin cơ bản
                      </h4>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label
                            htmlFor="name"
                            className="text-sm font-medium text-default-600"
                          >
                            Tên khách hàng
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.name}
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className="text-sm font-medium text-default-600"
                          >
                            Email
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.email}
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="text-sm font-medium text-default-600"
                          >
                            Số điện thoại
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.phone || "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="address"
                            className="text-sm font-medium text-default-600"
                          >
                            Địa chỉ
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.address || "Chưa có"}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Thông tin doanh nghiệp */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <h4 className="font-semibold text-blue-600">
                        Thông tin doanh nghiệp
                      </h4>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label
                            htmlFor="taxCode"
                            className="text-sm font-medium text-default-600"
                          >
                            Mã số thuế
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.taxCode || "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="businessLicenseDate"
                            className="text-sm font-medium text-default-600"
                          >
                            Ngày cấp GĐKKD
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.businessLicenseDate
                              ? formatDate(customer.businessLicenseDate)
                              : "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="representative"
                            className="text-sm font-medium text-default-600"
                          >
                            Người đại diện
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.representative || "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="position"
                            className="text-sm font-medium text-default-600"
                          >
                            Chức vụ
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.position || "Chưa có"}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Thông tin quản lý */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <h4 className="font-semibold text-blue-600">
                        Thông tin quản lý
                      </h4>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label
                            htmlFor="assignedTo"
                            className="text-sm font-medium text-default-600"
                          >
                            Người phụ trách
                          </label>
                          <p className="text-sm text-default-900">
                            {getStaffNameById(customer.assignedTo)}
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="createdBy"
                            className="text-sm font-medium text-default-600"
                          >
                            Người tạo
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.createdBy}
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="createdAt"
                            className="text-sm font-medium text-default-600"
                          >
                            Ngày tạo
                          </label>
                          <p className="text-sm text-default-900">
                            {formatDate(customer.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Tạo tài liệu */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <h4 className="font-semibold text-blue-600">
                        Tạo tài liệu
                      </h4>
                    </CardHeader>
                    <CardBody>
                      <div className="text-center py-4">
                        <p className="text-sm text-default-500 mb-4">
                          Tạo tài liệu từ biểu mẫu với thông tin khách hàng
                        </p>
                        <Button
                          color="primary"
                          onPress={() => setIsGenerateModalOpen(true)}
                        >
                          Tạo tài liệu mới
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-between">
                <Button color="danger" variant="flat" onPress={onClose}>
                  Đóng
                </Button>
                <div className="flex gap-2">
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={handleEditCustomer}
                  >
                    Chỉnh sửa
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <GenerateDocumentModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        customer={customer}
      />
    </>
  );
});

CustomerDetailModal.displayName = "CustomerDetailModal";
