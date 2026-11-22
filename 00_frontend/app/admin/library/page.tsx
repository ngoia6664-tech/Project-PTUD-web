"use client";

import { useState } from "react";
import AdminLibraryManager from "@/components/admin/AdminLibraryManager";
import {
  MOCK_ADMIN_LIBRARY_RESPONSE,
  type AdminDocumentItem,
} from "@/lib/mock/admin";

/**
 * Trang Quản lý Thư viện tài liệu (/admin/library).
 */
export default function AdminLibraryPage() {
  const [documents, setDocuments] = useState<AdminDocumentItem[]>(
    MOCK_ADMIN_LIBRARY_RESPONSE.data,
  );
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  }

  function handleApprove(id: string) {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "approved" } : d)),
    );
    showToast("Đã duyệt tài liệu hiển thị lên thư viện sinh viên.");
  }

  function handleDelete(id: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast("Đã xóa tài liệu khỏi danh sách mẫu.");
  }

  function handleUploadMock(
    title: string,
    courseCode: string,
    fileType: AdminDocumentItem["fileType"],
  ) {
    setDocuments((prev) => [
      {
        id: `adoc_${Date.now()}`,
        title,
        courseCode,
        courseName: courseCode,
        fileType,
        fileSize: "1,5 MB",
        uploadedBy: "Quản trị viên KMA",
        uploadedAt: new Date().toISOString().slice(0, 10),
        status: "approved",
      },
      ...prev,
    ]);
    showToast(`Đã mô phỏng tải lên "${title}".`);
  }

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div>
          <h2 className="admin-page-title">
            Quản lý <span>Thư viện</span>
          </h2>
          <p className="admin-page-desc">
            Kiểm duyệt tài liệu sinh viên đóng góp, tải lên tài liệu chính thức hoặc gỡ tài liệu vi phạm.
          </p>
        </div>
      </div>

      {toast && (
        <div className="admin-toast" role="status">
          {toast}
        </div>
      )}

      <AdminLibraryManager
        documents={documents}
        onApprove={handleApprove}
        onDelete={handleDelete}
        onUploadMock={handleUploadMock}
      />
    </div>
  );
}
