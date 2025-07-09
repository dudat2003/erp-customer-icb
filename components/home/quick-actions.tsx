import { Button, Tooltip } from "@heroui/react";
import { UploadIcon } from "../icons/templates/upload-icon";
import { useRouter } from "next/navigation";
import { CustomerFormModal } from "@/components/accounts/customer-form-modal";

export const QuickActions = () => {
  const router = useRouter();

  const handleUploadTemplate = () => {
    // TODO: Open upload template modal or navigate to template page
    console.log("Upload template clicked");
  };

  return (
    <div className="w-full bg-gradient-to-r p-4 rounded-xl from-primary-50 to-secondary-50 border border-default-200">
      <div className="  ">
        <div className="md:flex space-y-4   items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-default-700">
              Lối tắt nhanh
            </h4>
          </div>
          <div className="flex gap-3">
            <Tooltip
              content="Tạo hồ sơ khách hàng mới trong hệ thống"
              placement="bottom"
              color="primary"
              delay={500}
            >
              <div className="hover:scale-105 transition-transform duration-200">
                <CustomerFormModal />
              </div>
            </Tooltip>
            <Tooltip
              content="Upload template Word để tạo biểu mẫu cho khách hàng"
              placement="bottom"
              color="secondary"
              delay={500}
            >
              <Button
                color="secondary"
                variant="flat"
                startContent={<UploadIcon />}
                size="md"
                onPress={handleUploadTemplate}
                className="hover:scale-105 transition-transform duration-200"
              >
                Tải biểu mẫu mới
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
