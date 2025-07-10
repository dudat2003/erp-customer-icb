import { Card, CardBody, Spinner } from "@heroui/react";
import React from "react";
import { useTemplates } from "@/hooks/use-templates-ls";
import { FileIcon } from "@/components/icons/table/file-icon";

export const CardBalance4 = () => {
  const { data: templatesData, isLoading } = useTemplates();
  const templates = templatesData?.data || [];
  const totalTemplates = templates.length;

  return (
    <Card className="xl:max-w-sm bg-secondary-100 rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5 overflow-hidden">
        <div className="flex gap-2.5">
          <span className="text-3xl">
            <FileIcon />
          </span>
          <div className="flex flex-col">
            <span className=" ">Biểu mẫu</span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className="  text-xl font-semibold">
            {isLoading ? (
              <Spinner />
            ) : (
              ` ${totalTemplates.toLocaleString("vi-VN")} biểu mẫu có sẵn`
            )}
          </span>
        </div>
      </CardBody>
    </Card>
  );
};
