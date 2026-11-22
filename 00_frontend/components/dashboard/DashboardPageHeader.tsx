import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Page Header gọn cho tất cả trang con khu sinh viên (đặc tả Q1, cao ~110–140px):
 * Breadcrumb + tiêu đề Lora + mô tả một dòng + vùng nút hành động chính bên phải.
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardPageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  titleHighlight?: string;
  description: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}

export default function DashboardPageHeader({
  breadcrumbs,
  title,
  titleHighlight,
  description,
  actions,
  meta,
}: DashboardPageHeaderProps) {
  return (
    <header className="dash-page-header">
      <div className="dash-page-header-inner">
        <div className="dash-page-header-main">
          <nav className="dash-breadcrumb" aria-label="Đường dẫn trang">
            {breadcrumbs.map((crumb, idx) => (
              <span
                key={`${crumb.label}-${idx}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                {idx > 0 && <ChevronRight size={13} aria-hidden="true" />}
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span aria-current="page" style={{ color: "#1e1916", fontWeight: 600 }}>
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          <h1 className="dash-page-header-title">
            {title}
            {titleHighlight ? (
              <>
                {" "}
                <span>{titleHighlight}</span>
              </>
            ) : null}
          </h1>

          <p className="dash-page-header-desc">{description}</p>
          {meta && <div className="dash-page-header-meta">{meta}</div>}
        </div>

        {actions && <div className="dash-page-header-actions">{actions}</div>}
      </div>
    </header>
  );
}
