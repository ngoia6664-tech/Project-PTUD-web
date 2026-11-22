"use client";

import { AlertCircle, Inbox, RefreshCw } from "lucide-react";

/**
 * Các thành phần trạng thái dữ liệu dùng chung cho cả khu sinh viên (/dashboard)
 * và khu quản trị (/admin), kích hoạt qua `?demo=loading|empty|error` hoặc khi lọc rỗng.
 */

interface DataSkeletonProps {
  variant?: "cards" | "list" | "table" | "schedule";
  count?: number;
}

export function DataSkeleton({
  variant = "cards",
  count = 4,
}: DataSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === "table") {
    return (
      <div className="kma-skeleton-card" aria-busy="true" aria-label="Đang tải bảng dữ liệu">
        <div className="kma-skeleton-line kma-skeleton-line--short" />
        {items.map((idx) => (
          <div key={idx} className="kma-skeleton-row">
            <div className="kma-skeleton-line" />
            <div className="kma-skeleton-line" />
            <div className="kma-skeleton-line kma-skeleton-line--short" />
            <div className="kma-skeleton-line" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "schedule") {
    return (
      <div className="kma-skeleton-card" aria-busy="true" aria-label="Đang tải thời khóa biểu">
        <div className="kma-skeleton-line kma-skeleton-line--short" />
        <div className="kma-skeleton-grid">
          {items.map((idx) => (
            <div key={idx} className="kma-skeleton-block" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="kma-skeleton-list" aria-busy="true" aria-label="Đang tải danh sách">
        {items.map((idx) => (
          <div key={idx} className="kma-skeleton-card">
            <div className="kma-skeleton-line kma-skeleton-line--title" />
            <div className="kma-skeleton-line" />
            <div className="kma-skeleton-line kma-skeleton-line--short" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="kma-skeleton-grid" aria-busy="true" aria-label="Đang tải dữ liệu">
      {items.map((idx) => (
        <div key={idx} className="kma-skeleton-card">
          <div className="kma-skeleton-line kma-skeleton-line--short" />
          <div className="kma-skeleton-line kma-skeleton-line--title" />
          <div className="kma-skeleton-line" />
          <div className="kma-skeleton-line kma-skeleton-line--short" />
        </div>
      ))}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="kma-state-box" role="status">
      <div className="kma-state-icon" aria-hidden="true">
        <Inbox size={24} strokeWidth={1.75} />
      </div>
      <h3 className="kma-state-title">{title}</h3>
      <p className="kma-state-desc">{description}</p>
      {actionLabel && onAction && (
        <button type="button" className="kma-state-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
}

export function ErrorState({
  title = "Không thể tải dữ liệu",
  message = "Đã xảy ra sự cố kết nối tạm thời. Vui lòng thử tải lại dữ liệu.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="kma-state-box kma-state-box--error" role="alert">
      <div className="kma-state-icon" aria-hidden="true">
        <AlertCircle size={24} strokeWidth={1.75} />
      </div>
      <h3 className="kma-state-title">{title}</h3>
      <p className="kma-state-desc">{message}</p>
      <button type="button" className="kma-state-btn" onClick={onRetry}>
        <RefreshCw size={15} />
        Thử lại
      </button>
    </div>
  );
}
