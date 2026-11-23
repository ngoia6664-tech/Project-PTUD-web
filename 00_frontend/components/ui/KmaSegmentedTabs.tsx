"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

/**
 * Bộ tab lọc nội bộ có 1 pill đỏ trượt mượt bằng transform (đồng bộ với Top Navbar).
 * Dùng cho bộ lọc danh mục Tin tức, chuyển chế độ Tuần/Ngày Lịch học, lọc vai trò/ngành Admin.
 */

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface KmaSegmentedTabsProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function KmaSegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className = "",
}: KmaSegmentedTabsProps<T>) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const syncPill = useCallback(() => {
    const wrapEl = wrapRef.current;
    const pillEl = pillRef.current;
    if (!wrapEl || !pillEl) return;

    const idx = options.findIndex((o) => o.value === value);
    const activeEl = idx >= 0 ? btnRefs.current[idx] : null;
    if (!activeEl) {
      pillEl.classList.remove("kma-seg-pill--ready");
      return;
    }

    wrapEl.style.setProperty("--seg-x", `${activeEl.offsetLeft}px`);
    wrapEl.style.setProperty("--seg-y", `${activeEl.offsetTop}px`);
    wrapEl.style.setProperty("--seg-w", `${activeEl.offsetWidth}px`);
    wrapEl.style.setProperty("--seg-h", `${activeEl.offsetHeight}px`);
    pillEl.classList.add("kma-seg-pill--ready");
  }, [options, value]);

  useIsomorphicLayoutEffect(() => {
    syncPill();
    const wrapEl = wrapRef.current;
    if (!wrapEl || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => syncPill());
    observer.observe(wrapEl);
    window.addEventListener("resize", syncPill, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncPill);
    };
  }, [syncPill]);

  return (
    <div
      ref={wrapRef}
      role="tablist"
      aria-label={ariaLabel}
      className={`kma-seg-tabs ${className}`.trim()}
    >
      <span ref={pillRef} className="kma-seg-pill" aria-hidden="true" />
      {options.map((opt, idx) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              btnRefs.current[idx] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            className={`kma-seg-btn ${active ? "kma-seg-btn--active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
