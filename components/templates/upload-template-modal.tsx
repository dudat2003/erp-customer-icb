"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Divider,
  Spinner,
} from "@heroui/react";
import { UploadIcon } from "@/components/icons/templates/upload-icon";
import { useCreateTemplate } from "@/hooks/use-templates";
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
  const [content, setContent] = useState(""); // HTML content for placeholder replacement
  const [fileBase64, setFileBase64] = useState(""); // Original file for preview
  const [detectedPlaceholders, setDetectedPlaceholders] = useState<string[]>(
    []
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const { mutate: createTemplate, isPending } = useCreateTemplate();

  // Render docx preview when fileBase64 changes
  const renderDocxPreview = useCallback(async () => {
    if (!fileBase64 || !previewContainerRef.current) {
      return;
    }

    setIsPreviewLoading(true);

    try {
      // Dynamic import docx-preview (only on client)
      const docxPreview = await import("docx-preview");

      // Convert base64 to ArrayBuffer
      const binaryString = atob(fileBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Clear previous preview
      previewContainerRef.current.innerHTML = "";

      // Render docx with ArrayBuffer
      await docxPreview.renderAsync(
        bytes.buffer,
        previewContainerRef.current,
        undefined,
        {
          className: "docx-wrapper",
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
          experimental: true,
          trimXmlDeclaration: true,
          useBase64URL: true,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
          renderEndnotes: true,
        }
      );

      setPreviewError(false);
    } catch (error) {
      setPreviewError(true);
    } finally {
      setIsPreviewLoading(false);
    }
  }, [fileBase64]);

  useEffect(() => {
    if (fileBase64 && isOpen) {
      // Delay to ensure DOM is ready
      const timer = setTimeout(() => {
        renderDocxPreview();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [fileBase64, isOpen, renderDocxPreview]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".docx")) {
      alert("Vui lòng chọn file định dạng .docx");
      return;
    }

    setFileName(file.name);
    setTemplateName(file.name.replace(".docx", ""));
    setIsAnalyzing(true);
    setPreviewError(false); // Reset preview error for new file

    try {
      const arrayBuffer = await file.arrayBuffer();

      // 1. Convert to base64 for storage and preview
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < uint8Array.length; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      const base64 = btoa(binary);
      setFileBase64(base64);

      // 2. Extract HTML content using mammoth (for placeholder replacement)
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const htmlContent = result.value;
      setContent(htmlContent);

      // 3. Detect placeholders
      const placeholders = PLACEHOLDER_VARIABLES.filter((placeholder) =>
        htmlContent.includes(placeholder)
      );
      setDetectedPlaceholders(placeholders);

      if (result.messages.length > 0) {
        console.warn("Mammoth warnings:", result.messages);
      }
    } catch (error) {
      console.error("Error analyzing file:", error);
      alert("Có lỗi xảy ra khi phân tích file. Vui lòng thử lại.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (!templateName.trim() || !fileName.trim() || !fileBase64) {
      alert("Vui lòng điền đầy đủ thông tin và chọn file");
      return;
    }

    const newTemplate = {
      id: Date.now().toString(),
      name: templateName,
      description: "",
      fileName: fileName,
      content: content, // HTML for placeholder replacement
      fileBase64: fileBase64, // Original file for preview
      placeholders: detectedPlaceholders,
      createdAt: new Date(),
      updatedAt: new Date(),
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
    setFileBase64("");
    setDetectedPlaceholders([]);
    setIsAnalyzing(false);
    setPreviewError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (previewContainerRef.current) {
      previewContainerRef.current.innerHTML = "";
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
                <UploadIcon />
                <span>Tải lên biểu mẫu mới</span>
              </div>
              <p className="text-sm text-default-500 font-normal">
                Chọn file .docx để tải lên và xem preview đúng format gốc
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
                      isLoading={isAnalyzing}
                    >
                      {isAnalyzing ? "Đang phân tích..." : "Chọn file .docx"}
                    </Button>
                    {fileName && (
                      <Chip color="success" variant="flat">
                        {fileName}
                      </Chip>
                    )}
                  </div>
                </div>

                {fileName && !isAnalyzing && (
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
                          isReadOnly
                          variant="bordered"
                        />
                      </div>
                    </div>

                    <Divider />

                    {/* Placeholders Section */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">
                        3. Placeholder được phát hiện
                      </h4>
                      <Card>
                        <CardBody className="p-4">
                          {detectedPlaceholders.length > 0 ? (
                            <div className="space-y-3">
                              <p className="text-sm text-default-600">
                                Tìm thấy {detectedPlaceholders.length}{" "}
                                placeholder:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {detectedPlaceholders.map((placeholder) => (
                                  <Chip
                                    key={placeholder}
                                    color="primary"
                                    variant="flat"
                                    size="sm"
                                  >
                                    {placeholder}
                                  </Chip>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-warning-600 font-medium">
                                ⚠️ Không tìm thấy placeholder nào
                              </p>
                              <p className="text-sm text-default-500">
                                Hãy đảm bảo file chứa các placeholder hợp lệ:{" "}
                                <code className="text-xs bg-default-100 px-1 rounded">
                                  {"{Tên khách hàng}"}
                                </code>
                                ,{" "}
                                <code className="text-xs bg-default-100 px-1 rounded">
                                  {"{Mã khách hàng}"}
                                </code>
                                , v.v.
                              </p>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    </div>

                    <Divider />

                    {/* DOCX Preview Section */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">
                        4. Preview biểu mẫu
                      </h4>
                      <Card>
                        <CardBody className="p-0">
                          {isPreviewLoading && (
                            <div className="flex items-center justify-center p-8">
                              <Spinner size="lg" />
                              <span className="ml-3">Đang tải preview...</span>
                            </div>
                          )}

                          {/* DOCX Preview Container */}
                          <div
                            ref={previewContainerRef}
                            className="docx-preview-container overflow-auto bg-white"
                            style={{
                              minHeight:
                                fileBase64 && !previewError ? "300px" : "0",
                              maxHeight: "500px",
                              display: previewError ? "none" : "block",
                            }}
                          />

                          {/* Fallback HTML Preview when docx-preview fails */}
                          {previewError && content && (
                            <div className="p-4">
                              <p className="text-sm text-warning-600 mb-3">
                                ⚠️ Không thể render preview format gốc. Hiển thị
                                nội dung HTML:
                              </p>
                              <div
                                className="prose prose-sm max-w-none border rounded-lg p-4 bg-gray-50 max-h-[400px] overflow-y-auto"
                                dangerouslySetInnerHTML={{ __html: content }}
                              />
                            </div>
                          )}
                        </CardBody>
                      </Card>
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
                isDisabled={
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
