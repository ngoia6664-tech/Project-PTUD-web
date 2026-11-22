"use client";

import { Target } from "lucide-react";

/**
 * Thẻ kết quả GPA kỳ, GPA tích lũy và công cụ nhập "GPA mục tiêu"
 * để gợi ý điểm trung bình cần đạt ở các môn còn lại.
 */

interface GpaTargetCardProps {
  semesterGpa4: number;
  semesterGpa10: number;
  semesterCredits: number;
  cumulativeGpa4: number;
  cumulativeCredits: number;
  remainingCredits: number;
  targetGpa: number;
  onTargetGpaChange: (value: number) => void;
}

export default function GpaTargetCard({
  semesterGpa4,
  semesterGpa10,
  semesterCredits,
  cumulativeGpa4,
  cumulativeCredits,
  remainingCredits,
  targetGpa,
  onTargetGpaChange,
}: GpaTargetCardProps) {
  const totalCredits = cumulativeCredits + remainingCredits;
  const requiredGpa =
    remainingCredits > 0
      ? (targetGpa * totalCredits - cumulativeGpa4 * cumulativeCredits) /
        remainingCredits
      : 0;

  let suggestionText = "";
  let isWarn = false;

  if (remainingCredits <= 0) {
    suggestionText = "Bạn đã hoàn thành đủ tổng tín chỉ của chương trình.";
  } else if (requiredGpa > 4.0) {
    isWarn = true;
    suggestionText = `Cần trung bình ${requiredGpa.toFixed(2)}/4.00 cho ${remainingCredits} tín chỉ còn lại — vượt mức tối đa 4.00. Bạn nên cân nhắc cải thiện các môn đã học hoặc điều chỉnh mục tiêu.`;
  } else if (requiredGpa <= 0) {
    suggestionText = `Bạn đã vượt mục tiêu ${targetGpa.toFixed(2)}! Chỉ cần duy trì kết quả ổn định ở ${remainingCredits} tín chỉ còn lại.`;
  } else {
    const letterHint =
      requiredGpa >= 3.8
        ? "từ A trở lên (≥ 8.5)"
        : requiredGpa >= 3.5
          ? "chủ yếu A và B+ (≥ 7.8)"
          : requiredGpa >= 3.0
            ? "từ B trở lên (≥ 7.0)"
            : "từ C+ trở lên (≥ 6.3)";
    suggestionText = `Để đạt GPA tích lũy ${targetGpa.toFixed(2)} khi tốt nghiệp, bạn cần đạt trung bình ${requiredGpa.toFixed(2)}/4.00 ở ${remainingCredits} tín chỉ còn lại (gợi ý: ${letterHint}).`;
  }

  return (
    <aside className="dash-card dash-stack" style={{ gap: 16 }}>
      <h2 className="dash-card-title">
        <Target size={19} color="#8b1218" />
        Kết quả & GPA mục tiêu
      </h2>

      <div className="dash-form-grid">
        <div className="dash-gpa-box">
          <div style={{ fontSize: "0.78rem", color: "#6e6359" }}>
            GPA học kỳ (thang 4)
          </div>
          <div className="dash-gpa-big">{semesterGpa4.toFixed(2)}</div>
          <div style={{ fontSize: "0.76rem", color: "#6e6359" }}>
            Thang 10: {semesterGpa10.toFixed(2)} ({semesterCredits} TC)
          </div>
        </div>

        <div className="dash-gpa-box">
          <div style={{ fontSize: "0.78rem", color: "#6e6359" }}>
            GPA tích lũy dự kiến
          </div>
          <div className="dash-gpa-big" style={{ color: "#156843" }}>
            {cumulativeGpa4.toFixed(2)}
          </div>
          <div style={{ fontSize: "0.76rem", color: "#6e6359" }}>
            Tổng {cumulativeCredits} / {totalCredits} TC
          </div>
        </div>
      </div>

      <label className="dash-field">
        <span className="dash-label">GPA mục tiêu tốt nghiệp (thang 4.00)</span>
        <input
          type="number"
          min={2.0}
          max={4.0}
          step={0.05}
          className="dash-input"
          value={targetGpa}
          onChange={(e) => {
            const val = Number(e.target.value);
            onTargetGpaChange(
              Math.max(0, Math.min(4, Number.isNaN(val) ? 3.2 : val)),
            );
          }}
        />
      </label>

      <div
        style={{
          padding: "13px 15px",
          borderRadius: 14,
          fontSize: "0.86rem",
          background: isWarn ? "#fdf0f0" : "#e7f6ee",
          border: `1px solid ${isWarn ? "#d86e75" : "rgba(21, 104, 67, 0.72)"}`,
          color: isWarn ? "#8b1218" : "#145c3b",
        }}
      >
        {suggestionText}
      </div>
    </aside>
  );
}
