"use client";

import { useState } from "react";
import { FileSpreadsheet, Save, X } from "lucide-react";
import { KMA_SHIFT_ROWS, WEEK_DAYS, type WeekDay } from "@/lib/mock/dashboard";
import type { AdminScheduleEvent } from "@/lib/mock/admin";

/**
 * Form thêm/sửa một buổi học chung theo lớp và nút nhập từ file CSV (chỉ giao diện).
 */

interface AdminScheduleFormProps {
  selectedClass: string;
  initialEvent: AdminScheduleEvent | null;
  onSave: (event: AdminScheduleEvent) => void;
  onCancelEdit: () => void;
  onCsvSelected: (fileName: string) => void;
}

export default function AdminScheduleForm({
  selectedClass,
  initialEvent,
  onSave,
  onCancelEdit,
  onCsvSelected,
}: AdminScheduleFormProps) {
  const [courseCode, setCourseCode] = useState(initialEvent?.courseCode ?? "");
  const [courseName, setCourseName] = useState(initialEvent?.courseName ?? "");
  const [dayOfWeek, setDayOfWeek] = useState<WeekDay>(
    initialEvent?.dayOfWeek ?? 2,
  );
  const [shiftId, setShiftId] = useState<number>(() => {
    if (!initialEvent) return 1;
    return (
      KMA_SHIFT_ROWS.find((s) => s.startPeriod === initialEvent.startPeriod)
        ?.id ?? 1
    );
  });
  const [room, setRoom] = useState(initialEvent?.room ?? "");
  const [lecturer, setLecturer] = useState(initialEvent?.lecturer ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim()) return;

    const shift =
      KMA_SHIFT_ROWS.find((s) => s.id === shiftId) ?? KMA_SHIFT_ROWS[0];

    onSave({
      id: initialEvent?.id ?? `asch_${Date.now()}`,
      classCode: initialEvent?.classCode ?? selectedClass,
      courseCode: courseCode.trim().toUpperCase(),
      courseName: courseName.trim(),
      dayOfWeek,
      startPeriod: shift.startPeriod,
      endPeriod: shift.endPeriod,
      startTime: shift.start,
      endTime: shift.end,
      room: room.trim() || "TA1-101",
      lecturer: lecturer.trim() || "Đang phân công",
    });

    if (!initialEvent) {
      setCourseCode("");
      setCourseName("");
      setRoom("");
      setLecturer("");
    }
  }

  return (
    <section className="admin-card admin-stack" style={{ gap: 14 }}>
      <div className="admin-card-head" style={{ marginBottom: 0 }}>
        <h3 className="admin-card-title">
          {initialEvent
            ? `Sửa buổi học (${initialEvent.classCode})`
            : `Thêm buổi học cho lớp ${selectedClass}`}
        </h3>

        {/* Nút nhập từ file CSV (chỉ giao diện mẫu) */}
        <label className="admin-btn admin-btn--sm" style={{ cursor: "pointer" }}>
          <FileSpreadsheet size={14} />
          Nhập từ CSV
          <input
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onCsvSelected(file.name);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <form onSubmit={handleSubmit} className="admin-stack" style={{ gap: 12 }}>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-label">Mã học phần *</span>
            <input
              type="text"
              className="admin-input"
              required
              placeholder="VD: AT1804"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
          </label>

          <label className="admin-field">
            <span className="admin-label">Tên học phần *</span>
            <input
              type="text"
              className="admin-input"
              required
              placeholder="VD: Mật mã học ứng dụng"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </label>

          <label className="admin-field">
            <span className="admin-label">Thứ (Thứ 2 – Thứ 6)</span>
            <select
              className="admin-select"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value) as WeekDay)}
            >
              {WEEK_DAYS.map((d) => (
                <option key={d.day} value={d.day}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span className="admin-label">Ca học / Giờ</span>
            <select
              className="admin-select"
              value={shiftId}
              onChange={(e) => setShiftId(Number(e.target.value))}
            >
              {KMA_SHIFT_ROWS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({s.timeRange})
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span className="admin-label">Phòng học</span>
            <input
              type="text"
              className="admin-input"
              placeholder="VD: TA2-304"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </label>

          <label className="admin-field">
            <span className="admin-label">Giảng viên</span>
            <input
              type="text"
              className="admin-input"
              placeholder="VD: TS. Trần Quang Hải"
              value={lecturer}
              onChange={(e) => setLecturer(e.target.value)}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          {initialEvent && (
            <button
              type="button"
              className="admin-btn admin-btn--sm"
              onClick={onCancelEdit}
            >
              <X size={14} />
              Hủy sửa
            </button>
          )}
          <button
            type="submit"
            className="admin-btn admin-btn--primary admin-btn--sm"
          >
            <Save size={14} />
            {initialEvent ? "Cập nhật buổi học" : "Thêm buổi học"}
          </button>
        </div>
      </form>
    </section>
  );
}
