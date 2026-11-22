import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  FolderKanban,
  Newspaper,
} from "lucide-react";
import AdminOverviewStats from "@/components/admin/AdminOverviewStats";
import AdminCharts from "@/components/admin/AdminCharts";
import {
  MOCK_ADMIN_LIBRARY_RESPONSE,
  MOCK_ADMIN_NEWS_RESPONSE,
  MOCK_ADMIN_OVERVIEW_RESPONSE,
  MOCK_CONTENT_DISTRIBUTION_RESPONSE,
  MOCK_MONTHLY_GROWTH_RESPONSE,
} from "@/lib/mock/admin";

/**
 * Trang Tổng quan Quản trị (/admin) theo đặc tả B1:
 * 4 KPI đếm số, 2 biểu đồ vẽ dần (Người dùng mới 6 tháng & Tài liệu theo khối ngành),
 * và khối "Cần xử lý" kèm lối tắt sang duyệt tài liệu & quản lý tin.
 */
export default function AdminOverviewPage() {
  const stats = MOCK_ADMIN_OVERVIEW_RESPONSE.data;
  const growth = MOCK_MONTHLY_GROWTH_RESPONSE.data;
  const distribution = MOCK_CONTENT_DISTRIBUTION_RESPONSE.data;
  const pendingDocs = MOCK_ADMIN_LIBRARY_RESPONSE.data.filter(
    (d) => d.status === "pending",
  );
  const hiddenNewsCount = MOCK_ADMIN_NEWS_RESPONSE.data.filter(
    (n) => !n.isVisible,
  ).length;
  const latestNews = MOCK_ADMIN_NEWS_RESPONSE.data.slice(0, 3);

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div>
          <h2 className="admin-page-title">
            Bảng điều khiển <span>Quản trị</span>
          </h2>
          <p className="admin-page-desc">
            Lần kéo tin tự động gần nhất:{" "}
            <strong className="admin-num">
              {new Date(stats.lastCrawlAt).toLocaleString("vi-VN")}
            </strong>{" "}
            (dữ liệu mẫu).
          </p>
        </div>

        <div className="admin-toolbar">
          <Link href="/admin/news" className="admin-btn admin-btn--primary admin-btn--sm">
            <Newspaper size={15} />
            Quản lý tin tức
          </Link>
          <Link href="/admin/schedule" className="admin-btn admin-btn--sm">
            <CalendarDays size={15} />
            Lịch học chung
          </Link>
        </div>
      </div>

      {/* 4 thẻ KPI đếm từ 0 */}
      <AdminOverviewStats stats={stats} />

      {/* 2 biểu đồ SVG vẽ dần 1 lần khi cuộn tới */}
      <AdminCharts growth={growth} distribution={distribution} />

      {/* Card Cần xử lý + Tin kéo về gần nhất */}
      <div className="admin-two-col kma-stagger">
        <section className="admin-card">
          <div className="admin-card-head">
            <h3 className="admin-card-title">
              <AlertCircle size={18} color="#8b1218" />
              Cần xử lý
            </h3>
            <Link href="/admin/library" className="admin-btn admin-btn--sm">
              Duyệt tài liệu
              <ArrowRight size={14} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <Link
              href="/admin/library"
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: "#fdf0f0",
                border: "1px solid rgba(139, 18, 24, 0.25)",
              }}
            >
              <strong className="admin-num" style={{ fontSize: "1.2rem", color: "#8b1218", display: "block" }}>
                {stats.pendingDocumentsCount}
              </strong>
              <span style={{ fontSize: "0.8rem", color: "#3a312b" }}>
                Tài liệu chờ duyệt
              </span>
            </Link>

            <Link
              href="/admin/news"
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: "#faf1df",
                border: "1px solid rgba(125, 86, 22, 0.28)",
              }}
            >
              <strong className="admin-num" style={{ fontSize: "1.2rem", color: "#7d5616", display: "block" }}>
                {hiddenNewsCount}
              </strong>
              <span style={{ fontSize: "0.8rem", color: "#3a312b" }}>
                Tin đang ẩn / chờ rà soát
              </span>
            </Link>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    <FolderKanban size={13} style={{ display: "inline", marginRight: 5 }} />
                    Tài liệu chờ duyệt mới nhất
                  </th>
                  <th>Môn</th>
                  <th>Người gửi</th>
                </tr>
              </thead>
              <tbody>
                {pendingDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 600 }}>{doc.title}</td>
                    <td>
                      <span className="admin-badge admin-badge--gold">
                        {doc.courseCode}
                      </span>
                    </td>
                    <td>{doc.uploadedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-head">
            <h3 className="admin-card-title">
              <Newspaper size={18} color="#8b1218" />
              Tin kéo về mới nhất
            </h3>
            <Link href="/admin/news" className="admin-btn admin-btn--sm">
              Xem tất cả
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {latestNews.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "#fbf6ec",
                  border: "1px solid #e7dccb",
                }}
              >
                <strong style={{ display: "block", fontSize: "0.86rem" }}>
                  {item.title}
                </strong>
                <span style={{ fontSize: "0.76rem", color: "#5c5249" }}>
                  {item.sourceName} •{" "}
                  <span className="admin-num">
                    {new Date(item.fetchedAt).toLocaleString("vi-VN")}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
