"use client";

import { useState } from "react";
import AdminGradingTable from "@/components/admin/AdminGradingTable";
import {
  MOCK_ADMIN_GRADING_RESPONSE,
  type AdminGradeScaleRule,
} from "@/lib/mock/admin";

/**
 * Trang Cấu hình thang điểm (/admin/grading).
 * Cho phép chỉnh sửa trực tiếp bảng quy đổi điểm chữ, thang 4 và thang 10.
 */
export default function AdminGradingPage() {
  const [rules, setRules] = useState<AdminGradeScaleRule[]>(
    MOCK_ADMIN_GRADING_RESPONSE.data,
  );
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  }

  function handleChangeRule(
    id: string,
    field: keyof AdminGradeScaleRule,
    value: string | number,
  ) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  }

  function handleAddRule() {
    setRules((prev) => [
      ...prev,
      {
        id: `gr_${Date.now()}`,
        letter: "Mới",
        minScore10: 0,
        maxScore10: 0,
        score4: 0,
        classification: "Bậc bổ sung",
      },
    ]);
  }

  function handleDeleteRule(id: string) {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  function handleResetDefault() {
    setRules(MOCK_ADMIN_GRADING_RESPONSE.data);
    showToast("Đã khôi phục bảng quy đổi thang điểm chuẩn KMA.");
  }

  function handleSaveConfig() {
    showToast(
      `Đã lưu cấu hình ${rules.length} bậc điểm (giao diện mẫu trên trình duyệt).`,
    );
  }

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div>
          <h2 className="admin-page-title">
            Cấu hình <span>Thang điểm</span>
          </h2>
          <p className="admin-page-desc">
            Điều chỉnh ngưỡng quy đổi giữa điểm hệ 10, điểm chữ và điểm hệ 4 dùng chung toàn hệ thống.
          </p>
        </div>
      </div>

      {toast && (
        <div className="admin-toast" role="status">
          {toast}
        </div>
      )}

      <AdminGradingTable
        rules={rules}
        onChangeRule={handleChangeRule}
        onAddRule={handleAddRule}
        onDeleteRule={handleDeleteRule}
        onResetDefault={handleResetDefault}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
}
