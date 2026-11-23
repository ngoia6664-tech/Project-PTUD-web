"use client";

import Image from "next/image";
import {
  Award,
  Bookmark,
  BookOpen,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Megaphone,
  Pin,
  Shield,
  Sparkles,
} from "lucide-react";
import { NEWS_CATEGORY_LABELS, type NewsPost } from "@/lib/mock/dashboard";
import KmaTiltCard from "@/components/ui/KmaTiltCard";

/**
 * Thẻ tin tức cho trang /dashboard/news theo Ảnh 2:
 * - Tin ghim (isPinned) hiển thị dạng ngang nổi bật ở trên cùng kèm ảnh hội trường KMA
 * - Các tin còn lại hiển thị dạng lưới 3 cột với khung ảnh chủ đề, nhãn "Mới", nút Lưu, Đánh dấu đã đọc và "Xem bài gốc"
 */

interface NewsCardProps {
  post: NewsPost;
  featured?: boolean;
  onToggleRead: (id: string) => void;
  onToggleSaved: (id: string) => void;
}

const THUMB_ICON = {
  ceremony: Sparkles,
  scholarship: Award,
  academic: BookOpen,
  event: Calendar,
  notice: Megaphone,
};

export default function NewsCard({
  post,
  featured = false,
  onToggleRead,
  onToggleSaved,
}: NewsCardProps) {
  const dateText = new Date(post.publishedAt).toLocaleDateString("vi-VN");
  const ThumbIcon = THUMB_ICON[post.coverTheme];

  if (featured) {
    return (
      <KmaTiltCard
        as="article"
        maxTilt={2.4}
        className={`dash-news-pinned ${post.isRead ? "dash-news-card--read" : ""}`}
      >
        <Image
          src="/assets/kma-news-ceremony.jpg"
          alt="Minh họa sự kiện Học viện Kỹ thuật Mật mã"
          width={620}
          height={364}
          className="dash-news-pinned-thumb"
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="dash-badge dash-badge--gold">
              <Pin size={12} />
              Ghim
            </span>
            {post.isNew && (
              <span className="dash-badge dash-badge--crimson">Mới</span>
            )}
            <span className="dash-badge dash-badge--crimson-soft">
              {NEWS_CATEGORY_LABELS[post.category]}
            </span>
          </div>

          <h2
            style={{
              margin: 0,
              fontFamily: "var(--dash-display)",
              fontSize: "1.42rem",
              lineHeight: 1.25,
            }}
          >
            {post.title}
          </h2>

          <p style={{ margin: 0, color: "#6e6359", fontSize: "0.9rem" }}>
            {post.summary}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: "0.8rem",
              color: "#6e6359",
              marginTop: 4,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Shield size={14} color="#8b1218" />
              {post.sourceName}
            </span>
            <span>|</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Calendar size={14} />
              {dateText}
            </span>
          </div>
        </div>

        <div className="dash-news-pinned-actions">
          <button
            type="button"
            aria-pressed={post.isSaved}
            className={`dash-ghost-action ${
              post.isSaved ? "dash-ghost-action--active" : ""
            }`}
            onClick={() => onToggleSaved(post.id)}
          >
            <Bookmark size={15} fill={post.isSaved ? "currentColor" : "none"} />
            {post.isSaved ? "Đã lưu" : "Lưu"}
          </button>

          <button
            type="button"
            aria-pressed={post.isRead}
            className={`dash-ghost-action ${
              post.isRead ? "dash-ghost-action--active" : ""
            }`}
            onClick={() => onToggleRead(post.id)}
          >
            <CheckCircle2 size={15} />
            {post.isRead ? "Đã đọc" : "Đánh dấu đã đọc"}
          </button>

          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="dash-btn dash-btn--outline-crimson dash-btn--sm"
          >
            Xem bài gốc
            <ExternalLink size={14} />
          </a>
        </div>
      </KmaTiltCard>
    );
  }

  return (
    <article
      className={`dash-card dash-card--hover dash-news-card ${
        post.isRead ? "dash-news-card--read" : ""
      }`}
    >
      <div className="dash-news-card-body">
        <div className={`dash-news-thumb dash-news-thumb--${post.coverTheme}`}>
          <ThumbIcon size={26} />
          <span>{NEWS_CATEGORY_LABELS[post.category]}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {post.isNew && (
              <span className="dash-badge dash-badge--crimson">Mới</span>
            )}
            <span className="dash-badge dash-badge--gold">
              {NEWS_CATEGORY_LABELS[post.category]}
            </span>
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: "0.95rem",
              fontWeight: 700,
              lineHeight: 1.35,
            }}
          >
            {post.title}
          </h3>

          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              color: "#6e6359",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.summary}
          </p>

          <div
            style={{
              marginTop: "auto",
              fontSize: "0.75rem",
              color: "#63594f",
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span>{post.sourceName}</span>
            <span>• {dateText}</span>
          </div>
        </div>
      </div>

      <div className="dash-news-card-footer">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            type="button"
            aria-pressed={post.isSaved}
            className={`dash-ghost-action ${
              post.isSaved ? "dash-ghost-action--active" : ""
            }`}
            onClick={() => onToggleSaved(post.id)}
          >
            <Bookmark size={14} fill={post.isSaved ? "currentColor" : "none"} />
            {post.isSaved ? "Đã lưu" : "Lưu"}
          </button>

          <button
            type="button"
            aria-pressed={post.isRead}
            className={`dash-ghost-action ${
              post.isRead ? "dash-ghost-action--active" : ""
            }`}
            onClick={() => onToggleRead(post.id)}
          >
            <CheckCircle2 size={14} />
            {post.isRead ? "Đã đọc" : "Đánh dấu đọc"}
          </button>
        </div>

        <a
          href={post.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="dash-btn dash-btn--outline-crimson dash-btn--sm"
        >
          Xem bài gốc
          <ExternalLink size={13} />
        </a>
      </div>
    </article>
  );
}
