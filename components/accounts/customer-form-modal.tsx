import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/use-customers-ls";
import { useStaff } from "@/hooks/use-staff";
import { Select, SelectItem } from "@heroui/react";
import { DatePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { PlusIcon } from "@/components/icons/plus-icon";

interface CustomerFormModalProps {
  customerData?: any;
  onSuccess?: () => void;
}

export const CustomerFormModal = forwardRef<any, CustomerFormModalProps>(
  ({ customerData, onSuccess }, ref) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const createCustomer = useCreateCustomer();
    const updateCustomer = useUpdateCustomer();
    const { data: staffData } = useStaff();
    const staff = staffData || [];
    const [form, setForm] = useState<any>({
      id: undefined,
      name: "",
      customerCode: "",
      email: "",
      phone: "",
      taxCode: "",
      businessLicenseDate: "",
      representative: "",
      position: "",
      address: "",
      category: "regular" as "regular" | "potential" | "closed" | "promising",
      assignedTo: staff[0]?.id || "1",
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      openModal: (data?: any) => {
        if (data) {
          setForm(data);
        } else {
          // Reset form for new customer
          setForm({
            id: undefined,
            name: "",
            customerCode: "",
            email: "",
            phone: "",
            taxCode: "",
            businessLicenseDate: "",
            representative: "",
            position: "",
            address: "",
            category: "regular",
            assignedTo: staff[0]?.id || "1",
          });
        }
        onOpen();
      },
    }));

    // Handle customer data from props
    useEffect(() => {
      if (customerData) {
        setForm(customerData);
      }
    }, [customerData]);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (onClose: () => void) => {
      setError("");
      setSuccess(false);
      if (!form.name || !form.customerCode || !form.email) {
        setError("Vui lòng nhập đầy đủ các trường bắt buộc!");
        return;
      }
      try {
        if (form.id) {
          await updateCustomer.mutateAsync({
            id: form.id,
            data: { ...form, category: form.category as any },
          });
        } else {
          await createCustomer.mutateAsync({
            ...form,
            createdBy: "System",
            category: form.category as any,
          });
        }
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onOpenChange(); // Close modal
          if (onSuccess) {
            onSuccess();
          }
          // Reset form
          setForm({
            id: undefined,
            name: "",
            customerCode: "",
            email: "",
            phone: "",
            taxCode: "",
            businessLicenseDate: "",
            representative: "",
            position: "",
            address: "",
            category: "regular",
            assignedTo: staff[0]?.id || "1",
          });
        }, 1200);
      } catch (e: any) {
        setError(e.message || "Có lỗi xảy ra!");
      }
    };

    return (
      <div>
        <Button
          onPress={onOpen}
          color="primary"
          className="font-semibold rounded-lg px-6 py-2 shadow-md bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          <span className="mr-2">
            <PlusIcon />
          </span>{" "}
          Thêm khách hàng mới
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="4xl"
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-blue-700 text-xl font-bold">
                  <span>
                    {form.id ? "Cập nhật khách hàng" : "Thêm khách hàng mới"}
                  </span>
                  <span className="text-xs text-gray-400 font-normal">
                    Các trường có dấu * là bắt buộc
                  </span>
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/*  Thông tin chung */}
                    <div className="col-span-1 md:col-span-2   rounded-lg p-4 mb-2 ">
                      <div className="font-semibold mb-2 text-blue-600">
                        Thông tin chung
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Mã khách hàng"
                          name="customerCode"
                          value={form.customerCode}
                          onChange={handleChange}
                          variant="bordered"
                          isRequired
                          className="col-span-1"
                        />
                        <Select
                          label="Người phụ trách"
                          name="assignedTo"
                          selectedKeys={[form.assignedTo]}
                          onSelectionChange={(keys) => {
                            const selectedKey = Array.from(keys)[0] as string;
                            setForm({ ...form, assignedTo: selectedKey });
                          }}
                          variant="bordered"
                          className="col-span-1"
                        >
                          {staff.map((s: any) => (
                            <SelectItem key={s.id}>
                              {s.name + (s.role ? ` (${s.role})` : "")}
                            </SelectItem>
                          ))}
                        </Select>
                        <Select
                          label="Phân loại khách hàng"
                          name="category"
                          selectedKeys={[form.category]}
                          onSelectionChange={(keys) => {
                            const selectedKey = Array.from(keys)[0] as string;
                            setForm({
                              ...form,
                              category: selectedKey as
                                | "regular"
                                | "potential"
                                | "closed"
                                | "promising",
                            });
                          }}
                          variant="bordered"
                          className="col-span-1"
                        >
                          <SelectItem key="regular">
                            Khách hàng thường
                          </SelectItem>
                          <SelectItem key="potential">Tiềm năng</SelectItem>
                          <SelectItem key="closed">Đã ký hợp đồng</SelectItem>
                          <SelectItem key="promising">Khả quan</SelectItem>
                        </Select>
                      </div>
                    </div>
                    {/*  Thông tin khách hàng */}
                    <div className="col-span-1 md:col-span-2   rounded-lg p-4 ">
                      <div className="font-semibold mb-2 text-blue-600">
                        Thông tin khách hàng
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          isRequired
                          label="Tên khách hàng "
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          variant="bordered"
                          className="col-span-1"
                        />
                        <Input
                          label="Mã số thuế"
                          name="taxCode"
                          value={form.taxCode}
                          onChange={handleChange}
                          variant="bordered"
                          className="col-span-1"
                        />
                        <DatePicker
                          label="Ngày cấp GĐKKD"
                          name="businessLicenseDate"
                          value={
                            form.businessLicenseDate
                              ? parseDate(form.businessLicenseDate)
                              : null
                          }
                          onChange={(value) =>
                            setForm({
                              ...form,
                              businessLicenseDate: value
                                ? value.toString()
                                : "",
                            })
                          }
                          variant="bordered"
                          className="col-span-1"
                        />
                        <Input
                          label="Người đại diện"
                          name="representative"
                          value={form.representative}
                          onChange={handleChange}
                          variant="bordered"
                          className="col-span-1"
                        />
                        <Input
                          label="Chức vụ"
                          name="position"
                          value={form.position}
                          onChange={handleChange}
                          variant="bordered"
                          className="col-span-1"
                        />
                        <Input
                          label="Email "
                          isRequired
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          variant="bordered"
                          className="col-span-1"
                          type="email"
                        />
                        <Input
                          label="Số điện thoại"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          variant="bordered"
                          className="col-span-1"
                          type="tel"
                        />
                        <Input
                          label="Địa chỉ"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          variant="bordered"
                          className="col-span-1 md:col-span-2"
                        />
                      </div>
                    </div>
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                  )}
                  {success && (
                    <div className="text-green-600 text-sm mt-2">
                      {form.id
                        ? "Cập nhật thành công!"
                        : "Thêm khách hàng thành công!"}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter className="flex justify-end gap-2">
                  <Button color="danger" variant="flat" onClick={onClose}>
                    Đóng
                  </Button>
                  <Button
                    color="primary"
                    isLoading={
                      createCustomer.isPending || updateCustomer.isPending
                    }
                    className="font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6"
                    onPress={() => handleSubmit(onClose)}
                  >
                    {form.id ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
  }
);

CustomerFormModal.displayName = "CustomerFormModal";
