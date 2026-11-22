"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DashboardHero from "@/components/dashboard/DashboardHero";
import CurriculumProgress from "@/components/dashboard/CurriculumProgress";
import CurriculumSemesterList from "@/components/dashboard/CurriculumSemesterList";
import {
  MOCK_CURRICULUM_RESPONSE,
  MOCK_USER_RESPONSE,
  type CourseStatus,
} from "@/lib/mock/dashboard";

/**
 * Trang Chương trình học (/dashboard/curriculum).
 * Hiển thị tiến độ hoàn thành tín chỉ và danh sách môn theo kỳ kèm lọc trạng thái.
 */

type StatusFilter = "all" | CourseStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả môn" },
  { value: "da-hoc", label: "Đã học" },
  { value: "dang-hoc", label: "Đang học" },
  { value: "chua-hoc", label: "Chưa học" },
];

export default function DashboardCurriculumPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const allCourses = MOCK_CURRICULUM_RESPONSE.data;
  const user = MOCK_USER_RESPONSE.data;

  const filteredCourses =
    statusFilter === "all"
      ? allCourses
      : allCourses.filter((c) => c.status === statusFilter);

  return (
    <>
      <DashboardHero
        eyebrow="Học tập KMA"
        titlePrefix="Chương trình"
        titleHighlight="đào tạo"
        subtitle={`Ngành ${user.majorName} • ${user.cohort}. Theo dõi toàn bộ học phần bắt buộc, tự chọn và trạng thái hoàn thành theo từng kỳ.`}
      >
        <Link href="/dashboard/study" className="dash-btn dash-btn--sm">
          <ArrowLeft size={14} />
          Về góc Học tập
        </Link>
      </DashboardHero>

      <main className="dash-main">
        <div className="dash-stack">
          <CurriculumProgress courses={allCourses} />

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

          <CurriculumSemesterList courses={filteredCourses} />
        </div>
      </main>
    </>
  );
}
