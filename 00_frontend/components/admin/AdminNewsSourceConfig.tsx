"use client";

import { useState } from "react";
import { Plus, RefreshCw, Rss } from "lucide-react";
import type { NewsSourceConfig } from "@/lib/mock/admin";

/**
 * Khối cấu hình nguồn tin tự động (URL, chu kỳ kéo) và nút "Kéo tin ngay" (giao diện mẫu).
 */

interface AdminNewsSourceConfigProps {
  sources: NewsSourceConfig[];
  onToggleSource: (id: string) => void;
  onUpdateInterval: (id: string, minutes: number) => void;
  onAddSource: (name: string, url: string, intervalMinutes: number) => void;
  onTriggerCrawl: () => void;
  isCrawling: boolean;
}

export default function AdminNewsSourceConfig({
  sources,
  onToggleSource,
  onUpdateInterval,
  onAddSource,
  onTriggerCrawl,
  isCrawling,
}: AdminNewsSourceConfigProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [intervalMinutes, setIntervalMinutes] = useState(60);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    onAddSource(name.trim(), url.trim(), intervalMinutes);
    setName("");
    setUrl("");
    setIntervalMinutes(60);
  }

  return (
    <section className="admin-card admin-stack" style={{ gap: 16 }}>
      <div className="admin-card-head" style={{ marginBottom: 0 }}>
        <h2 className="admin-card-title">
          <Rss size={18} color="#8b1218" />
          Cấu hình nguồn tin
        </h2>
        <button
          type="button"
          className="admin-btn admin-btn--primary admin-btn--sm"
          onClick={onTriggerCrawl}
          disabled={isCrawling}
        >
          <RefreshCw size={14} />
          {isCrawling ? "Đang mô phỏng kéo tin..." : "Kéo tin ngay"}
        </button>
      </div>

      {/* Danh sách nguồn tin hiện có */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sources.map((src) => (
          <div
            key={src.id}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: "#fbf6ec",
              border: "1px solid #e5d9c6",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <strong style={{ fontSize: "0.88rem" }}>{src.name}</strong>
              <button
                type="button"
                className={`admin-btn admin-btn--sm ${
                  src.enabled ? "admin-btn--jade" : ""
                }`}
                onClick={() => onToggleSource(src.id)}
              >
                {src.enabled ? "Đang bật" : "Đã tắt"}
              </button>
            </div>

            <div style={{ fontSize: "0.78rem", color: "#5c5249", wordBreak: "break-all" }}>
              URL: {src.url}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "0.8rem",
                }}
              >
                <span>Chu kỳ kéo:</span>
                <select
                  className="admin-select"
                  style={{ width: "auto", padding: "4px 8px", fontSize: "0.8rem" }}
                  value={src.intervalMinutes}
                  onChange={(e) =>
                    onUpdateInterval(src.id, Number(e.target.value))
                  }
                >
                  <option value={30}>30 phút</option>
                  <option value={60}>60 phút</option>
                  <option value={120}>2 giờ</option>
                  <option value={180}>3 giờ</option>
                  <option value={360}>6 giờ</option>
                </select>
              </label>

              <span className="admin-num" style={{ fontSize: "0.74rem", color: "#5c5249" }}>
                Lần cuối: {new Date(src.lastSyncedAt).toLocaleTimeString("vi-VN")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Form thêm nguồn tin mới */}
      <form
        onSubmit={handleAdd}
        style={{
          paddingTop: 14,
          borderTop: "1px solid #e5d9c6",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <strong style={{ fontSize: "0.88rem" }}>Thêm nguồn tin mới</strong>
        <label className="admin-field">
          <span className="admin-label">Tên nguồn</span>
          <input
            type="text"
            className="admin-input"
            placeholder="VD: Khoa An toàn thông tin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="admin-field">
          <span className="admin-label">URL nguồn tin</span>
          <input
            type="url"
            className="admin-input"
            placeholder="https://actvn.edu.vn/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </label>

        <label className="admin-field">
          <span className="admin-label">Chu kỳ kéo (phút)</span>
          <select
            className="admin-select"
            value={intervalMinutes}
            onChange={(e) => setIntervalMinutes(Number(e.target.value))}
          >
            <option value={30}>Mỗi 30 phút</option>
            <option value={60}>Mỗi 60 phút</option>
            <option value={120}>Mỗi 2 giờ</option>
            <option value={360}>Mỗi 6 giờ</option>
          </select>
        </label>

        <button type="submit" className="admin-btn admin-btn--sm">
          <Plus size={14} />
          Lưu nguồn tin
        </button>
      </form>
    </section>
  );
}
