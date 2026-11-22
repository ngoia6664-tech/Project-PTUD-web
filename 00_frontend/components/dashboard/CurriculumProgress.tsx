import type { Course } from "@/lib/mock/dashboard";

/**
 * Thanh tiến độ hoàn thành Chương trình đào tạo kèm thống kê tín chỉ theo trạng thái.
 */

interface CurriculumProgressProps {
  courses: Course[];
}

export default function CurriculumProgress({
  courses,
}: CurriculumProgressProps) {
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const doneCredits = courses
    .filter((c) => c.status === "da-hoc")
    .reduce((sum, c) => sum + c.credits, 0);
  const activeCredits = courses
    .filter((c) => c.status === "dang-hoc")
    .reduce((sum, c) => sum + c.credits, 0);
  const todoCredits = courses
    .filter((c) => c.status === "chua-hoc")
    .reduce((sum, c) => sum + c.credits, 0);

  const percent =
    totalCredits > 0 ? Math.round((doneCredits / totalCredits) * 100) : 0;

  return (
    <section className="dash-card dash-stack" style={{ gap: 14 }}>
      <div className="dash-card-head" style={{ marginBottom: 0 }}>
        <h2 className="dash-card-title">Tiến độ hoàn thành khung chương trình</h2>
        <span className="dash-badge dash-badge--crimson-soft">
          {doneCredits} / {totalCredits} tín chỉ ({percent}%)
        </span>
      </div>

      <div className="dash-bar-track" style={{ height: 12 }}>
        <div className="dash-bar-fill" style={{ width: `${percent}%` }} />
      </div>

      <div className="dash-chip-group">
        <span className="dash-badge dash-badge--jade">
          Đã học: {doneCredits} TC
        </span>
        <span className="dash-badge dash-badge--gold">
          Đang học: {activeCredits} TC
        </span>
        <span className="dash-badge">Chưa học: {todoCredits} TC</span>
      </div>
    </section>
  );
}
