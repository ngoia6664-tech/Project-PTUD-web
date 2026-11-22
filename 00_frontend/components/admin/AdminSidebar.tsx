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
 * Thanh sidebar trái của khu vực Quản trị (/admin):
 * - 7 mục điều hướng quản trị có aria-current="page".
 * - Một pill trượt dọc theo mục active bằng transform (--dash-indicator-ms: 600ms).
 * - Trên màn nhỏ thu gọn thành drawer (Q5).
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

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  // Lưu mục vừa click để đổi active & trượt pill ngay lập tức, không chờ route tải xong
  const [pendingNav, setPendingNav] = useState<{
    href: string;
    fromPathname: string;
  } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const effectivePath =
    pendingNav && pendingNav.fromPathname === pathname
      ? pendingNav.href
      : pathname;

  const isItemActive = useCallback(
    (item: (typeof ADMIN_NAV_ITEMS)[number], targetPath = effectivePath) =>
      item.exact ? targetPath === item.href : targetPath.startsWith(item.href),
    [effectivePath],
  );

  // Cập nhật ngay vị trí dọc pill theo chỉ số mục (không đợi requestAnimationFrame)
  const movePillToIndex = useCallback((index: number) => {
    const listEl = listRef.current;
    const pillEl = pillRef.current;
    if (!listEl || !pillEl) return;
    const activeEl = index >= 0 ? linkRefs.current[index] : null;
    if (!activeEl) {
      pillEl.classList.remove("admin-nav-pill--ready");
      return;
    }
    listEl.style.setProperty("--admin-pill-y", `${activeEl.offsetTop}px`);
    listEl.style.setProperty("--admin-pill-h", `${activeEl.offsetHeight}px`);
    pillEl.classList.add("admin-nav-pill--ready");
  }, []);

  // Đo vị trí dọc mục đang active để trượt 1 pill duy nhất bằng transform
  const syncPill = useCallback(() => {
    const activeIdx = ADMIN_NAV_ITEMS.findIndex((item) => isItemActive(item));
    movePillToIndex(activeIdx);
  }, [isItemActive, movePillToIndex]);

  useIsomorphicLayoutEffect(() => {
    syncPill();
    const listEl = listRef.current;
    if (!listEl || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => syncPill());
    observer.observe(listEl);
    return () => {
      observer.disconnect();
    };
  }, [syncPill]);

  const handleNavClick = useCallback(
    (
      e: ReactMouseEvent<HTMLAnchorElement>,
      item: (typeof ADMIN_NAV_ITEMS)[number],
      idx: number,
    ) => {
      onClose();
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
    [isItemActive, movePillToIndex, onClose, pathname],
  );

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

      <nav className="admin-nav" aria-label="Danh mục quản trị">
        <span className="admin-nav-group">Quản trị hệ thống</span>
        <div ref={listRef} className="admin-nav-list">
          <span
            ref={pillRef}
            className="admin-nav-pill"
            aria-hidden="true"
          />
          {ADMIN_NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              <Link
                key={item.href}
                ref={(el) => {
                  linkRefs.current[idx] = el;
                }}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`admin-nav-link ${
                  active ? "admin-nav-link--active" : ""
                }`}
                onClick={(e) => handleNavClick(e, item, idx)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
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
