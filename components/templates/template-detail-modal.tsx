"use client";
import React, { useEffect, useRef, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
} from "@heroui/react";
import { TemplatesIcon } from "@/components/icons/sidebar/templates-icon";
import type { Template } from "@/types";
import { formatDateLong } from "@/lib/dayjs";

interface TemplateDetailModalProps {
  isOpen: boolean;
  onClose?: () => void;
  template: Template | null;
}

export const TemplateDetailModal: React.FC<TemplateDetailModalProps> = ({
  isOpen,
  onClose,
  template,
}) => {
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);

  // Render DOCX preview when template has fileBase64
  const renderDocxPreview = useCallback(async () => {
    if (!template?.fileBase64 || !previewContainerRef.current) return;

    setIsPreviewLoading(true);
    try {
      // Dynamic import docx-preview
      const { renderAsync } = await import("docx-preview");

      // Convert base64 to ArrayBuffer
      const binaryString = atob(template.fileBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const arrayBuffer = bytes.buffer;

      // Clear previous content
      previewContainerRef.current.innerHTML = "";

      // Render DOCX
      await renderAsync(arrayBuffer, previewContainerRef.current, undefined, {
        className: "docx",
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        renderHeaders: true,
        renderFooters: true,
        renderFootnotes: true,
        renderEndnotes: true,
      });
    } catch (error) {
      console.error("Error rendering DOCX preview:", error);
      if (previewContainerRef.current) {
        previewContainerRef.current.innerHTML =
          '<p class="text-red-500 p-4">Không thể hiển thị preview. Vui lòng tải file về để xem.</p>';
      }
    } finally {
      setIsPreviewLoading(false);
    }
  }, [template?.fileBase64]);

  // Trigger preview render when modal opens and has fileBase64
  useEffect(() => {
    if (isOpen && template?.fileBase64) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        renderDocxPreview();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, template?.fileBase64, renderDocxPreview]);

  if (!template) return null;

  const handleClose = () => {
    onClose?.();
  };

  const handleDownload = () => {
    if (template.fileBase64) {
      // Download original file if we have base64
      const binaryString = atob(template.fileBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = template.fileName || `${template.name}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Fallback to HTML content download
      const element = document.createElement("a");
      const file = new Blob([template.content || ""], { type: "text/html" });
      element.href = URL.createObjectURL(file);
      element.download = `${template.name}.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

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
              <div className="flex items-center gap-2">
                <TemplatesIcon />
                <span>Chi tiết biểu mẫu</span>
              </div>
              <p className="text-sm text-default-500 font-normal">
                Xem thông tin chi tiết và nội dung biểu mẫu
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Template Info */}
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold">
                      Thông tin biểu mẫu
                    </h4>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-default-500">Tên biểu mẫu</p>
                        <p className="font-semibold">{template.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Tên file</p>
                        <p className="font-semibold">{template.fileName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Ngày tạo</p>
                        <p className="font-semibold">
                          {formatDateLong(template.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">
                          Cập nhật lần cuối
                        </p>
                        <p className="font-semibold">
                          {formatDateLong(template.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Placeholders */}
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold">
                      Placeholder ({template.placeholders.length})
                    </h4>
                  </CardHeader>
                  <CardBody>
                    {template.placeholders.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {template.placeholders.map((placeholder, index) => (
                          <Chip
                            key={index}
                            color="primary"
                            variant="flat"
                            size="sm"
                          >
                            {placeholder}
                          </Chip>
                        ))}
                      </div>
                    ) : (
                      <p className="text-default-500">
                        Không có placeholder nào trong biểu mẫu này
                      </p>
                    )}
                  </CardBody>
                </Card>

                {/* Content Preview */}
                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold">Nội dung biểu mẫu</h4>
                  </CardHeader>
                  <CardBody>
                    {template.fileBase64 ? (
                      <>
                        {isPreviewLoading && (
                          <div className="flex items-center justify-center p-8">
                            <Spinner size="lg" />
                            <span className="ml-3">Đang tải preview...</span>
                          </div>
                        )}
                        <div
                          ref={previewContainerRef}
                          className="docx-preview-container max-h-[400px] overflow-auto bg-white rounded-lg border"
                          style={{ minHeight: "200px" }}
                        />
                      </>
                    ) : (
                      <Textarea
                        value={template.content || ""}
                        variant="bordered"
                        minRows={15}
                        maxRows={20}
                        isReadOnly
                        classNames={{
                          input: "font-mono text-sm",
                        }}
                      />
                    )}
                  </CardBody>
                </Card>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={handleClose}>
                Đóng
              </Button>
              <Button color="primary" onPress={handleDownload}>
                {template.fileBase64
                  ? "Tải xuống file gốc"
                  : "Tải xuống nội dung"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
