"use client";
import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { TemplatesIcon } from "@/components/icons/sidebar/templates-icon";
import { Template } from "@/types";

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
  if (!template) return null;

  const handleClose = () => {
    onClose?.();
  };

  const handleDownload = () => {
    // Mock download functionality
    const element = document.createElement("a");
    const file = new Blob([template.content || ""], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${template.name}.docx`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
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
                          {new Date(template.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">
                          Cập nhật lần cuối
                        </p>
                        <p className="font-semibold">
                          {new Date(template.updatedAt).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
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
                  </CardBody>
                </Card>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={handleClose}>
                Đóng
              </Button>
              <Button color="primary" onPress={handleDownload}>
                Tải xuống nội dung
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
