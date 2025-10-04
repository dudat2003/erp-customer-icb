"use client";
import React, { useState, useRef } from "react";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Divider,
} from "@heroui/react";
import { UploadIcon } from "@/components/icons/templates/upload-icon";
import { useCreateTemplate } from "@/hooks/use-templates-ls";
import { PLACEHOLDER_VARIABLES } from "@/types";
import mammoth from "mammoth";

interface UploadTemplateModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const UploadTemplateModal: React.FC<UploadTemplateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [templateName, setTemplateName] = useState("");
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const [detectedPlaceholders, setDetectedPlaceholders] = useState<string[]>(
    []
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createTemplate, isPending } = useCreateTemplate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".docx")) {
      alert("Vui lòng chọn file định dạng .docx");
      return;
    }

    setFileName(file.name);
    setTemplateName(file.name.replace(".docx", ""));

    // Mock file reading and placeholder detection
    analyzeFile(file);
  };

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true);

    try {
      // Sử dụng mammoth để chuyển đổi file .docx sang HTML
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      // Lấy HTML content
      const htmlContent = result.value;
      
      // Chuyển HTML về text để hiển thị trong textarea (có thể preview)
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      // Lưu cả HTML và text content
      setContent(htmlContent); // Lưu HTML để sau này dùng cho export
      
      // Detect placeholders from HTML content
      const placeholders = PLACEHOLDER_VARIABLES.filter((placeholder) =>
        htmlContent.includes(placeholder)
      );

      setDetectedPlaceholders(placeholders);
      setIsAnalyzing(false);
      
      // Log warnings nếu có
      if (result.messages.length > 0) {
        console.warn('Mammoth warnings:', result.messages);
      }
      
    } catch (error) {
      console.error('Error analyzing file:', error);
      setIsAnalyzing(false);
      alert('Có lỗi xảy ra khi phân tích file. Vui lòng thử lại.');
    }
  };

  const handleSubmit = () => {
    if (!templateName.trim() || !fileName.trim() || !content.trim()) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const newTemplate = {
      id: Date.now().toString(),
      name: templateName,
      fileName: fileName,
      content: content,
      placeholders: detectedPlaceholders,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    createTemplate(newTemplate, {
      onSuccess: () => {
        onSuccess?.();
        handleReset();
      },
      onError: (error) => {
        console.error("Error creating template:", error);
        alert("Có lỗi xảy ra khi tạo biểu mẫu");
      },
    });
  };

  const handleReset = () => {
    setTemplateName("");
    setFileName("");
    setContent("");
    setDetectedPlaceholders([]);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    handleReset();
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="4xl"
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
                <UploadIcon />
                <span>Tải lên biểu mẫu mới</span>
              </div>
              <p className="text-sm text-default-500 font-normal">
                Chọn file .docx để tải lên và hệ thống sẽ tự động phát hiện
                placeholder
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* File Upload Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">
                    1. Chọn file biểu mẫu
                  </h4>
                  <div className="flex items-center gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<UploadIcon />}
                      onPress={() => fileInputRef.current?.click()}
                    >
                      Chọn file .docx
                    </Button>
                    {fileName && (
                      <Chip color="success" variant="flat">
                        {fileName}
                      </Chip>
                    )}
                  </div>
                </div>

                {fileName && (
                  <>
                    <Divider />

                    {/* Template Info Section */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">
                        2. Thông tin biểu mẫu
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Tên biểu mẫu"
                          placeholder="Nhập tên biểu mẫu"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          variant="bordered"
                        />
                        <Input
                          label="Tên file"
                          placeholder="Tên file gốc"
                          value={fileName}
                          onChange={(e) => setFileName(e.target.value)}
                          variant="bordered"
                        />
                      </div>
                    </div>

                    <Divider />

                    {/* Content Preview Section */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">
                        3. Nội dung biểu mẫu
                      </h4>
                      {isAnalyzing ? (
                        <Card>
                          <CardBody className="flex items-center justify-center p-8">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                              <p className="text-default-600">
                                Đang phân tích file...
                              </p>
                            </div>
                          </CardBody>
                        </Card>
                      ) : (
                        <div className="space-y-4">
                          <Textarea
                            label="Nội dung HTML"
                            placeholder="Nội dung HTML sẽ được tự động trích xuất từ file"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            variant="bordered"
                            minRows={8}
                            maxRows={12}
                            description="Nội dung này đã được chuyển đổi từ file .docx sang HTML"
                          />
                          {content && (
                            <Card>
                              <CardBody>
                                <h5 className="font-medium text-sm mb-2">Preview nội dung:</h5>
                                <div 
                                  className="prose prose-sm max-w-none border rounded-lg p-3 bg-gray-50 max-h-48 overflow-y-auto"
                                  dangerouslySetInnerHTML={{ __html: content }}
                                />
                              </CardBody>
                            </Card>
                          )}
                        </div>
                      )}
                    </div>

                    <Divider />

                    {/* Placeholders Section */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">
                        4. Placeholder được phát hiện
                      </h4>
                      {isAnalyzing ? (
                        <Card>
                          <CardBody className="p-4">
                            <p className="text-default-600">
                              Đang phát hiện placeholder...
                            </p>
                          </CardBody>
                        </Card>
                      ) : (
                        <Card>
                          <CardBody className="p-4">
                            {detectedPlaceholders.length > 0 ? (
                              <div className="space-y-3">
                                <p className="text-sm text-default-600">
                                  Tìm thấy {detectedPlaceholders.length}{" "}
                                  placeholder:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {detectedPlaceholders.map(
                                    (placeholder, index) => (
                                      <Chip
                                        key={index}
                                        color="primary"
                                        variant="flat"
                                        size="sm"
                                      >
                                        {placeholder}
                                      </Chip>
                                    )
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-default-500">
                                Không tìm thấy placeholder nào. Hãy đảm bảo file
                                chứa các placeholder hợp lệ như{" "}
                                {"{Tên khách hàng}"}, {"{Mã khách hàng}"}, v.v.
                              </p>
                            )}
                          </CardBody>
                        </Card>
                      )}
                    </div>
                  </>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={handleClose}>
                Hủy bỏ
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isPending}
                disabled={
                  isPending || isAnalyzing || !fileName || !templateName.trim()
                }
              >
                {isPending ? "Đang tạo..." : "Tạo biểu mẫu"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
