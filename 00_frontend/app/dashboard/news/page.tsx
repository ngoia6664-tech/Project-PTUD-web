"use client";

import { useState } from "react";
import {
  Award,
  Bookmark,
  Calendar,
  GraduationCap,
  Inbox,
  Loader2,
  Megaphone,
  Search,
} from "lucide-react";
import DashboardHero from "@/components/dashboard/DashboardHero";
import NewsCard from "@/components/dashboard/NewsCard";
import {
  MOCK_NEWS_RESPONSE,
  NEWS_CATEGORY_LABELS,
  type NewsCategory,
  type NewsPost,
} from "@/lib/mock/dashboard";

/**
 * Trang Tin tức trường (/dashboard/news) theo Ảnh 2:
 * Hero có ô tìm kiếm tích hợp -> hàng lọc loại tin & nút "Bài đã lưu" -> tin ghim nổi bật -> lưới 3 cột tin tức.
 * Có sẵn nút mô phỏng trạng thái đang tải và trạng thái rỗng.
 */

type NewsFilterValue = "all" | NewsCategory;

const CATEGORY_TABS: {
  value: NewsFilterValue;
  label: string;
  icon?: typeof GraduationCap;
}[] = [
  { value: "all", label: "Tất cả" },
  { value: "hoc-vu", label: NEWS_CATEGORY_LABELS["hoc-vu"], icon: GraduationCap },
  { value: "hoc-bong", label: NEWS_CATEGORY_LABELS["hoc-bong"], icon: Award },
  { value: "su-kien", label: NEWS_CATEGORY_LABELS["su-kien"], icon: Calendar },
  { value: "thong-bao", label: NEWS_CATEGORY_LABELS["thong-bao"], icon: Megaphone },
];

export default function DashboardNewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>(MOCK_NEWS_RESPONSE.data);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<NewsFilterValue>("all");
  const [onlySaved, setOnlySaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [simulateEmpty, setSimulateEmpty] = useState(false);

  function handleToggleRead(id: string) {
    setPosts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isRead: !item.isRead } : item,
      ),
    );
  }

  function handleToggleSaved(id: string) {
    setPosts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSaved: !item.isSaved } : item,
      ),
    );
  }

  function handleSimulateLoading() {
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 900);
  }

  const savedCount = posts.filter((p) => p.isSaved).length;
  const keyword = query.trim().toLowerCase();

  const visiblePosts = simulateEmpty
    ? []
    : posts
        .filter((item) => {
          if (category !== "all" && item.category !== category) return false;
          if (onlySaved && !item.isSaved) return false;
          if (!keyword) return true;
          return (
            item.title.toLowerCase().includes(keyword) ||
            item.summary.toLowerCase().includes(keyword) ||
            item.sourceName.toLowerCase().includes(keyword)
          );
        })
        .sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return (
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
        });

  const pinnedPost = visiblePosts.find((p) => p.isPinned) ?? null;
  const regularPosts = pinnedPost
    ? visiblePosts.filter((p) => p.id !== pinnedPost.id)
    : visiblePosts;

  return (
    <>
      <DashboardHero
        eyebrow="Tin tức sinh viên"
        titlePrefix="Tin tức"
        titleHighlight="KMA"
        subtitle="Cập nhật nhanh chóng các thông tin học vụ, học bổng, sự kiện và thông báo quan trọng dành cho sinh viên KMA."
      >
        <div className="dash-hero-search">
          <Search size={18} color="#63594f" />
          <input
            type="search"
            placeholder="Tìm kiếm tin tức (ví dụ: học bổng, đăng ký học, sự kiện...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Tìm kiếm tin tức"
          />
          <button
            type="button"
            className="dash-btn dash-btn--primary dash-btn--sm"
            onClick={() => setQuery((q) => q.trim())}
          >
            Tìm kiếm
          </button>
        </div>
      </DashboardHero>

      <main className="dash-main">
        <div className="dash-stack">
          {/* Hàng lọc danh mục + Bài đã lưu + nút mô phỏng trạng thái */}
          <div className="dash-news-filter-row">
            <div className="dash-chip-group" role="tablist" aria-label="Lọc theo loại tin">
              {CATEGORY_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    role="tab"
                    aria-selected={category === tab.value}
                    className={`dash-chip ${
                      category === tab.value ? "dash-chip--active" : ""
                    }`}
                    onClick={() => setCategory(tab.value)}
                  >
                    {Icon && <Icon size={15} />}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="dash-chip-group">
              <button
                type="button"
                aria-pressed={onlySaved}
                className={`dash-chip ${onlySaved ? "dash-chip--active" : ""}`}
                onClick={() => setOnlySaved((v) => !v)}
              >
                <Bookmark size={14} />
                Bài đã lưu: <strong>{savedCount}</strong>
              </button>

              <button
                type="button"
                className="dash-btn dash-btn--sm"
                onClick={handleSimulateLoading}
                disabled={isLoading}
              >
                <Loader2 size={14} className={isLoading ? "dash-spin" : undefined} />
                Đang tải
              </button>

              <button
                type="button"
                aria-pressed={simulateEmpty}
                className={`dash-btn dash-btn--sm ${
                  simulateEmpty ? "dash-btn--danger" : ""
                }`}
                onClick={() => setSimulateEmpty((v) => !v)}
              >
                <Inbox size={14} />
                {simulateEmpty ? "Tắt rỗng" : "Trạng thái rỗng"}
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="dash-skeleton-grid" aria-busy="true">
              <div className="dash-skeleton-card" />
              <div className="dash-skeleton-card" />
              <div className="dash-skeleton-card" />
            </div>
          ) : visiblePosts.length === 0 ? (
            <div className="dash-state-box">
              <Inbox size={34} color="#8b1218" />
              <strong style={{ color: "#1e1916" }}>
                Không có tin tức nào phù hợp
              </strong>
              <p style={{ margin: 0 }}>
                Thử đổi từ khóa tìm kiếm, chọn danh mục khác hoặc đặt lại bộ lọc.
              </p>
              <button
                type="button"
                className="dash-btn dash-btn--primary dash-btn--sm"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setOnlySaved(false);
                  setSimulateEmpty(false);
                }}
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <>
              {/* Tin ghim nổi bật ở trên cùng */}
              {pinnedPost && (
                <NewsCard
                  post={pinnedPost}
                  featured
                  onToggleRead={handleToggleRead}
                  onToggleSaved={handleToggleSaved}
                />
              )}

              {/* Lưới 3 cột các tin còn lại */}
              {regularPosts.length > 0 && (
                <div className="dash-news-grid">
                  {regularPosts.map((post) => (
                    <NewsCard
                      key={post.id}
                      post={post}
                      onToggleRead={handleToggleRead}
                      onToggleSaved={handleToggleSaved}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
