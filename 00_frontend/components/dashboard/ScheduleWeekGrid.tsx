"use client";

import {
  Clock,
  Lock,
  MapPin,
  Pencil,
  Repeat,
  Trash2,
} from "lucide-react";
import {
  KMA_SHIFT_ROWS,
  WEEK_DAYS,
  type ScheduleEvent,
} from "@/lib/mock/dashboard";

/**
 * Lưới Thời khóa biểu tuần Thứ Hai – Thứ Sáu × 5 ca học KMA theo Ảnh 3.
 * Phân biệt rõ 4 nhóm màu (Học trên lớp / Thực hành / Tự học / Sự kiện cá nhân)
 * và phân quyền: lịch lớp chỉ xem, lịch tự thêm cho phép sửa/xóa.
 * Trên điện thoại tự chuyển thành danh sách theo từng ngày.
 */

interface ScheduleWeekGridProps {
  events: ScheduleEvent[];
  conflictIds: Set<string>;
  onEdit: (event: ScheduleEvent) => void;
  onDelete: (id: string) => void;
}

export default function ScheduleWeekGrid({
  events,
  conflictIds,
  onEdit,
  onDelete,
}: ScheduleWeekGridProps) {
  return (
    <>
      {/* Bảng lưới tuần cho màn hình máy tính & tablet */}
      <div className="dash-timetable-wrap">
        <table className="dash-timetable">
          <thead>
            <tr>
              <th>Thời gian</th>
              {WEEK_DAYS.map((day) => (
                <th key={day.day}>
                  {day.label}
                  <small>{day.dateHint}</small>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {KMA_SHIFT_ROWS.map((shift) => (
              <tr key={shift.id}>
                <td className="dash-time-col">
                  <div>{shift.timeRange}</div>
                  <div style={{ fontSize: "0.75rem", color: "#63594f", fontWeight: 500 }}>
                    {shift.label}
                  </div>
                </td>

                {WEEK_DAYS.map((day) => {
                  const cellEvents = events.filter(
                    (ev) =>
                      ev.dayOfWeek === day.day &&
                      ev.startPeriod <= shift.endPeriod &&
                      ev.endPeriod >= shift.startPeriod,
                  );

                  return (
                    <td key={`${shift.id}-${day.day}`}>
                      {cellEvents.length === 0 ? (
                        <div className="dash-empty-dash" aria-hidden="true">—</div>
                      ) : (
                        cellEvents.map((ev) => {
                          const isConflict = conflictIds.has(ev.id);
                          return (
                            <div
                              key={ev.id}
                              className={`dash-slot-card dash-slot-card--${ev.eventType} ${
                                isConflict ? "dash-slot-card--conflict" : ""
                              }`}
                            >
                              <div className="dash-slot-code">
                                <span>{ev.courseCode}</span>
                                <span className="dash-slot-actions">
                                  {ev.source === "class" ? (
                                    <span title="Lịch chung của lớp (chỉ xem)">
                                      <Lock size={11} />
                                    </span>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        className="dash-mini-icon-btn"
                                        onClick={() => onEdit(ev)}
                                        aria-label={`Sửa ${ev.courseName}`}
                                        title="Sửa"
                                      >
                                        <Pencil size={11} />
                                      </button>
                                      <button
                                        type="button"
                                        className="dash-mini-icon-btn"
                                        onClick={() => onDelete(ev.id)}
                                        aria-label={`Xóa ${ev.courseName}`}
                                        title="Xóa"
                                      >
                                        <Trash2 size={11} />
                                      </button>
                                    </>
                                  )}
                                </span>
                              </div>

                              <strong style={{ lineHeight: 1.25 }}>
                                {ev.courseName}
                              </strong>

                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <MapPin size={11} />
                                {ev.room}
                              </span>

                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <Clock size={11} />
                                {ev.startTime} – {ev.endTime}
                                {ev.repeatWeekly && <Repeat size={10} />}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Danh sách theo ngày khi mở trên điện thoại */}
      <div className="dash-week-mobile-list" aria-label="Lịch tuần dạng danh sách">
        {WEEK_DAYS.map((day) => {
          const dayEvents = events
            .filter((ev) => ev.dayOfWeek === day.day)
            .sort((a, b) => a.startPeriod - b.startPeriod);

          return (
            <div key={day.day} className="dash-card" style={{ padding: 14 }}>
              <div className="dash-card-head" style={{ marginBottom: 10 }}>
                <strong style={{ fontSize: "0.95rem" }}>
                  {day.label} ({day.dateHint})
                </strong>
                <span className="dash-badge">{dayEvents.length} buổi</span>
              </div>

              {dayEvents.length === 0 ? (
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#63594f" }}>
                  Không có buổi học.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className={`dash-slot-card dash-slot-card--${ev.eventType} ${
                        conflictIds.has(ev.id) ? "dash-slot-card--conflict" : ""
                      }`}
                    >
                      <div className="dash-slot-code">
                        <span>
                          {ev.courseCode} — {ev.courseName}
                        </span>
                        {ev.source === "personal" && (
                          <span className="dash-slot-actions">
                            <button
                              type="button"
                              className="dash-mini-icon-btn"
                              onClick={() => onEdit(ev)}
                              aria-label={`Sửa ${ev.courseName}`}
                            >
                              <Pencil size={11} />
                            </button>
                            <button
                              type="button"
                              className="dash-mini-icon-btn"
                              onClick={() => onDelete(ev.id)}
                              aria-label={`Xóa ${ev.courseName}`}
                            >
                              <Trash2 size={11} />
                            </button>
                          </span>
                        )}
                      </div>
                      <span>
                        {ev.startTime} – {ev.endTime} • {ev.room} • {ev.lecturer}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
