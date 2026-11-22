"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import CurriculumProgress from "@/components/dashboard/CurriculumProgress";
import CurriculumSemesterList from "@/components/dashboard/CurriculumSemesterList";
import {
  DataSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/DataStates";
import { useDemoState } from "@/components/ui/useDemoState";
import {
  MOCK_CURRICULUM_RESPONSE,
  MOCK_USER_RESPONSE,
  type CourseStatus,
} from "@/lib/mock/dashboard";

/**
 * Trang Chương trình học (/dashboard/curriculum) theo đặc tả A6:
 * - Page header gọn (Q1) + ô tìm kiếm môn học
 * - Thanh tiến độ tổng (Đã học / Đang học / Chưa học theo tín chỉ)
 * - Tab chọn học kỳ + chip lọc trạng thái + hỗ trợ ?demo=loading|empty|error.
 */

type StatusFilter = "all" | CourseStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "da-hoc", label: "Đã học" },
  { value: "dang-hoc", label: "Đang học" },
  { value: "chua-hoc", label: "Chưa học" },
];

export default function DashboardCurriculumPage() {
  const { demoMode, retryDemo } = useDemoState();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [semesterFilter, setSemesterFilter] = useState<number | "all">("all");
  const [query, setQuery] = useState("");

  const allCourses = MOCK_CURRICULUM_RESPONSE.data;
  const user = MOCK_USER_RESPONSE.data;
  const semesters = Array.from(new Set(allCourses.map((c) => c.semester))).sort(
    (a, b) => a - b,
  );

  const keyword = query.trim().toLowerCase();
  const filteredCourses = allCourses.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (semesterFilter !== "all" && c.semester !== semesterFilter) return false;
    if (!keyword) return true;
    return (
      c.code.toLowerCase().includes(keyword) ||
      c.name.toLowerCase().includes(keyword)
    );
  });

  function resetAll() {
    setStatusFilter("all");
    setSemesterFilter("all");
    setQuery("");
    retryDemo();
  }

  return (
    <>
      <DashboardPageHeader
        breadcrumbs={[
          { label: "Tổng quan", href: "/dashboard" },
          { label: "Học tập", href: "/dashboard/study" },
          { label: "Chương trình học" },
        ]}
        title="Chương trình"
        titleHighlight="đào tạo"
        description={`Ngành ${user.majorName} • ${user.cohort} — Tra cứu học phần bắt buộc, tự chọn và tiến độ tín chỉ theo kỳ.`}
        actions={
          <div className="dash-hero-search" style={{ minWidth: 260 }}>
            <Search size={16} color="#5c5249" />
            <input
              type="search"
              placeholder="Tìm mã môn hoặc tên học phần..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Tìm kiếm môn học"
            />
          </div>
        }
      />

      <main className="dash-main">
        <div className="dash-stack">
          {demoMode === "loading" ? (
            <DataSkeleton variant="table" count={5} />
          ) : demoMode === "error" ? (
            <ErrorState
              title="Không thể tải chương trình đào tạo"
              message="Chưa thể đồng bộ khung chương trình của ngành. Vui lòng thử lại."
              onRetry={retryDemo}
            />
          ) : demoMode === "empty" ? (
            <EmptyState
              title="Chưa có dữ liệu chương trình học"
              description="Không có học phần nào được tìm thấy cho khóa đào tạo hiện tại."
              actionLabel="Tải lại khung chuẩn"
              onAction={resetAll}
            />
          ) : (
            <>
              <CurriculumProgress courses={allCourses} />

              {/* Tab chọn học kỳ + chip lọc trạng thái */}
              <div className="dash-stack" style={{ gap: 10 }}>
                <div
                  className="dash-chip-group"
                  role="tablist"
                  aria-label="Lọc theo học kỳ"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={semesterFilter === "all"}
                    className={`dash-chip ${
                      semesterFilter === "all" ? "dash-chip--active" : ""
                    }`}
                    onClick={() => setSemesterFilter("all")}
                  >
                    Tất cả kỳ
                  </button>
                  {semesters.map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      role="tab"
                      aria-selected={semesterFilter === sem}
                      className={`dash-chip ${
                        semesterFilter === sem ? "dash-chip--active" : ""
                      }`}
                      onClick={() => setSemesterFilter(sem)}
                    >
                      Học kỳ {sem}
                    </button>
                  ))}
                </div>

                <div
                  className="dash-chip-group"
                  role="tablist"
                  aria-label="Lọc môn theo trạng thái"
                >
                  {FILTERS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      role="tab"
                      aria-selected={statusFilter === f.value}
                      className={`dash-chip ${
                        statusFilter === f.value ? "dash-chip--active" : ""
                      }`}
                      onClick={() => setStatusFilter(f.value)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredCourses.length === 0 ? (
                <EmptyState
                  title="Không tìm thấy học phần phù hợp"
                  description="Thử xóa từ khóa tìm kiếm hoặc chọn lại kỳ học và trạng thái khác."
                  actionLabel="Đặt lại bộ lọc"
                  onAction={resetAll}
                />
              ) : (
                <CurriculumSemesterList courses={filteredCourses} />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
