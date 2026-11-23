"use client";

import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  Calculator,
  CalendarDays,
  ChevronDown,
  FolderKanban,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  ShieldCheck,
  Swords,
  UserCircle2,
  X,
} from "lucide-react";
import type { User } from "@/lib/mock/dashboard";

/**
 * Thanh điều hướng trên cùng (Top Navbar) khu sinh viên theo đặc tả Q4:
 * - 5 tab chính: Tổng quan, Tin tức, Lịch học, Học tập, Battle Royale.
 *   (Tab Học tập vẫn sáng khi ở /dashboard/gpa, /dashboard/curriculum, /dashboard/library)
 * - Một pill đỏ duy nhất trượt giữa các tab bằng transform (--dash-indicator-ms: 600ms).
 * - Bên phải: chuông thông báo hiện số tin chưa đọc + menu avatar (Hồ sơ, Chuyển sang Admin (Demo), Về Home, Đăng xuất).
 */

interface DashboardNavbarProps {
  user: User;
  unreadNewsCount: number;
}

interface NavTabItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  extraPrefixes?: string[];
}

const TOP_NAV_ITEMS: NavTabItem[] = [
  {
    href: "/dashboard",
    label: "Tổng quan",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/dashboard/news", label: "Tin tức", icon: Newspaper },
  { href: "/dashboard/schedule", label: "Lịch học", icon: CalendarDays },
  {
    href: "/dashboard/study",
    label: "Học tập",
    icon: GraduationCap,
    extraPrefixes: [
      "/dashboard/gpa",
      "/dashboard/curriculum",
      "/dashboard/library",
    ],
  },
  { href: "/battleground", label: "Battle Royale", icon: Swords },
];

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function DashboardNavbar({
  user,
  unreadNewsCount,
}: DashboardNavbarProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Lưu tab vừa click để đổi active & trượt pill ngay lập tức, không chờ route tải xong
  const [pendingNav, setPendingNav] = useState<{
    href: string;
    fromPathname: string;
  } | null>(null);

  const menuWrapRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const effectivePath =
    pendingNav && pendingNav.fromPathname === pathname
      ? pendingNav.href
      : pathname;

  const isItemActive = useCallback(
    (item: NavTabItem, targetPath = effectivePath) => {
      if (item.exact) return targetPath === item.href;
      if (targetPath.startsWith(item.href)) return true;
      if (item.extraPrefixes?.some((prefix) => targetPath.startsWith(prefix))) {
        return true;
      }
      return false;
    },
    [effectivePath],
  );

  // Cập nhật ngay vị trí pill tới tab theo chỉ số (không đợi requestAnimationFrame)
  const movePillToIndex = useCallback((index: number) => {
    const navEl = navRef.current;
    const pillEl = pillRef.current;
    if (!navEl || !pillEl) return;
    const activeEl = index >= 0 ? linkRefs.current[index] : null;
    if (!activeEl) {
      pillEl.classList.remove("dash-nav-pill--ready");
      return;
    }
    navEl.style.setProperty("--pill-x", `${activeEl.offsetLeft}px`);
    navEl.style.setProperty("--pill-w", `${activeEl.offsetWidth}px`);
    pillEl.classList.add("dash-nav-pill--ready");
  }, []);

  // Đo vị trí tab đang active để đồng bộ pill khi đổi route hoặc đổi kích thước
  const syncPill = useCallback(() => {
    const activeIndex = TOP_NAV_ITEMS.findIndex((item) => isItemActive(item));
    movePillToIndex(activeIndex);
  }, [isItemActive, movePillToIndex]);

  useIsomorphicLayoutEffect(() => {
    syncPill();
    const navEl = navRef.current;
    if (!navEl || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => syncPill());
    observer.observe(navEl);
    window.addEventListener("resize", syncPill, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncPill);
    };
  }, [syncPill]);

  // Kích hoạt trượt pill ngay lập tức khi người dùng click tab (bỏ độ trễ chờ route)
  const handleNavClick = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>, item: NavTabItem, idx: number) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      movePillToIndex(idx);
      setPendingNav(
        isItemActive(item, pathname)
          ? null
          : { href: item.href, fromPathname: pathname },
      );
    },
    [isItemActive, movePillToIndex, pathname],
  );

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

  return (
    <>
      <header className="dash-topbar">
        <div className="dash-topbar-inner">
          {/* Logo KMA Overall */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flex: "none",
            }}
          >
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

          {/* 5 tab chính + 1 pill trượt bằng transform */}
          <nav
            ref={navRef}
            className="dash-topnav"
            aria-label="Điều hướng chính"
          >
            <span ref={pillRef} className="dash-nav-pill" aria-hidden="true" />
            {TOP_NAV_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              const active = isItemActive(item);
              return (
                <Link
                  key={item.href}
                  ref={(el) => {
                    linkRefs.current[idx] = el;
                  }}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item, idx)}
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

          {/* Cụm góc phải: Chuông hiện số chưa đọc + Avatar menu */}
          <div className="dash-topbar-end">
            <Link
              href="/dashboard/news"
              className="dash-icon-circle"
              aria-label={`Tin tức (${unreadNewsCount} tin chưa đọc)`}
              title={`Tin tức (${unreadNewsCount} tin chưa đọc)`}
            >
              <Bell size={17} />
              {unreadNewsCount > 0 && (
                <span className="dash-bell-count" aria-hidden="true">
                  {unreadNewsCount}
                </span>
              )}
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
                <span className="dash-avatar-circle">
                  {user.avatarInitials}
                </span>
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
                  <span style={{ fontSize: "0.78rem", color: "#5c5249" }}>
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
                  Hồ sơ
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
                  Về Home
                </Link>
                <Link
                  href="/login"
                  className="dash-dropdown-item"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogOut size={16} />
                  Đăng xuất
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
            borderBottom: "1px solid #e7dccb",
          }}
        >
          <strong
            style={{ fontFamily: "var(--dash-display)", fontSize: "1.1rem" }}
          >
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
            paddingTop: 8,
            borderTop: "1px solid #e7dccb",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#5c5249",
              padding: "4px 12px",
              textTransform: "uppercase",
            }}
          >
            Mục học tập
          </span>
          <Link
            href="/dashboard/gpa"
            className="dash-topnav-link"
            onClick={() => setDrawerOpen(false)}
          >
            <Calculator size={16} />
            <span>Tính GPA</span>
          </Link>
          <Link
            href="/dashboard/curriculum"
            className="dash-topnav-link"
            onClick={() => setDrawerOpen(false)}
          >
            <BookOpen size={16} />
            <span>Chương trình học</span>
          </Link>
          <Link
            href="/dashboard/library"
            className="dash-topnav-link"
            onClick={() => setDrawerOpen(false)}
          >
            <FolderKanban size={16} />
            <span>Thư viện tài liệu</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="dash-topnav-link"
            onClick={() => setDrawerOpen(false)}
          >
            <UserCircle2 size={16} />
            <span>Hồ sơ</span>
          </Link>
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 12,
            borderTop: "1px solid #e7dccb",
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
            Về Home
          </Link>
          <Link
            href="/login"
            className="dash-btn dash-btn--sm"
            onClick={() => setDrawerOpen(false)}
          >
            <LogOut size={15} />
            Đăng xuất
          </Link>
        </div>
      </aside>
    </>
  );
}
