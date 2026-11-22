"use client";

import { useState } from "react";
import AdminNewsTable from "@/components/admin/AdminNewsTable";
import AdminNewsSourceConfig from "@/components/admin/AdminNewsSourceConfig";
import {
  DataSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/DataStates";
import { useDemoState } from "@/components/ui/useDemoState";
import type { NewsCategory } from "@/lib/mock/dashboard";
import {
  MOCK_ADMIN_NEWS_RESPONSE,
  MOCK_NEWS_SOURCES_RESPONSE,
  type AdminNewsItem,
  type NewsSourceConfig,
} from "@/lib/mock/admin";

/**
 * Trang Quản lý Tin tức & Nguồn tin (/admin/news).
 * Hỗ trợ trạng thái dữ liệu qua ?demo=loading|empty|error.
 */
export default function AdminNewsPage() {
  const { demoMode, retryDemo } = useDemoState();
  const [newsList, setNewsList] = useState<AdminNewsItem[]>(
    MOCK_ADMIN_NEWS_RESPONSE.data,
  );
  const [sources, setSources] = useState<NewsSourceConfig[]>(
    MOCK_NEWS_SOURCES_RESPONSE.data,
  );
  const [isCrawling, setIsCrawling] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function showNotice(text: string) {
    setNotice(text);
    window.setTimeout(() => setNotice(null), 3200);
  }

  function handleToggleVisible(id: string) {
    setNewsList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item,
      ),
    );
  }

  function handleTogglePinned(id: string) {
    setNewsList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item,
      ),
    );
  }

  function handleChangeCategory(id: string, category: NewsCategory) {
    setNewsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, category } : item)),
    );
  }

  function handleToggleSource(id: string) {
    setSources((prev) =>
      prev.map((src) =>
        src.id === id ? { ...src, enabled: !src.enabled } : src,
      ),
    );
  }

  function handleUpdateInterval(id: string, intervalMinutes: number) {
    setSources((prev) =>
      prev.map((src) => (src.id === id ? { ...src, intervalMinutes } : src)),
    );
    showNotice("Đã cập nhật chu kỳ kéo tin (giao diện mẫu).");
  }

  function handleAddSource(
    name: string,
    url: string,
    intervalMinutes: number,
  ) {
    setSources((prev) => [
      ...prev,
      {
        id: `src_${Date.now()}`,
        name,
        url,
        intervalMinutes,
        enabled: true,
        lastSyncedAt: new Date().toISOString(),
      },
    ]);
    showNotice(`Đã thêm nguồn tin "${name}" (dữ liệu mẫu).`);
  }

  function handleTriggerCrawl() {
    setIsCrawling(true);
    window.setTimeout(() => {
      setIsCrawling(false);
      showNotice(
        "Đã mô phỏng lệnh Kéo tin ngay (chưa kết nối crawler backend thật).",
      );
    }, 800);
  }

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div>
          <h2 className="admin-page-title">
            Quản lý <span>Tin tức</span>
          </h2>
          <p className="admin-page-desc">
            Kiểm soát hiển thị, ghim bài, phân loại tin và cấu hình danh sách nguồn kéo tin tự động.
          </p>
        </div>
      </div>

      {notice && (
        <div className="admin-toast" role="status">
          {notice}
        </div>
      )}

      {demoMode === "loading" ? (
        <DataSkeleton variant="table" count={5} />
      ) : demoMode === "error" ? (
        <ErrorState
          title="Không thể tải danh sách tin tức"
          message="Hệ thống chưa lấy được dữ liệu từ bảng tin quản trị. Vui lòng thử lại."
          onRetry={retryDemo}
        />
      ) : demoMode === "empty" ? (
        <EmptyState
          title="Chưa có bản tin nào được kéo về"
          description="Nhấn Kéo tin ngay hoặc kiểm tra cấu hình nguồn tin để đồng bộ bài viết mới."
          actionLabel="Tải lại dữ liệu mẫu"
          onAction={retryDemo}
        />
      ) : (
        <div className="admin-two-col">
          <AdminNewsTable
            items={newsList}
            onToggleVisible={handleToggleVisible}
            onTogglePinned={handleTogglePinned}
            onChangeCategory={handleChangeCategory}
          />

          <AdminNewsSourceConfig
            sources={sources}
            onToggleSource={handleToggleSource}
            onUpdateInterval={handleUpdateInterval}
            onAddSource={handleAddSource}
            onTriggerCrawl={handleTriggerCrawl}
            isCrawling={isCrawling}
          />
        </div>
      )}
    </div>
  );
}
