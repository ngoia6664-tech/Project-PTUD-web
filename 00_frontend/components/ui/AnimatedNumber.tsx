"use client";

import { useEffect, useState } from "react";
import { useInViewOnce } from "./useInViewOnce";

/**
 * Hiển thị số KPI đếm mượt từ 0 tới giá trị đích ĐÚNG MỘT LẦN khi cuộn tới.
 * Nếu bật prefers-reduced-motion: hiển thị ngay giá trị cuối.
 */

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  locale?: boolean;
  durationMs?: number;
}

export default function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = false,
  durationMs = 780,
}: AnimatedNumberProps) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>(0.1);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!inView) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const id = requestAnimationFrame(() => setDisplayValue(value));
      return () => cancelAnimationFrame(id);
    }

    let rafId = 0;
    const startTime = performance.now();

    function step(now: number) {
      const t = Math.min(1, (now - startTime) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayValue(value * eased);
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    }

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, value, durationMs]);

  const formatted = locale
    ? Math.round(displayValue).toLocaleString("vi-VN")
    : decimals > 0
      ? displayValue.toFixed(decimals)
      : String(Math.round(displayValue));

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
