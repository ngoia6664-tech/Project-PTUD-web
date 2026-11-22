import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Gamepad2,
  GraduationCap,
  Layers,
  Target,
  TrendingUp,
} from "lucide-react";
import DashboardHero from "@/components/dashboard/DashboardHero";
import {
  MOCK_CURRICULUM_RESPONSE,
  MOCK_GPA_RECORDS_RESPONSE,
  MOCK_OVERVIEW_RESPONSE,
  convertScore10,
} from "@/lib/mock/dashboard";

/**
 * Trang Trung tâm Học tập (/dashboard/study) theo Ảnh 5:
 * Gộp nhanh 4 khối trực quan: Tính GPA, Chương trình học (vòng tròn % SVG thuần + tiến độ học kỳ),
 * Bảng môn đang học kèm thanh tiến độ, và Tiến độ học tập + Công cụ học tập hữu ích.
 */
export default function DashboardStudyPage() {
  const overview = MOCK_OVERVIEW_RESPONSE.data;
  const courses = MOCK_CURRICULUM_RESPONSE.data;
  const recentScores = MOCK_GPA_RECORDS_RESPONSE.data.slice(0, 3);
  const activeCourses = courses.filter((c) => c.status === "dang-hoc");

  const progressPercent = Math.round(
    (overview.completedCredits / overview.totalCredits) * 100,
  );
  const remainingCredits = overview.totalCredits - overview.completedCredits - 15;

  return (
    <>
      <DashboardHero
        eyebrow="Học viện Kỹ thuật Mật mã"
        titlePrefix="Học"
        titleHighlight="tập"
        subtitle="Theo dõi tiến độ học tập, tính GPA và quản lý chương trình đào tạo cùng các công cụ hỗ trợ sinh viên KMA."
      />

      <main className="dash-main">
        <div className="dash-stack">
          <div className="dash-study-grid">
            {/* Khối 1: Tính GPA */}
            <section className="dash-card">
              <div className="dash-card-head">
                <div>
                  <h2 className="dash-card-title">
                    <GraduationCap size={20} color="#7d5616" />
                    Tính GPA
                  </h2>
                  <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#6e6359" }}>
                    Tính điểm trung bình, theo dõi kết quả và mục tiêu GPA
                  </p>
                </div>

                <Link
                  href="/dashboard/gpa"
                  className="dash-btn dash-btn--outline-crimson dash-btn--sm"
                >
                  Tính GPA chi tiết
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="dash-gpa-highlight">
                <div className="dash-gpa-box">
                  <div style={{ fontSize: "0.8rem", color: "#6e6359" }}>
                    GPA hiện tại
                  </div>
                  <div className="dash-gpa-big">
                    {overview.gpaCurrent.toFixed(2)}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#63594f", marginBottom: 8 }}>
                    / {overview.gpaScale.toFixed(2)}
                  </div>
                  <span className="dash-badge dash-badge--jade">
                    <CheckCircle2 size={12} />
                    Xếp loại Giỏi
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: "0.84rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Target size={15} color="#8b1218" />
                      Mục tiêu: <strong>3.60</strong>
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Layers size={15} color="#7d5616" />
                      Kỳ này: <strong>15 tín chỉ</strong>
                    </span>
                  </div>

                  <div className="dash-table-wrap">
                    <table className="dash-table" style={{ fontSize: "0.8rem" }}>
                      <thead>
                        <tr>
                          <th>Môn học gần nhất</th>
                          <th>TC</th>
                          <th>Điểm (4)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentScores.map((item) => {
                          const rule = convertScore10(item.score10);
                          return (
                            <tr key={item.id}>
                              <td>{item.courseName}</td>
                              <td>{item.credits}</td>
                              <td>
                                <span className="dash-badge dash-badge--jade">
                                  {rule.score4.toFixed(1)} ({rule.letter})
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Khối 2: Chương trình học (Vòng tròn SVG thuần + thanh học kỳ) */}
            <section className="dash-card">
              <div className="dash-card-head">
                <div>
                  <h2 className="dash-card-title">
                    <BookOpen size={20} color="#7d5616" />
                    Chương trình học
                  </h2>
                  <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#6e6359" }}>
                    Theo dõi tiến độ hoàn thành khung chương trình đào tạo
                  </p>
                </div>

                <Link
                  href="/dashboard/curriculum"
                  className="dash-btn dash-btn--outline-crimson dash-btn--sm"
                >
                  Xem chi tiết
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="dash-donut-wrap">
                <div className="dash-donut-box">
                  <svg viewBox="0 0 120 120" width="132" height="132" aria-hidden="true">
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="#efe5d5"
                      strokeWidth="12"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#8c7862"
                      strokeWidth="1"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="42"
                      fill="none"
                      stroke="#8c7862"
                      strokeWidth="1"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="#8b1218"
                      strokeWidth="12"
                      strokeLinecap="round"
                      pathLength={100}
                      strokeDasharray={`${progressPercent} 100`}
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="dash-donut-center">
                    <strong>{progressPercent}%</strong>
                    <span style={{ fontSize: "0.75rem", color: "#6e6359" }}>
                      Hoàn thành
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "HK1 (2024 – 2025)", pct: 100 },
                    { label: "HK2 (2024 – 2025)", pct: 100 },
                    { label: "HK1 (2026 – 2027)", pct: 71 },
                  ].map((sem) => (
                    <div key={sem.label}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.8rem",
                          marginBottom: 4,
                        }}
                      >
                        <span>{sem.label}</span>
                        <strong>{sem.pct}%</strong>
                      </div>
                      <div className="dash-bar-track">
                        <div
                          className="dash-bar-fill"
                          style={{ width: `${sem.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Khối 3: Môn đang học */}
            <section className="dash-card">
              <div className="dash-card-head">
                <div>
                  <h2 className="dash-card-title">
                    <CalendarDays size={20} color="#8b1218" />
                    Môn đang học
                  </h2>
                  <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#6e6359" }}>
                    Danh sách các học phần trong học kỳ hiện tại
                  </p>
                </div>

                <Link
                  href="/dashboard/schedule"
                  className="dash-btn dash-btn--outline-crimson dash-btn--sm"
                >
                  Xem lịch học
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Mã môn</th>
                      <th>Tên môn học</th>
                      <th>TC</th>
                      <th>Hình thức</th>
                      <th style={{ minWidth: 120 }}>Tiến độ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCourses.map((course) => (
                      <tr key={course.id}>
                        <td style={{ fontWeight: 700, color: "#8b1218" }}>
                          {course.code}
                        </td>
                        <td style={{ fontWeight: 600 }}>{course.name}</td>
                        <td>{course.credits}</td>
                        <td>
                          <span className="dash-badge dash-badge--gold">
                            {course.format ?? "Lý thuyết"}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div className="dash-bar-track" style={{ height: 8 }}>
                              <div
                                className="dash-bar-fill"
                                style={{ width: `${course.progress ?? 50}%` }}
                              />
                            </div>
                            <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                              {course.progress ?? 50}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Khối 4: Tiến độ học tập & Công cụ học tập hữu ích */}
            <div className="dash-stack" style={{ gap: 16 }}>
              <section className="dash-card">
                <h2 className="dash-card-title" style={{ marginBottom: 12 }}>
                  <TrendingUp size={20} color="#7d5616" />
                  Tiến độ học tập
                </h2>

                <div className="dash-study-progress-grid">
                  <div className="dash-upcoming-item">
                    <GraduationCap size={20} color="#7d5616" />
                    <div>
                      <strong>{overview.completedCredits}</strong>
                      <div style={{ fontSize: "0.75rem", color: "#6e6359" }}>
                        Tín chỉ tích lũy
                      </div>
                    </div>
                  </div>
                  <div className="dash-upcoming-item">
                    <BookOpen size={20} color="#8b1218" />
                    <div>
                      <strong>15</strong>
                      <div style={{ fontSize: "0.75rem", color: "#6e6359" }}>
                        Tín chỉ đang học
                      </div>
                    </div>
                  </div>
                  <div className="dash-upcoming-item">
                    <Clock size={20} color="#7d5616" />
                    <div>
                      <strong>{Math.max(0, remainingCredits)}</strong>
                      <div style={{ fontSize: "0.75rem", color: "#6e6359" }}>
                        Tín chỉ còn lại
                      </div>
                    </div>
                  </div>
                  <div className="dash-upcoming-item">
                    <Target size={20} color="#156843" />
                    <div>
                      <strong>{progressPercent}%</strong>
                      <div style={{ fontSize: "0.75rem", color: "#6e6359" }}>
                        Tiến độ chương trình
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="dash-card">
                <h2 className="dash-card-title" style={{ marginBottom: 12 }}>
                  Công cụ học tập hữu ích
                </h2>

                <div className="dash-chip-group">
                  <Link href="/dashboard/schedule" className="dash-btn dash-btn--sm">
                    <CalendarDays size={15} color="#8b1218" />
                    Lịch học thông minh
                  </Link>
                  <Link href="/dashboard/gpa" className="dash-btn dash-btn--sm">
                    <BarChart3 size={15} color="#8b1218" />
                    Tính GPA & Mục tiêu
                  </Link>
                  <Link href="/dashboard/curriculum" className="dash-btn dash-btn--sm">
                    <BookOpen size={15} color="#8b1218" />
                    Khung chương trình
                  </Link>
                  <Link href="/dashboard/library" className="dash-btn dash-btn--sm">
                    <FileText size={15} color="#8b1218" />
                    Thư viện tài liệu
                  </Link>
                  <Link href="/battleground" className="dash-btn dash-btn--sm">
                    <Gamepad2 size={15} color="#8b1218" />
                    KMA Battle Royale
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
