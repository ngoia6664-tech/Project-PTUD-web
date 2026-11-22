"use client";

import { Plus, Trash2 } from "lucide-react";
import { convertScore10, type GpaRecord } from "@/lib/mock/dashboard";

/**
 * Bảng nhập môn học, số tín chỉ và điểm thang 10 trong trang Tính GPA.
 * Tự động quy đổi điểm chữ & thang 4 theo bảng KMA_GRADE_RULES.
 */

interface GpaTableProps {
  records: GpaRecord[];
  onChangeRecord: (
    id: string,
    field: keyof GpaRecord,
    value: string | number,
  ) => void;
  onAddRecord: () => void;
  onDeleteRecord: (id: string) => void;
}

export default function GpaTable({
  records,
  onChangeRecord,
  onAddRecord,
  onDeleteRecord,
}: GpaTableProps) {
  return (
    <section className="dash-card dash-stack" style={{ gap: 14 }}>
      <div className="dash-card-head" style={{ marginBottom: 0 }}>
        <h2 className="dash-card-title">Bảng điểm học kỳ hiện tại</h2>
        <button
          type="button"
          className="dash-btn dash-btn--primary dash-btn--sm"
          onClick={onAddRecord}
        >
          <Plus size={15} />
          Thêm môn
        </button>
      </div>

      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Mã môn</th>
              <th>Tên học phần</th>
              <th style={{ width: 84 }}>Tín chỉ</th>
              <th style={{ width: 102 }}>Điểm (10)</th>
              <th>Điểm chữ</th>
              <th>Thang 4</th>
              <th style={{ width: 46 }}></th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => {
              const converted = convertScore10(rec.score10);
              return (
                <tr key={rec.id}>
                  <td>
                    <input
                      type="text"
                      className="dash-input"
                      style={{ minWidth: 82, padding: "6px 8px" }}
                      value={rec.courseCode}
                      onChange={(e) =>
                        onChangeRecord(rec.id, "courseCode", e.target.value)
                      }
                      aria-label={`Mã môn ${rec.courseName}`}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="dash-input"
                      style={{ minWidth: 160, padding: "6px 8px" }}
                      value={rec.courseName}
                      onChange={(e) =>
                        onChangeRecord(rec.id, "courseName", e.target.value)
                      }
                      aria-label={`Tên học phần ${rec.courseCode}`}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      className="dash-input"
                      style={{ padding: "6px 8px" }}
                      value={rec.credits}
                      onChange={(e) =>
                        onChangeRecord(
                          rec.id,
                          "credits",
                          Math.max(1, Number(e.target.value) || 1),
                        )
                      }
                      aria-label={`Số tín chỉ ${rec.courseName}`}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      className="dash-input"
                      style={{ padding: "6px 8px" }}
                      value={rec.score10}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        onChangeRecord(
                          rec.id,
                          "score10",
                          Math.max(0, Math.min(10, Number.isNaN(val) ? 0 : val)),
                        );
                      }}
                      aria-label={`Điểm thang 10 ${rec.courseName}`}
                    />
                  </td>
                  <td>
                    <span
                      className={`dash-badge ${
                        converted.score4 >= 3.5
                          ? "dash-badge--jade"
                          : converted.score4 >= 2.0
                            ? "dash-badge--gold"
                            : "dash-badge--crimson-soft"
                      }`}
                    >
                      {converted.letter}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: "#8b1218" }}>
                    {converted.score4.toFixed(1)}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="dash-mini-icon-btn"
                      onClick={() => onDeleteRecord(rec.id)}
                      aria-label={`Xóa môn ${rec.courseName}`}
                      title="Xóa môn"
                    >
                      <Trash2 size={13} color="#8b1218" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
