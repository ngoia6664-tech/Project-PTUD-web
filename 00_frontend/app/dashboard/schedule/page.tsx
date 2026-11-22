"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  List,
  MapPin,
  Plus,
} from "lucide-react";
import DashboardHero from "@/components/dashboard/DashboardHero";
import ScheduleWeekGrid from "@/components/dashboard/ScheduleWeekGrid";
import ScheduleDayList from "@/components/dashboard/ScheduleDayList";
import ScheduleEventForm from "@/components/dashboard/ScheduleEventForm";
import {
  MOCK_SCHEDULE_RESPONSE,
  WEEK_DAYS,
  type ScheduleEvent,
  type WeekDay,
} from "@/lib/mock/dashboard";

/**
 * Trang Lịch học (/dashboard/schedule) theo Ảnh 3:
 * Hero -> thanh chọn học kỳ, chế độ Tuần / Ngày, chuyển tuần ->
 * Cột trái: Thời khóa biểu Thứ Hai – Thứ Sáu với 4 nhóm màu.
 * Cột phải: Lịch sắp tới + Form thêm/sửa sự kiện cá nhân + Cảnh báo xung đột lịch học.
 */

function findConflicts(events: ScheduleEvent[]): {
  conflictIds: Set<string>;
  messages: string[];
} {
  const conflictIds = new Set<string>();
  const messages: string[] = [];

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i];
      const b = events[j];
      if (a.dayOfWeek !== b.dayOfWeek) continue;
      if (a.startPeriod <= b.endPeriod && a.endPeriod >= b.startPeriod) {
        conflictIds.add(a.id);
        conflictIds.add(b.id);
        const dayName =
          WEEK_DAYS.find((d) => d.day === a.dayOfWeek)?.label ?? "";
        messages.push(
          `${dayName}: "${a.courseName}" (${a.startTime}–${a.endTime}) trùng giờ với "${b.courseName}".`,
        );
      }
    }
  }
  return { conflictIds, messages };
}

