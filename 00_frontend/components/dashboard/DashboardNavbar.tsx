"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  Calculator,
  CalendarDays,
  ChevronDown,
  FolderKanban,
  Home,
  LayoutDashboard,
  Menu,
  Newspaper,
  ShieldCheck,
  Swords,
  UserCircle2,
  X,
} from "lucide-react";
import type { User } from "@/lib/mock/dashboard";

/**
 * Thanh điều hướng trên cùng (Top Navbar) giữ nguyên đầy đủ tên và danh sách nav cũ:
 * Tổng quan, Tin tức trường, Lịch học, Tính GPA, Chương trình học,
 * Thư viện tài liệu, Hồ sơ cá nhân và KMA Battle Royale.
 */

interface DashboardNavbarProps {
  user: User;
  unreadNewsCount: number;
}

const TOP_NAV_ITEMS = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/news", label: "Tin tức trường", icon: Newspaper, exact: false },
  { href: "/dashboard/schedule", label: "Lịch học", icon: CalendarDays, exact: false },
  { href: "/dashboard/gpa", label: "Tính GPA", icon: Calculator, exact: false },
  { href: "/dashboard/curriculum", label: "Chương trình học", icon: BookOpen, exact: false },
  { href: "/dashboard/library", label: "Thư viện tài liệu", icon: FolderKanban, exact: false },
  { href: "/dashboard/profile", label: "Hồ sơ cá nhân", icon: UserCircle2, exact: false },
  { href: "/battleground", label: "KMA Battle Royale", icon: Swords, exact: false },
];

export default function DashboardNavbar({
  user,
  unreadNewsCount,
}: DashboardNavbarProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen && !drawerOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setDrawerOpen(false);
      }
    }

    function handlePointerDown(e: MouseEvent) {
      if (
        menuOpen &&
        menuWrapRef.current &&
        !menuWrapRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [menuOpen, drawerOpen]);

  function isItemActive(item: (typeof TOP_NAV_ITEMS)[number]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <>
      <header className="dash-topbar">
        <div className="dash-topbar-inner">
          {/* Logo KMA Overall */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "none" }}>
            <button
              type="button"
              className="dash-mobile-toggle"
              onClick={() => setDrawerOpen(true)}
              aria-label="Mở menu điều hướng"
              aria-expanded={drawerOpen}
              aria-controls="dash-mobile-drawer"
            >
              <Menu size={20} />
            </button>

            <Link href="/dashboard" className="dash-brand">
              <svg
                className="dash-brand-shield"
                viewBox="0 0 36 38"
                aria-hidden="true"
              >
                <path
                  d="M18 2L32 7.5V18.5C32 27.2 25.8 33.4 18 36C10.2 33.4 4 27.2 4 18.5V7.5L18 2Z"
                  fill="#8b1218"
                  stroke="#b8893a"
                  strokeWidth="1.6"
                />
                <circle cx="18" cy="15.5" r="3.6" fill="#faf6ef" />
                <path d="M16.2 18.5h3.6l.8 7h-5.2l.8-7Z" fill="#faf6ef" />
              </svg>
              <span className="dash-brand-text">
                <span className="dash-brand-name">
                  KMA <b>Overall</b>
                </span>
                <span className="dash-brand-sub">Cổng sinh viên KMA</span>
              </span>
            </Link>
          </div>

          {/* Giữ nguyên toàn bộ 8 mục điều hướng cũ */}
          <nav className="dash-topnav" aria-label="Điều hướng chính">
            {TOP_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`dash-topnav-link ${
                    active ? "dash-topnav-link--active" : ""
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Cụm công cụ góc phải */}
          <div className="dash-topbar-end">
            <Link
              href="/dashboard/news"
              className="dash-icon-circle"
              aria-label={`Tin tức trường (${unreadNewsCount} chưa đọc)`}
              title="Tin tức & thông báo mới"
            >
              <Bell size={17} />
              {unreadNewsCount > 0 && <span className="dash-bell-dot" />}
            </Link>

            <div className="dash-user-menu-wrap" ref={menuWrapRef}>
              <button
                type="button"
                className="dash-avatar-btn"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-label="Mở menu tài khoản"
              >
                <span className="dash-avatar-circle">{user.avatarInitials}</span>
                <ChevronDown
                  size={15}
                  className={`dash-chevron ${menuOpen ? "dash-chevron--open" : ""}`}
                />
              </button>

              <div
                className={`dash-dropdown ${menuOpen ? "dash-dropdown--open" : ""}`}
                role="menu"
                aria-hidden={!menuOpen}
                inert={!menuOpen}
              >
                <div className="dash-dropdown-head">
                  <strong style={{ display: "block", fontSize: "0.9rem" }}>
                    {user.fullName}
                  </strong>
                  <span style={{ fontSize: "0.76rem", color: "#63594f" }}>
                    {user.studentCode} • Lớp {user.className}
                  </span>
                </div>

                <Link
                  href="/dashboard/profile"
                  className="dash-dropdown-item"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserCircle2 size={16} />
                  Hồ sơ cá nhân
                </Link>
                <Link
                  href="/admin"
                  prefetch={false}
                  className="dash-dropdown-item"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  <ShieldCheck size={16} />
                  Chuyển sang Admin (Demo)
                </Link>
                <Link
                  href="/"
                  className="dash-dropdown-item"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  <Home size={16} />
                  Về trang Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Ngăn kéo menu trên màn hình nhỏ / điện thoại */}
      <div
        className={`dash-drawer-backdrop ${
          drawerOpen ? "dash-drawer-backdrop--open" : ""
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="dash-mobile-drawer"
        className={`dash-drawer ${drawerOpen ? "dash-drawer--open" : ""}`}
        aria-label="Menu di động"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 12,
            borderBottom: "1px solid #eadfce",
          }}
        >
          <strong style={{ fontFamily: "var(--dash-display)", fontSize: "1.1rem" }}>
            KMA <span style={{ color: "#8b1218" }}>Overall</span>
          </strong>
          <button
            type="button"
            className="dash-icon-circle"
            onClick={() => setDrawerOpen(false)}
            aria-label="Đóng menu"
          >
            <X size={17} />
          </button>
        </div>

        {TOP_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`dash-topnav-link ${
                active ? "dash-topnav-link--active" : ""
              }`}
              onClick={() => setDrawerOpen(false)}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div
          style={{
            marginTop: "auto",
            paddingTop: 12,
            borderTop: "1px solid #eadfce",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Link
            href="/admin"
            prefetch={false}
            className="dash-btn dash-btn--outline-crimson dash-btn--sm"
            onClick={() => setDrawerOpen(false)}
          >
            <ShieldCheck size={15} />
            Chuyển sang Admin (Demo)
          </Link>
          <Link
            href="/"
            className="dash-btn dash-btn--sm"
            onClick={() => setDrawerOpen(false)}
          >
            <Home size={15} />
            Về trang Home
          </Link>
        </div>
      </aside>
    </>
  );
}
