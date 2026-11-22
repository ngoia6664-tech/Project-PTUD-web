"use client";

import { useState } from "react";
import AdminCourseManager from "@/components/admin/AdminCourseManager";
import {
  MOCK_ADMIN_COURSES_RESPONSE,
  type AdminCourseItem,
} from "@/lib/mock/admin";

/**
 * Trang Quản lý Môn học và Chương trình đào tạo (/admin/courses).
 */
export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourseItem[]>(
    MOCK_ADMIN_COURSES_RESPONSE.data,
  );
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

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div>
          <h2 className="admin-page-title">
            Môn học & <span>Chương trình</span>
          </h2>
          <p className="admin-page-desc">
            Thêm mới, cập nhật mã môn, số tín chỉ và kỳ học cho khung chương trình các ngành KMA.
          </p>
        </div>
      </div>

      {toast && (
        <div className="admin-toast" role="status">
          {toast}
        </div>
      )}

      <AdminCourseManager
        courses={courses}
        onSaveCourse={handleSaveCourse}
        onDeleteCourse={handleDeleteCourse}
      />
    </div>
  );
}
