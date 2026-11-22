"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import DashboardHero from "@/components/dashboard/DashboardHero";
import GpaTable from "@/components/dashboard/GpaTable";
import GpaTargetCard from "@/components/dashboard/GpaTargetCard";
import {
  KMA_GRADE_RULES,
  MOCK_GPA_BASE,
  MOCK_GPA_RECORDS_RESPONSE,
  convertScore10,
  type GpaRecord,
} from "@/lib/mock/dashboard";

/**
 * Trang Tính GPA chi tiết (/dashboard/gpa).
 * Sinh viên nhập môn/điểm/tín chỉ trực tiếp để tính GPA kỳ, GPA tích lũy và điểm cần đạt.
 */
export default function DashboardGpaPage() {
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

  return (
    <>
      <DashboardHero
        eyebrow="Học tập KMA"
        titlePrefix="Tính điểm"
        titleHighlight="GPA"
        subtitle={`Quy đổi thang điểm 10 sang điểm chữ & thang 4 chuẩn KMA. Dữ liệu nền mẫu: ${MOCK_GPA_BASE.previousCredits} TC với GPA ${MOCK_GPA_BASE.previousGpa4.toFixed(2)}.`}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/dashboard/study" className="dash-btn dash-btn--sm">
            <ArrowLeft size={14} />
            Về góc Học tập
          </Link>
          <button
            type="button"
            className="dash-btn dash-btn--outline-crimson dash-btn--sm"
            onClick={() => setRecords(MOCK_GPA_RECORDS_RESPONSE.data)}
          >
            <RotateCcw size={14} />
            Khôi phục điểm mẫu
          </button>
        </div>
      </DashboardHero>

      <main className="dash-main">
        <div className="dash-stack">
          <div className="dash-gpa-layout">
            <GpaTable
              records={records}
              onChangeRecord={handleChangeRecord}
              onAddRecord={handleAddRecord}
              onDeleteRecord={handleDeleteRecord}
            />

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
        </div>
      </main>
    </>
  );
}
