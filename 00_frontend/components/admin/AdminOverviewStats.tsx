import { FileText, Newspaper, UserPlus, Users } from "lucide-react";
import type { AdminOverviewStats as AdminOverviewStatsData } from "@/lib/mock/admin";

/**
 * 4 thẻ chỉ số tổng quan cho trang /admin:
 * Tổng số người dùng, Người dùng mới trong tháng, Tin mới kéo về và Số tài liệu.
 */

interface AdminOverviewStatsProps {
  stats: AdminOverviewStatsData;
}

export default function AdminOverviewStats({ stats }: AdminOverviewStatsProps) {
  return (
    <section className="admin-stats-grid" aria-label="Chỉ số quản trị tổng quan">
      <article className="admin-card admin-card--hover admin-stat-card">
        <span className="admin-stat-icon admin-stat-icon--crimson">
          <Users size={22} />
        </span>
        <div>
          <div className="admin-stat-value">
            {stats.totalUsers.toLocaleString("vi-VN")}
          </div>
          <div className="admin-stat-label">
            Tổng người dùng (+{stats.usersGrowthPercent}%)
          </div>
        </div>
      </article>

      <article className="admin-card admin-card--hover admin-stat-card">
        <span className="admin-stat-icon admin-stat-icon--jade">
          <UserPlus size={22} />
        </span>
        <div>
          <div className="admin-stat-value">
            +{stats.newUsersThisMonth.toLocaleString("vi-VN")}
          </div>
          <div className="admin-stat-label">Người dùng mới tháng này</div>
        </div>
      </article>

      <article className="admin-card admin-card--hover admin-stat-card">
        <span className="admin-stat-icon">
          <Newspaper size={22} />
        </span>
        <div>
          <div className="admin-stat-value">{stats.fetchedNewsCount}</div>
          <div className="admin-stat-label">Tin mới kéo về gần đây</div>
        </div>
      </article>

      <article className="admin-card admin-card--hover admin-stat-card">
        <span className="admin-stat-icon admin-stat-icon--blue">
          <FileText size={22} />
        </span>
        <div>
          <div className="admin-stat-value">
            {stats.totalDocuments.toLocaleString("vi-VN")}
          </div>
          <div className="admin-stat-label">
            Tài liệu ({stats.pendingDocumentsCount} chờ duyệt)
          </div>
        </div>
      </article>
    </section>
  );
}
