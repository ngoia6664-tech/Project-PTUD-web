"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import AdminGradingTable from "@/components/admin/AdminGradingTable";
import {
  DataSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/DataStates";
import { useDemoState } from "@/components/ui/useDemoState";
import {
  MOCK_ADMIN_GRADING_RESPONSE,
  type AdminGradeScaleRule,
} from "@/lib/mock/admin";

/**
 * Trang Cấu hình thang điểm (/admin/grading) theo đặc tả B7:
 * Chỉnh sửa bảng quy đổi điểm chữ / thang 4 / thang 10, phát hiện chồng lấn hoặc lỗ hổng khoảng điểm,
 * và hỗ trợ ?demo=loading|empty|error.
 */

function validateGradeRanges(rules: AdminGradeScaleRule[]): string[] {
  const warnings: string[] = [];
  const sorted = [...rules].sort((a, b) => b.minScore10 - a.minScore10);

  for (let i = 0; i < sorted.length; i++) {
    const curr = sorted[i];
    if (curr.minScore10 > curr.maxScore10) {
      warnings.push(
        `Bậc "${curr.letter}": điểm tối thiểu (${curr.minScore10}) lớn hơn tối đa (${curr.maxScore10}).`,
      );
    }
    if (i > 0) {
      const prev = sorted[i - 1];
      if (curr.maxScore10 >= prev.minScore10) {
        warnings.push(
          `Khoảng điểm bậc "${curr.letter}" (đến ${curr.maxScore10}) bị chồng lấn với "${prev.letter}" (từ ${prev.minScore10}).`,
        );
      } else if (Number((prev.minScore10 - curr.maxScore10).toFixed(2)) > 0.15) {
        warnings.push(
          `Có lỗ hổng khoảng điểm giữa "${curr.letter}" (đến ${curr.maxScore10}) và "${prev.letter}" (từ ${prev.minScore10}).`,
        );
      }
    }
  }
  return warnings;
}

export default function AdminGradingPage() {
  const { demoMode, retryDemo } = useDemoState();
  const [rules, setRules] = useState<AdminGradeScaleRule[]>(
    MOCK_ADMIN_GRADING_RESPONSE.data,
  );
  const [toast, setToast] = useState<string | null>(null);

  const rangeWarnings = validateGradeRanges(rules);

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
    if (rangeWarnings.length > 0) {
      showToast("Vui lòng xử lý các cảnh báo khoảng điểm chồng lấn/lỗ hổng trước khi lưu.");
      return;
    }
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

      {rangeWarnings.length > 0 && demoMode === "normal" && (
        <div
          role="alert"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "12px 16px",
            borderRadius: 12,
            background: "#fdf0f0",
            border: "1px solid #d86e75",
            color: "#7d151b",
            fontSize: "0.85rem",
          }}
        >
          <AlertTriangle size={18} style={{ flex: "none", marginTop: 2 }} />
          <div>
            <strong>Phát hiện lỗi khoảng điểm:</strong>
            <ul style={{ margin: "4px 0 0 18px", padding: 0 }}>
              {rangeWarnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {demoMode === "loading" ? (
        <DataSkeleton variant="table" count={6} />
      ) : demoMode === "error" ? (
        <ErrorState
          title="Không thể tải cấu hình thang điểm"
          message="Chưa lấy được bảng quy đổi điểm từ máy chủ. Vui lòng thử lại."
          onRetry={retryDemo}
        />
      ) : demoMode === "empty" ? (
        <EmptyState
          title="Chưa có bậc điểm nào"
          description="Khôi phục thang điểm chuẩn KMA để áp dụng lại bảng quy đổi mặc định."
          actionLabel="Khôi phục chuẩn KMA"
          onAction={() => {
            setRules(MOCK_ADMIN_GRADING_RESPONSE.data);
            retryDemo();
          }}
        />
      ) : (
        <AdminGradingTable
          rules={rules}
          onChangeRule={handleChangeRule}
          onAddRule={handleAddRule}
          onDeleteRule={handleDeleteRule}
          onResetDefault={handleResetDefault}
          onSaveConfig={handleSaveConfig}
        />
      )}
    </div>
  );
}
