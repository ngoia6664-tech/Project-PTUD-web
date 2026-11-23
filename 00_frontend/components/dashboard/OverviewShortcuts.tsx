"use client";

import { ArrowRight, Calculator, FileText, Swords } from "lucide-react";
import KmaTiltCard from "@/components/ui/KmaTiltCard";

/**
 * 3 thẻ lối tắt trang Tổng quan đúng đặc tả A1 với thẻ 3D tương tác (KmaTiltCard):
 * Tính GPA, Thư viện tài liệu và KMA Battle Royale.
 */

const SHORTCUTS = [
  {
    href: "/dashboard/gpa",
    title: "Tính GPA",
    desc: "Nhập điểm hệ 10, xem quy đổi hệ 4 tức thì và kiểm tra mục tiêu tốt nghiệp.",
    icon: Calculator,
    cta: "Mở bảng tính",
  },
  {
    href: "/dashboard/library",
    title: "Thư viện tài liệu",
    desc: "Tra cứu slide bài giảng, đề thi các năm và tài liệu ôn tập của KMA.",
    icon: FileText,
    cta: "Khám phá kho tài liệu",
  },
  {
    href: "/battleground",
    title: "KMA Battle Royale",
    desc: "Khu vực giải trí đấu trường theo lượt dành cho cộng đồng sinh viên KMA.",
    icon: Swords,
    cta: "Vào đấu trường",
  },
];

export default function OverviewShortcuts() {
  return (
    <section aria-label="Lối tắt nhanh">
      <div className="dash-section-head">
        <h2 className="dash-section-title">Lối tắt nhanh</h2>
      </div>

      <div className="dash-shortcuts-grid kma-stagger">
        {SHORTCUTS.map((item) => {
          const Icon = item.icon;
          return (
            <KmaTiltCard
              key={item.href}
              href={item.href}
              className="dash-feature-card"
            >
              <div className="dash-feature-head">
                <Icon size={18} color="#8b1218" strokeWidth={1.75} />
                <span>{item.title}</span>
              </div>
              <p className="dash-feature-desc">{item.desc}</p>
              <span
                style={{
                  marginTop: "auto",
                  paddingTop: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  color: "#8b1218",
                }}
              >
                {item.cta}
                <ArrowRight size={14} className="dash-cta-arrow" />
              </span>
            </KmaTiltCard>
          );
        })}
      </div>
    </section>
  );
}
