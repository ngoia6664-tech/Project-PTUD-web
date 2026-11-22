import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import DashboardHero from "@/components/dashboard/DashboardHero";
import OverviewStats from "@/components/dashboard/OverviewStats";
import OverviewFeatures from "@/components/dashboard/OverviewFeatures";
import NextClassCard from "@/components/dashboard/NextClassCard";
import LatestNewsCard from "@/components/dashboard/LatestNewsCard";
import BattleRoyaleCard from "@/components/dashboard/BattleRoyaleCard";
import {
  MOCK_OVERVIEW_RESPONSE,
  MOCK_USER_RESPONSE,
} from "@/lib/mock/dashboard";

/**
 * Trang Tổng quan sinh viên (/dashboard) theo Ảnh 1:
 * Hero KMA Overall -> 4 thẻ chỉ số -> 5 Tiện ích nổi bật -> Buổi học tiếp theo & 3 tin mới nhất -> Banner đỏ sơn mài.
 */
export default function DashboardOverviewPage() {
  const user = MOCK_USER_RESPONSE.data;
  const overview = MOCK_OVERVIEW_RESPONSE.data;

  return (
    <>
      <DashboardHero
        eyebrow="Học viện Kỹ thuật Mật mã"
        titlePrefix="KMA"
        titleHighlight="Overall"
        subtitle={`Xin chào ${user.fullName} (${user.studentCode} • Lớp ${user.className}). Theo dõi học tập, cập nhật tin tức, quản lý lịch học, tính GPA và tra cứu tài liệu trong một không gian thống nhất.`}
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
          {/* 4 thẻ chỉ số tổng quan */}
          <OverviewStats overview={overview} />

          {/* 5 thẻ tiện ích nổi bật (bao gồm KMA Battle Royale) */}
          <OverviewFeatures />

          {/* Buổi học tiếp theo + 3 tin mới nhất */}
          <div className="dash-overview-grid">
            <NextClassCard nextClass={overview.nextClass} />
            <LatestNewsCard posts={overview.latestNews} />
          </div>

          {/* Banner đỏ sơn mài cuối trang */}
          <BattleRoyaleCard />
        </div>
      </main>
    </>
  );
}
