"use client";

import { Check, Pencil, Plus, Trash2 } from "lucide-react";

/**
 * Bảng điểm chi tiết theo đúng cấu trúc cổng KMA:
 * # | Năm học | Học kỳ | Môn thi | Lần | TP1 | TP2 | ĐQT | Điểm thi | Điểm HP | Điểm chữ | Thang 4 | Tín chỉ * | Thao tác
 *
 * - Mỗi dòng đều có nút Sửa (Pencil) / Xong (Check) và nút Xóa (Trash2).
 * - ĐQT và Điểm HP luôn chỉ đọc (không cho input), tự động tính theo state:
 *   ĐQT = 0.7 * TP1 + 0.3 * TP2; Điểm HP = 0.21 * TP1 + 0.09 * TP2 + 0.7 * Điểm thi.
 * - Đổi Điểm HP sang Điểm chữ: làm tròn 1 chữ số, rồi >=9 A+, >=8.5 A, >=7.8 B+,
 *   >=7 B, >=6.3 C+, >=5.5 C, >=4.8 D+, >=4 D, còn lại F; chặn điểm ngoài 0–10.
 */

export type LetterGrade = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "F";

export const VALID_LETTER_GRADES: readonly LetterGrade[] = [
  "A+",
  "A",
  "B+",
  "B",
  "C+",
  "C",
  "D+",
  "D",
  "F",
];

export const GPA_REFERENCE_RULES: {
  letter: LetterGrade;
  minScore10: number;
  score4: number;
}[] = [
  { letter: "A+", minScore10: 9.0, score4: 4.0 },
  { letter: "A", minScore10: 8.5, score4: 3.8 },
  { letter: "B+", minScore10: 7.8, score4: 3.5 },
  { letter: "B", minScore10: 7.0, score4: 3.0 },
  { letter: "C+", minScore10: 6.3, score4: 2.4 },
  { letter: "C", minScore10: 5.5, score4: 2.0 },
  { letter: "D+", minScore10: 4.8, score4: 1.5 },
  { letter: "D", minScore10: 4.0, score4: 1.0 },
  { letter: "F", minScore10: 0.0, score4: 0.0 },
];

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function parseScore0To10(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const num = Number(trimmed);
  if (Number.isNaN(num) || num < 0 || num > 10) return null;
  return num;
}

export function isInvalidScoreInput(raw: string): boolean {
  const trimmed = raw.trim();
  if (trimmed === "") return false;
  return parseScore0To10(trimmed) === null;
}

export function score10ToLetter(score: number): LetterGrade {
  const rounded = round1(score);
  if (rounded >= 9.0) return "A+";
  if (rounded >= 8.5) return "A";
  if (rounded >= 7.8) return "B+";
  if (rounded >= 7.0) return "B";
  if (rounded >= 6.3) return "C+";
  if (rounded >= 5.5) return "C";
  if (rounded >= 4.8) return "D+";
  if (rounded >= 4.0) return "D";
  return "F";
}

export function letterToScore4(letter: string): number | null {
  const found = GPA_REFERENCE_RULES.find((r) => r.letter === letter);
  return found ? found.score4 : null;
}

export interface GpaCourseRow {
  id: string;
  source: "parsed" | "manual";
  isEditing: boolean;
  namHoc: string;
  hocKyInput: string;
  mon: string;
  lanInput: string;
  tp1Input: string;
  tp2Input: string;
  dqtInput: string;
  diemThiInput: string;
  /** Điểm HP (thang 10 — chỉ đọc, tự tính từ TP1, TP2 và Điểm thi) */
  score10Input: string;
  diemChu: string;
  /** Số tín chỉ (chuỗi nguyên 1–10, bắt buộc) */
  tinChiInput: string;
}

export interface GpaRowError {
  mon?: string;
  tp1?: string;
  tp2?: string;
  dqt?: string;
  diemThi?: string;
  score10?: string;
  tinChi?: string;
}

