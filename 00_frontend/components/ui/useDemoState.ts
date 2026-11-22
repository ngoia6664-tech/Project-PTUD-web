"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook đọc trạng thái demo từ query string `?demo=loading|empty|error`.
 * Không dùng nút công tắc demo trên giao diện (theo đặc tả Q7).
 * Hoạt động an toàn với Next.js 16 Cache Components (static prerender).
 */

export type DemoMode = "normal" | "loading" | "empty" | "error";

function readDemoModeFromUrl(): DemoMode {
  if (typeof window === "undefined") return "normal";
  const param = new URLSearchParams(window.location.search).get("demo");
  if (param === "loading" || param === "empty" || param === "error") {
    return param;
  }
  return "normal";
}

export function useDemoState() {
  const pathname = usePathname();
  const [mode, setMode] = useState<DemoMode>("normal");

  useEffect(() => {
    const sync = () => setMode(readDemoModeFromUrl());
    const id = requestAnimationFrame(sync);
    window.addEventListener("popstate", sync);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("popstate", sync);
    };
  }, [pathname]);

  function retry() {
    setMode("normal");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("demo");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }

  return { demoMode: mode, retryDemo: retry };
}
