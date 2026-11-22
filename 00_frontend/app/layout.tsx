import type { Metadata } from "next";
import { Be_Vietnam_Pro, Lora } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kma-body",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-kma-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KMA Overall — Cổng sinh viên Học viện Kỹ thuật Mật mã",
  description:
    "Nền tảng học tập, lịch học, tính GPA, thư viện tài liệu và tin tức dành cho sinh viên Học viện Kỹ thuật Mật mã (KMA).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
