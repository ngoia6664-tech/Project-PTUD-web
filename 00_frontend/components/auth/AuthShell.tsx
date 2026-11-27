"use client";

import { createContext, useContext, useState } from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import AuthLegalModals, { type AuthModalKind } from "./AuthLegalModals";
import "./auth.css";

/**
 * Khung giao diện Auth KMA Overall (dùng chung cho /login và /register):
 * - Header: Logo Khiên KMA Overall bên trái + nút pill "(?) Trợ giúp" bên phải.
 * - Stage: Nền minh họa Học viện KMA ấm áp bên trái chuyển dần sang nền Giấy Dó kem bên phải;
 *          Cột trái tiêu đề tùy biến theo ngữ cảnh Đăng nhập / Đăng ký + nét cong vàng đồng;
 *          Cột phải thẻ form trắng ngà bo góc 22px.
 * - Footer: Bản quyền KMA bên trái + link mở Modal "Điều khoản dịch vụ" & "Chính sách quyền riêng tư".
 */

interface AuthModalContextValue {
  openModal: (kind: Exclude<AuthModalKind, null>) => void;
}

const AuthModalContext = createContext<AuthModalContextValue>({
  openModal: () => {},
});

export function useAuthModal() {
  return useContext(AuthModalContext);
}

interface AuthShellProps {
  eyebrow: string;
  showEyebrowDot?: boolean;
  heroTitlePrefix?: string;
  heroTitleHighlight?: string;
  heroTitleLine2?: string;
  heroDescription?: string;
  onConfirmLegal?: (kind: "privacy" | "terms") => void;
  children: React.ReactNode;
}

export default function AuthShell({
  eyebrow,
  showEyebrowDot = false,
  heroTitlePrefix = "Bắt đầu",
  heroTitleHighlight = "hành trình",
  heroTitleLine2 = "của bạn.",
  heroDescription,
  onConfirmLegal,
  children,
}: AuthShellProps) {
  const [activeModal, setActiveModal] = useState<AuthModalKind>(null);

  return (
    <AuthModalContext.Provider
      value={{ openModal: (kind) => setActiveModal(kind) }}
    >
      <div className="kma-auth-root" lang="vi">
        {/* Thanh Header trên cùng */}
        <header className="kma-auth-header">
          <div className="kma-auth-header-inner">
            <Link href="/" className="kma-auth-brand">
              <svg
                className="kma-auth-brand-shield"
                viewBox="0 0 36 38"
                aria-hidden="true"
              >
                <path
                  d="M18 2L32 7.5V18.5C32 27.2 25.8 33.4 18 36C10.2 33.4 4 27.2 4 18.5V7.5L18 2Z"
                  fill="#8b1218"
                  stroke="#b8893a"
                  strokeWidth="1.7"
                />
                <circle cx="18" cy="15.5" r="3.6" fill="#faf6ef" />
                <path d="M16.2 18.5h3.6l.8 7h-5.2l.8-7Z" fill="#faf6ef" />
              </svg>
              <span className="kma-auth-brand-text">
                <span className="kma-auth-brand-name">
                  KMA <b>Overall</b>
                </span>
                <span className="kma-auth-brand-sub">Cổng sinh viên KMA</span>
              </span>
            </Link>

            <button
              type="button"
              className="kma-auth-help-btn"
              onClick={() => setActiveModal("help")}
            >
              <HelpCircle size={16} strokeWidth={1.9} aria-hidden="true" />
              <span>Trợ giúp</span>
            </button>
          </div>
        </header>

        {/* Khu vực nội dung chính 2 cột trên nền Học viện KMA */}
        <main className="kma-auth-stage">
          <div className="kma-auth-bg-art" aria-hidden="true" />
          <div className="kma-auth-bg-fade" aria-hidden="true" />

          <div className="kma-auth-stage-inner">
            <section className="kma-auth-hero" aria-label="Giới thiệu KMA Overall">
              <div className="kma-auth-eyebrow">
                <span className="kma-auth-eyebrow-line" aria-hidden="true" />
                {showEyebrowDot && (
                  <span className="kma-auth-eyebrow-dot" aria-hidden="true" />
                )}
                <span>{eyebrow}</span>
              </div>

              <h1 className="kma-auth-hero-title">
                {heroTitlePrefix} <span>{heroTitleHighlight}</span>
                <br />
                <span>{heroTitleLine2}</span>
              </h1>

              {/* Nét cong vàng đồng mảnh bên dưới tiêu đề theo ảnh mẫu */}
              <svg
                className="kma-auth-hero-arc"
                viewBox="0 0 260 28"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 24C48 7 118 4 176 9C212 12 238 8 258 2"
                  stroke="url(#kmaHeroArcGrad)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="kmaHeroArcGrad"
                    x1="2"
                    y1="24"
                    x2="258"
                    y2="2"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#c9a04e" stopOpacity="0.25" />
                    <stop offset="45%" stopColor="#b8893a" stopOpacity="0.92" />
                    <stop offset="100%" stopColor="#d8b46a" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
              </svg>

              {heroDescription && (
                <p className="kma-auth-hero-desc">{heroDescription}</p>
              )}
            </section>

            <section className="kma-auth-card-col">{children}</section>
          </div>
        </main>

        {/* Thanh chân trang bản quyền & pháp lý */}
        <footer className="kma-auth-footer">
          <div className="kma-auth-footer-inner">
            <p className="kma-auth-copyright">
              © 2026 Học viện Kỹ thuật Mật mã (KMA). Mọi quyền được bảo lưu.
            </p>
            <div className="kma-auth-footer-links">
              <button
                type="button"
                className="kma-auth-footer-link"
                onClick={() => setActiveModal("terms")}
              >
                Điều khoản dịch vụ
              </button>
              <span className="kma-auth-footer-sep" aria-hidden="true">
                |
              </span>
              <button
                type="button"
                className="kma-auth-footer-link"
                onClick={() => setActiveModal("privacy")}
              >
                Chính sách quyền riêng tư
              </button>
            </div>
          </div>
        </footer>

        <AuthLegalModals
          activeModal={activeModal}
          onClose={() => setActiveModal(null)}
          onConfirmRead={onConfirmLegal}
        />
      </div>
    </AuthModalContext.Provider>
  );
}
