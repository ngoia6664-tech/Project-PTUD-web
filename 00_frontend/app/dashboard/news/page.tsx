"use client";

import { useState } from "react";
import {
  Award,
  Bookmark,
  Calendar,
  EyeOff,
  GraduationCap,
  Megaphone,
  Search,
} from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import NewsCard from "@/components/dashboard/NewsCard";
import {
  DataSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/DataStates";
import { useDemoState } from "@/components/ui/useDemoState";
import {
  MOCK_NEWS_RESPONSE,
  NEWS_CATEGORY_LABELS,
  type NewsCategory,
  type NewsPost,
} from "@/lib/mock/dashboard";

/**
 * Trang Tin tức trường (/dashboard/news) theo đặc tả A2:
 * - Page header gọn (Q1) + ô tìm kiếm
 * - Chip lọc (Tất cả, Học vụ, Học bổng, Sự kiện, Thông báo chung)
 * - Tin ghim lớn trên cùng + lưới 2 cột thẻ tin gọn + cột phải "Đã lưu" & "Chưa đọc"
 * - Trạng thái dữ liệu chỉ bật qua ?demo=loading|empty|error (KHÔNG có nút công tắc demo trên UI).
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
  const { demoMode, retryDemo } = useDemoState();
  const [posts, setPosts] = useState<NewsPost[]>(MOCK_NEWS_RESPONSE.data);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<NewsFilterValue>("all");
  const [onlySaved, setOnlySaved] = useState(false);

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

  const savedPosts = posts.filter((p) => p.isSaved);
  const unreadPosts = posts.filter((p) => !p.isRead);
  const keyword = query.trim().toLowerCase();

  const visiblePosts = posts
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

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setOnlySaved(false);
    retryDemo();
  }

  return (
    <>
      <DashboardPageHeader
        breadcrumbs={[
          { label: "Tổng quan", href: "/dashboard" },
          { label: "Tin tức" },
        ]}
        title="Tin tức"
        titleHighlight="KMA"
        description="Thông báo học vụ, học bổng, sự kiện và tin mới nhất từ Học viện Kỹ thuật Mật mã."
        actions={
          <div className="dash-hero-search" style={{ minWidth: 280 }}>
            <Search size={16} color="#5c5249" />
            <input
              type="search"
              placeholder="Tìm tin tức, học bổng..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Tìm kiếm tin tức"
            />
          </div>
        }
      />

      <main className="dash-main">
        <div className="dash-stack">
          {/* Hàng chip lọc theo loại tin */}
          <div className="dash-news-filter-row">
            <div
              className="dash-chip-group"
              role="tablist"
              aria-label="Lọc theo loại tin"
            >
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

            <button
              type="button"
              aria-pressed={onlySaved}
              className={`dash-chip ${onlySaved ? "dash-chip--active" : ""}`}
              onClick={() => setOnlySaved((v) => !v)}
            >
              <Bookmark size={14} />
              Bài đã lưu: <strong>{savedPosts.length}</strong>
            </button>
          </div>

          {demoMode === "loading" ? (
            <DataSkeleton variant="cards" count={4} />
          ) : demoMode === "error" ? (
            <ErrorState
              title="Không thể tải tin tức KMA"
              message="Hệ thống chưa kết nối được với nguồn tin Học viện. Vui lòng thử lại."
              onRetry={retryDemo}
            />
          ) : demoMode === "empty" || visiblePosts.length === 0 ? (
            <EmptyState
              title="Chưa có tin tức phù hợp"
              description="Thử thay đổi từ khóa tìm kiếm hoặc đặt lại bộ lọc danh mục để xem tất cả thông báo."
              actionLabel="Đặt lại bộ lọc"
              onAction={resetFilters}
            />
          ) : (
            <div className="dash-news-layout">
              <div className="dash-stack" style={{ gap: 18 }}>
                {pinnedPost && (
                  <NewsCard
                    post={pinnedPost}
                    featured
                    onToggleRead={handleToggleRead}
                    onToggleSaved={handleToggleSaved}
                  />
                )}

                {regularPosts.length > 0 && (
                  <div className="dash-news-grid-2 kma-stagger">
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
              </div>

              {/* Cột phải: Đã lưu + Chưa đọc theo đặc tả A2 */}
              <aside className="dash-stack" style={{ gap: 16 }}>
                <section className="dash-card">
                  <div className="dash-card-head" style={{ marginBottom: 12 }}>
                    <h2 className="dash-card-title" style={{ fontSize: "1.02rem" }}>
                      <Bookmark size={17} color="#8b1218" />
                      Đã lưu ({savedPosts.length})
                    </h2>
                  </div>

                  {savedPosts.length === 0 ? (
                    <p style={{ margin: 0, fontSize: "0.84rem", color: "#5c5249" }}>
                      Chưa có bài viết nào được lưu.
                    </p>
                  ) : (
                    <div className="dash-mini-news-list">
                      {savedPosts.map((item) => (
                        <a
                          key={item.id}
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dash-mini-news-item"
                        >
                          <strong style={{ fontSize: "0.84rem" }}>
                            {item.title}
                          </strong>
                          <span style={{ fontSize: "0.75rem", color: "#5c5249" }}>
                            {item.sourceName}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </section>

                <section className="dash-card">
                  <div className="dash-card-head" style={{ marginBottom: 12 }}>
                    <h2 className="dash-card-title" style={{ fontSize: "1.02rem" }}>
                      <EyeOff size={17} color="#7d5616" />
                      Chưa đọc ({unreadPosts.length})
                    </h2>
                  </div>

                  {unreadPosts.length === 0 ? (
                    <p style={{ margin: 0, fontSize: "0.84rem", color: "#156843" }}>
                      Bạn đã đọc tất cả tin tức mới.
                    </p>
                  ) : (
                    <div className="dash-mini-news-list">
                      {unreadPosts.slice(0, 4).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="dash-mini-news-item"
                          style={{ textAlign: "left", cursor: "pointer" }}
                          onClick={() => handleToggleRead(item.id)}
                        >
                          <strong style={{ fontSize: "0.84rem" }}>
                            {item.title}
                          </strong>
                          <span style={{ fontSize: "0.75rem", color: "#8b1218" }}>
                            Nhấn để đánh dấu đã đọc
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
