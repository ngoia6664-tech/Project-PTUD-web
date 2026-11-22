"use client";

import { useState } from "react";
import { AlertTriangle, PlusSquare, Save } from "lucide-react";
import {
  KMA_SHIFT_ROWS,
  WEEK_DAYS,
  type ScheduleEvent,
  type ScheduleEventType,
  type WeekDay,
} from "@/lib/mock/dashboard";

/**
 * Form "Thêm sự kiện học tập cá nhân" đặt ở cột phải trang Lịch học theo Ảnh 3.
 * Hỗ trợ thêm mới và chỉnh sửa buổi học cá nhân, tùy chọn lặp hàng tuần và cảnh báo trùng giờ.
 */

interface ScheduleEventFormProps {
  initialEvent: ScheduleEvent | null;
  existingEvents: ScheduleEvent[];
  onSubmit: (event: ScheduleEvent) => void;
  onCancelEdit: () => void;
}

export default function ScheduleEventForm({
  initialEvent,
  existingEvents,
  onSubmit,
  onCancelEdit,
}: ScheduleEventFormProps) {
  const [courseName, setCourseName] = useState(initialEvent?.courseName ?? "");
  const [dayOfWeek, setDayOfWeek] = useState<WeekDay>(
    initialEvent?.dayOfWeek ?? 2,
  );
  const [shiftId, setShiftId] = useState<number>(() => {
    if (!initialEvent) return 4;
    return (
      KMA_SHIFT_ROWS.find((s) => s.startPeriod === initialEvent.startPeriod)
        ?.id ?? 4
    );
  });
  const [eventType, setEventType] = useState<ScheduleEventType>(
    initialEvent?.eventType ?? "self",
  );
  const [room, setRoom] = useState(initialEvent?.room ?? "Thư viện");
  const [lecturer, setLecturer] = useState(
    initialEvent?.lecturer ?? "Tự học cá nhân",
  );
  const [repeatWeekly, setRepeatWeekly] = useState(
    initialEvent?.repeatWeekly ?? true,
  );

  const selectedShift =
    KMA_SHIFT_ROWS.find((s) => s.id === shiftId) ?? KMA_SHIFT_ROWS[0];

  const overlapping = existingEvents.filter((ev) => {
    if (initialEvent && ev.id === initialEvent.id) return false;
    if (ev.dayOfWeek !== dayOfWeek) return false;
    return (
      selectedShift.startPeriod <= ev.endPeriod &&
      selectedShift.endPeriod >= ev.startPeriod
    );
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseName.trim()) return;

    const colorMap: Record<ScheduleEventType, string> = {
      class: "#8b1218",
      lab: "#2563eb",
      self: "#7c3aed",
      personal: "#b8893a",
    };

    onSubmit({
      id: initialEvent?.id ?? `sch_personal_${Date.now()}`,
      courseCode: initialEvent?.courseCode ?? (eventType === "self" ? "STU" : "EVT"),
      courseName: courseName.trim(),
      room: room.trim() || "Thư viện",
      lecturer: lecturer.trim() || "Tự học cá nhân",
      dayOfWeek,
      startPeriod: selectedShift.startPeriod,
      endPeriod: selectedShift.endPeriod,
      startTime: selectedShift.start,
      endTime: selectedShift.end,
      color: colorMap[eventType],
      eventType,
      source: "personal",
      repeatWeekly,
    });

    if (!initialEvent) {
      setCourseName("");
    }
  }

  return (
    <form className="dash-card" style={{ display: "flex", flexDirection: "column", gap: 12 }} onSubmit={handleSubmit}>
      <h3 className="dash-card-title" style={{ fontSize: "1.04rem" }}>
        <PlusSquare size={18} color="#8b1218" />
        {initialEvent
          ? "Chỉnh sửa sự kiện cá nhân"
          : "Thêm sự kiện học tập cá nhân"}
      </h3>

      {overlapping.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "9px 11px",
            borderRadius: 11,
            background: "#fdf0f0",
            border: "1px solid #d86e75",
            color: "#8b1218",
            fontSize: "0.79rem",
          }}
          role="alert"
        >
          <AlertTriangle size={16} style={{ flex: "none", marginTop: 1 }} />
          <span>
            Trùng giờ với <strong>{overlapping[0].courseName}</strong>. Bạn vẫn có thể lưu để xem cảnh báo xung đột.
          </span>
        </div>
      )}

      <label className="dash-field">
        <span className="dash-label">Tên sự kiện *</span>
        <input
          id="schedule-event-title"
          type="text"
          className="dash-input"
          required
          placeholder="Ví dụ: Ôn tập Mật mã học"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
      </label>

      <div className="dash-form-grid">
        <label className="dash-field">
          <span className="dash-label">Thứ (T2 – T6)</span>
          <select
            className="dash-select"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(Number(e.target.value) as WeekDay)}
          >
            {WEEK_DAYS.map((d) => (
              <option key={d.day} value={d.day}>
                {d.label} ({d.dateHint})
              </option>
            ))}
          </select>
        </label>

        <label className="dash-field">
          <span className="dash-label">Ca học / Giờ</span>
          <select
            className="dash-select"
            value={shiftId}
            onChange={(e) => setShiftId(Number(e.target.value))}
          >
            {KMA_SHIFT_ROWS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.timeRange}
              </option>
            ))}
          </select>
        </label>

        <label className="dash-field">
          <span className="dash-label">Loại sự kiện</span>
          <select
            className="dash-select"
            value={eventType}
            onChange={(e) => setEventType(e.target.value as ScheduleEventType)}
          >
            <option value="self">Tự học / Ôn tập</option>
            <option value="personal">Sự kiện cá nhân / CLB</option>
          </select>
        </label>

        <label className="dash-field">
          <span className="dash-label">Địa điểm</span>
          <input
            type="text"
            className="dash-input"
            placeholder="Thư viện / Online"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </label>
      </div>

      <label className="dash-field">
        <span className="dash-label">Giảng viên / Nhóm</span>
        <input
          type="text"
          className="dash-input"
          placeholder="Tự học cá nhân / Nhóm 04"
          value={lecturer}
          onChange={(e) => setLecturer(e.target.value)}
        />
      </label>

      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontSize: "0.84rem",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          className="dash-checkbox"
          checked={repeatWeekly}
          onChange={(e) => setRepeatWeekly(e.target.checked)}
        />
        <span>Lặp lại buổi này hàng tuần</span>
      </label>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 2 }}>
        {initialEvent && (
          <button
            type="button"
            className="dash-btn dash-btn--sm"
            onClick={onCancelEdit}
          >
            Hủy
          </button>
        )}
        <button type="submit" className="dash-btn dash-btn--primary dash-btn--sm">
          <Save size={14} />
          {initialEvent ? "Lưu thay đổi" : "Lưu sự kiện"}
        </button>
      </div>
    </form>
  );
}
