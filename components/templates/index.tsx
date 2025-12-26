"use client";
import React, { useState } from "react";
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
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
	useDisclosure,
} from "@heroui/react";
import Link from "next/link";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { TemplatesIcon } from "@/components/icons/sidebar/templates-icon";
import { UploadIcon } from "@/components/icons/templates/upload-icon";
import { EyeIcon } from "@/components/icons/table/eye-icon";
import { DeleteIcon } from "@/components/icons/table/delete-icon";
import { useTemplates, useDeleteTemplate } from "@/hooks/use-templates";
import { Template } from "@/types";
import { UploadTemplateModal } from "@/components/templates/upload-template-modal";
import { formatDate } from "@/lib/dayjs";
import { TemplateDetailModal } from "@/components/templates/template-detail-modal";

const columns = [
	{ name: "TÊN BIỂU MẪU", uid: "name" },
	{ name: "TÊN FILE", uid: "fileName" },
	{ name: "PLACEHOLDER", uid: "placeholders" },
	{ name: "NGÀY TẠO", uid: "createdAt" },
	{ name: "THAO TÁC", uid: "actions" },
];

export const Templates = () => {
	const { data: templates, isLoading, refetch } = useTemplates();
	const { mutate: deleteTemplate } = useDeleteTemplate();

	const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
		null,
	);
	const [templateToDelete, setTemplateToDelete] = useState<Template | null>(
		null,
	);
	const [isDeleting, setIsDeleting] = useState(false);

	const {
		isOpen: isUploadModalOpen,
		onOpen: onUploadModalOpen,
		onClose: onUploadModalClose,
	} = useDisclosure();

	const {
		isOpen: isDetailModalOpen,
		onOpen: onDetailModalOpen,
		onClose: onDetailModalClose,
	} = useDisclosure();

	const {
		isOpen: isDeleteModalOpen,
		onOpen: onDeleteModalOpen,
		onClose: onDeleteModalClose,
	} = useDisclosure();

	const handleViewTemplate = (template: Template) => {
		setSelectedTemplate(template);
		onDetailModalOpen();
	};

	const handleDeleteTemplate = (template: Template) => {
		setTemplateToDelete(template);
		onDeleteModalOpen();
	};

	const confirmDeleteTemplate = async () => {
		if (!templateToDelete) return;

		try {
			setIsDeleting(true);
			await deleteTemplate(templateToDelete.id);
			onDeleteModalClose();
			setTemplateToDelete(null);
			refetch();
		} catch (error) {
			console.error("Error deleting template:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleUploadSuccess = () => {
		onUploadModalClose();
		refetch();
	};

	const renderCell = (template: Template, columnKey: string) => {
		switch (columnKey) {
			case "name":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-sm">{template.name}</p>
					</div>
				);
			case "fileName":
				return (
					<div className="flex flex-col">
						<p className="text-sm">{template.fileName}</p>
					</div>
				);
			case "placeholders":
				return (
					<div className="flex flex-wrap gap-1">
						{template.placeholders.slice(0, 3).map((placeholder, index) => (
							<Chip key={index} size="sm" variant="flat" color="primary">
								{placeholder}
							</Chip>
						))}
						{template.placeholders.length > 3 && (
							<Chip size="sm" variant="flat" color="default">
								+{template.placeholders.length - 3}
							</Chip>
						)}
					</div>
				);
			case "createdAt":
				return (
					<div className="flex flex-col">
						<p className="text-sm">
							{formatDate(template.createdAt)}
						</p>
					</div>
				);
			case "actions":
				return (
					<div className="flex items-center gap-4">
						<Tooltip content="Xem chi tiết">
							<button
								onClick={() => handleViewTemplate(template)}
								className="cursor-pointer"
							>
								<EyeIcon size={20} fill="#979797" />
							</button>
						</Tooltip>
						<Tooltip content="Xóa" color="danger">
							<button
								onClick={() => handleDeleteTemplate(template)}
								className="cursor-pointer"
							>
								<DeleteIcon size={20} fill="#FF0080" />
							</button>
						</Tooltip>
					</div>
				);
			default:
				return null;
		}
	};

	const templateList = templates?.data || [];

	return (
		<div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
			{/* Breadcrumb */}
			<ul className="flex">
				<li className="flex gap-2">
					<HouseIcon />
					<Link href={"/"}>
						<span>Trang chủ</span>
					</Link>
					<span> / </span>
				</li>
				<li className="flex gap-2">
					<TemplatesIcon />
					<span>Quản lý biểu mẫu</span>
				</li>
			</ul>

			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h3 className="text-xl font-semibold">Quản lý biểu mẫu</h3>
					<p className="text-default-500 text-sm mt-1">
						Tạo, chỉnh sửa và quản lý các biểu mẫu dành cho khách hàng
					</p>
				</div>
				<Button
					color="primary"
					startContent={<UploadIcon />}
					onPress={onUploadModalOpen}
				>
					Tải lên biểu mẫu
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<Card>
					<CardHeader className="flex gap-3">
						<div className="flex flex-col">
							<p className="text-md font-semibold">Tổng biểu mẫu</p>
							<p className="text-small text-default-500">
								Số lượng biểu mẫu hiện có
							</p>
						</div>
					</CardHeader>
					<CardBody className="pt-0">
						<p className="text-2xl font-bold text-primary">
							{isLoading ? <Spinner size="sm" /> : templateList.length}
						</p>
					</CardBody>
				</Card>

				<Card>
					<CardHeader className="flex gap-3">
						<div className="flex flex-col">
							<p className="text-md font-semibold">Biểu mẫu mới</p>
							<p className="text-small text-default-500">Tạo trong tháng này</p>
						</div>
					</CardHeader>
					<CardBody className="pt-0">
						<p className="text-2xl font-bold text-success">
							{isLoading ? (
								<Spinner size="sm" />
							) : (
								templateList.filter((t) => {
									const created = new Date(t.createdAt);
									const now = new Date();
									return (
										created.getMonth() === now.getMonth() &&
										created.getFullYear() === now.getFullYear()
									);
								}).length
							)}
						</p>
					</CardBody>
				</Card>

				<Card>
					<CardHeader className="flex gap-3">
						<div className="flex flex-col">
							<p className="text-md font-semibold">Placeholder</p>
							<p className="text-small text-default-500">Tổng số placeholder</p>
						</div>
					</CardHeader>
					<CardBody className="pt-0">
						<p className="text-2xl font-bold text-warning">
							{isLoading ? (
								<Spinner size="sm" />
							) : (
								templateList.reduce(
									(total, template) => total + template.placeholders.length,
									0,
								)
							)}
						</p>
					</CardBody>
				</Card>
			</div>

			{/* Templates Table */}
			<div className="w-full">
				<Card>
					<CardHeader>
						<div className="flex justify-between items-center w-full">
							<h4 className="text-large font-semibold">Danh sách biểu mẫu</h4>
						</div>
					</CardHeader>
					<CardBody>
						{isLoading ? (
							<div className="flex justify-center items-center p-8">
								<Spinner size="lg" />
							</div>
						) : (
							<Table aria-label="Bảng danh sách biểu mẫu">
								<TableHeader columns={columns}>
									{(column) => (
										<TableColumn
											key={column.uid}
											align={column.uid === "actions" ? "center" : "start"}
										>
											{column.name}
										</TableColumn>
									)}
								</TableHeader>
								<TableBody
									items={templateList}
									emptyContent={
										<div className="text-center py-8">
											<p className="text-lg text-default-500">
												Chưa có biểu mẫu nào
											</p>
											<p className="text-sm text-default-400 mt-2">
												Hãy tải lên biểu mẫu đầu tiên của bạn
											</p>
										</div>
									}
								>
									{(template) => (
										<TableRow key={template.id}>
											{(columnKey) => (
												<TableCell>
													{renderCell(template, columnKey as string)}
												</TableCell>
											)}
										</TableRow>
									)}
								</TableBody>
							</Table>
						)}
					</CardBody>
				</Card>
			</div>

			{/* Upload Template Modal */}
			<UploadTemplateModal
				isOpen={isUploadModalOpen}
				onClose={onUploadModalClose}
				onSuccess={handleUploadSuccess}
			/>

			{/* Template Detail Modal */}
			<TemplateDetailModal
				isOpen={isDetailModalOpen}
				onClose={onDetailModalClose}
				template={selectedTemplate}
			/>

			{/* Delete Confirmation Modal */}
			<Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} size="md">
				<ModalContent>
					{() => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<DeleteIcon size={24} fill="#FF0080" />
									<span>Xác nhận xóa biểu mẫu</span>
								</div>
							</ModalHeader>
							<ModalBody>
								{templateToDelete && (
									<div className="space-y-4">
										<p className="text-default-600">
											Bạn có chắc chắn muốn xóa biểu mẫu này không?
										</p>
										<div className="bg-default-50 p-4 rounded-lg">
											<div className="flex items-center gap-3">
												<div className="bg-primary-100 p-2 rounded-lg">
													<TemplatesIcon />
												</div>
												<div>
													<p className="font-semibold text-lg">
														{templateToDelete.name}
													</p>
													<p className="text-sm text-default-500">
														{templateToDelete.fileName}
													</p>
												</div>
											</div>
										</div>
										<div className="bg-red-50 border border-red-200 p-3 rounded-lg">
											<p className="text-red-700 text-sm">
												<strong>Lưu ý:</strong> Hành động này không thể hoàn
												tác. Biểu mẫu sẽ bị xóa vĩnh viễn khỏi hệ thống.
											</p>
										</div>
									</div>
								)}
							</ModalBody>
							<ModalFooter>
								<Button
									color="default"
									variant="light"
									onPress={onDeleteModalClose}
								>
									Hủy bỏ
								</Button>
								<Button
									color="danger"
									onPress={confirmDeleteTemplate}
									className="bg-red-600 hover:bg-red-700"
									isLoading={isDeleting}
									disabled={isDeleting}
								>
									{isDeleting ? "Đang xóa..." : "Xóa biểu mẫu"}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
};
