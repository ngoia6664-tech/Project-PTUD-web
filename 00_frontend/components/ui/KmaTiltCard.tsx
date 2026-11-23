"use client";

import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useRef,
} from "react";
import Link from "next/link";

/**
 * Thẻ tương tác 3D tinh tế (Interactive 3D Tilt + Mouse-tracking Specular Sheen):
 * - Nghiêng nhẹ tối đa ±4.5° theo con trỏ chuột (perspective 900px).
 * - Cập nhật trực tiếp biến CSS trên DOM ref để đạt 60fps, không re-render React.
 * - Tự tắt hiệu ứng khi prefers-reduced-motion: reduce hoặc màn cảm ứng (pointer: coarse).
 */

interface KmaTiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  href?: string;
  as?: "div" | "article" | "section";
  maxTilt?: number;
  "aria-label"?: string;
}

export default function KmaTiltCard({
  children,
  className = "",
  style,
  href,
  as = "div",
  maxTilt = 4.2,
  "aria-label": ariaLabel,
}: KmaTiltCardProps) {
  const elRef = useRef<HTMLElement | null>(null);

  const canAnimate = useCallback(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
    if (window.matchMedia("(pointer: coarse)").matches) {
      return false;
    }
    return true;
  }, []);

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLElement>) => {
      const el = elRef.current;
      if (!el || !canAnimate()) return;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      const rx = (0.5 - py) * (maxTilt * 2);
      const ry = (px - 0.5) * (maxTilt * 2);

      el.style.setProperty("--tilt-rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--tilt-ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--tilt-ty", "-3px");
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    },
    [canAnimate, maxTilt],
  );

  const handleMouseLeave = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-rx", "0deg");
    el.style.setProperty("--tilt-ry", "0deg");
    el.style.setProperty("--tilt-ty", "0px");
  }, []);

  const combinedClass = `kma-tilt-card ${className}`.trim();

  if (href) {
    return (
      <Link
        ref={(node) => {
          elRef.current = node;
        }}
        href={href}
        className={combinedClass}
        style={style}
        aria-label={ariaLabel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </Link>
    );
  }

  if (as === "article") {
    return (
      <article
        ref={(node) => {
          elRef.current = node;
        }}
        className={combinedClass}
        style={style}
        aria-label={ariaLabel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </article>
    );
  }

  if (as === "section") {
    return (
      <section
        ref={(node) => {
          elRef.current = node;
        }}
        className={combinedClass}
        style={style}
        aria-label={ariaLabel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </section>
    );
  }

  return (
    <div
      ref={(node) => {
        elRef.current = node;
      }}
      className={combinedClass}
      style={style}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
