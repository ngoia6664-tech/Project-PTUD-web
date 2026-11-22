"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Download,
  Heart,
  Layers,
  Search,
  Upload,
} from "lucide-react";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import LibraryCard from "@/components/dashboard/LibraryCard";
import {
  DataSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/DataStates";
import { useDemoState } from "@/components/ui/useDemoState";
import { MOCK_LIBRARY_RESPONSE, type DocumentItem } from "@/lib/mock/dashboard";

/**
 * Trang Thư viện tài liệu (/dashboard/library) theo đặc tả A7:
 * - Page header gọn + 3 số liệu nhỏ + nút "Đóng góp tài liệu"
 * - Banner "Tài liệu nổi bật" mảnh (<= 120px)
 * - Thanh lọc dính khi cuộn (tìm, Môn, Loại, Yêu thích, sắp xếp)
 * - Lưới thẻ tài liệu + hỗ trợ ?demo=loading|empty|error.
 */
export default function DashboardLibraryPage() {
  const { demoMode, retryDemo } = useDemoState();
  const [docs, setDocs] = useState<DocumentItem[]>(MOCK_LIBRARY_RESPONSE.data);
  const [query, setQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState<"downloads" | "newest">("downloads");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showContribute, setShowContribute] = useState(false);
  const [contribTitle, setContribTitle] = useState("");
  const [contribNotice, setContribNotice] = useState<string | null>(null);

  const courseOptions = Array.from(
    new Map(docs.map((d) => [d.courseCode, d.courseName])).entries(),
  );

  function handleToggleFavorite(id: string) {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d)),
    );
  }

  function handleSubmitContribute(e: React.FormEvent) {
    e.preventDefault();
    if (!contribTitle.trim()) return;
    setContribNotice(
      `Đã gửi tài liệu "${contribTitle.trim()}" vào hàng chờ duyệt của quản trị viên (giao diện mẫu).`,
    );
    setContribTitle("");
    setShowContribute(false);
    window.setTimeout(() => setContribNotice(null), 3500);
  }

  const keyword = query.trim().toLowerCase();
  const filteredDocs = docs
    .filter((doc) => {
      if (selectedCourse !== "all" && doc.courseCode !== selectedCourse) {
        return false;
      }
      if (selectedType !== "all" && doc.fileType !== selectedType) {
        return false;
      }
      if (onlyFavorites && !doc.isFavorite) return false;
      if (!keyword) return true;
      return (
        doc.title.toLowerCase().includes(keyword) ||
        doc.courseName.toLowerCase().includes(keyword) ||
        doc.courseCode.toLowerCase().includes(keyword) ||
        doc.uploadedBy.toLowerCase().includes(keyword)
      );
    })
    .sort((a, b) =>
      sortBy === "downloads"
        ? b.downloads - a.downloads
        : b.uploadedAt.localeCompare(a.uploadedAt),
    );

  function resetFilters() {
    setQuery("");
    setSelectedCourse("all");
    setSelectedType("all");
    setOnlyFavorites(false);
    retryDemo();
  }

  return (
    <>
      <DashboardPageHeader
        breadcrumbs={[
          { label: "Tổng quan", href: "/dashboard" },
          { label: "Học tập", href: "/dashboard/study" },
          { label: "Thư viện tài liệu" },
        ]}
        title="Thư viện"
        titleHighlight="tài liệu"
        description="Kho bài giảng, slide, đề thi các năm và tài liệu ôn tập chính thống dành cho sinh viên KMA."
        meta={
          <>
            <span className="dash-header-stat">
              <Layers size={14} color="#7d5616" />
              <strong>5.428+</strong> tài liệu
            </span>
            <span className="dash-header-stat">
              <BookOpen size={14} color="#7d5616" />
              <strong>62</strong> môn học
            </span>
            <span className="dash-header-stat">
              <Download size={14} color="#7d5616" />
              <strong>186.320+</strong> lượt tải
            </span>
          </>
        }
        actions={
          <button
            type="button"
            className="dash-btn dash-btn--primary dash-btn--sm"
            onClick={() => setShowContribute((v) => !v)}
          >
            <Upload size={14} />
            Đóng góp tài liệu
          </button>
        }
      />

      <main className="dash-main">
        <div className="dash-stack">
          {contribNotice && (
            <div className="dash-toast" role="status">
              {contribNotice}
            </div>
          )}

          {/* Form đóng góp tài liệu chờ duyệt (đặc tả A7) */}
          {showContribute && (
            <form
              className="dash-card dash-stack"
              style={{ gap: 12 }}
              onSubmit={handleSubmitContribute}
            >
              <h2 className="dash-card-title" style={{ fontSize: "1.05rem" }}>
                Đóng góp tài liệu mới (Chờ quản trị viên duyệt)
              </h2>
              <div className="dash-form-grid">
                <label className="dash-field">
                  <span className="dash-label">Tiêu đề tài liệu *</span>
                  <input
                    type="text"
                    className="dash-input"
                    required
                    placeholder="VD: Tổng hợp đề cương ôn tập Mạng máy tính"
                    value={contribTitle}
                    onChange={(e) => setContribTitle(e.target.value)}
                  />
                </label>
                <label className="dash-field">
                  <span className="dash-label">Tệp đính kèm (mô phỏng)</span>
                  <input type="file" className="dash-input" />
                </label>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="dash-btn dash-btn--sm"
                  onClick={() => setShowContribute(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="dash-btn dash-btn--primary dash-btn--sm"
                >
                  Gửi chờ duyệt
                </button>
              </div>
            </form>
          )}

          {/* Banner "Tài liệu nổi bật" mảnh (<= 120px theo đặc tả A7) */}
          <section className="dash-crimson-banner dash-crimson-banner--compact">
            <div>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#f5dfae",
                  textTransform: "uppercase",
                }}
              >
                Tài liệu nổi bật
              </span>
              <h3>Bộ bài giảng chuyên ngành An toàn thông tin</h3>
              <p style={{ fontSize: "0.84rem" }}>
                Khoa An toàn thông tin • PDF • 12 chương • 24.891 lượt tải
              </p>
            </div>

            <button
              type="button"
              className="dash-btn dash-btn--cream dash-btn--sm"
              onClick={() => setSelectedCourse("AT1811")}
            >
              Xem ngay
              <ArrowRight size={14} />
            </button>
          </section>

          {/* Thanh lọc dính khi cuộn (đặc tả A7) */}
          <div className="dash-card dash-library-sticky-bar">
            <div style={{ position: "relative", flex: 1, minWidth: 210 }}>
              <Search
                size={16}
                color="#5c5249"
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                type="search"
                className="dash-input"
                style={{ paddingLeft: 36 }}
                placeholder="Tìm tài liệu, môn học, tác giả..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Tìm kiếm tài liệu"
              />
            </div>

            <select
              className="dash-select"
              style={{ width: "auto", minWidth: 180 }}
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              aria-label="Lọc theo môn học"
            >
              <option value="all">Môn học: Tất cả</option>
              {courseOptions.map(([code, name]) => (
                <option key={code} value={code}>
                  {code} — {name}
                </option>
              ))}
            </select>

            <select
              className="dash-select"
              style={{ width: "auto", minWidth: 136 }}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Lọc theo loại tài liệu"
            >
              <option value="all">Loại: Tất cả</option>
              <option value="PDF">PDF</option>
              <option value="SLIDE">SLIDE</option>
              <option value="DE-THI">Đề thi</option>
              <option value="DOC">DOC</option>
            </select>

            <select
              className="dash-select"
              style={{ width: "auto", minWidth: 150 }}
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "downloads" | "newest")
              }
              aria-label="Sắp xếp tài liệu"
            >
              <option value="downloads">Tải nhiều nhất</option>
              <option value="newest">Mới nhất</option>
            </select>

            <button
              type="button"
              aria-pressed={onlyFavorites}
              className={`dash-chip ${onlyFavorites ? "dash-chip--active" : ""}`}
              onClick={() => setOnlyFavorites((v) => !v)}
            >
              <Heart size={14} />
              Yêu thích ({docs.filter((d) => d.isFavorite).length})
            </button>
          </div>

          <section>
            <div className="dash-section-head">
              <h2 className="dash-section-title">Danh sách tài liệu</h2>
              <span style={{ fontSize: "0.84rem", color: "#5c5249" }}>
                Hiển thị <strong>{filteredDocs.length}</strong> tài liệu
              </span>
            </div>

            {demoMode === "loading" ? (
              <DataSkeleton variant="cards" count={4} />
            ) : demoMode === "error" ? (
              <ErrorState
                title="Không thể tải thư viện tài liệu"
                message="Máy chủ lưu trữ tài liệu tạm thời không phản hồi. Vui lòng thử lại."
                onRetry={retryDemo}
              />
            ) : demoMode === "empty" || filteredDocs.length === 0 ? (
              <EmptyState
                title="Không tìm thấy tài liệu phù hợp"
                description="Thử đổi từ khóa tìm kiếm, chọn môn học khác hoặc đặt lại bộ lọc."
                actionLabel="Đặt lại bộ lọc"
                onAction={resetFilters}
              />
            ) : (
              <div className="dash-library-grid kma-stagger">
                {filteredDocs.map((doc) => (
                  <LibraryCard
                    key={doc.id}
                    doc={doc}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
