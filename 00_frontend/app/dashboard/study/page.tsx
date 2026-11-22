"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  GraduationCap,
} from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { useInViewOnce } from "@/components/ui/useInViewOnce";
import {
  MOCK_CURRICULUM_RESPONSE,
  MOCK_LIBRARY_RESPONSE,
  MOCK_OVERVIEW_RESPONSE,
} from "@/lib/mock/dashboard";

/**
 * Trang Trung tâm Học tập (/dashboard/study) theo đặc tả A4:
 * - Page header gọn (Q1)
 * - 3 thẻ lớn: Tính GPA (xem trước 3.48 + đường sparkline vẽ dần),
 *   Chương trình học (vòng tròn 71% vẽ dần), Thư viện (biểu tượng file + số lượng tài liệu)
 * - Card "Môn đang học" 5 môn + thanh tiến độ.
 */
export default function DashboardStudyPage() {
  const { ref: topRef, inView } = useInViewOnce<HTMLDivElement>(0.15);
  const overview = MOCK_OVERVIEW_RESPONSE.data;
  const courses = MOCK_CURRICULUM_RESPONSE.data;
  const activeCourses = courses.filter((c) => c.status === "dang-hoc");
  const totalDocs = MOCK_LIBRARY_RESPONSE.data.length;

  const progressPercent = Math.round(
    (overview.completedCredits / overview.totalCredits) * 100,
  );

  return (
    <>
      <DashboardPageHeader
        breadcrumbs={[
          { label: "Tổng quan", href: "/dashboard" },
          { label: "Học tập" },
        ]}
        title="Học"
        titleHighlight="tập"
        description="Trung tâm quản lý điểm GPA, khung chương trình đào tạo, thư viện tài liệu và các môn đang học."
        actions={
          <Link href="/dashboard/gpa" className="dash-btn dash-btn--primary dash-btn--sm">
            Tính GPA ngay
            <ArrowRight size={14} />
          </Link>
        }
      />

      <main className="dash-main">
        <div className="dash-stack">
          {/* 3 thẻ lớn theo đặc tả A4 */}
          <div ref={topRef} className="dash-study-top-grid kma-stagger">
            {/* Thẻ 1: Tính GPA */}
            <section className="dash-card dash-card--hover" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="dash-card-head" style={{ marginBottom: 0 }}>
                <h2 className="dash-card-title">
                  <GraduationCap size={19} color="#7d5616" />
                  Tính GPA
                </h2>
                <span className="dash-badge dash-badge--jade">Giỏi</span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div className="dash-gpa-big">
                    <AnimatedNumber value={overview.gpaCurrent} decimals={2} />
                  </div>
                  <span style={{ fontSize: "0.82rem", color: "#5c5249" }}>
                    Thang điểm / {overview.gpaScale.toFixed(2)}
                  </span>
                </div>

                <svg width="110" height="46" viewBox="0 0 110 46" aria-hidden="true">
                  <path
                    d="M6 36 L30 30 L55 24 L80 16 L104 9"
                    fill="none"
                    stroke="#8b1218"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    className={`kma-svg-line ${inView ? "kma-svg-line--visible" : ""}`}
                  />
                  {[
                    [6, 36],
                    [30, 30],
                    [55, 24],
                    [80, 16],
                    [104, 9],
                  ].map(([cx, cy], idx) => (
                    <circle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r="3"
                      fill="#8b1218"
                      className={`kma-svg-dot ${inView ? "kma-svg-dot--visible" : ""}`}
                      style={{ animationDelay: `${260 + idx * 70}ms` }}
                    />
                  ))}
                </svg>
              </div>

              <p style={{ margin: 0, fontSize: "0.84rem", color: "#5c5249" }}>
                Quy đổi điểm hệ 10 sang hệ 4 tức thì và tính điểm cần đạt cho mục tiêu.
              </p>

              <Link
                href="/dashboard/gpa"
                className="dash-btn dash-btn--outline-crimson dash-btn--sm"
                style={{ marginTop: "auto", alignSelf: "flex-start" }}
              >
                Tính GPA chi tiết
                <ArrowRight size={14} />
              </Link>
            </section>

            {/* Thẻ 2: Chương trình học (vòng 71% vẽ dần) */}
            <section className="dash-card dash-card--hover" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="dash-card-head" style={{ marginBottom: 0 }}>
                <h2 className="dash-card-title">
                  <BookOpen size={19} color="#7d5616" />
                  Chương trình học
                </h2>
                <span className="dash-badge dash-badge--gold">
                  {overview.completedCredits}/{overview.totalCredits} TC
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div className="dash-donut-box" style={{ width: 92, height: 92, flex: "none" }}>
                  <svg viewBox="0 0 100 100" width="92" height="92" aria-hidden="true">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#efe5d5"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#8b1218"
                      strokeWidth="10"
                      strokeLinecap="round"
                      pathLength={100}
                      strokeDasharray="100"
                      strokeDashoffset={inView ? 100 - progressPercent : 100}
                      transform="rotate(-90 50 50)"
                      className="kma-svg-arc"
                    />
                  </svg>
                  <div className="dash-donut-center">
                    <strong style={{ fontSize: "1.15rem" }}>
                      <AnimatedNumber value={progressPercent} suffix="%" />
                    </strong>
                  </div>
                </div>

                <div style={{ fontSize: "0.84rem", color: "#5c5249", display: "flex", flexDirection: "column", gap: 4 }}>
                  <span>
                    Đã hoàn thành: <strong style={{ color: "#1e1916" }}>{overview.completedCredits} TC</strong>
                  </span>
                  <span>
                    Đang học: <strong style={{ color: "#1e1916" }}>15 TC</strong>
                  </span>
                  <span>
                    Còn lại: <strong style={{ color: "#1e1916" }}>{overview.totalCredits - overview.completedCredits - 15} TC</strong>
                  </span>
                </div>
              </div>

              <Link
                href="/dashboard/curriculum"
                className="dash-btn dash-btn--outline-crimson dash-btn--sm"
                style={{ marginTop: "auto", alignSelf: "flex-start" }}
              >
                Xem chương trình đào tạo
                <ArrowRight size={14} />
              </Link>
            </section>

            {/* Thẻ 3: Thư viện tài liệu */}
            <section className="dash-card dash-card--hover" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="dash-card-head" style={{ marginBottom: 0 }}>
                <h2 className="dash-card-title">
                  <FileText size={19} color="#7d5616" />
                  Thư viện tài liệu
                </h2>
                <span className="dash-badge dash-badge--crimson-soft">KMA</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span className="dash-stat-icon" style={{ width: 54, height: 54 }} aria-hidden="true">
                  <FileText size={26} strokeWidth={1.75} />
                </span>
                <div>
                  <div className="dash-stat-value">
                    <AnimatedNumber value={5428} locale suffix="+" />
                  </div>
                  <div className="dash-stat-label">
                    Tài liệu ôn tập ({totalDocs} tài liệu mẫu nổi bật)
                  </div>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: "0.84rem", color: "#5c5249" }}>
                Slide bài giảng, đề thi các kỳ và mẫu báo cáo thực hành theo từng học phần.
              </p>

              <Link
                href="/dashboard/library"
                className="dash-btn dash-btn--outline-crimson dash-btn--sm"
                style={{ marginTop: "auto", alignSelf: "flex-start" }}
              >
                Mở thư viện tài liệu
                <ArrowRight size={14} />
              </Link>
            </section>
          </div>

          {/* Card Môn đang học (5 môn + thanh tiến độ) */}
          <section className="dash-card">
            <div className="dash-card-head">
              <div>
                <h2 className="dash-card-title">
                  <CalendarDays size={19} color="#8b1218" />
                  Môn đang học ({activeCourses.length})
                </h2>
                <p style={{ margin: "2px 0 0", fontSize: "0.84rem", color: "#5c5249" }}>
                  Danh sách học phần trong {overview.currentSemester}
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
                    <th style={{ minWidth: 160 }}>Tiến độ</th>
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
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="dash-bar-track" style={{ height: 8 }}>
                            <div
                              className="dash-bar-fill"
                              style={{ width: `${course.progress ?? 50}%` }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              fontVariantNumeric: "tabular-nums lining-nums",
                              minWidth: 34,
                            }}
                          >
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
        </div>
      </main>
    </>
  );
}
