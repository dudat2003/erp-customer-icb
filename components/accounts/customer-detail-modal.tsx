import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Chip,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Link,
} from "@heroui/react";
import { useState, forwardRef, useImperativeHandle } from "react";
import { Customer, CUSTOMER_CATEGORIES } from "@/types";
import { useStaff } from "@/hooks/use-staff";
import { useTemplates } from "@/hooks/use-templates";
import { DownloadIcon } from "@/components/icons/templates/download-icon";
import { PrintIcon } from "@/components/icons/templates/print-icon";

interface CustomerDetailModalProps {
  onEdit?: (customer: Customer) => void;
}

export const CustomerDetailModal = forwardRef<any, CustomerDetailModalProps>(
  ({ onEdit }, ref) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const { data: staffData } = useStaff();
    const staff = staffData || [];

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      openModal: (customerData: Customer) => {
        setCustomer(customerData);
        onOpen();
      },
    }));

    // Helper function to get staff name by ID
    const getStaffNameById = (staffId: string): string => {
      const staffMember = staff.find((s) => s.id === staffId);
      return staffMember ? staffMember.name : `ID: ${staffId}`;
    };

    // Lấy danh sách template thật
    const { data: templates, isLoading: isLoadingTemplates } = useTemplates();


    // Tải file txt đã fill thông tin customer
    const handleDownloadTemplate = async (template: any) => {
      if (!customer) return;
      try {
        const res = await fetch(`/api/templates/${template.id}/fill?customerId=${customer.id}&download=1`);
        if (!res.ok) {
          alert("Không thể tải file biểu mẫu");
          return;
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${template.name.replace(/\.docx$/i, "")}-${customer.name}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (e) {
        alert("Có lỗi khi tải file");
      }
    };

    const handlePrintTemplate = (template: any) => {
      console.log("Print template:", template);
      // TODO: Implement print functionality
    };

    const handleEditCustomer = () => {
      if (customer && onEdit) {
        onEdit(customer);
        onOpenChange(); // Close detail modal
      }
    };

    if (!customer) return null;

    return (
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
                    {CUSTOMER_CATEGORIES[customer.category]}
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
                          <label className="text-sm font-medium text-default-600">
                            Tên khách hàng
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.name}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-default-600">
                            Email
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.email}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-default-600">
                            Số điện thoại
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.phone || "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-default-600">
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
                          <label className="text-sm font-medium text-default-600">
                            Mã số thuế
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.taxCode || "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-default-600">
                            Ngày cấp GĐKKD
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.businessLicenseDate
                              ? new Date(
                                  customer.businessLicenseDate
                                ).toLocaleDateString("vi-VN")
                              : "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-default-600">
                            Người đại diện
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.representative || "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-default-600">
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
                          <label className="text-sm font-medium text-default-600">
                            Người phụ trách
                          </label>
                          <p className="text-sm text-default-900">
                            {getStaffNameById(customer.assignedTo)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-default-600">
                            Người tạo
                          </label>
                          <p className="text-sm text-default-900">
                            {customer.createdBy}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-default-600">
                            Ngày tạo
                          </label>
                          <p className="text-sm text-default-900">
                            {new Date(customer.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Danh sách biểu mẫu */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <h4 className="font-semibold text-blue-600">
                        Danh sách biểu mẫu {isLoadingTemplates ? '' : `(${templates?.length || 0})`}
                      </h4>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-3">
                        {isLoadingTemplates ? (
                          <div className="text-center py-8 text-default-500">Đang tải...</div>
                        ) : templates && templates.length > 0 ? (
                          templates.map((template) => (
                            <div
                              key={template.id}
                              className="flex items-center justify-between p-3 bg-default-50 rounded-lg hover:bg-default-100 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-blue-600 font-semibold text-sm">DOC</span>
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{template.name}</p>
                                  <p className="text-xs text-default-500">
                                    {template.fileName} • {new Date(template.createdAt).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="light"
                                  color="primary"
                                  isIconOnly
                                  onPress={() => handleDownloadTemplate(template)}
                                >
                                  <DownloadIcon />
                                </Button>
                                {/* Có thể thêm nút Print nếu muốn */}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-default-500">
                            <p>Chưa có biểu mẫu nào</p>
                          </div>
                        )}
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
    );
  }
);

CustomerDetailModal.displayName = "CustomerDetailModal";
