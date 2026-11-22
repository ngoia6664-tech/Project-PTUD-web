import Link from "next/link";
import { Newspaper, Pin } from "lucide-react";
import { NEWS_CATEGORY_LABELS, type NewsPost } from "@/lib/mock/dashboard";

/**
 * Khối hiển thị 3 tin tức mới nhất từ Học viện trên trang Tổng quan (/dashboard).
 */

interface LatestNewsCardProps {
  posts: NewsPost[];
}

export default function LatestNewsCard({ posts }: LatestNewsCardProps) {
  return (
    <section className="dash-card">
      <div className="dash-card-head">
        <h2 className="dash-card-title">
          <Newspaper size={19} color="#8b1218" />
          3 tin mới nhất
        </h2>
        <Link
          href="/dashboard/news"
          className="dash-btn dash-btn--outline-crimson dash-btn--sm"
        >
          Tất cả tin
        </Link>
      </div>

      <div className="dash-mini-news-list">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.id}
            href="/dashboard/news"
            className="dash-mini-news-item"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {post.isPinned && (
                <span className="dash-badge dash-badge--gold">
                  <Pin size={11} />
                  Ghim
                </span>
              )}
              {post.isNew && (
                <span className="dash-badge dash-badge--crimson">Mới</span>
              )}
              <span className="dash-badge">
                {NEWS_CATEGORY_LABELS[post.category]}
              </span>
            </div>
            <strong style={{ fontSize: "0.9rem", color: "#1e1916" }}>
              {post.title}
            </strong>
            <span style={{ fontSize: "0.76rem", color: "#6e6359" }}>
              {post.sourceName} •{" "}
              {new Date(post.publishedAt).toLocaleDateString("vi-VN")}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
