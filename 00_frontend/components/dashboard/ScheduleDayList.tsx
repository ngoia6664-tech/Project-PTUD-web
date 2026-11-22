"use client";

import { Clock, Lock, MapPin, Pencil, Repeat, Trash2, User } from "lucide-react";
import { WEEK_DAYS, type ScheduleEvent, type WeekDay } from "@/lib/mock/dashboard";

/**
 * Chế độ xem Lịch học theo từng Ngày (Thứ Hai – Thứ Sáu).
 */

interface ScheduleDayListProps {
  selectedDay: WeekDay;
  onSelectDay: (day: WeekDay) => void;
  events: ScheduleEvent[];
  conflictIds: Set<string>;
  onEdit: (event: ScheduleEvent) => void;
  onDelete: (id: string) => void;
}

export default function ScheduleDayList({
  selectedDay,
  onSelectDay,
  events,
  conflictIds,
  onEdit,
  onDelete,
}: ScheduleDayListProps) {
  const dayEvents = events
    .filter((ev) => ev.dayOfWeek === selectedDay)
    .sort((a, b) => a.startPeriod - b.startPeriod);

  const activeDay = WEEK_DAYS.find((d) => d.day === selectedDay) ?? WEEK_DAYS[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="dash-chip-group" role="tablist" aria-label="Chọn thứ trong tuần">
        {WEEK_DAYS.map((item) => (
          <button
            key={item.day}
            type="button"
            role="tab"
            aria-selected={selectedDay === item.day}
            className={`dash-chip ${selectedDay === item.day ? "dash-chip--active" : ""}`}
            onClick={() => onSelectDay(item.day)}
          >
            {item.label} ({item.dateHint})
          </button>
        ))}
      </div>

      {dayEvents.length === 0 ? (
        <div className="dash-state-box">
          <strong style={{ color: "#1e1916" }}>
            {activeDay.label} chưa có buổi học nào
          </strong>
          <p style={{ margin: 0 }}>
            Bạn có thể thêm buổi tự học hoặc sự kiện cá nhân ở khung bên phải.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {dayEvents.map((ev) => {
            const isConflict = conflictIds.has(ev.id);
            return (
              <article
                key={ev.id}
                className={`dash-slot-card dash-slot-card--${ev.eventType} ${
                  isConflict ? "dash-slot-card--conflict" : ""
                }`}
                style={{ padding: 14, gap: 6 }}
              >
                <div className="dash-slot-code" style={{ fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span className="dash-badge dash-badge--crimson-soft">
                      {ev.courseCode}
                    </span>
                    <span className="dash-badge">
                      {ev.source === "class" ? (
                        <>
                          <Lock size={11} />
                          Lịch lớp (chỉ xem)
                        </>
                      ) : (
                        "Lịch tự thêm"
                      )}
                    </span>
                    {ev.repeatWeekly && (
                      <span className="dash-badge dash-badge--jade">
                        <Repeat size={11} />
                        Lặp hàng tuần
                      </span>
                    )}
                    {isConflict && (
                      <span className="dash-badge dash-badge--crimson">Trùng giờ</span>
                    )}
                  </div>

                  {ev.source === "personal" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        className="dash-btn dash-btn--sm"
                        onClick={() => onEdit(ev)}
                      >
                        <Pencil size={13} />
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="dash-btn dash-btn--sm dash-btn--danger"
                        onClick={() => onDelete(ev.id)}
                      >
                        <Trash2 size={13} />
                        Xóa
                      </button>
                    </div>
                  )}
                </div>

                <strong style={{ fontSize: "1rem" }}>{ev.courseName}</strong>

                <div className="dash-next-meta" style={{ color: "inherit" }}>
                  <span>
                    <Clock size={14} />
                    Tiết {ev.startPeriod}–{ev.endPeriod} ({ev.startTime} – {ev.endTime})
                  </span>
                  <span>
                    <MapPin size={14} />
                    {ev.room}
                  </span>
                  <span>
                    <User size={14} />
                    {ev.lecturer}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
