import Link from "next/link";
import { CalendarClock, Clock, MapPin, User } from "lucide-react";
import {
  MOCK_SCHEDULE_RESPONSE,
  WEEK_DAYS,
  type ScheduleEvent,
} from "@/lib/mock/dashboard";

/**
 * Thẻ "Hôm nay & buổi học tiếp theo" trên trang Tổng quan (đặc tả A1):
 * Hiển thị dòng thời gian các buổi trong ngày kèm nhãn "Sắp diễn ra" cho buổi kế tiếp.
 */

interface NextClassCardProps {
  nextClass: ScheduleEvent | null;
}

export default function NextClassCard({ nextClass }: NextClassCardProps) {
  // Lấy danh sách buổi học cùng ngày với buổi học tiếp theo để tạo timeline hôm nay
  const todayEvents = nextClass
    ? MOCK_SCHEDULE_RESPONSE.data
        .filter((ev) => ev.dayOfWeek === nextClass.dayOfWeek)
        .sort((a, b) => a.startPeriod - b.startPeriod)
    : [];

  const dayLabel =
    WEEK_DAYS.find((d) => d.day === nextClass?.dayOfWeek)?.label ?? "Hôm nay";

  return (
    <section className="dash-card">
      <div className="dash-card-head">
        <h2 className="dash-card-title">
          <CalendarClock size={19} color="#8b1218" strokeWidth={1.75} />
          Hôm nay &amp; buổi học tiếp theo
        </h2>
        <Link
          href="/dashboard/schedule"
          className="dash-btn dash-btn--outline-crimson dash-btn--sm"
        >
          Xem lịch tuần
        </Link>
      </div>

      {todayEvents.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {todayEvents.map((ev, index) => {
            const isNext = index === 0;
            return (
              <div
                key={ev.id}
                className="dash-next-class-box"
                style={{
                  borderLeftColor: isNext ? "#8b1218" : "#b8893a",
                  background: isNext ? "#fdf0f0" : "#fbf6ec",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span className="dash-badge dash-badge--crimson-soft">
                      {ev.courseCode}
                    </span>
                    <span className="dash-badge dash-badge--gold">
                      {ev.source === "class" ? "Lịch lớp" : "Cá nhân"}
                    </span>
                  </div>

                  {isNext && (
                    <span className="dash-badge dash-badge--crimson">
                      Sắp diễn ra
                    </span>
                  )}
                </div>

                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>
                  {ev.courseName}
                </h3>

                <div className="dash-next-meta">
                  <span>
                    <Clock size={14} color="#8b1218" />
                    {dayLabel} • {ev.startTime} – {ev.endTime}
                  </span>
                  <span>
                    <MapPin size={14} color="#7d5616" />
                    {ev.room}
                  </span>
                  <span>
                    <User size={14} color="#5c5249" />
                    {ev.lecturer}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="dash-state-box">
          <p style={{ margin: 0 }}>Hôm nay không có buổi học nào.</p>
        </div>
      )}
    </section>
  );
}
