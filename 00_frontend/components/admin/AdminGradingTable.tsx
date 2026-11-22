"use client";

import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import type { AdminGradeScaleRule } from "@/lib/mock/admin";

/**
 * Bảng cấu hình thang quy đổi điểm chữ / thang 4 / thang 10 có thể chỉnh trực tiếp (/admin/grading).
 */

interface AdminGradingTableProps {
  rules: AdminGradeScaleRule[];
  onChangeRule: (
    id: string,
    field: keyof AdminGradeScaleRule,
    value: string | number,
  ) => void;
  onAddRule: () => void;
  onDeleteRule: (id: string) => void;
  onResetDefault: () => void;
  onSaveConfig: () => void;
}

export default function AdminGradingTable({
  rules,
  onChangeRule,
  onAddRule,
  onDeleteRule,
  onResetDefault,
  onSaveConfig,
}: AdminGradingTableProps) {
  return (
    <section className="admin-card admin-stack" style={{ gap: 16 }}>
      <div className="admin-card-head" style={{ marginBottom: 0 }}>
        <h3 className="admin-card-title">Bảng quy đổi điểm chữ / thang 4 / thang 10</h3>
        <div className="admin-toolbar">
          <button
            type="button"
            className="admin-btn admin-btn--sm"
            onClick={onAddRule}
          >
            <Plus size={14} />
            Thêm bậc điểm
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--sm"
            onClick={onResetDefault}
          >
            <RotateCcw size={14} />
            Khôi phục chuẩn KMA
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary admin-btn--sm"
            onClick={onSaveConfig}
          >
            <Save size={14} />
            Lưu cấu hình
          </button>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 110 }}>Điểm chữ</th>
              <th style={{ width: 135 }}>Thang 10 (từ)</th>
              <th style={{ width: 135 }}>Thang 10 (đến)</th>
              <th style={{ width: 130 }}>Điểm thang 4</th>
              <th>Xếp loại / Mô tả</th>
              <th style={{ width: 70 }}></th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ fontWeight: 700, padding: "6px 10px" }}
                    value={rule.letter}
                    onChange={(e) =>
                      onChangeRule(rule.id, "letter", e.target.value)
                    }
                    aria-label="Điểm chữ"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    className="admin-input admin-num"
                    style={{ padding: "6px 10px" }}
                    value={rule.minScore10}
                    onChange={(e) =>
                      onChangeRule(rule.id, "minScore10", Number(e.target.value))
                    }
                    aria-label="Mức tối thiểu thang 10"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    className="admin-input admin-num"
                    style={{ padding: "6px 10px" }}
                    value={rule.maxScore10}
                    onChange={(e) =>
                      onChangeRule(rule.id, "maxScore10", Number(e.target.value))
                    }
                    aria-label="Mức tối đa thang 10"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    step={0.1}
                    className="admin-input admin-num"
                    style={{ padding: "6px 10px", fontWeight: 700 }}
                    value={rule.score4}
                    onChange={(e) =>
                      onChangeRule(rule.id, "score4", Number(e.target.value))
                    }
                    aria-label="Điểm thang 4"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ padding: "6px 10px" }}
                    value={rule.classification}
                    onChange={(e) =>
                      onChangeRule(rule.id, "classification", e.target.value)
                    }
                    aria-label="Xếp loại"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger admin-btn--sm"
                    onClick={() => onDeleteRule(rule.id)}
                    aria-label={`Xóa bậc điểm ${rule.letter}`}
                  >
                    <Trash2 size={13} />
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
