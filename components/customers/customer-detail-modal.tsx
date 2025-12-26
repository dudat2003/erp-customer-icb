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
import { useTemplates } from "@/hooks/use-templates";
import { generateContractCode } from "@/types";
import { DownloadIcon } from "@/components/icons/templates/download-icon";
import { PrintIcon } from "@/components/icons/templates/print-icon";
import { saveAs } from "file-saver";
import type { Template } from "@prisma/client";
import { CUSTOMER_CATEGORIES } from "@/types";
import dayjs, { formatDate } from "@/lib/dayjs";

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

  // Lấy danh sách template thật
  const { data: templates, isLoading: isLoadingTemplates } = useTemplates();

  // Fill dữ liệu customer vào template
  const fillTemplateData = (template: Template) => {
    if (!customer) return template.content || "";

    let filledContent = template.content || "";

    // Mapping dữ liệu customer với placeholder
    const dataMapping = {
      "{Tên khách hàng}": customer.name || "",
      "{Mã khách hàng}": customer.customerCode || "",
      "{Mã số thuế}": customer.taxCode || "",
      "{Ngày cấp GĐKKD}": customer.businessLicenseDate
        ? formatDate(customer.businessLicenseDate)
        : "",
      "{Người đại diện}": customer.representative || "",
      "{Chức vụ}": customer.position || "",
      "{Email}": customer.email || "",
      "{Số điện thoại}": customer.phone || "",
      "{Địa chỉ}": customer.address || "",
      "{Ngày tạo hợp đồng}": dayjs().format("DD/MM/YYYY"),
      "{Mã hợp đồng}": generateContractCode(customer.customerCode),
    };

    // Thay thế các placeholder bằng dữ liệu thực
    Object.entries(dataMapping).forEach(([placeholder, value]) => {
      filledContent = filledContent.replace(
        new RegExp(placeholder, "g"),
        value
      );
    });

    return filledContent;
  };

  // Tải file .docx thật từ HTML template đã fill thông tin customer
  const handleDownloadTemplate = async (template: Template) => {
    if (!customer) return;

    try {
      const filledContent = fillTemplateData(template);

      // Tạo HTML với style cơ bản
      const htmlContent = `
          <html>
            <head>
              <meta charset="UTF-8">
              <title>${template.name} - ${customer.name}</title>
              <style>
                body { 
                  font-family: 'Times New Roman', serif; 
                  margin: 40px; 
                  line-height: 1.6; 
                  font-size: 12pt;
                }
                h1 { 
                  color: #333; 
                  font-size: 16pt; 
                  margin-bottom: 20px;
                  text-align: center;
                }
                p { 
                  margin: 10px 0; 
                  text-align: justify;
                }
                .content {
                  white-space: pre-wrap;
                }
              </style>
            </head>
            <body>
              <h1>${template.name}</h1>
              <div class="content">${filledContent}</div>
            </body>
          </html>
        `;

      // Gọi API để chuyển HTML sang DOCX
      const fileName = `${
        template.fileName?.replace(".docx", "") || "template"
      }_${customer.customerCode}_filled.docx`;

      const response = await fetch("/api/templates/generate-docx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlContent,
          fileName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate DOCX");
      }

      const docxBlob = await response.blob();
      saveAs(docxBlob, fileName);
    } catch (error) {
      console.error("Lỗi khi tạo file .docx:", error);
      // Fallback về text file nếu có lỗi
      const filledContent = fillTemplateData(template);
      const blob = new Blob([filledContent || ""], {
        type: "text/plain;charset=utf-8",
      });
      const fileName = `${
        template.fileName?.replace(".docx", "") || "template"
      }_${customer.customerCode}_filled.txt`;
      saveAs(blob, fileName);
    }
  };

  const handlePrintTemplate = (template: Template) => {
    if (!customer) return;

    const filledContent = fillTemplateData(template);

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
          <html>
            <head>
              <title>${template.name} - ${customer.name}</title>
              <style>
                body { 
                  font-family: 'Times New Roman', serif; 
                  margin: 40px; 
                  line-height: 1.6; 
                  font-size: 12pt;
                }
                h1 { 
                  color: #333; 
                  font-size: 16pt; 
                  margin-bottom: 20px;
                  text-align: center;
                }
                p { 
                  margin: 10px 0; 
                  text-align: justify;
                }
                .content {
                  white-space: pre-wrap;
                }
              </style>
            </head>
            <body>
              <h1>${template.name}</h1>
              <div class="content">${filledContent}</div>
            </body>
          </html>
        `);
      printWindow.document.close();
      printWindow.print();
    }
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

                {/* Danh sách biểu mẫu */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <h4 className="font-semibold text-blue-600">
                      Danh sách biểu mẫu{" "}
                      {isLoadingTemplates
                        ? ""
                        : `(${templates?.data?.length || 0})`}
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      {isLoadingTemplates ? (
                        <div className="text-center py-8 text-default-500">
                          Đang tải...
                        </div>
                      ) : templates && templates?.data?.length > 0 ? (
                        templates.data.map((template) => (
                          <div
                            key={template.id}
                            className="flex items-center justify-between p-3 bg-default-50 rounded-lg hover:bg-default-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">
                                  DOC
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {template.name}
                                </p>
                                <p className="text-xs text-default-500">
                                  {template.fileName || "N/A"} •{" "}
                                  {formatDate(template.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                color="primary"
                                onPress={() => handleDownloadTemplate(template)}
                                className="hover:scale-110 transition-transform"
                              >
                                <DownloadIcon />
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                color="secondary"
                                onPress={() => handlePrintTemplate(template)}
                                className="hover:scale-110 transition-transform"
                              >
                                <PrintIcon />
                              </Button>
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
});

CustomerDetailModal.displayName = "CustomerDetailModal";
