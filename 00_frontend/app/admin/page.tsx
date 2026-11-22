import Link from "next/link";
import { ArrowRight, CalendarDays, FolderKanban, Newspaper } from "lucide-react";
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
 * Trang Tổng quan Quản trị (/admin).
 * Hiển thị 4 thẻ chỉ số, 2 biểu đồ SVG thuần và lối tắt xử lý nhanh.
 */
export default function AdminOverviewPage() {
  const stats = MOCK_ADMIN_OVERVIEW_RESPONSE.data;
  const growth = MOCK_MONTHLY_GROWTH_RESPONSE.data;
  const distribution = MOCK_CONTENT_DISTRIBUTION_RESPONSE.data;
  const pendingDocs = MOCK_ADMIN_LIBRARY_RESPONSE.data.filter(
    (d) => d.status === "pending",
  );
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

      {/* 4 thẻ chỉ số chính */}
      <AdminOverviewStats stats={stats} />

      {/* 2 biểu đồ SVG/CSS thuần */}
      <AdminCharts growth={growth} distribution={distribution} />

      {/* Hai bảng tóm tắt nhanh: tài liệu chờ duyệt & tin kéo về gần nhất */}
      <div className="admin-two-col">
        <section className="admin-card">
          <div className="admin-card-head">
            <h3 className="admin-card-title">
              <FolderKanban size={18} color="#8b1218" />
              Tài liệu đang chờ duyệt ({pendingDocs.length})
            </h3>
            <Link href="/admin/library" className="admin-btn admin-btn--sm">
              Duyệt ngay
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tiêu đề tài liệu</th>
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
                  borderRadius: 12,
                  background: "#fbf6ec",
                  border: "1px solid #e5d9c6",
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
