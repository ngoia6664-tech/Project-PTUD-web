"use client";

import { usePathname } from "next/navigation";
import { Menu, ShieldCheck } from "lucide-react";
import type { AdminProfile } from "@/lib/mock/admin";

/**
 * Thanh Header trên cùng của khu vực /admin.
 * Hiển thị tên màn hình quản trị hiện tại, nút mở drawer trên mobile và thẻ quản trị viên.
 */

interface AdminHeaderProps {
  profile: AdminProfile;
  onOpenMenu: () => void;
}

const ADMIN_ROUTE_META: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Tổng quan quản trị",
    subtitle: "Theo dõi người dùng, lượng tin kéo về và kho tài liệu KMA Overall",
  },
  "/admin/news": {
    title: "Quản lý tin tức & nguồn tin",
    subtitle: "Bật/tắt hiển thị, ghim bài, gắn loại và cấu hình chu kỳ kéo tin",
  },
  "/admin/schedule": {
    title: "Quản lý lịch học chung",
    subtitle: "Lịch theo lớp/học phần, nhập CSV và soạn thông báo nghỉ/dạy bù",
  },
  "/admin/users": {
    title: "Quản lý người dùng",
    subtitle: "Tìm kiếm, lọc vai trò, khóa/mở tài khoản và phân quyền",
  },
  "/admin/courses": {
    title: "Môn học và chương trình đào tạo",
    subtitle: "Thêm, chỉnh sửa học phần, tín chỉ và phân kỳ theo ngành",
  },
  "/admin/library": {
    title: "Quản lý thư viện tài liệu",
    subtitle: "Tải lên tài liệu chính thức, duyệt bài sinh viên đóng góp hoặc gỡ bỏ",
  },
  "/admin/grading": {
    title: "Cấu hình thang điểm KMA",
    subtitle: "Chỉnh sửa bảng quy đổi điểm chữ, thang 4 và thang 10",
  },
};

export default function AdminHeader({
  profile,
  onOpenMenu,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const meta = ADMIN_ROUTE_META[pathname] ?? ADMIN_ROUTE_META["/admin"];

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          type="button"
          className="admin-menu-btn"
          onClick={onOpenMenu}
          aria-label="Mở menu quản trị"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="admin-header-title">{meta.title}</h1>
          <p className="admin-header-sub">{meta.subtitle}</p>
        </div>
      </div>

      <div className="admin-header-right">
        <span className="admin-badge admin-badge--crimson-soft admin-header-role-pill">
          <ShieldCheck size={13} />
          {profile.roleLabel}
        </span>

        <div className="admin-user-chip">
          <span className="admin-avatar">{profile.avatarInitials}</span>
          <div className="admin-user-meta" style={{ lineHeight: 1.2 }}>
            <strong style={{ display: "block", fontSize: "0.83rem" }}>
              {profile.fullName}
            </strong>
            <span style={{ fontSize: "0.72rem", color: "#5c5249" }}>
              {profile.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
