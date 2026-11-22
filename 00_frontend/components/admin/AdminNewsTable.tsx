"use client";

import { Eye, EyeOff, Pin } from "lucide-react";
import { NEWS_CATEGORY_LABELS, type NewsCategory } from "@/lib/mock/dashboard";
import type { AdminNewsItem } from "@/lib/mock/admin";

/**
 * Bảng quản lý tin tức đã kéo về (/admin/news).
 * Hiển thị nguồn, thời gian kéo; cho phép bật/tắt hiển thị, ghim tin và gắn loại tin.
 */

interface AdminNewsTableProps {
  items: AdminNewsItem[];
  onToggleVisible: (id: string) => void;
  onTogglePinned: (id: string) => void;
  onChangeCategory: (id: string, category: NewsCategory) => void;
}

export default function AdminNewsTable({
  items,
  onToggleVisible,
  onTogglePinned,
  onChangeCategory,
}: AdminNewsTableProps) {
  return (
    <section className="admin-card">
      <div className="admin-card-head">
        <h2 className="admin-card-title">Danh sách tin đã kéo về</h2>
        <span className="admin-badge admin-badge--gold admin-num">
          {items.length} bản tin
        </span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tiêu đề & Nguồn</th>
              <th>Thời gian kéo</th>
              <th style={{ width: 170 }}>Loại tin</th>
              <th>Hiển thị</th>
              <th>Ghim</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong style={{ display: "block", fontSize: "0.88rem" }}>
                    {item.title}
                  </strong>
                  <span style={{ fontSize: "0.76rem", color: "#5c5249" }}>
                    Nguồn: {item.sourceName}
                  </span>
                </td>
                <td className="admin-num" style={{ whiteSpace: "nowrap", fontSize: "0.82rem" }}>
                  {new Date(item.fetchedAt).toLocaleString("vi-VN", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td>
                  <select
                    className="admin-select"
                    style={{ padding: "6px 10px", fontSize: "0.82rem" }}
                    value={item.category}
                    onChange={(e) =>
                      onChangeCategory(item.id, e.target.value as NewsCategory)
                    }
                    aria-label={`Chọn loại cho ${item.title}`}
                  >
                    {(Object.keys(NEWS_CATEGORY_LABELS) as NewsCategory[]).map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {NEWS_CATEGORY_LABELS[cat]}
                        </option>
                      ),
                    )}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className={`admin-btn admin-btn--sm ${
                      item.isVisible ? "admin-btn--jade" : ""
                    }`}
                    onClick={() => onToggleVisible(item.id)}
                  >
                    {item.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    {item.isVisible ? "Đang hiện" : "Đang ẩn"}
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={`admin-btn admin-btn--sm ${
                      item.isPinned ? "admin-btn--primary" : ""
                    }`}
                    onClick={() => onTogglePinned(item.id)}
                  >
                    <Pin size={14} />
                    {item.isPinned ? "Đã ghim" : "Ghim"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
