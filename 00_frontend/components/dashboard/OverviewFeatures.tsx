import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  FileText,
  Gamepad2,
} from "lucide-react";

/**
 * Khối 5 thẻ "Tiện ích nổi bật" ngay trên trang Tổng quan theo Ảnh 1,
 * bao gồm thẻ dẫn nhanh tới Lịch học, Tính GPA, Chương trình học, Thư viện và KMA Battle Royale.
 */

const FEATURES = [
  {
    href: "/dashboard/schedule",
    title: "Lịch học thông minh",
    desc: "Theo dõi và quản lý lịch học tuần, lịch tự học cá nhân.",
    icon: CalendarDays,
  },
  {
    href: "/dashboard/gpa",
    title: "Tính GPA & học tập",
    desc: "Tính điểm, đặt mục tiêu và ước lượng điểm các môn còn lại.",
    icon: BarChart3,
  },
  {
    href: "/dashboard/curriculum",
    title: "Chương trình học",
    desc: "Tra cứu môn học theo kỳ, trạng thái và tiến độ tín chỉ.",
    icon: BookOpen,
  },
  {
    href: "/dashboard/library",
    title: "Thư viện tài liệu",
    desc: "Slide bài giảng, đề thi và tài liệu ôn tập của KMA.",
    icon: FileText,
  },
  {
    href: "/battleground",
    title: "KMA Battle Royale",
    desc: "Sân chơi giải trí theo lượt cho cộng đồng sinh viên KMA.",
    icon: Gamepad2,
  },
];

export default function OverviewFeatures() {
  return (
    <section aria-label="Tiện ích nổi bật">
      <div className="dash-section-head">
        <h2 className="dash-section-title">Tiện ích nổi bật</h2>
        <Link
          href="/dashboard/study"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: "0.84rem",
            fontWeight: 600,
            color: "#8b1218",
          }}
        >
          Xem góc học tập
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="dash-features-grid">
        {FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="dash-feature-card"
            >
              <div className="dash-feature-head">
                <Icon size={18} color="#8b1218" />
                <span>{item.title}</span>
              </div>
              <p className="dash-feature-desc">{item.desc}</p>
              <span className="dash-feature-art" aria-hidden="true">
                <Icon size={34} strokeWidth={1.5} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
