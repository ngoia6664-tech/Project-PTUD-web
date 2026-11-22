import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import DashboardShell from "@/components/dashboard/DashboardShell";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dash-body",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
  variable: "--font-dash-display",
  display: "swap",
});

/**
 * Layout riêng cho toàn bộ khu vực sinh viên (/dashboard/*).
 * TODO: bảo vệ route theo vai trò (kiểm tra phiên đăng nhập và role === "student"
 *       trước khi cho truy cập, nếu chưa đăng nhập thì chuyển hướng về /login).
 */

export const metadata: Metadata = {
  title: "KMA Overall — Cổng sinh viên",
  description: "Dashboard học tập, lịch học, tính GPA và tin tức cho sinh viên Học viện KMA",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      fontClassName={`${beVietnamPro.variable} ${playfairDisplay.variable}`}
    >
      {children}
    </DashboardShell>
  );
}
