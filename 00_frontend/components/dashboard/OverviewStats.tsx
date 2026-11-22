import { BookOpen, GraduationCap, Layers, TrendingUp } from "lucide-react";
import type { DashboardOverview } from "@/lib/mock/dashboard";

/**
 * 4 thẻ chỉ số tổng quan dưới phần Hero theo Ảnh 1:
 * GPA hiện tại, tín chỉ tích lũy, % tiến độ chương trình và số môn đang học.
 */

interface OverviewStatsProps {
  overview: DashboardOverview;
}

export default function OverviewStats({ overview }: OverviewStatsProps) {
  const progressPercent = Math.round(
    (overview.completedCredits / overview.totalCredits) * 100,
  );

  return (
    <section className="dash-stats-grid" aria-label="Chỉ số học tập tổng quan">
      <article className="dash-card dash-stat-card">
        <span className="dash-stat-icon">
          <GraduationCap size={23} />
        </span>
        <div>
          <div className="dash-stat-value">{overview.gpaCurrent.toFixed(2)}</div>
          <div className="dash-stat-label">
            GPA hiện tại (/ {overview.gpaScale.toFixed(2)})
          </div>
        </div>
      </article>

      <article className="dash-card dash-stat-card">
        <span className="dash-stat-icon">
          <Layers size={22} />
        </span>
        <div>
          <div className="dash-stat-value">{overview.completedCredits}</div>
          <div className="dash-stat-label">
            Tín chỉ tích lũy (/ {overview.totalCredits})
          </div>
        </div>
      </article>

      <article className="dash-card dash-stat-card">
        <span className="dash-stat-icon">
          <TrendingUp size={22} />
        </span>
        <div>
          <div className="dash-stat-value">{progressPercent}%</div>
          <div className="dash-stat-label">Tiến độ chương trình</div>
        </div>
      </article>

      <article className="dash-card dash-stat-card">
        <span className="dash-stat-icon">
          <BookOpen size={22} />
        </span>
        <div>
          <div className="dash-stat-value">{overview.activeCoursesCount}</div>
          <div className="dash-stat-label">Môn đang học</div>
        </div>
      </article>
    </section>
  );
}
