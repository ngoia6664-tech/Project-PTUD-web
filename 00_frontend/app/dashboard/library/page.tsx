"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Download,
  Heart,
  Inbox,
  Layers,
  Search,
} from "lucide-react";
import DashboardHero from "@/components/dashboard/DashboardHero";
import LibraryCard from "@/components/dashboard/LibraryCard";
import { MOCK_LIBRARY_RESPONSE, type DocumentItem } from "@/lib/mock/dashboard";

/**
 * Trang Thư viện tài liệu (/dashboard/library) theo Ảnh 4:
 * Hero kèm 3 chỉ số nổi bật -> Banner đỏ tài liệu nổi bật -> Thanh tìm kiếm + lọc môn / loại / yêu thích -> Lưới thẻ tài liệu.
 */
export default function DashboardLibraryPage() {
  const [docs, setDocs] = useState<DocumentItem[]>(MOCK_LIBRARY_RESPONSE.data);
  const [query, setQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const courseOptions = Array.from(
    new Map(docs.map((d) => [d.courseCode, d.courseName])).entries(),
  );

  function handleToggleFavorite(id: string) {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d)),
    );
  }

  const keyword = query.trim().toLowerCase();
  const filteredDocs = docs.filter((doc) => {
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
  });

  return (
    <>
      <DashboardHero
        eyebrow="Học viện Kỹ thuật Mật mã"
        titlePrefix="Thư viện"
        titleHighlight="tài liệu"
        subtitle="Kho tài liệu học tập, slide bài giảng, đề thi và tài nguyên chính thống dành cho sinh viên KMA."
      >
        <div className="dash-hero-stat-strip">
          <div className="dash-hero-stat-pill">
            <Layers size={20} color="#7d5616" />
            <div>
              <strong style={{ display: "block", lineHeight: 1.2 }}>5.428+</strong>
              <span style={{ fontSize: "0.75rem", color: "#6e6359" }}>
                Tài liệu học tập
              </span>
            </div>
          </div>

          <div className="dash-hero-stat-pill">
            <BookOpen size={20} color="#7d5616" />
            <div>
              <strong style={{ display: "block", lineHeight: 1.2 }}>62</strong>
              <span style={{ fontSize: "0.75rem", color: "#6e6359" }}>Môn học</span>
            </div>
          </div>

          <div className="dash-hero-stat-pill">
            <Download size={20} color="#7d5616" />
            <div>
              <strong style={{ display: "block", lineHeight: 1.2 }}>186.320+</strong>
              <span style={{ fontSize: "0.75rem", color: "#6e6359" }}>Lượt tải</span>
            </div>
          </div>
        </div>
      </DashboardHero>

      <main className="dash-main">
        <div className="dash-stack">
          {/* Banner đỏ sơn mài "Tài liệu nổi bật" theo Ảnh 4 */}
          <section className="dash-crimson-banner">
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#f5dfae",
                  textTransform: "uppercase",
                }}
              >
                Tài liệu nổi bật
              </span>
              <h3>Bộ bài giảng chuyên ngành An toàn thông tin</h3>
              <p>
                Tổng hợp bài giảng chính thức, cập nhật mới nhất từ Khoa An toàn thông tin • PDF • 12 chương • 24.891 lượt tải
              </p>
            </div>

            <button
              type="button"
              className="dash-btn dash-btn--cream"
              onClick={() => setSelectedCourse("AT1811")}
            >
              Xem ngay
              <ArrowRight size={15} />
            </button>
          </section>

          {/* Thanh tìm kiếm & bộ lọc môn học / loại / yêu thích */}
          <div
            className="dash-card"
            style={{
              padding: 14,
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <Search
                size={16}
                color="#63594f"
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
                placeholder="Tìm kiếm tài liệu theo tên, mô tả, môn học, tác giả..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Tìm kiếm tài liệu"
              />
            </div>

            <select
              className="dash-select"
              style={{ width: "auto", minWidth: 190 }}
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
              style={{ width: "auto", minWidth: 150 }}
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
              <span style={{ fontSize: "0.82rem", color: "#6e6359" }}>
                Hiển thị <strong>{filteredDocs.length}</strong> tài liệu
              </span>
            </div>

            {filteredDocs.length === 0 ? (
              <div className="dash-state-box">
                <Inbox size={34} color="#8b1218" />
                <strong style={{ color: "#1e1916" }}>
                  Không tìm thấy tài liệu phù hợp
                </strong>
                <button
                  type="button"
                  className="dash-btn dash-btn--primary dash-btn--sm"
                  onClick={() => {
                    setQuery("");
                    setSelectedCourse("all");
                    setSelectedType("all");
                    setOnlyFavorites(false);
                  }}
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="dash-library-grid">
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
