"use client";

import { useState } from "react";
import {
  AlertCircle,
  Calculator,
  ClipboardPaste,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import GpaTable, {
  GPA_REFERENCE_RULES,
  VALID_LETTER_GRADES,
  parseScore0To10,
  round1,
  score10ToLetter,
  type GpaCourseRow,
  type GpaRowError,
} from "@/components/dashboard/GpaTable";
import { ApiError, apiFetch } from "@/lib/api";

/**
 * Trang Tính điểm GPA (/dashboard/gpa) nối trực tiếp với backend Express:
 * - Hỗ trợ dán nhiều lần (nhiều trang/học kỳ): nối chữ mới vào rawText cách nhau 1 dòng trống,
 *   gửi TOÀN BỘ rawText lên POST /grades/parse để backend tự gộp môn học lại.
 * - Lưu tín chỉ đã nhập theo tên môn (tinChiTheoMon) và tự điền lại khi nhận courses mới.
 * - Bảng điểm đủ cột chuẩn KMA (#, Năm học, Học kỳ, Môn thi, Lần, TP1, TP2, ĐQT, Điểm thi, Điểm HP, Điểm chữ, Thang 4, Tín chỉ).
 * - Khi nhập tay TP1/TP2 tự tính ĐQT (= 0.7*TP1 + 0.3*TP2) và Điểm HP (= 0.21*TP1 + 0.09*TP2 + 0.7*Điểm thi).
 * - POST /grades/gpa { courses: [{ mon, diemChu, tinChi }] } → hiển thị GPA 2 chữ số thập phân.
 */

interface ParsedCourseApi {
  namHoc: string;
  hocKy: number;
  mon: string;
  lan: number;
  diemThi: number | null;
  diemHP: number | null;
  diemChu: string;
}

interface ParseGradesResponse {
  courses: ParsedCourseApi[];
  message?: string;
}

interface CalcGpaResponse {
  GPA: number;
  message?: string;
}

/**
 * Trích thêm TP1, TP2, ĐQT từ bảng điểm gốc theo tên môn + lần thi để hiển thị đầy đủ trên bảng
 * (không ảnh hưởng tới logic gộp môn hay tính GPA ở backend).
 */
function extractTpMapFromRawText(
  text: string,
): Map<string, { tp1: string; tp2: string; dqt: string }> {
  const map = new Map<string, { tp1: string; tp2: string; dqt: string }>();
  for (const line of text.split("\n")) {
    const cols = line.split("\t");
    if (cols.length < 9) continue;
    if (cols[0].trim() === "" || !Number.isInteger(Number(cols[0]))) continue;
    const mon = (cols[4] ?? "").trim();
    const lan = Number(cols[5] ?? "");
    const tp1 = (cols[6] ?? "").trim();
    const tp2 = (cols[7] ?? "").trim();
    const dqt = (cols[8] ?? "").trim();
    if (mon && !Number.isNaN(lan)) {
      map.set(`${mon}__${lan}`, { tp1, tp2, dqt });
    }
  }
  return map;
}

export default function DashboardGpaPage() {
  // Toàn bộ chữ bảng điểm đã tích lũy qua các lần dán
  const [rawText, setRawText] = useState("");
  // Nội dung đang nhập/dán ở lần hiện tại
  const [pasteInput, setPasteInput] = useState("");
  // Số lần đã dán và phân tích thành công
  const [pasteCount, setPasteCount] = useState(0);
  // Ghi nhớ số tín chỉ đã nhập theo tên môn để giữ lại khi dán thêm bảng điểm mới
  const [tinChiTheoMon, setTinChiTheoMon] = useState<Record<string, string>>(
    {},
  );

  const [rows, setRows] = useState<GpaCourseRow[]>([]);
  const [rowErrors, setRowErrors] = useState<Record<string, GpaRowError>>({});

  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseNotice, setParseNotice] = useState<string | null>(null);

  const [calculating, setCalculating] = useState(false);
  const [gpaError, setGpaError] = useState<string | null>(null);
  const [gpaResult, setGpaResult] = useState<{
    gpa: number;
    courseCount: number;
    totalCredits: number;
  } | null>(null);
  const [isResultStale, setIsResultStale] = useState(false);

  async function handleParseTranscript(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (parsing) return;
    setParseError(null);
    setParseNotice(null);
    setGpaError(null);

    const newChunk = pasteInput.trim();
    if (!newChunk) {
      setParseError(
        rawText
          ? "Vui lòng dán thêm phần bảng điểm mới vào ô trên rồi bấm Phân tích."
          : "Vui lòng dán nội dung bảng điểm trước khi phân tích.",
      );
      return;
    }

    // Nối phần mới vào toàn bộ rawText đã dán trước đó (cách nhau 1 dòng trống)
    const combinedText = rawText ? `${rawText}\n\n${newChunk}` : newChunk;

    setParsing(true);
    try {
      // Luôn gửi TOÀN BỘ combinedText lên backend để backend tự gộp môn học lại
      const data = await apiFetch<ParseGradesResponse>("/grades/parse", {
        method: "POST",
        body: { text: combinedText },
      });

      const parsedCourses = Array.isArray(data?.courses) ? data.courses : [];
      const tpMap = extractTpMapFromRawText(combinedText);

      const mappedParsed: GpaCourseRow[] = parsedCourses.map((c, idx) => {
        const courseKey = c.mon.trim();
        const tp = tpMap.get(`${courseKey}__${c.lan}`);
        return {
          id: `parsed_${idx}_${courseKey}`,
          source: "parsed",
          namHoc: c.namHoc ?? "",
          hocKyInput: c.hocKy != null ? String(c.hocKy) : "",
          mon: c.mon,
          lanInput: c.lan != null ? String(c.lan) : "",
          tp1Input: tp?.tp1 ?? "",
          tp2Input: tp?.tp2 ?? "",
          dqtInput: tp?.dqt ?? "",
          diemThiInput: c.diemThi != null ? c.diemThi.toFixed(1) : "",
          score10Input: c.diemHP != null ? c.diemHP.toFixed(1) : "",
          diemChu: c.diemChu,
          // Tự động điền lại số tín chỉ đã sửa trước đó, mặc định 2 tín chỉ
          tinChiInput: tinChiTheoMon[courseKey] ?? "2",
        };
      });

      const nextPasteCount = pasteCount + 1;
      setRawText(combinedText);
      setPasteInput("");
      setPasteCount(nextPasteCount);
      setRows((prev) => [
        ...mappedParsed,
        ...prev.filter((row) => row.source === "manual"),
      ]);
      setRowErrors({});
      if (gpaResult) setIsResultStale(true);
      setParseNotice(
        `Đã dán lần thứ ${nextPasteCount}. Hiện có ${mappedParsed.length} môn sau khi gộp (tín chỉ mặc định là 2, bạn có thể sửa từng môn hoặc bấm Tính GPA ngay).`,
      );
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Không thể phân tích bảng điểm. Vui lòng thử lại.";
      setParseError(msg);
    } finally {
      setParsing(false);
    }
  }

  function handleAddManualRow() {
    setRows((prev) => [
      ...prev,
      {
        id: `manual_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        source: "manual",
        namHoc: "",
        hocKyInput: "1",
        mon: "",
        lanInput: "1",
        tp1Input: "",
        tp2Input: "",
        dqtInput: "",
        diemThiInput: "",
        score10Input: "",
        diemChu: "",
        tinChiInput: "2",
      },
    ]);
    setGpaError(null);
    if (gpaResult) setIsResultStale(true);
  }

  function handleChangeRow(
    id: string,
    patch: Partial<Omit<GpaCourseRow, "id" | "source">>,
  ) {
    const targetRow = rows.find((r) => r.id === id);
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );

    // Cập nhật bộ nhớ tín chỉ theo tên môn mỗi khi người dùng thay đổi tín chỉ hoặc tên môn
    if (targetRow) {
      const nextMon = (patch.mon ?? targetRow.mon).trim();
      const nextTinChi = patch.tinChiInput ?? targetRow.tinChiInput;
      if (nextMon) {
        setTinChiTheoMon((prev) => {
          if (nextTinChi === "") {
            if (!(nextMon in prev)) return prev;
            const copy = { ...prev };
            delete copy[nextMon];
            return copy;
          }
          if (prev[nextMon] === nextTinChi) return prev;
          return { ...prev, [nextMon]: nextTinChi };
        });
      }
    }

    setRowErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setGpaError(null);
    if (gpaResult) setIsResultStale(true);
  }

  function handleDeleteRow(id: string) {
    setRows((prev) => prev.filter((row) => row.id !== id));
    setRowErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (gpaResult) setIsResultStale(true);
  }

  // Nút "Xóa hết, dán lại": reset sạch rawText, courses, tinChiTheoMon và kết quả
  function handleResetAll() {
    setRawText("");
    setPasteInput("");
    setPasteCount(0);
    setTinChiTheoMon({});
    setRows([]);
    setRowErrors({});
    setGpaResult(null);
    setGpaError(null);
    setParseError(null);
    setParseNotice(null);
    setIsResultStale(false);
  }

  async function handleCalculateGpa() {
    if (calculating) return;
    setGpaError(null);

    if (rows.length === 0) {
      setGpaError("Vui lòng phân tích bảng điểm hoặc thêm ít nhất 1 môn học.");
      return;
    }

    if (rows.length > 100) {
      setGpaError("Danh sách không được vượt quá 100 môn học mỗi lần tính.");
      return;
    }

    const nextRowErrors: Record<string, GpaRowError> = {};
    const payloadCourses: { mon: string; diemChu: string; tinChi: number }[] =
      [];
    let totalCredits = 0;

    for (const row of rows) {
      const err: GpaRowError = {};
      const cleanName = row.mon.trim();
      if (!cleanName) {
        err.mon = "Nhập tên môn";
      }

      let resolvedLetter = row.diemChu.trim();
      if (row.source === "manual") {
        const tp1 = parseScore0To10(row.tp1Input);
        const tp2 = parseScore0To10(row.tp2Input);
        const diemThi = parseScore0To10(row.diemThiInput);

        if (tp1 === null) err.tp1 = "0–10";
        if (tp2 === null) err.tp2 = "0–10";
        if (diemThi === null) err.diemThi = "0–10";

        if (tp1 !== null && tp2 !== null && diemThi !== null) {
          const hp = round1(0.21 * tp1 + 0.09 * tp2 + 0.7 * diemThi);
          resolvedLetter = score10ToLetter(hp);
        }
      } else if (
        !VALID_LETTER_GRADES.includes(
          resolvedLetter as (typeof VALID_LETTER_GRADES)[number],
        )
      ) {
        err.score10 = "Điểm chữ không hợp lệ";
      }

      const rawCredits = row.tinChiInput.trim();
      const numCredits = Number(rawCredits);
      if (
        rawCredits === "" ||
        !Number.isInteger(numCredits) ||
        numCredits < 1 ||
        numCredits > 10
      ) {
        err.tinChi = "Nguyên 1–10";
      }

      if (Object.keys(err).length > 0) {
        nextRowErrors[row.id] = err;
      } else {
        totalCredits += numCredits;
        payloadCourses.push({
          mon: cleanName,
          diemChu: resolvedLetter,
          tinChi: numCredits,
        });
      }
    }

    if (Object.keys(nextRowErrors).length > 0) {
      setRowErrors(nextRowErrors);
      setGpaError(
        "Vui lòng nhập đủ TP1, TP2, Điểm thi (0–10) cho các môn nhập tay và tín chỉ nguyên (1–10).",
      );
      return;
    }

    setRowErrors({});
    setCalculating(true);

    try {
      const data = await apiFetch<CalcGpaResponse>("/grades/gpa", {
        method: "POST",
        body: { courses: payloadCourses },
      });

      const numericGpa = Number(data?.GPA);
      if (Number.isNaN(numericGpa)) {
        setGpaError("Máy chủ trả về kết quả GPA không hợp lệ.");
        return;
      }

      setGpaResult({
        gpa: numericGpa,
        courseCount: payloadCourses.length,
        totalCredits,
      });
      setIsResultStale(false);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Không thể tính GPA. Vui lòng thử lại.";
      setGpaError(msg);
    } finally {
      setCalculating(false);
    }
  }

  const hasAnyData =
    rawText !== "" ||
    pasteInput !== "" ||
    rows.length > 0 ||
    Object.keys(tinChiTheoMon).length > 0;

  return (
    <>
      <DashboardPageHeader
        breadcrumbs={[
          { label: "Tổng quan", href: "/dashboard" },
          { label: "Học tập", href: "/dashboard/study" },
          { label: "Tính GPA" },
        ]}
        title="Tính điểm"
        titleHighlight="GPA"
        description="Dán nối tiếp nhiều trang bảng điểm từ cổng đào tạo để phân tích gộp hoặc nhập môn thủ công (TP1, TP2, ĐQT, Điểm thi) và tính GPA thang 4."
      />

      <main className="dash-main">
        <div className="dash-stack">
          {/* Khu vực dán bảng điểm nối tiếp gọi POST /grades/parse */}
          <form
            className="dash-card dash-stack"
            style={{ gap: 14 }}
            onSubmit={handleParseTranscript}
          >
            <div className="dash-card-head" style={{ marginBottom: 0 }}>
              <h2 className="dash-card-title">
                <ClipboardPaste size={19} color="#8b1218" />
                Dán bảng điểm từ cổng đào tạo
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span className="dash-badge dash-badge--gold dash-num">
                  Đã dán {pasteCount} lần
                </span>
                <span className="dash-badge dash-badge--crimson-soft dash-num">
                  Đang có {rows.length} môn
                </span>
              </div>
            </div>

            <label className="dash-field">
              <span className="dash-label">
                {pasteCount > 0
                  ? "Dán thêm trang bảng điểm tiếp theo — hệ thống sẽ tự nối vào dữ liệu trước đó và giữ nguyên tín chỉ bạn đã nhập"
                  : "Sao chép bảng điểm (dạng bảng cách nhau bởi phím Tab) và dán vào ô dưới đây. Có thể dán nhiều lần cho nhiều trang."}
              </span>
              <textarea
                className="dash-input"
                rows={4}
                style={{
                  height: "auto",
                  minHeight: 108,
                  padding: "12px 14px",
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                }}
                placeholder={
                  pasteCount > 0
                    ? "Dán thêm phần bảng điểm tiếp theo vào đây..."
                    : "Dán các dòng bảng điểm từ hệ thống đào tạo KMA vào đây..."
                }
                value={pasteInput}
                onChange={(e) => {
                  setPasteInput(e.target.value);
                  if (parseError) setParseError(null);
                }}
                disabled={parsing}
              />
            </label>

            {parseError && (
              <div
                role="alert"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "#fdf0f0",
                  border: "1px solid rgba(139, 18, 24, 0.35)",
                  color: "#6b0c11",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                <AlertCircle size={16} style={{ flex: "none" }} />
                <span>{parseError}</span>
              </div>
            )}

            {parseNotice && (
              <div
                role="status"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "#e7f6ee",
                  border: "1px solid rgba(21, 104, 67, 0.35)",
                  color: "#104e31",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                <FileSpreadsheet size={16} style={{ flex: "none" }} />
                <span>{parseNotice}</span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              {hasAnyData && (
                <button
                  type="button"
                  className="dash-btn dash-btn--outline-crimson dash-btn--sm"
                  onClick={handleResetAll}
                  disabled={parsing || calculating}
                >
                  <RotateCcw size={14} />
                  Xóa hết, dán lại
                </button>
              )}
              <button
                type="submit"
                className="dash-btn dash-btn--primary"
                disabled={parsing}
                aria-busy={parsing}
              >
                <Sparkles size={15} />
                {parsing
                  ? "Đang phân tích..."
                  : pasteCount > 0
                    ? "Nối thêm & Phân tích"
                    : "Phân tích"}
              </button>
            </div>
          </form>

          {/* Bảng môn học full-width để hiển thị đủ 13 cột KMA thoáng rõ, không bị cắt input */}
          <GpaTable
            rows={rows}
            rowErrors={rowErrors}
            onChangeRow={handleChangeRow}
            onAddManualRow={handleAddManualRow}
            onDeleteRow={handleDeleteRow}
            onClearAll={handleResetAll}
          />

          {/* Card Kết quả GPA & nút Tính GPA */}
          <section
            className="dash-card kma-seal-frame"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                className="dash-gpa-box"
                style={{ minWidth: 180, textAlign: "center", padding: "12px 20px" }}
              >
                <div style={{ fontSize: "0.78rem", color: "#5c5249" }}>
                  GPA thang 4.00
                </div>
                <div
                  className="dash-gpa-big dash-num"
                  style={{ fontSize: "2.2rem", margin: "2px 0" }}
                >
                  {gpaResult ? gpaResult.gpa.toFixed(2) : "—"}
                </div>
              </div>

              <div>
                <h2 className="dash-card-title" style={{ marginBottom: 4 }}>
                  <Calculator size={19} color="#8b1218" />
                  Kết quả GPA tổng kết
                </h2>
                <p
                  className="dash-num"
                  style={{ margin: 0, fontSize: "0.86rem", color: "#5c5249" }}
                >
                  {gpaResult
                    ? `Tính từ ${gpaResult.courseCount} môn học • Tổng ${gpaResult.totalCredits} tín chỉ`
                    : `Hiện có ${rows.length} môn trong danh sách. Điền đủ tín chỉ (1–10) rồi bấm Tính GPA.`}
                </p>
                {isResultStale && gpaResult && (
                  <p
                    role="status"
                    style={{
                      margin: "6px 0 0",
                      fontSize: "0.82rem",
                      color: "#7d5616",
                      fontWeight: 600,
                    }}
                  >
                    Bảng điểm vừa thay đổi — nhấn &ldquo;Tính GPA&rdquo; để cập nhật
                    kết quả mới.
                  </p>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 8,
                minWidth: 200,
              }}
            >
              <button
                type="button"
                className="dash-btn dash-btn--primary"
                style={{ minWidth: 180 }}
                onClick={handleCalculateGpa}
                disabled={calculating || rows.length === 0}
                aria-busy={calculating}
              >
                <Calculator size={16} />
                {calculating ? "Đang tính GPA..." : "Tính GPA"}
              </button>
            </div>

            {gpaError && (
              <div
                role="alert"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "#fdf0f0",
                  border: "1px solid rgba(139, 18, 24, 0.35)",
                  color: "#6b0c11",
                  fontSize: "0.83rem",
                }}
              >
                <AlertCircle
                  size={15}
                  style={{ flex: "none", marginTop: 2 }}
                />
                <span>{gpaError}</span>
              </div>
            )}
          </section>

          {/* Bảng tham chiếu thang quy đổi điểm */}
          <section className="dash-card">
            <h3 className="dash-card-title" style={{ marginBottom: 12 }}>
              Thang quy đổi điểm hệ 10 sang điểm chữ & hệ 4
            </h3>
            <div className="dash-chip-group">
              {GPA_REFERENCE_RULES.map((rule) => (
                <span key={rule.letter} className="dash-badge dash-badge--gold">
                  <strong>{rule.letter}</strong>: ≥ {rule.minScore10.toFixed(1)}{" "}
                  → {rule.score4.toFixed(1)}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
