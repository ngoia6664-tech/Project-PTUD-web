import type { Course, CourseStatus } from "@/lib/mock/dashboard";

/**
 * Danh sách học phần nhóm theo từng học kỳ kèm trạng thái (Đã học / Đang học / Chưa học).
 */

interface CurriculumSemesterListProps {
  courses: Course[];
}

const STATUS_META: Record<
  CourseStatus,
  { label: string; badgeClass: string }
> = {
  "da-hoc": { label: "Đã học", badgeClass: "dash-badge--jade" },
  "dang-hoc": { label: "Đang học", badgeClass: "dash-badge--gold" },
  "chua-hoc": { label: "Chưa học", badgeClass: "" },
};

export default function CurriculumSemesterList({
  courses,
}: CurriculumSemesterListProps) {
  const semesters = Array.from(new Set(courses.map((c) => c.semester))).sort(
    (a, b) => a - b,
  );

  if (semesters.length === 0) {
    return (
      <div className="dash-state-box">
        <p style={{ margin: 0 }}>Không có học phần nào khớp bộ lọc trạng thái.</p>
      </div>
    );
  }

  return (
    <div className="dash-stack" style={{ gap: 18 }}>
      {semesters.map((semester) => {
        const list = courses.filter((c) => c.semester === semester);
        const semCredits = list.reduce((sum, c) => sum + c.credits, 0);

        return (
          <section key={semester} className="dash-card dash-stack" style={{ gap: 12 }}>
            <div className="dash-card-head" style={{ marginBottom: 0 }}>
              <h3 className="dash-card-title">Học kỳ {semester}</h3>
              <span className="dash-badge dash-badge--gold">
                {semCredits} tín chỉ
              </span>
            </div>

            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Mã HP</th>
                    <th>Tên học phần</th>
                    <th>Tín chỉ</th>
                    <th>Loại</th>
                    <th>Trạng thái</th>
                    <th>Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((course) => {
                    const statusInfo = STATUS_META[course.status];
                    return (
                      <tr key={course.id}>
                        <td style={{ fontWeight: 700, color: "#8b1218" }}>
                          {course.code}
                        </td>
                        <td style={{ fontWeight: 600 }}>{course.name}</td>
                        <td>{course.credits}</td>
                        <td>
                          {course.category === "bat-buoc"
                            ? "Bắt buộc"
                            : "Tự chọn"}
                        </td>
                        <td>
                          <span className={`dash-badge ${statusInfo.badgeClass}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td>
                          {course.letterGrade
                            ? `${course.score10?.toFixed(1)} (${course.letterGrade})`
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
