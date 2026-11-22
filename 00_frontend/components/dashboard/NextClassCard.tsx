import Link from "next/link";
import { CalendarClock, Clock, MapPin, User } from "lucide-react";
import { WEEK_DAYS, type ScheduleEvent } from "@/lib/mock/dashboard";

/**
 * Thẻ "Buổi học tiếp theo" trên trang Tổng quan sinh viên.
 * Hiển thị tên môn, khung giờ, phòng học, giảng viên và đường dẫn sang Lịch học.
 */

interface NextClassCardProps {
  nextClass: ScheduleEvent | null;
}

export default function NextClassCard({ nextClass }: NextClassCardProps) {
  const dayLabel =
    WEEK_DAYS.find((d) => d.day === nextClass?.dayOfWeek)?.label ?? "";

  return (
    <section className="dash-card">
      <div className="dash-card-head">
        <h2 className="dash-card-title">
          <CalendarClock size={19} color="#8b1218" />
          Buổi học tiếp theo
        </h2>
        <Link
          href="/dashboard/schedule"
          className="dash-btn dash-btn--outline-crimson dash-btn--sm"
        >
          Xem cả tuần
        </Link>
      </div>

      {nextClass ? (
        <div className="dash-next-class-box">
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span className="dash-badge dash-badge--crimson-soft">
              {nextClass.courseCode}
            </span>
            <span className="dash-badge dash-badge--gold">
              {nextClass.source === "class" ? "Lịch lớp (chỉ xem)" : "Lịch cá nhân"}
            </span>
          </div>

          <h3 style={{ margin: 0, fontSize: "1.06rem", fontWeight: 700 }}>
            {nextClass.courseName}
          </h3>

          <div className="dash-next-meta">
            <span>
              <Clock size={14} color="#8b1218" />
              {dayLabel} • Tiết {nextClass.startPeriod}–{nextClass.endPeriod} (
              {nextClass.startTime} – {nextClass.endTime})
            </span>
            <span>
              <MapPin size={14} color="#7d5616" />
              Phòng {nextClass.room}
            </span>
            <span>
              <User size={14} color="#6e6359" />
              {nextClass.lecturer}
            </span>
          </div>

          {nextClass.note && (
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#6e6359" }}>
              Ghi chú: {nextClass.note}
            </p>
          )}
        </div>
      ) : (
        <div className="dash-state-box">
          <p style={{ margin: 0 }}>Hiện chưa có buổi học nào sắp diễn ra.</p>
        </div>
      )}
    </section>
  );
}
