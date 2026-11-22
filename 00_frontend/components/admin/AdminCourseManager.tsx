"use client";

import { useState } from "react";
import { BookOpen, Pencil, Save, Trash2, X } from "lucide-react";
import type { AdminCourseItem } from "@/lib/mock/admin";

/**
 * Component quản lý Môn học & Chương trình đào tạo (/admin/courses):
 * Bảng danh sách môn học kết hợp form thêm/sửa môn (tên, mã, tín chỉ, kỳ, ngành).
 */

interface AdminCourseManagerProps {
  courses: AdminCourseItem[];
  onSaveCourse: (course: AdminCourseItem) => void;
  onDeleteCourse: (id: string) => void;
}

export default function AdminCourseManager({
  courses,
  onSaveCourse,
  onDeleteCourse,
}: AdminCourseManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState(4);
  const [major, setMajor] = useState<AdminCourseItem["major"]>("ATTT");
  const [category, setCategory] =
    useState<AdminCourseItem["category"]>("bat-buoc");

  function startEdit(course: AdminCourseItem) {
    setEditingId(course.id);
    setCode(course.code);
    setName(course.name);
    setCredits(course.credits);
    setSemester(course.semester);
    setMajor(course.major);
    setCategory(course.category);
  }

  function resetForm() {
    setEditingId(null);
    setCode("");
    setName("");
    setCredits(3);
    setSemester(4);
    setMajor("ATTT");
    setCategory("bat-buoc");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    onSaveCourse({
      id: editingId ?? `ac_${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      credits: Math.max(1, Number(credits) || 1),
      semester: Math.max(1, Number(semester) || 1),
      major,
      category,
    });
    resetForm();
  }

  return (
    <div className="admin-two-col">
      {/* Bảng danh sách môn học */}
      <section className="admin-card">
        <div className="admin-card-head">
          <h3 className="admin-card-title">
            <BookOpen size={18} color="#8b1218" />
            Danh sách học phần trong chương trình
          </h3>
          <span className="admin-badge admin-badge--gold admin-num">
            {courses.length} môn học
          </span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã môn</th>
                <th>Tên học phần</th>
                <th>Tín chỉ</th>
                <th>Kỳ</th>
                <th>Ngành</th>
                <th style={{ width: 136 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td className="admin-num" style={{ fontWeight: 700, color: "#8b1218" }}>
                    {course.code}
                  </td>
                  <td>
                    <strong style={{ display: "block" }}>{course.name}</strong>
                    <span style={{ fontSize: "0.75rem", color: "#5c5249" }}>
                      {course.category === "bat-buoc" ? "Bắt buộc" : "Tự chọn"}
                    </span>
                  </td>
                  <td className="admin-num">{course.credits}</td>
                  <td className="admin-num">Kỳ {course.semester}</td>
                  <td>
                    <span className="admin-badge admin-badge--blue">
                      {course.major}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn--sm"
                        onClick={() => startEdit(course)}
                      >
                        <Pencil size={13} />
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger admin-btn--sm"
                        onClick={() => onDeleteCourse(course.id)}
                      >
                        <Trash2 size={13} />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Form thêm / sửa môn học */}
      <form
        className="admin-card admin-stack"
        style={{ gap: 14 }}
        onSubmit={handleSubmit}
      >
        <div className="admin-card-head" style={{ marginBottom: 0 }}>
          <h3 className="admin-card-title">
            {editingId ? "Chỉnh sửa học phần" : "Thêm học phần mới"}
          </h3>
          {editingId && (
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={resetForm}
            >
              <X size={14} />
              Hủy
            </button>
          )}
        </div>

        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-label">Mã môn *</span>
            <input
              type="text"
              className="admin-input"
              required
              placeholder="VD: AT501"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>

          <label className="admin-field">
            <span className="admin-label">Số tín chỉ *</span>
            <input
              type="number"
              min={1}
              max={12}
              className="admin-input admin-num"
              required
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
            />
          </label>

          <label className="admin-field admin-form-full">
            <span className="admin-label">Tên môn học *</span>
            <input
              type="text"
              className="admin-input"
              required
              placeholder="VD: Điều tra số (Digital Forensics)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="admin-field">
            <span className="admin-label">Học kỳ dự kiến *</span>
            <select
              className="admin-select"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sem) => (
                <option key={sem} value={sem}>
                  Học kỳ {sem}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span className="admin-label">Ngành đào tạo</span>
            <select
              className="admin-select"
              value={major}
              onChange={(e) =>
                setMajor(e.target.value as AdminCourseItem["major"])
              }
            >
              <option value="ATTT">An toàn thông tin (ATTT)</option>
              <option value="CNTT">Công nghệ thông tin (CNTT)</option>
              <option value="DTVT">Điện tử – Viễn thông (ĐTVT)</option>
            </select>
          </label>

          <label className="admin-field admin-form-full">
            <span className="admin-label">Phân loại học phần</span>
            <select
              className="admin-select"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as AdminCourseItem["category"])
              }
            >
              <option value="bat-buoc">Bắt buộc</option>
              <option value="tu-chon">Tự chọn</option>
            </select>
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="admin-btn admin-btn--primary">
            <Save size={15} />
            {editingId ? "Lưu thay đổi" : "Thêm môn vào chương trình"}
          </button>
        </div>
      </form>
    </div>
  );
}
