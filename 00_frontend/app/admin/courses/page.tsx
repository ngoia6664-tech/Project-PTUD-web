"use client";

import { useState } from "react";
import AdminCourseManager from "@/components/admin/AdminCourseManager";
import {
  DataSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/DataStates";
import { useDemoState } from "@/components/ui/useDemoState";
import {
  MOCK_ADMIN_COURSES_RESPONSE,
  type AdminCourseItem,
} from "@/lib/mock/admin";

/**
 * Trang Quản lý Môn học và Chương trình đào tạo (/admin/courses).
 * Hỗ trợ lọc theo ngành/kỳ và trạng thái dữ liệu qua ?demo=loading|empty|error.
 */
export default function AdminCoursesPage() {
  const { demoMode, retryDemo } = useDemoState();
  const [courses, setCourses] = useState<AdminCourseItem[]>(
    MOCK_ADMIN_COURSES_RESPONSE.data,
  );
  const [majorFilter, setMajorFilter] = useState<"all" | AdminCourseItem["major"]>("all");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  }

  function handleSaveCourse(course: AdminCourseItem) {
    setCourses((prev) => {
      const exists = prev.some((c) => c.id === course.id);
      if (exists) {
        showToast(`Đã cập nhật học phần ${course.code}.`);
        return prev.map((c) => (c.id === course.id ? course : c));
      }
      showToast(`Đã thêm học phần ${course.code} — ${course.name}.`);
      return [...prev, course];
    });
  }

  function handleDeleteCourse(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    showToast("Đã xóa học phần khỏi danh sách mẫu.");
  }

  const visibleCourses =
    majorFilter === "all"
      ? courses
      : courses.filter((c) => c.major === majorFilter);

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div>
          <h2 className="admin-page-title">
            Môn học &amp; <span>Chương trình</span>
          </h2>
          <p className="admin-page-desc">
            Thêm mới, cập nhật mã môn, số tín chỉ và kỳ học cho khung chương trình các ngành KMA.
          </p>
        </div>

        <div className="admin-chip-group" role="tablist" aria-label="Lọc theo ngành">
          {(["all", "ATTT", "CNTT", "DTVT"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={majorFilter === m}
              className={`admin-chip ${majorFilter === m ? "admin-chip--active" : ""}`}
              onClick={() => setMajorFilter(m)}
            >
              {m === "all" ? "Tất cả ngành" : m}
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div className="admin-toast" role="status">
          {toast}
        </div>
      )}

      {demoMode === "loading" ? (
        <DataSkeleton variant="table" count={5} />
      ) : demoMode === "error" ? (
        <ErrorState
          title="Không thể tải danh mục môn học"
          message="Đã có lỗi khi tải chương trình đào tạo. Vui lòng thử lại."
          onRetry={retryDemo}
        />
      ) : demoMode === "empty" ? (
        <EmptyState
          title="Chưa có học phần nào"
          description="Khôi phục danh mục môn học mẫu hoặc thêm học phần mới."
          actionLabel="Tải lại danh mục"
          onAction={retryDemo}
        />
      ) : (
        <AdminCourseManager
          courses={visibleCourses}
          onSaveCourse={handleSaveCourse}
          onDeleteCourse={handleDeleteCourse}
        />
      )}
    </div>
  );
}
