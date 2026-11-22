"use client";

import { FileText, Newspaper, UserPlus, Users } from "lucide-react";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import type { AdminOverviewStats as AdminOverviewStatsData } from "@/lib/mock/admin";

/**
 * 4 thẻ KPI tổng quan trang /admin (đặc tả B1):
 * Đếm số mượt từ 0 đúng một lần khi xuất hiện (tắt ngay nếu prefers-reduced-motion).
 */

interface AdminOverviewStatsProps {
  stats: AdminOverviewStatsData;
}

export default function AdminOverviewStats({ stats }: AdminOverviewStatsProps) {
  return (
    <section
      className="admin-stats-grid kma-stagger"
      aria-label="Chỉ số quản trị tổng quan"
    >
      <article className="admin-card admin-card--hover admin-stat-card">
        <span className="admin-stat-icon admin-stat-icon--crimson" aria-hidden="true">
          <Users size={22} strokeWidth={1.75} />
        </span>
        <div>
          <div className="admin-stat-value">
            <AnimatedNumber value={stats.totalUsers} locale />
          </div>
          <div className="admin-stat-label">
            Tổng người dùng (+{stats.usersGrowthPercent}%)
          </div>
        </div>
      </article>

      <article className="admin-card admin-card--hover admin-stat-card">
        <span className="admin-stat-icon admin-stat-icon--jade" aria-hidden="true">
          <UserPlus size={22} strokeWidth={1.75} />
        </span>
        <div>
          <div className="admin-stat-value">
            <AnimatedNumber value={stats.newUsersThisMonth} prefix="+" locale />
          </div>
          <div className="admin-stat-label">Người dùng mới tháng này</div>
        </div>
      </article>

      <article className="admin-card admin-card--hover admin-stat-card">
        <span className="admin-stat-icon" aria-hidden="true">
          <Newspaper size={22} strokeWidth={1.75} />
        </span>
        <div>
          <div className="admin-stat-value">
            <AnimatedNumber value={stats.fetchedNewsCount} locale />
          </div>
          <div className="admin-stat-label">Tin mới kéo về gần đây</div>
        </div>
      </article>

      <article className="admin-card admin-card--hover admin-stat-card">
        <span className="admin-stat-icon admin-stat-icon--blue" aria-hidden="true">
          <FileText size={22} strokeWidth={1.75} />
        </span>
        <div>
          <div className="admin-stat-value">
            <AnimatedNumber value={stats.totalDocuments} locale />
          </div>
          <div className="admin-stat-label">
            Tài liệu ({stats.pendingDocumentsCount} chờ duyệt)
          </div>
        </div>
      </article>
    </section>
  );
}