interface GpaTableProps {
  rows: GpaCourseRow[];
  rowErrors: Record<string, GpaRowError>;
  onChangeRow: (
    id: string,
    patch: Partial<Omit<GpaCourseRow, "id" | "source">>,
  ) => void;
  onToggleEditRow: (id: string) => void;
  onAddManualRow: () => void;
  onDeleteRow: (id: string) => void;
  onClearAll: () => void;
}

export default function GpaTable({
  rows,
  rowErrors,
  onChangeRow,
  onToggleEditRow,
  onAddManualRow,
  onDeleteRow,
  onClearAll,
}: GpaTableProps) {
  // Cập nhật TP1, TP2 hoặc Điểm thi → tự tính ĐQT và Điểm HP (không cho sửa trực tiếp ĐQT & Điểm HP)
  function handleComponentScoreChange(
    row: GpaCourseRow,
    field: "tp1Input" | "tp2Input" | "diemThiInput",
    rawValue: string,
  ) {
    const nextTp1Raw = field === "tp1Input" ? rawValue : row.tp1Input;
    const nextTp2Raw = field === "tp2Input" ? rawValue : row.tp2Input;
    const nextThiRaw = field === "diemThiInput" ? rawValue : row.diemThiInput;

    const tp1 = parseScore0To10(nextTp1Raw);
    const tp2 = parseScore0To10(nextTp2Raw);
    const diemThi = parseScore0To10(nextThiRaw);

    let dqtInput = "";
    let score10Input = "";
    let diemChu = "";

    if (tp1 !== null && tp2 !== null) {
      const dqt = round1(0.7 * tp1 + 0.3 * tp2);
      dqtInput = dqt.toFixed(1);

      if (diemThi !== null) {
        const hp = round1(0.21 * tp1 + 0.09 * tp2 + 0.7 * diemThi);
        score10Input = hp.toFixed(1);
        diemChu = score10ToLetter(hp);
      }
    }

    onChangeRow(row.id, {
      [field]: rawValue,
      dqtInput,
      score10Input,
      diemChu,
    });
  }

  const numInputStyle = (hasErr?: string, minWidth = 66) => ({
    minWidth,
    width: "100%",
    padding: "6px 6px",
    textAlign: "center" as const,
    borderColor: hasErr ? "#8b1218" : undefined,
  });

  return (
    <section className="dash-card dash-stack" style={{ gap: 14 }}>
      <div className="dash-card-head" style={{ marginBottom: 0 }}>
        <div>
          <h2 className="dash-card-title">Danh sách học phần tính GPA</h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "0.82rem",
              color: "#5c5249",
            }}
          >
            Bấm biểu tượng bút chì để sửa bất kỳ môn nào. Khi sửa{" "}
            <strong>TP1, TP2</strong> và <strong>Điểm thi</strong> (0–10), hệ
            thống tự tính <strong>ĐQT</strong> (= 0,7×TP1 + 0,3×TP2),{" "}
            <strong>Điểm HP</strong> (= 0,21×TP1 + 0,09×TP2 + 0,7×Điểm thi) và{" "}
            <strong>Điểm chữ</strong>.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {rows.length > 0 && (
            <button
              type="button"
              className="dash-btn dash-btn--sm"
              onClick={onClearAll}
            >
              Xóa danh sách
            </button>
          )}
          <button
            type="button"
            className="dash-btn dash-btn--primary dash-btn--sm"
            onClick={onAddManualRow}
          >
            <Plus size={15} />
            Thêm môn nhập tay
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div
          style={{
            padding: "28px 18px",
            borderRadius: 12,
            border: "1px dashed #c8b69e",
            background: "#fbf6ec",
            textAlign: "center",
            color: "#5c5249",
            fontSize: "0.88rem",
          }}
        >
          Chưa có môn học nào. Hãy dán bảng điểm ở khung trên rồi bấm{" "}
          <strong>Phân tích</strong>, hoặc bấm{" "}
          <strong>Thêm môn nhập tay</strong>.
        </div>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th style={{ width: 40, textAlign: "center" }}>#</th>
                <th style={{ minWidth: 112 }}>Năm học</th>
                <th style={{ width: 72, textAlign: "center" }}>Học kỳ</th>
                <th style={{ minWidth: 200 }}>Môn thi</th>
                <th style={{ width: 64, textAlign: "center" }}>Lần</th>
                <th style={{ width: 78, textAlign: "center" }}>TP1</th>
                <th style={{ width: 78, textAlign: "center" }}>TP2</th>
                <th style={{ width: 74, textAlign: "center" }}>ĐQT</th>
                <th style={{ width: 84, textAlign: "center" }}>Điểm thi</th>
                <th style={{ width: 82, textAlign: "center" }}>Điểm HP</th>
                <th style={{ width: 82, textAlign: "center" }}>Điểm chữ</th>
                <th style={{ width: 74, textAlign: "center" }}>Thang 4</th>
                <th style={{ width: 88, textAlign: "center" }}>Tín chỉ *</th>
                <th style={{ width: 82, textAlign: "center" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const err = rowErrors[row.id];
                const score4 = letterToScore4(row.diemChu);
                const editable = row.isEditing;

                const tp1Err =
                  err?.tp1 ??
                  (isInvalidScoreInput(row.tp1Input) ? "0–10" : undefined);
                const tp2Err =
                  err?.tp2 ??
                  (isInvalidScoreInput(row.tp2Input) ? "0–10" : undefined);
                const thiErr =
                  err?.diemThi ??
                  (isInvalidScoreInput(row.diemThiInput) ? "0–10" : undefined);

                return (
                  <tr
                    key={row.id}
                    style={
                      editable ? { background: "#fdf9f1" } : undefined
                    }
                  >
                    <td
                      className="dash-num"
                      style={{
                        textAlign: "center",
                        color: "#5c5249",
                        fontSize: "0.82rem",
                      }}
                    >
                      {idx + 1}
                    </td>

                    {/* Năm học */}
                    <td>
                      {editable ? (
                        <input
                          type="text"
                          className="dash-input dash-num"
                          style={{
                            minWidth: 102,
                            padding: "6px 8px",
                            textAlign: "center",
                          }}
                          placeholder="2025-2026"
                          value={row.namHoc}
                          onChange={(e) =>
                            onChangeRow(row.id, { namHoc: e.target.value })
                          }
                          aria-label="Năm học"
                        />
                      ) : (
                        <span
                          className="dash-num"
                          style={{ whiteSpace: "nowrap", fontSize: "0.84rem" }}
                        >
                          {row.namHoc || "—"}
                        </span>
                      )}
                    </td>

                    {/* Học kỳ */}
                    <td style={{ textAlign: "center" }}>
                      {editable ? (
                        <input
                          type="number"
                          min={1}
                          max={3}
                          step={1}
                          className="dash-input dash-num"
                          style={numInputStyle(undefined, 54)}
                          placeholder="1"
                          value={row.hocKyInput}
                          onChange={(e) =>
                            onChangeRow(row.id, { hocKyInput: e.target.value })
                          }
                          aria-label="Học kỳ"
                        />
                      ) : (
                        <span className="dash-num" style={{ fontSize: "0.84rem" }}>
                          {row.hocKyInput || "—"}
                        </span>
                      )}
                    </td>

                    {/* Môn thi */}
                    <td>
                      {editable ? (
                        <div>
                          <input
                            type="text"
                            className="dash-input"
                            style={{
                              minWidth: 185,
                              padding: "6px 9px",
                              borderColor: err?.mon ? "#8b1218" : undefined,
                            }}
                            placeholder="Nhập tên môn học..."
                            value={row.mon}
                            onChange={(e) =>
                              onChangeRow(row.id, { mon: e.target.value })
                            }
                            aria-label="Môn thi"
                            aria-invalid={err?.mon ? true : undefined}
                          />
                          {err?.mon && (
                            <div
                              style={{
                                marginTop: 3,
                                fontSize: "0.73rem",
                                color: "#8b1218",
                              }}
                            >
                              {err.mon}
                            </div>
                          )}
                        </div>
                      ) : (
                        <strong style={{ fontSize: "0.88rem" }}>
                          {row.mon || "—"}
                        </strong>
                      )}
                    </td>

                    {/* Lần */}
                    <td style={{ textAlign: "center" }}>
                      {editable ? (
                        <input
                          type="number"
                          min={1}
                          max={9}
                          step={1}
                          className="dash-input dash-num"
                          style={numInputStyle(undefined, 50)}
                          placeholder="1"
                          value={row.lanInput}
                          onChange={(e) =>
                            onChangeRow(row.id, { lanInput: e.target.value })
                          }
                          aria-label="Lần thi"
                        />
                      ) : (
                        <span className="dash-num" style={{ fontSize: "0.84rem" }}>
                          {row.lanInput || "—"}
                        </span>
                      )}
                    </td>

                    {/* TP1 */}
                    <td style={{ textAlign: "center" }}>
                      {editable ? (
                        <div>
                          <input
                            type="number"
                            min={0}
                            max={10}
                            step={0.1}
                            className="dash-input dash-num"
                            style={numInputStyle(tp1Err)}
                            placeholder="0–10"
                            value={row.tp1Input}
                            onChange={(e) =>
                              handleComponentScoreChange(
                                row,
                                "tp1Input",
                                e.target.value,
                              )
                            }
                            aria-label={`Điểm TP1 ${row.mon || "môn học"}`}
                            aria-invalid={tp1Err ? true : undefined}
                          />
                          {tp1Err && (
                            <div
                              style={{
                                marginTop: 2,
                                fontSize: "0.72rem",
                                color: "#8b1218",
                              }}
                            >
                              {tp1Err}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span
                          className="dash-num"
                          style={{
                            color: row.tp1Input ? "#3a312b" : "#84776c",
                          }}
                        >
                          {row.tp1Input || "—"}
                        </span>
                      )}
                    </td>

                    {/* TP2 */}
                    <td style={{ textAlign: "center" }}>
                      {editable ? (
                        <div>
                          <input
                            type="number"
                            min={0}
                            max={10}
                            step={0.1}
                            className="dash-input dash-num"
                            style={numInputStyle(tp2Err)}
                            placeholder="0–10"
                            value={row.tp2Input}
                            onChange={(e) =>
                              handleComponentScoreChange(
                                row,
                                "tp2Input",
                                e.target.value,
                              )
                            }
                            aria-label={`Điểm TP2 ${row.mon || "môn học"}`}
                            aria-invalid={tp2Err ? true : undefined}
                          />
                          {tp2Err && (
                            <div
                              style={{
                                marginTop: 2,
                                fontSize: "0.72rem",
                                color: "#8b1218",
                              }}
                            >
                              {tp2Err}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span
                          className="dash-num"
                          style={{
                            color: row.tp2Input ? "#3a312b" : "#84776c",
                          }}
                        >
                          {row.tp2Input || "—"}
                        </span>
                      )}
                    </td>

                    {/* ĐQT (chỉ đọc, tự tính từ TP1 & TP2 — không cho nhập tay) */}
                    <td style={{ textAlign: "center" }}>
                      <span
                        className="dash-num"
                        style={{
                          fontWeight: row.dqtInput ? 600 : 400,
                          color: row.dqtInput ? "#3a312b" : "#84776c",
                        }}
                      >
                        {row.dqtInput || "—"}
                      </span>
                    </td>

                    {/* Điểm thi */}
                    <td style={{ textAlign: "center" }}>
                      {editable ? (
                        <div>
                          <input
                            type="number"
                            min={0}
                            max={10}
                            step={0.1}
                            className="dash-input dash-num"
                            style={numInputStyle(thiErr, 68)}
                            placeholder="0–10"
                            value={row.diemThiInput}
                            onChange={(e) =>
                              handleComponentScoreChange(
                                row,
                                "diemThiInput",
                                e.target.value,
                              )
                            }
                            aria-label={`Điểm thi ${row.mon || "môn học"}`}
                            aria-invalid={thiErr ? true : undefined}
                          />
                          {thiErr && (
                            <div
                              style={{
                                marginTop: 2,
                                fontSize: "0.72rem",
                                color: "#8b1218",
                              }}
                            >
                              {thiErr}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span
                          className="dash-num"
                          style={{
                            fontSize: "0.86rem",
                            color: row.diemThiInput ? "#1e1916" : "#84776c",
                          }}
                        >
                          {row.diemThiInput || "—"}
                        </span>
                      )}
                    </td>

                    {/* Điểm HP (chỉ đọc, tự tính từ TP1, TP2 & Điểm thi — không cho nhập tay) */}
                    <td style={{ textAlign: "center" }}>
                      <span
                        className="dash-num"
                        style={{
                          fontWeight: row.score10Input ? 700 : 400,
                          fontSize: "0.88rem",
                          color: row.score10Input ? "#1e1916" : "#84776c",
                        }}
                      >
                        {row.score10Input || "—"}
                      </span>
                    </td>

                    {/* Điểm chữ */}
                    <td style={{ textAlign: "center" }}>
                      {row.diemChu ? (
                        <span
                          className={`dash-badge ${
                            score4 !== null && score4 >= 3.5
                              ? "dash-badge--jade"
                              : score4 !== null && score4 >= 2.0
                                ? "dash-badge--gold"
                                : "dash-badge--crimson-soft"
                          }`}
                        >
                          {row.diemChu}
                        </span>
                      ) : (
                        <span style={{ color: "#84776c" }}>—</span>
                      )}
                    </td>

                    {/* Thang 4 */}
                    <td
                      className="dash-num"
                      style={{
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#8b1218",
                      }}
                    >
                      {score4 !== null ? score4.toFixed(1) : "—"}
                    </td>

                    {/* Tín chỉ */}
                    <td style={{ textAlign: "center" }}>
                      <div>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          step={1}
                          required
                          className="dash-input dash-num"
                          style={numInputStyle(err?.tinChi, 70)}
                          placeholder="1–10"
                          value={row.tinChiInput}
                          onChange={(e) =>
                            onChangeRow(row.id, { tinChiInput: e.target.value })
                          }
                          aria-label={`Số tín chỉ ${row.mon || "môn học"}`}
                          aria-invalid={err?.tinChi ? true : undefined}
                        />
                        {err?.tinChi && (
                          <div
                            style={{
                              marginTop: 2,
                              fontSize: "0.72rem",
                              color: "#8b1218",
                            }}
                          >
                            {err.tinChi}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Thao tác: Sửa / Xong + Xóa */}
                    <td>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <button
                          type="button"
                          className="dash-mini-icon-btn"
                          style={
                            editable
                              ? {
                                  background: "#e7f6ee",
                                  borderColor: "rgba(21, 104, 67, 0.45)",
                                }
                              : undefined
                          }
                          onClick={() => onToggleEditRow(row.id)}
                          aria-label={
                            editable
                              ? `Xong chỉnh sửa ${row.mon || "môn này"}`
                              : `Sửa môn ${row.mon || "này"}`
                          }
                          title={editable ? "Xong" : "Sửa môn"}
                        >
                          {editable ? (
                            <Check size={13} color="#156843" />
                          ) : (
                            <Pencil size={13} color="#7d5616" />
                          )}
                        </button>

                        <button
                          type="button"
                          className="dash-mini-icon-btn"
                          onClick={() => onDeleteRow(row.id)}
                          aria-label={`Xóa môn ${row.mon || "này"}`}
                          title="Xóa môn"
                        >
                          <Trash2 size={13} color="#8b1218" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
