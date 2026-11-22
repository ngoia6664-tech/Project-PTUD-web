"use client";

import { useState } from "react";
import { RotateCcw, TrendingUp } from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import GpaTable from "@/components/dashboard/GpaTable";
import GpaTargetCard from "@/components/dashboard/GpaTargetCard";
import {
  DataSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/DataStates";
import { useDemoState } from "@/components/ui/useDemoState";
import { useInViewOnce } from "@/components/ui/useInViewOnce";
import {
  KMA_GRADE_RULES,
  MOCK_GPA_BASE,
  MOCK_GPA_RECORDS_RESPONSE,
  convertScore10,
  type GpaRecord,
} from "@/lib/mock/dashboard";

/**
 * Trang Tính GPA chi tiết (/dashboard/gpa) theo đặc tả A5:
 * - Page header gọn (Q1) + nút "Khôi phục điểm mẫu"
 * - Bảng nhập môn / tín chỉ / điểm 0–10 + quy đổi tức thì sang điểm chữ & thang 4
 * - Card kết quả & GPA mục tiêu sticky bên phải
 * - Biểu đồ đường GPA theo kỳ vẽ dần bằng stroke-dashoffset khi cuộn tới
 * - Hỗ trợ ?demo=loading|empty|error.
 */

const SEMESTER_GPA_HISTORY = [
  { label: "HK1", gpa: 3.35 },
  { label: "HK2", gpa: 3.42 },
  { label: "HK3", gpa: 3.51 },
  { label: "HK4", gpa: 3.44 },
  { label: "HK5", gpa: 3.48 },
];

export default function DashboardGpaPage() {
  const { demoMode, retryDemo } = useDemoState();
  const { ref: chartRef, inView: chartInView } = useInViewOnce<HTMLElement>(0.2);
  const [records, setRecords] = useState<GpaRecord[]>(
    MOCK_GPA_RECORDS_RESPONSE.data,
  );
  const [targetGpa, setTargetGpa] = useState(3.6);

  function handleChangeRecord(
    id: string,
    field: keyof GpaRecord,
    value: string | number,
  ) {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, [field]: value } : rec)),
    );
  }

  function handleAddRecord() {
    setRecords((prev) => [
      ...prev,
      {
        id: `gpa_${Date.now()}`,
        courseCode: "AT000",
        courseName: "Học phần mới",
        credits: 3,
        score10: 8.0,
        semester: "HK1 2026–2027",
      },
    ]);
  }

  function handleDeleteRecord(id: string) {
    setRecords((prev) => prev.filter((rec) => rec.id !== id));
  }

  const semesterCredits = records.reduce((sum, r) => sum + r.credits, 0);
  const totalWeighted4 = records.reduce(
    (sum, r) => sum + convertScore10(r.score10).score4 * r.credits,
    0,
  );
  const totalWeighted10 = records.reduce(
    (sum, r) => sum + r.score10 * r.credits,
    0,
  );

  const semesterGpa4 =
    semesterCredits > 0 ? totalWeighted4 / semesterCredits : 0;
  const semesterGpa10 =
    semesterCredits > 0 ? totalWeighted10 / semesterCredits : 0;

  const cumulativeCredits = MOCK_GPA_BASE.previousCredits + semesterCredits;
  const cumulativeGpa4 =
    cumulativeCredits > 0
      ? (MOCK_GPA_BASE.previousGpa4 * MOCK_GPA_BASE.previousCredits +
          totalWeighted4) /
        cumulativeCredits
      : 0;
  const remainingCredits = Math.max(
    0,
    MOCK_GPA_BASE.totalProgramCredits - cumulativeCredits,
  );

  // Tạo tọa độ SVG cho biểu đồ đường GPA theo kỳ (gồm kỳ dự kiến hiện tại)
  const chartPoints = [
    ...SEMESTER_GPA_HISTORY,
    { label: "Dự kiến", gpa: Number(cumulativeGpa4.toFixed(2)) },
  ];
  const svgCoords = chartPoints.map((pt, idx) => {
    const x = 44 + idx * 80;
    const clamped = Math.max(2.0, Math.min(4.0, pt.gpa));
    const y = 148 - ((clamped - 2.0) / 2.0) * 116;
    return { ...pt, x, y };
  });
  const linePath = svgCoords
    .map((p, idx) => `${idx === 0 ? "M" : "L"}${p.x} ${p.y}`)
    .join(" ");
  const areaPath = `${linePath} L${svgCoords[svgCoords.length - 1].x} 154 L${svgCoords[0].x} 154 Z`;

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
        description={`Quy đổi điểm hệ 10 sang hệ 4 tức thì. Nền tích lũy mẫu: ${MOCK_GPA_BASE.previousCredits} TC với GPA ${MOCK_GPA_BASE.previousGpa4.toFixed(2)}.`}
        actions={
          <button
            type="button"
            className="dash-btn dash-btn--outline-crimson dash-btn--sm"
            onClick={() => {
              setRecords(MOCK_GPA_RECORDS_RESPONSE.data);
              retryDemo();
            }}
          >
            <RotateCcw size={14} />
            Khôi phục điểm mẫu
          </button>
        }
      />

      <main className="dash-main">
        <div className="dash-stack">
          {demoMode === "loading" ? (
            <DataSkeleton variant="table" count={5} />
          ) : demoMode === "error" ? (
            <ErrorState
              title="Không thể tải bảng điểm mẫu"
              message="Đã có sự cố khi nạp dữ liệu điểm học kỳ. Vui lòng thử lại."
              onRetry={retryDemo}
            />
          ) : demoMode === "empty" ? (
            <EmptyState
              title="Chưa có học phần nào trong bảng tính"
              description="Khôi phục điểm mẫu hoặc thêm môn học mới để bắt đầu tính GPA."
              actionLabel="Khôi phục điểm mẫu"
              onAction={() => {
                setRecords(MOCK_GPA_RECORDS_RESPONSE.data);
                retryDemo();
              }}
            />
          ) : (
            <>
              <div className="dash-gpa-layout">
                <GpaTable
                  records={records}
                  onChangeRecord={handleChangeRecord}
                  onAddRecord={handleAddRecord}
                  onDeleteRecord={handleDeleteRecord}
                />

                <div className="dash-gpa-sticky">
                  <GpaTargetCard
                    semesterGpa4={semesterGpa4}
                    semesterGpa10={semesterGpa10}
                    semesterCredits={semesterCredits}
                    cumulativeGpa4={cumulativeGpa4}
                    cumulativeCredits={cumulativeCredits}
                    remainingCredits={remainingCredits}
                    targetGpa={targetGpa}
                    onTargetGpaChange={setTargetGpa}
                  />
                </div>
              </div>

              {/* Biểu đồ đường GPA theo kỳ (vẽ dần bằng stroke-dashoffset một lần khi cuộn tới) */}
              <section ref={chartRef} className="dash-card">
                <div className="dash-card-head">
                  <h2 className="dash-card-title">
                    <TrendingUp size={19} color="#8b1218" />
                    Xu hướng GPA theo học kỳ
                  </h2>
                  <span className="dash-badge dash-badge--gold">Thang 4.00</span>
                </div>

                <svg
                  viewBox="0 0 490 184"
                  width="100%"
                  height="184"
                  role="img"
                  aria-label="Biểu đồ đường GPA tích lũy qua các học kỳ"
                >
                  <defs>
                    <linearGradient id="gpaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b1218" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#8b1218" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {[2.5, 3.0, 3.5, 4.0].map((val) => {
                    const y = 148 - ((val - 2.0) / 2.0) * 116;
                    return (
                      <g key={val}>
                        <line
                          x1="36"
                          y1={y}
                          x2="466"
                          y2={y}
                          stroke="#e7dccb"
                          strokeDasharray="4 4"
                        />
                        <text
                          x="28"
                          y={y + 4}
                          textAnchor="end"
                          fontSize="11"
                          fill="#5c5249"
                        >
                          {val.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}

                  <path
                    d={areaPath}
                    fill="url(#gpaAreaGrad)"
                    className={`kma-svg-area ${
                      chartInView ? "kma-svg-area--visible" : ""
                    }`}
                  />

                  <path
                    d={linePath}
                    fill="none"
                    stroke="#8b1218"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    className={`kma-svg-line ${
                      chartInView ? "kma-svg-line--visible" : ""
                    }`}
                  />

                  {svgCoords.map((pt, idx) => (
                    <g key={pt.label}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        fill="#fffdf9"
                        stroke="#8b1218"
                        strokeWidth="2.5"
                        className={`kma-svg-dot ${
                          chartInView ? "kma-svg-dot--visible" : ""
                        }`}
                        style={{ animationDelay: `${260 + idx * 80}ms` }}
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        textAnchor="middle"
                        fontSize="11.5"
                        fontWeight="700"
                        fill="#1e1916"
                      >
                        {pt.gpa.toFixed(2)}
                      </text>
                      <text
                        x={pt.x}
                        y="174"
                        textAnchor="middle"
                        fontSize="11.5"
                        fontWeight="600"
                        fill="#5c5249"
                      >
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </section>

              {/* Bảng tham chiếu thang quy đổi điểm KMA */}
              <section className="dash-card">
                <h3 className="dash-card-title" style={{ marginBottom: 12 }}>
                  Thang quy đổi điểm tham chiếu KMA
                </h3>
                <div className="dash-chip-group">
                  {KMA_GRADE_RULES.map((rule) => (
                    <span key={rule.letter} className="dash-badge dash-badge--gold">
                      <strong>{rule.letter}</strong>: ≥ {rule.minScore10.toFixed(1)} →{" "}
                      {rule.score4.toFixed(1)}
                    </span>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