export default function DashboardSchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>(
    MOCK_SCHEDULE_RESPONSE.data,
  );
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState<WeekDay>(2);
  const [weekNumber, setWeekNumber] = useState(12);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);

  const { conflictIds, messages } = findConflicts(events);

  function handleSaveEvent(saved: ScheduleEvent) {
    setEvents((prev) => {
      const exists = prev.some((item) => item.id === saved.id);
      if (exists) {
        return prev.map((item) => (item.id === saved.id ? saved : item));
      }
      return [...prev, saved];
    });
    setEditingEvent(null);
  }

  function handleEdit(ev: ScheduleEvent) {
    if (ev.source !== "personal") return;
    setEditingEvent(ev);
  }

  function handleDelete(id: string) {
    setEvents((prev) => prev.filter((item) => item.id !== id));
    if (editingEvent?.id === id) setEditingEvent(null);
  }

  const upcomingEvents = [...events]
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startPeriod - b.startPeriod)
    .slice(0, 3);

  return (
    <>
      <DashboardHero
        eyebrow="Học viện Kỹ thuật Mật mã"
        titlePrefix="Lịch"
        titleHighlight="học"
        subtitle="Quản lý thời khóa biểu Thứ Hai – Thứ Sáu, phân biệt lịch chung của lớp (chỉ xem) với sự kiện cá nhân tự thêm."
      />

      <main className="dash-main">
        <div className="dash-stack">
          {/* Thanh điều khiển Học kỳ + Tuần/Ngày + Tuần trước/sau */}
          <div className="dash-schedule-controls">
            <div className="dash-chip-group">
              <select
                className="dash-select"
                style={{ width: "auto", minWidth: 220, borderRadius: 999 }}
                aria-label="Chọn học kỳ"
                defaultValue="hk1-2627"
              >
                <option value="hk1-2627">Học kỳ: Học kỳ 1 (2026 – 2027)</option>
                <option value="hk2-2526">Học kỳ: Học kỳ 2 (2025 – 2026)</option>
              </select>

              <button
                type="button"
                aria-pressed={viewMode === "week"}
                className={`dash-chip ${viewMode === "week" ? "dash-chip--active" : ""}`}
                onClick={() => setViewMode("week")}
              >
                <CalendarDays size={15} />
                Theo tuần
              </button>

              <button
                type="button"
                aria-pressed={viewMode === "day"}
                className={`dash-chip ${viewMode === "day" ? "dash-chip--active" : ""}`}
                onClick={() => setViewMode("day")}
              >
                <List size={15} />
                Theo ngày
              </button>
            </div>

            <div className="dash-chip-group">
              <button
                type="button"
                className="dash-btn dash-btn--sm"
                onClick={() => setWeekNumber((w) => Math.max(1, w - 1))}
              >
                <ChevronLeft size={15} />
                Tuần trước
              </button>

              <span className="dash-badge dash-badge--gold" style={{ padding: "6px 14px" }}>
                Tuần {weekNumber}
              </span>

              <button
                type="button"
                className="dash-btn dash-btn--sm"
                onClick={() => setWeekNumber((w) => Math.min(20, w + 1))}
              >
                Tuần sau
                <ChevronRight size={15} />
              </button>

              <button
                type="button"
                className="dash-btn dash-btn--primary dash-btn--sm"
                onClick={() => {
                  setEditingEvent(null);
                  const input = document.getElementById("schedule-event-title");
                  const prefersReduced = window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches;
                  input?.scrollIntoView({
                    behavior: prefersReduced ? "auto" : "smooth",
                    block: "center",
                  });
                  input?.focus();
                }}
              >
                <Plus size={15} />
                Thêm buổi học
              </button>
            </div>
          </div>

          {/* Bố cục 2 cột theo Ảnh 3 */}
          <div className="dash-schedule-layout">
            {/* Cột trái: Thời khóa biểu */}
            <section className="dash-card">
              <div className="dash-card-head" style={{ flexWrap: "wrap" }}>
                <h2 className="dash-card-title">
                  <Calendar size={19} color="#8b1218" />
                  Thời khóa biểu tuần {weekNumber}
                </h2>

                <div className="dash-legend-row">
                  <span className="dash-legend-item">
                    <span className="dash-legend-dot" style={{ background: "#b91c1c" }} />
                    Học trên lớp
                  </span>
                  <span className="dash-legend-item">
                    <span className="dash-legend-dot" style={{ background: "#1d4ed8" }} />
                    Thực hành
                  </span>
                  <span className="dash-legend-item">
                    <span className="dash-legend-dot" style={{ background: "#6d28d9" }} />
                    Tự học
                  </span>
                  <span className="dash-legend-item">
                    <span className="dash-legend-dot" style={{ background: "#925f10" }} />
                    Sự kiện cá nhân
                  </span>
                </div>
              </div>

              {viewMode === "week" ? (
                <ScheduleWeekGrid
                  events={events}
                  conflictIds={conflictIds}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : (
                <ScheduleDayList
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                  events={events}
                  conflictIds={conflictIds}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </section>

            {/* Cột phải: Lịch sắp tới + Form thêm sự kiện + Cảnh báo xung đột */}
            <aside className="dash-stack" style={{ gap: 16 }}>
              <section className="dash-card">
                <div className="dash-card-head" style={{ marginBottom: 12 }}>
                  <h3 className="dash-card-title" style={{ fontSize: "1.05rem" }}>
                    <CalendarDays size={18} color="#8b1218" />
                    Lịch sắp tới
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {upcomingEvents.map((ev, idx) => {
                    const dayObj = WEEK_DAYS.find((d) => d.day === ev.dayOfWeek);
                    return (
                      <div key={ev.id} className="dash-upcoming-item">
                        <div className="dash-day-pill">
                          <div>{dayObj?.short}</div>
                          <div style={{ fontWeight: 500, color: "#6e6359" }}>
                            {dayObj?.dateHint}
                          </div>
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <strong
                            title={`${ev.courseCode} – ${ev.courseName}`}
                            style={{
                              display: "block",
                              fontSize: "0.84rem",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {ev.courseCode} – {ev.courseName}
                          </strong>
                          <span style={{ fontSize: "0.75rem", color: "#6e6359" }}>
                            <MapPin size={11} style={{ display: "inline", marginRight: 3 }} />
                            {ev.room} •{" "}
                            <Clock size={11} style={{ display: "inline", marginRight: 3 }} />
                            {ev.startTime} – {ev.endTime}
                          </span>
                        </div>

                        <span
                          className={`dash-badge ${
                            idx === 0 ? "dash-badge--crimson-soft" : "dash-badge--gold"
                          }`}
                        >
                          {idx === 0 ? "Sắp diễn ra" : "Trong tuần"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              <ScheduleEventForm
                key={editingEvent?.id ?? "create"}
                initialEvent={editingEvent}
                existingEvents={events}
                onSubmit={handleSaveEvent}
                onCancelEdit={() => setEditingEvent(null)}
              />

              {/* Cảnh báo xung đột lịch học */}
              {messages.length > 0 && (
                <section className="dash-conflict-card" role="alert">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertTriangle size={18} />
                    <strong>Cảnh báo xung đột lịch học</strong>
                  </div>
                  {messages.map((msg) => (
                    <p key={msg} style={{ margin: 0, fontSize: "0.81rem" }}>
                      {msg}
                    </p>
                  ))}
                </section>
              )}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
