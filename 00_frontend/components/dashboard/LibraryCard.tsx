"use client";

import {
  ArrowRight,
  BookOpen,
  Download,
  FileText,
  HardDrive,
  Heart,
  User,
} from "lucide-react";
import type { DocumentItem } from "@/lib/mock/dashboard";

/**
 * Thẻ tài liệu thư viện theo Ảnh 4:
 * Bìa minh họa bên trái phân màu theo loại file (PDF / SLIDE / DE-THI / DOC),
 * thông tin môn học, tác giả, dung lượng, lượt tải và nút Yêu thích / Tải xuống / Xem chi tiết.
 */

interface LibraryCardProps {
  doc: DocumentItem;
  onToggleFavorite: (id: string) => void;
}

const TYPE_BADGE: Record<DocumentItem["fileType"], string> = {
  PDF: "dash-badge--crimson",
  SLIDE: "dash-badge--gold",
  "DE-THI": "dash-badge--crimson-soft",
  DOC: "dash-badge--blue",
};

export default function LibraryCard({
  doc,
  onToggleFavorite,
}: LibraryCardProps) {
  return (
    <article className="dash-card dash-card--hover dash-doc-card">
      <div className="dash-doc-main">
        {/* Bìa tài liệu thu nhỏ giống Ảnh 4 */}
        <div
          className={`dash-doc-cover dash-doc-cover--${doc.coverAccent}`}
          aria-hidden="true"
        >
          <span>{doc.coverLabel}</span>
          <span style={{ fontSize: "0.75rem" }}>
            {doc.courseCode}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span className={`dash-badge ${TYPE_BADGE[doc.fileType]}`}>
              <FileText size={11} />
              {doc.fileType}
            </span>
            <span className="dash-badge">{doc.courseCode}</span>
          </div>

          <h3 style={{ margin: 0, fontSize: "0.97rem", fontWeight: 700 }}>
            {doc.title}
          </h3>

          <p style={{ margin: 0, fontSize: "0.8rem", color: "#6e6359" }}>
            {doc.description}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "4px 10px",
              marginTop: "auto",
              paddingTop: 6,
              fontSize: "0.75rem",
              color: "#6e6359",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <BookOpen size={12} color="#7d5616" />
              {doc.courseName}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <HardDrive size={12} color="#7d5616" />
              {doc.fileSize}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <User size={12} color="#63594f" />
              {doc.uploadedBy}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Download size={12} color="#63594f" />
              {doc.downloads.toLocaleString("vi-VN")} lượt tải
            </span>
          </div>
        </div>
      </div>

      <div className="dash-doc-actions">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            className={`dash-ghost-action ${
              doc.isFavorite ? "dash-ghost-action--active" : ""
            }`}
            onClick={() => onToggleFavorite(doc.id)}
            aria-pressed={doc.isFavorite}
          >
            <Heart size={14} fill={doc.isFavorite ? "currentColor" : "none"} />
            {doc.isFavorite ? "Đã yêu thích" : "Yêu thích"}
          </button>

          <button
            type="button"
            className="dash-ghost-action"
            onClick={() =>
              window.alert(`Mô phỏng tải xuống: ${doc.title} (${doc.fileSize})`)
            }
          >
            <Download size={14} />
            Tải xuống
          </button>
        </div>

        <button
          type="button"
          className="dash-btn dash-btn--outline-crimson dash-btn--sm"
          onClick={() =>
            window.alert(`Chi tiết tài liệu mẫu: ${doc.title}\nMôn: ${doc.courseName}`)
          }
        >
          Xem chi tiết
          <ArrowRight size={13} />
        </button>
      </div>
    </article>
  );
}
