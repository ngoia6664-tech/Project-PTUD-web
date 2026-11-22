"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  BookOpen,
  CalendarDays,
  FolderKanban,
  Home,
  LayoutDashboard,
  Newspaper,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";

/**
 * Thanh sidebar trái của khu vực Quản trị (/admin).
 * Gồm đầy đủ 7 mục quản trị, huy hiệu ADMIN để phân biệt với trang sinh viên,
 * và nút chuyển nhanh về /dashboard để tiện demo.
 */

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/admin/news", label: "Tin tức & nguồn", icon: Newspaper, exact: false },
  { href: "/admin/schedule", label: "Lịch học chung", icon: CalendarDays, exact: false },
  { href: "/admin/users", label: "Người dùng", icon: Users, exact: false },
  { href: "/admin/courses", label: "Môn học & CTĐT", icon: BookOpen, exact: false },
  { href: "/admin/library", label: "Thư viện tài liệu", icon: FolderKanban, exact: false },
  { href: "/admin/grading", label: "Cấu hình thang điểm", icon: SlidersHorizontal, exact: false },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`admin-sidebar ${isOpen ? "admin-sidebar--open" : ""}`}
      aria-label="Điều hướng quản trị"
    >
      <div className="admin-sidebar-top">
        <Link href="/admin" className="admin-brand" onClick={onClose}>
          <svg width="34" height="36" viewBox="0 0 36 38" aria-hidden="true">
            <path
              d="M18 2L32 7.5V18.5C32 27.2 25.8 33.4 18 36C10.2 33.4 4 27.2 4 18.5V7.5L18 2Z"
              fill="#8b1218"
              stroke="#f0d69b"
              strokeWidth="1.8"
            />
            <circle cx="18" cy="15.5" r="3.6" fill="#fffaf0" />
            <path d="M16.2 18.5h3.6l.8 7h-5.2l.8-7Z" fill="#fffaf0" />
          </svg>
          <div>
            <div className="admin-brand-name">
              KMA <b>Overall</b>
            </div>
            <span className="admin-role-pill">ADMIN</span>
          </div>
        </Link>

        <button
          type="button"
          className="admin-sidebar-close"
          onClick={onClose}
          aria-label="Đóng menu quản trị"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="admin-nav">
        <span className="admin-nav-group">Quản trị hệ thống</span>
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link ${active ? "admin-nav-link--active" : ""}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/dashboard" className="admin-switch-btn" onClick={onClose}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <ArrowLeftRight size={15} />
            Sang Dashboard SV
          </span>
          <span style={{ fontSize: "0.72rem" }}>Demo</span>
        </Link>

        <Link href="/" className="admin-home-btn" onClick={onClose}>
          <Home size={16} />
          <span>Về trang Home</span>
        </Link>
      </div>
    </aside>
  );
}
