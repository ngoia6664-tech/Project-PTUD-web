"use client";

import "./dashboard.css";
import DashboardNavbar from "./DashboardNavbar";
import { MOCK_NEWS_RESPONSE, MOCK_USER_RESPONSE } from "@/lib/mock/dashboard";

/**
 * Khung giao diện bọc toàn bộ các trang trong /dashboard.
 * Dùng bố cục Top Navbar + vùng nội dung mở rộng theo bộ mockup mới.
 */

interface DashboardShellProps {
  children: React.ReactNode;
  fontClassName?: string;
}

export default function DashboardShell({
  children,
  fontClassName = "",
}: DashboardShellProps) {
  // Đọc dữ liệu giả (sau này thay bằng fetch /api/me và /api/news/unread-count)
  const user = MOCK_USER_RESPONSE.data;
  const unreadNewsCount = MOCK_NEWS_RESPONSE.data.filter(
    (item) => !item.isRead,
  ).length;

  return (
    <div className={`dash-root ${fontClassName}`.trim()} lang="vi">
      <DashboardNavbar user={user} unreadNewsCount={unreadNewsCount} />
      {children}
    </div>
  );
}
