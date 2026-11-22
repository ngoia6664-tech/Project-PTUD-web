"use client";

import { useState } from "react";
import { Megaphone, Send } from "lucide-react";
import type { AdminMakeupNotice } from "@/lib/mock/admin";

/**
 * Khung soạn thông báo nghỉ học / dạy bù / đổi phòng cho lớp học phần.
 */

interface AdminMakeupNoticeFormProps {
  selectedClass: string;
  notices: AdminMakeupNotice[];
  onPublishNotice: (notice: AdminMakeupNotice) => void;
}

const NOTICE_TYPE_LABEL: Record<AdminMakeupNotice["noticeType"], string> = {
  "nghi-hoc": "Thông báo nghỉ",
  "day-bu": "Lịch dạy bù",
  "doi-phong": "Đổi phòng học",
};

export default function AdminMakeupNoticeForm({
  selectedClass,
  notices,
  onPublishNotice,
}: AdminMakeupNoticeFormProps) {
  const [courseName, setCourseName] = useState("");
  const [noticeType, setNoticeType] =
    useState<AdminMakeupNotice["noticeType"]>("nghi-hoc");
  const [effectiveDate, setEffectiveDate] = useState("2026-11-26");
  const [content, setContent] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseName.trim() || !content.trim()) return;

    onPublishNotice({
      id: `ntc_${Date.now()}`,
      classCode: selectedClass,
      courseName: courseName.trim(),
      noticeType,
      effectiveDate,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    });
    setCourseName("");
    setContent("");
  }

  return (
    <section className="admin-card admin-stack" style={{ gap: 14 }}>
      <h3 className="admin-card-title">
        <Megaphone size={18} color="#8b1218" />
        Soạn thông báo nghỉ / dạy bù
      </h3>

      <form onSubmit={handleSubmit} className="admin-stack" style={{ gap: 10 }}>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-label">Môn học áp dụng *</span>
            <input
              type="text"
              className="admin-input"
              required
              placeholder="VD: Mật mã học ứng dụng"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </label>

          <label className="admin-field">
            <span className="admin-label">Loại thông báo</span>
            <select
              className="admin-select"
              value={noticeType}
              onChange={(e) =>
                setNoticeType(
                  e.target.value as AdminMakeupNotice["noticeType"],
                )
              }
            >
              <option value="nghi-hoc">Thông báo nghỉ học</option>
              <option value="day-bu">Lịch dạy bù</option>
              <option value="doi-phong">Đổi phòng học</option>
            </select>
          </label>
        </div>

        <label className="admin-field">
          <span className="admin-label">Ngày áp dụng</span>
          <input
            type="date"
            className="admin-input"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
          />
        </label>

        <label className="admin-field">
          <span className="admin-label">Nội dung thông báo *</span>
          <textarea
            rows={3}
            className="admin-textarea"
            required
            placeholder="Ghi rõ lý do, thời gian học bù hoặc phòng học mới..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            className="admin-btn admin-btn--primary admin-btn--sm"
          >
            <Send size={14} />
            Đăng thông báo cho lớp {selectedClass}
          </button>
        </div>
      </form>

      {/* Danh sách thông báo gần đây */}
      <div
        style={{
          paddingTop: 12,
          borderTop: "1px solid #e5d9c6",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <strong style={{ fontSize: "0.84rem" }}>Thông báo đã gửi gần đây</strong>
        {notices.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              background: "#fbf6ec",
              border: "1px solid #e5d9c6",
            }}
          >
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
              <span className="admin-badge admin-badge--crimson-soft">
                {item.classCode}
              </span>
              <span className="admin-badge admin-badge--gold">
                {NOTICE_TYPE_LABEL[item.noticeType]}
              </span>
              <span className="admin-badge admin-num">{item.effectiveDate}</span>
            </div>
            <strong style={{ display: "block", fontSize: "0.84rem" }}>
              {item.courseName}
            </strong>
            <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#5c5249" }}>
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
