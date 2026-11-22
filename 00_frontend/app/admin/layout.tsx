import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import AdminShell from "@/components/admin/AdminShell";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-admin-body",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
  variable: "--font-admin-display",
  display: "swap",
});

/**
 * Layout riêng cho toàn bộ khu vực Quản trị (/admin/*).
 * TODO: bảo vệ route theo vai trò (chỉ cho phép tài khoản có role === "admin"
 *       truy cập; nếu chưa đăng nhập hoặc là sinh viên thì chuyển hướng về /login hoặc /dashboard).
 */

export const metadata: Metadata = {
  title: "KMA Overall — Quản trị hệ thống",
  description:
    "Bảng điều khiển quản trị người dùng, tin tức, lịch học, môn học, thư viện và thang điểm KMA Overall",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell
      fontClassName={`${beVietnamPro.variable} ${playfairDisplay.variable}`}
    >
      {children}
    </AdminShell>
  );
}
