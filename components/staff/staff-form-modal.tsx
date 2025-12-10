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
import { useCreateStaff, useUpdateStaff } from "@/hooks/use-staff";
import { PlusIcon } from "@/components/icons/plus-icon";
import type { Staff } from "@prisma/client";
import toast from "react-hot-toast";

interface StaffFormModalProps {
	staffData?: Staff;
	onSuccess?: () => void;
}

export const StaffFormModal = forwardRef<any, StaffFormModalProps>(
	({ staffData, onSuccess }, ref) => {
		const { isOpen, onOpen, onOpenChange } = useDisclosure();
		const createStaff = useCreateStaff();
		const updateStaff = useUpdateStaff();
		const [form, setForm] = useState<Partial<Staff>>({
			name: "",
			email: "",
			role: "",
		});

		useImperativeHandle(ref, () => ({
			openModal: (staff?: Staff) => {
				if (staff) {
					setForm(staff);
				} else {
					setForm({
						name: "",
						email: "",
						role: "",
					});
				}
				onOpen();
			},
		}));

		useEffect(() => {
			if (staffData) {
				setForm(staffData);
			}
		}, [staffData]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setForm({
				...form,
				[e.target.name]: e.target.value,
			});
		};

		const handleSubmit = async () => {
			try {
				if (form.id) {
					// Update existing staff
					await updateStaff.mutateAsync({
						id: form.id,
						data: form as Staff,
					});
					toast.success("Cập nhật nhân viên thành công!");
				} else {
					// Create new staff
					await createStaff.mutateAsync(form as Staff);
					toast.success("Thêm nhân viên thành công!");
				}
				onSuccess?.();
				onOpenChange();
			} catch (error: any) {
				const errorMessage =
					error?.response?.data?.error || "Có lỗi xảy ra. Vui lòng thử lại!";
				toast.error(errorMessage);
			}
		};

		return (
			<>
				{!staffData && (
					<Button onPress={onOpen} color="primary" startContent={<PlusIcon />}>
						Thêm nhân viên
					</Button>
				)}
				<Modal
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					placement="top-center"
					size="2xl"
				>
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1">
									{form.id ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
								</ModalHeader>
								<ModalBody>
									<div className="grid grid-cols-1 gap-4">
										<Input
											autoFocus
											label="Họ và tên"
											name="name"
											placeholder="Nhập họ và tên"
											value={form.name}
											onChange={handleChange}
											variant="bordered"
											isRequired
										/>
										<Input
											label="Email"
											name="email"
											placeholder="name@company.com"
											type="email"
											value={form.email}
											onChange={handleChange}
											variant="bordered"
											isRequired
										/>
										<Input
											label="Chức vụ"
											name="role"
											placeholder="Nhập chức vụ"
											value={form.role || ""}
											onChange={handleChange}
											variant="bordered"
										/>
									</div>
								</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="flat" onPress={onClose}>
										Hủy
									</Button>
									<Button
										color="primary"
										onPress={handleSubmit}
										isLoading={createStaff.isPending || updateStaff.isPending}
									>
										{form.id ? "Cập nhật" : "Thêm mới"}
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
			</>
		);
	},
);

StaffFormModal.displayName = "StaffFormModal";
