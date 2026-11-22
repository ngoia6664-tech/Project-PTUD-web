"use client";

import { useState } from "react";
import { CheckCircle2, Trash2, Upload } from "lucide-react";
import type { AdminDocumentItem } from "@/lib/mock/admin";

/**
 * Quản lý Thư viện tài liệu (/admin/library):
 * Danh sách tài liệu có lọc trạng thái, nút tải lên (giao diện mẫu), duyệt và xóa.
 */

interface AdminLibraryManagerProps {
  documents: AdminDocumentItem[];
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
  onUploadMock: (title: string, courseCode: string, fileType: AdminDocumentItem["fileType"]) => void;
}

export default function AdminLibraryManager({
  documents,
  onApprove,
  onDelete,
  onUploadMock,
}: AdminLibraryManagerProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved">("all");
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("AT1804");
  const [fileType, setFileType] = useState<AdminDocumentItem["fileType"]>("PDF");

  const filtered =
    statusFilter === "all"
      ? documents
      : documents.filter((d) => d.status === statusFilter);

  function handleUploadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onUploadMock(title.trim(), courseCode.trim().toUpperCase(), fileType);
    setTitle("");
    setShowUpload(false);
  }

  return (
    <div className="admin-stack">
      <div className="admin-toolbar" style={{ justifyContent: "space-between" }}>
        <div className="admin-chip-group" role="tablist" aria-label="Lọc trạng thái tài liệu">
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === "all"}
            className={`admin-chip ${statusFilter === "all" ? "admin-chip--active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            Tất cả ({documents.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === "pending"}
            className={`admin-chip ${statusFilter === "pending" ? "admin-chip--active" : ""}`}
            onClick={() => setStatusFilter("pending")}
          >
            Chờ duyệt ({documents.filter((d) => d.status === "pending").length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === "approved"}
            className={`admin-chip ${statusFilter === "approved" ? "admin-chip--active" : ""}`}
            onClick={() => setStatusFilter("approved")}
          >
            Đã duyệt ({documents.filter((d) => d.status === "approved").length})
          </button>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={() => setShowUpload((v) => !v)}
        >
          <Upload size={15} />
          Tải lên tài liệu
        </button>
      </div>

      {/* Khung tải lên tài liệu (giao diện mẫu) */}
      {showUpload && (
        <form
          className="admin-card admin-stack"
          style={{ gap: 12 }}
          onSubmit={handleUploadSubmit}
        >
          <h3 className="admin-card-title">Tải lên tài liệu mới (Giao diện mẫu)</h3>
          <div className="admin-form-grid">
            <label className="admin-field admin-form-full">
              <span className="admin-label">Tiêu đề tài liệu *</span>
              <input
                type="text"
                className="admin-input"
                required
                placeholder="VD: Đề cương ôn tập Mật mã học 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="admin-field">
              <span className="admin-label">Mã học phần</span>
              <input
                type="text"
                className="admin-input"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              />
            </label>

            <label className="admin-field">
              <span className="admin-label">Loại tài liệu</span>
              <select
                className="admin-select"
                value={fileType}
                onChange={(e) =>
                  setFileType(e.target.value as AdminDocumentItem["fileType"])
                }
              >
                <option value="PDF">PDF</option>
                <option value="SLIDE">SLIDE</option>
                <option value="DE-THI">Đề thi</option>
                <option value="DOC">DOC</option>
              </select>
            </label>

            <label className="admin-field admin-form-full">
              <span className="admin-label">Chọn tệp (chỉ mô phỏng giao diện)</span>
              <input type="file" className="admin-input" />
            </label>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={() => setShowUpload(false)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn--primary admin-btn--sm"
            >
              Xác nhận tải lên
            </button>
          </div>
        </form>
      )}

      {/* Bảng tài liệu */}
      <section className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tài liệu</th>
                <th>Môn học</th>
                <th>Loại / Dung lượng</th>
                <th>Người tải lên</th>
                <th>Trạng thái</th>
                <th style={{ width: 170 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <strong style={{ display: "block" }}>{doc.title}</strong>
                    <span className="admin-num" style={{ fontSize: "0.75rem", color: "#5c5249" }}>
                      Ngày gửi: {doc.uploadedAt}
                    </span>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge--gold">
                      {doc.courseCode}
                    </span>
                  </td>
                  <td className="admin-num">
                    {doc.fileType} • {doc.fileSize}
                  </td>
                  <td>{doc.uploadedBy}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        doc.status === "approved"
                          ? "admin-badge--jade"
                          : "admin-badge--crimson-soft"
                      }`}
                    >
                      {doc.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      {doc.status === "pending" && (
                        <button
                          type="button"
                          className="admin-btn admin-btn--jade admin-btn--sm"
                          onClick={() => onApprove(doc.id)}
                        >
                          <CheckCircle2 size={13} />
                          Duyệt
                        </button>
                      )}
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger admin-btn--sm"
                        onClick={() => onDelete(doc.id)}
                      >
                        <Trash2 size={13} />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
