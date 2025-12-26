"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Divider,
} from "@heroui/react";
import type { Customer, Template } from "@/types";
import { useCustomers } from "@/hooks/use-customers";
import { useTemplates } from "@/hooks/use-templates";
import {
  useGenerateDocument,
  useDownloadDocument,
} from "@/hooks/use-documents";

interface GenerateDocumentModalProps {
  isOpen: boolean;
  onClose?: () => void;
  // Nếu truyền template → chọn customer
  // Nếu truyền customer → chọn template
  template?: Template | null;
  customer?: Customer | null;
}

export const GenerateDocumentModal: React.FC<GenerateDocumentModalProps> = ({
  isOpen,
  onClose,
  template: initialTemplate,
  customer: initialCustomer,
}) => {
  const { data: customersData } = useCustomers();
  const { data: templatesData } = useTemplates();
  const customers = customersData?.data || [];
  const templates = templatesData?.data || [];

  // Xác định mode: từ template chọn customer, hoặc từ customer chọn template
  const isTemplateMode = !!initialTemplate;

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [generatedDocxBase64, setGeneratedDocxBase64] = useState<string>("");
  const [generatedFileName, setGeneratedFileName] = useState<string>("");
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Hooks for API calls
  const generateDocument = useGenerateDocument();
  const downloadDocument = useDownloadDocument();

  // Lấy đối tượng đã chọn
  const selectedCustomer =
    initialCustomer ||
    customers.find((c: Customer) => c.id === selectedCustomerId);
  const selectedTemplate =
    initialTemplate ||
    templates.find((t: Template) => t.id === selectedTemplateId);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCustomerId("");
      setSelectedTemplateId("");
      setGeneratedDocxBase64("");
      setGeneratedFileName("");
      if (previewContainerRef.current) {
        previewContainerRef.current.innerHTML = "";
      }
    }
  }, [isOpen]);

  // Render preview when generatedDocxBase64 changes
  useEffect(() => {
    const renderPreview = async () => {
      if (!generatedDocxBase64 || !previewContainerRef.current) {
        return;
      }

      setIsPreviewLoading(true);

      try {
        const docxPreview = await import("docx-preview");

        const binaryString = atob(generatedDocxBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        previewContainerRef.current.innerHTML = "";

        await docxPreview.renderAsync(
          bytes.buffer,
          previewContainerRef.current,
          undefined,
          {
            className: "docx-wrapper",
            inWrapper: true,
            ignoreWidth: false,
            ignoreHeight: false,
            breakPages: true,
            renderHeaders: true,
            renderFooters: true,
          }
        );
      } catch (error) {
        console.error("Error rendering preview:", error);
        if (previewContainerRef.current) {
          previewContainerRef.current.innerHTML =
            '<p class="text-red-500 p-4">Không thể hiển thị preview</p>';
        }
      } finally {
        setIsPreviewLoading(false);
      }
    };

    if (generatedDocxBase64) {
      const timer = setTimeout(renderPreview, 100);
      return () => clearTimeout(timer);
    }
  }, [generatedDocxBase64]);

  // Kiểm tra đủ điều kiện để generate
  const canGenerate = isTemplateMode
    ? !!initialTemplate && !!selectedCustomerId
    : !!initialCustomer && !!selectedTemplateId;

  const finalTemplateId = initialTemplate?.id || selectedTemplateId;
  const finalCustomerId = initialCustomer?.id || selectedCustomerId;

  // Generate document from template using hook
  const handleGenerate = async () => {
    if (!finalTemplateId || !finalCustomerId) return;

    setGeneratedDocxBase64("");

    generateDocument.mutate(
      { templateId: finalTemplateId, customerId: finalCustomerId },
      {
        onSuccess: (data) => {
          setGeneratedDocxBase64(data.docxBase64);
          setGeneratedFileName(data.fileName);
        },
      }
    );
  };

  // Download as DOCX using hook
  const handleDownloadDocx = () => {
    if (!finalTemplateId || !finalCustomerId) return;

    downloadDocument.mutate({
      templateId: finalTemplateId,
      customerId: finalCustomerId,
      fileName: generatedFileName,
    });
  };

  // Print document
  const handlePrint = () => {
    if (!previewContainerRef.current) return;

    const printContent = previewContainerRef.current.innerHTML;
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Không thể mở cửa sổ in. Vui lòng cho phép popup.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${generatedFileName || "Document"}</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
            .docx-wrapper { box-shadow: none !important; }
          }
          body { 
            font-family: 'Times New Roman', serif; 
            line-height: 1.6;
            background: white;
          }
          .docx-wrapper {
            background: white;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
          }
          table { border-collapse: collapse; width: 100%; }
          td, th { border: 1px solid #ddd; padding: 8px; }
          p { margin: 0.5em 0; }
        </style>
      </head>
      <body>
        ${printContent}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        <\/script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleClose = () => {
    onClose?.();
  };

  // Title và subtitle theo mode
  const modalTitle = isTemplateMode
    ? "Tạo tài liệu từ biểu mẫu"
    : "Tạo tài liệu cho khách hàng";
  const modalSubtitle = isTemplateMode
    ? initialTemplate?.name
    : `${initialCustomer?.name} - ${initialCustomer?.customerCode}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[95vh]",
        body: "py-4",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <span>{modalTitle}</span>
              <p className="text-sm text-default-500 font-normal">
                {modalSubtitle}
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Step 1: Select Customer or Template */}
                <Card>
                  <CardBody className="space-y-4">
                    <h4 className="text-lg font-semibold">
                      {isTemplateMode
                        ? "1. Chọn khách hàng"
                        : "1. Chọn biểu mẫu"}
                    </h4>

                    {isTemplateMode ? (
                      // Chọn Customer
                      <>
                        <Select
                          label="Khách hàng"
                          placeholder="Chọn khách hàng"
                          aria-label="Chọn khách hàng"
                          selectedKeys={
                            selectedCustomerId ? [selectedCustomerId] : []
                          }
                          onSelectionChange={(keys) => {
                            const key = Array.from(keys)[0];
                            setSelectedCustomerId(key as string);
                            setGeneratedDocxBase64("");
                          }}
                          classNames={{ trigger: "min-h-12" }}
                        >
                          {customers.map((customer: Customer) => (
                            <SelectItem
                              key={customer.id}
                              textValue={customer.name}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {customer.name}
                                </span>
                                <span className="text-sm text-default-500">
                                  {customer.customerCode} - {customer.email}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </Select>

                        {selectedCustomer && (
                          <div className="grid grid-cols-2 gap-4 p-4 bg-default-100 rounded-lg">
                            <div>
                              <p className="text-sm text-default-500">Mã KH</p>
                              <p className="font-medium">
                                {selectedCustomer.customerCode}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-default-500">Email</p>
                              <p className="font-medium">
                                {selectedCustomer.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-default-500">
                                Điện thoại
                              </p>
                              <p className="font-medium">
                                {selectedCustomer.phone || "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-default-500">
                                Địa chỉ
                              </p>
                              <p className="font-medium">
                                {selectedCustomer.address || "-"}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      // Chọn Template
                      <>
                        <Select
                          label="Biểu mẫu"
                          placeholder="Chọn biểu mẫu"
                          aria-label="Chọn biểu mẫu"
                          selectedKeys={
                            selectedTemplateId ? [selectedTemplateId] : []
                          }
                          onSelectionChange={(keys) => {
                            const key = Array.from(keys)[0];
                            setSelectedTemplateId(key as string);
                            setGeneratedDocxBase64("");
                          }}
                          classNames={{ trigger: "min-h-12" }}
                        >
                          {templates.map((template: Template) => (
                            <SelectItem
                              key={template.id}
                              textValue={template.name}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {template.name}
                                </span>
                                <span className="text-sm text-default-500">
                                  {template.fileName}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </Select>

                        {selectedTemplate && (
                          <div className="grid grid-cols-2 gap-4 p-4 bg-default-100 rounded-lg">
                            <div>
                              <p className="text-sm text-default-500">
                                Tên biểu mẫu
                              </p>
                              <p className="font-medium">
                                {selectedTemplate.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-default-500">
                                Tên file
                              </p>
                              <p className="font-medium">
                                {selectedTemplate.fileName || "-"}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <Button
                      color="primary"
                      onPress={handleGenerate}
                      isLoading={generateDocument.isPending}
                      isDisabled={!canGenerate || generateDocument.isPending}
                    >
                      {generateDocument.isPending
                        ? "Đang tạo..."
                        : "Tạo tài liệu"}
                    </Button>
                  </CardBody>
                </Card>

                {/* Step 2: Preview & Actions */}
                {generatedDocxBase64 && (
                  <>
                    <Divider />
                    <Card>
                      <CardBody className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold">
                            2. Preview & Tải về
                          </h4>
                          <div className="flex gap-2">
                            <Button
                              color="primary"
                              variant="flat"
                              onPress={handleDownloadDocx}
                              isLoading={downloadDocument.isPending}
                            >
                              Tải về
                            </Button>
                            <Button
                              color="success"
                              variant="flat"
                              onPress={handlePrint}
                            >
                              In
                            </Button>
                          </div>
                        </div>

                        <Chip color="success" variant="flat" size="sm">
                          {generatedFileName}
                        </Chip>

                        {/* Document Preview */}
                        <div className="border rounded-lg overflow-hidden">
                          {isPreviewLoading && (
                            <div className="flex items-center justify-center p-8">
                              <Spinner size="lg" />
                              <span className="ml-3">Đang tải preview...</span>
                            </div>
                          )}
                          <div
                            ref={previewContainerRef}
                            className="docx-preview-container max-h-[500px] overflow-auto bg-white"
                            style={{ minHeight: "300px" }}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={handleClose}>
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
