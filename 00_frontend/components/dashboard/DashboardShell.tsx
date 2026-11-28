"use client";

import { useEffect } from "react";
import "./dashboard.css";
import DashboardNavbar from "./DashboardNavbar";
import { apiFetch } from "@/lib/api";
import { MOCK_NEWS_RESPONSE, MOCK_USER_RESPONSE } from "@/lib/mock/dashboard";

/**
 * Khung giao diện bọc toàn bộ các trang trong /dashboard.
 * - Gọi GET /auth/me khi vào khu vực sinh viên để xác thực phiên (gặp 401 tự xóa token và về /login).
 */

interface DashboardShellProps {
  children: React.ReactNode;
  fontClassName?: string;
}

interface AuthMeResponse {
  user: {
    id: number | string;
    role: string;
  };
}

export default function DashboardShell({
  children,
  fontClassName = "",
}: DashboardShellProps) {
  useEffect(() => {
    let mounted = true;
    apiFetch<AuthMeResponse>("/auth/me", { method: "GET" }).catch(() => {
      if (!mounted) return;
    });
    return () => {
      mounted = false;
    };
  }, []);

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
