"use client";

import { useState } from "react";
import "./admin.css";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { MOCK_ADMIN_PROFILE_RESPONSE } from "@/lib/mock/admin";

/**
 * Khung giao diện bọc toàn bộ các trang trong /admin.
 * Quản lý trạng thái đóng/mở sidebar trên màn hình nhỏ.
 */

interface AdminShellProps {
  children: React.ReactNode;
  fontClassName?: string;
}

export default function AdminShell({
  children,
  fontClassName = "",
}: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dữ liệu giả tài khoản quản trị (sau này thay bằng fetch /api/admin/me)
  const profile = MOCK_ADMIN_PROFILE_RESPONSE.data;

  return (
    <div className={`admin-root ${fontClassName}`.trim()} lang="vi">
      <div className="admin-layout">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {sidebarOpen && (
          <div
            className="admin-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className="admin-main-col">
          <AdminHeader
            profile={profile}
            onOpenMenu={() => setSidebarOpen(true)}
          />
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
