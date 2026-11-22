import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import DashboardHero from "@/components/dashboard/DashboardHero";
import OverviewStats from "@/components/dashboard/OverviewStats";
import NextClassCard from "@/components/dashboard/NextClassCard";
import LatestNewsCard from "@/components/dashboard/LatestNewsCard";
import OverviewShortcuts from "@/components/dashboard/OverviewShortcuts";
import {
  MOCK_OVERVIEW_RESPONSE,
  MOCK_USER_RESPONSE,
} from "@/lib/mock/dashboard";

/**
 * Trang Tổng quan sinh viên (/dashboard) theo đúng đặc tả A1:
 * - Banner chào gọn (<= ~280px)
 * - 4 thẻ KPI (GPA 3.48 + sparkline, Tín chỉ 107/150, Tiến độ vòng 71%, Môn đang học 5)
 * - Hôm nay & buổi học tiếp theo + Tin mới (3 tin)
 * - 3 thẻ lối tắt (Tính GPA, Thư viện, Battle Royale)
 */
export default function DashboardOverviewPage() {
  const user = MOCK_USER_RESPONSE.data;
  const overview = MOCK_OVERVIEW_RESPONSE.data;

  return (
    <>
      <DashboardHero
        eyebrow="Học viện Kỹ thuật Mật mã"
        titlePrefix="Chào,"
        titleHighlight={user.fullName}
        subtitle={`${user.studentCode} • Lớp ${user.className} • Ngành ${user.majorName} — ${overview.currentSemester}.`}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/dashboard/study" className="dash-btn dash-btn--primary">
            Vào góc học tập
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard/schedule"
            className="dash-btn dash-btn--outline-crimson"
          >
            <CalendarDays size={16} />
            Xem lịch học tuần
          </Link>
        </div>
      </DashboardHero>

      <main className="dash-main">
        <div className="dash-stack">
          {/* 4 thẻ KPI có đếm số & biểu đồ vẽ dần */}
          <OverviewStats overview={overview} />

          {/* Hôm nay & buổi học tiếp theo + 3 tin mới */}
          <div className="dash-overview-grid kma-stagger">
            <NextClassCard nextClass={overview.nextClass} />
            <LatestNewsCard posts={overview.latestNews} />
          </div>

          {/* 3 thẻ lối tắt theo đặc tả A1 */}
          <OverviewShortcuts />
        </div>
      </main>
    </>
  );
}
