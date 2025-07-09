import { useState, useEffect } from "react";
import { mockData } from "@/lib/mock-data";
import { Customer, Template } from "@/types";

interface LocalStorageManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocalStorageManager: React.FC<LocalStorageManagerProps> = ({ isOpen, onClose }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    setIsLoading(true);
    try {
      const customersData = mockData.getCustomers();
      const templatesData = mockData.getTemplates();
      setCustomers(customersData);
      setTemplates(templatesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetData = () => {
    if (confirm("Bạn có chắc chắn muốn reset tất cả dữ liệu về mặc định?")) {
      mockData.resetData();
      loadData();
    }
  };

  const handleClearData = () => {
    if (confirm("Bạn có chắc chắn muốn xóa tất cả dữ liệu?")) {
      mockData.clearAllData();
      loadData();
    }
  };

  const handleExportData = () => {
    const data = mockData.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `icb-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          mockData.importData(data);
          loadData();
          alert("Dữ liệu đã được import thành công!");
        } catch (error) {
          console.error("Error importing data:", error);
          alert("Lỗi khi import dữ liệu!");
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">LocalStorage Manager</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Actions */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleResetData}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Reset Data
            </button>
            <button
              onClick={handleClearData}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Clear All
            </button>
            <button
              onClick={handleExportData}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Export Data
            </button>
            <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Đang tải dữ liệu...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customers */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Customers ({customers.length})
                </h3>
                <div className="max-h-64 overflow-y-auto border rounded p-3">
                  {customers.map((customer) => (
                    <div key={customer.id} className="mb-2 p-2 bg-gray-50 rounded">
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-600">
                        {customer.customerCode} | {customer.category}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Templates */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Templates ({templates.length})
                </h3>
                <div className="max-h-64 overflow-y-auto border rounded p-3">
                  {templates.map((template) => (
                    <div key={template.id} className="mb-2 p-2 bg-gray-50 rounded">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-gray-600">
                        {template.fileName} | {template.placeholders.length} placeholders
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
