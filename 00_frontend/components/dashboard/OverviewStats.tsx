"use client";

import { BookOpen, GraduationCap, Layers } from "lucide-react";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import KmaTiltCard from "@/components/ui/KmaTiltCard";
import { useInViewOnce } from "@/components/ui/useInViewOnce";
import type { DashboardOverview } from "@/lib/mock/dashboard";

/**
 * 4 thẻ KPI trang Tổng quan (đặc tả A1) nâng cấp thẻ 3D tương tác (KmaTiltCard):
 * - GPA 3.48 + sparkline vẽ dần bằng stroke-dashoffset
 * - Tín chỉ 107/150
 * - Tiến độ vòng tròn SVG 71% vẽ dần
 * - Môn đang học 5
 */

interface OverviewStatsProps {
  overview: DashboardOverview;
}

export default function OverviewStats({ overview }: OverviewStatsProps) {
  const { ref, inView } = useInViewOnce<HTMLElement>(0.15);
  const progressPercent = Math.round(
    (overview.completedCredits / overview.totalCredits) * 100,
  );

  return (
    <section
      ref={ref}
      className="dash-stats-grid kma-stagger"
      aria-label="Chỉ số học tập tổng quan"
    >
      {/* KPI 1: GPA + Sparkline */}
      <KmaTiltCard
        href="/dashboard/gpa"
        className="dash-card dash-card--hover dash-stat-card"
        style={{ justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="dash-stat-icon" aria-hidden="true">
            <GraduationCap size={22} strokeWidth={1.75} />
          </span>
          <div>
            <div className="dash-stat-value">
              <AnimatedNumber value={overview.gpaCurrent} decimals={2} />
            </div>
            <div className="dash-stat-label">
              GPA hiện tại (/ {overview.gpaScale.toFixed(2)})
            </div>
          </div>
        </div>

        <svg
          width="66"
          height="32"
          viewBox="0 0 66 32"
          aria-hidden="true"
          style={{ flex: "none" }}
        >
          <path
            d="M4 24 L18 20 L33 17 L48 11 L62 6"
            fill="none"
            stroke="#8b1218"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            className={`kma-svg-line ${inView ? "kma-svg-line--visible" : ""}`}
          />
          <circle
            cx="62"
            cy="6"
            r="3"
            fill="#8b1218"
            className={`kma-svg-dot ${inView ? "kma-svg-dot--visible" : ""}`}
            style={{ animationDelay: "520ms" }}
          />
        </svg>
      </KmaTiltCard>

      {/* KPI 2: Tín chỉ tích lũy */}
      <KmaTiltCard
        href="/dashboard/curriculum"
        className="dash-card dash-card--hover dash-stat-card"
      >
        <span className="dash-stat-icon" aria-hidden="true">
          <Layers size={21} strokeWidth={1.75} />
        </span>
        <div>
          <div className="dash-stat-value">
            <AnimatedNumber value={overview.completedCredits} />
            <span
              style={{ fontSize: "0.95rem", color: "#5c5249", fontWeight: 600 }}
            >
              /{overview.totalCredits}
            </span>
          </div>
          <div className="dash-stat-label">Tín chỉ tích lũy</div>
        </div>
      </KmaTiltCard>

      {/* KPI 3: Tiến độ vòng tròn 71% */}
      <KmaTiltCard
        href="/dashboard/curriculum"
        className="dash-card dash-card--hover dash-stat-card"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          aria-hidden="true"
          style={{ flex: "none" }}
        >
          <circle
            cx="24"
            cy="24"
            r="19"
            fill="none"
            stroke="#efe5d5"
            strokeWidth="5"
          />
          <circle
            cx="24"
            cy="24"
            r="19"
            fill="none"
            stroke="#8b1218"
            strokeWidth="5"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset={inView ? 100 - progressPercent : 100}
            transform="rotate(-90 24 24)"
            className="kma-svg-arc"
          />
        </svg>
        <div>
          <div className="dash-stat-value">
            <AnimatedNumber value={progressPercent} suffix="%" />
          </div>
          <div className="dash-stat-label">Tiến độ chương trình</div>
        </div>
      </KmaTiltCard>

      {/* KPI 4: Môn đang học */}
      <KmaTiltCard
        href="/dashboard/study"
        className="dash-card dash-card--hover dash-stat-card"
      >
        <span className="dash-stat-icon" aria-hidden="true">
          <BookOpen size={21} strokeWidth={1.75} />
        </span>
        <div>
          <div className="dash-stat-value">
            <AnimatedNumber value={overview.activeCoursesCount} />
          </div>
          <div className="dash-stat-label">Môn đang học</div>
        </div>
      </KmaTiltCard>
    </section>
  );
}
