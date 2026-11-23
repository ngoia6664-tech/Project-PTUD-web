"use client";

import { type MouseEvent as ReactMouseEvent, useCallback, useRef } from "react";

/**
 * Banner đầu trang Tổng quan mang dấu ấn Học viện Kỹ thuật Mật mã (KMA):
 * - Hiệu ứng parallax 2 lớp rất nhẹ (±6px) theo con trỏ chuột trên desktop (tự tắt khi prefers-reduced-motion).
 * - Chấm nhịp thở vàng-đỏ cạnh nhãn học viện + khung ấn chương góc tinh tế.
 */

interface DashboardHeroProps {
  eyebrow?: string;
  titlePrefix: string;
  titleHighlight?: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function DashboardHero({
  eyebrow = "Học viện Kỹ thuật Mật mã",
  titlePrefix,
  titleHighlight,
  subtitle,
  children,
}: DashboardHeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLElement>) => {
    const el = heroRef.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;

    el.style.setProperty("--hero-px", `${(-dx * 12).toFixed(1)}px`);
    el.style.setProperty("--hero-py", `${(-dy * 8).toFixed(1)}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.setProperty("--hero-px", "0px");
    el.style.setProperty("--hero-py", "0px");
  }, []);

  return (
    <section
      ref={heroRef}
      className="dash-hero kma-seal-frame"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="dash-hero-art" aria-hidden="true" />
      <div className="dash-hero-fade" aria-hidden="true" />

      <div className="dash-hero-inner">
        <div className="dash-hero-copy">
          <span className="dash-eyebrow">
            <span className="kma-pulse-dot" aria-hidden="true" />
            {eyebrow}
          </span>
          <h1 className="dash-hero-title">
            {titlePrefix}
            {titleHighlight ? (
              <>
                {" "}
                <span>{titleHighlight}</span>
              </>
            ) : null}
          </h1>
          <p className="dash-hero-subtitle">{subtitle}</p>
          {children && <div className="dash-hero-extra">{children}</div>}
        </div>
      </div>
    </section>
  );
}
