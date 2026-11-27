"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  HelpCircle,
  KeyRound,
  Layers,
  Lock,
  Mail,
  Target,
  User,
  X,
} from "lucide-react";

/**
 * Hệ thống modal dùng chung cho khu vực Đăng nhập & Đăng ký:
 * - "privacy": Modal Chính sách quyền riêng tư (theo Ảnh 3)
 * - "terms": Modal Điều khoản dịch vụ (theo Ảnh 4)
 * - "help": Modal Trợ giúp sinh viên
 * - "forgot": Modal Quên mật khẩu (có validation inline & đổi email/gửi lại)
 * Hỗ trợ đầy đủ A11y: khóa cuộn nền, Focus Trap, tự focus khi mở, trả focus khi đóng và phím Escape.
 */

export type AuthModalKind = "privacy" | "terms" | "help" | "forgot" | null;

interface AuthLegalModalsProps {
  activeModal: AuthModalKind;
  onClose: () => void;
  onConfirmRead?: (kind: "privacy" | "terms") => void;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const PRIVACY_SECTIONS = [
  {
    icon: Layers,
    title: "1. Dữ liệu được thu thập",
    body: "Chúng tôi thu thập các thông tin như họ và tên, email sinh viên, mã sinh viên, thông tin học tập và một số dữ liệu sử dụng hệ thống (đăng nhập, thiết bị, thời gian truy cập) để cung cấp và cải thiện dịch vụ.",
  },
  {
    icon: Target,
    title: "2. Mục đích sử dụng",
    body: "Thông tin của bạn được sử dụng để xác thực tài khoản, quản lý học tập, cung cấp các dịch vụ dành cho sinh viên (lịch học, học liệu, đăng ký học phần, thông báo) và liên hệ khi cần thiết.",
  },
  {
    icon: Lock,
    title: "3. Bảo mật thông tin",
    body: "Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ thông tin cá nhân của bạn, bao gồm mã hóa dữ liệu, kiểm soát truy cập và giám sát an toàn hệ thống.",
  },
  {
    icon: User,
    title: "4. Quyền của người dùng",
    body: "Bạn có quyền truy cập, chỉnh sửa, yêu cầu xóa hoặc hạn chế xử lý thông tin cá nhân của mình theo quy định hiện hành. Bạn cũng có thể liên hệ với chúng tôi để được hỗ trợ về các yêu cầu liên quan.",
  },
];

const TERMS_SECTIONS = [
  {
    title: "1. Phạm vi sử dụng",
    body: "Điều khoản này quy định việc sử dụng Cổng sinh viên KMA (KMA Overall) bao gồm các tính năng học tập, theo dõi tiến độ, đăng ký học phần, tham gia sự kiện và các dịch vụ liên quan dành cho sinh viên KMA.",
  },
  {
    title: "2. Tài khoản người dùng",
    body: "Sinh viên được cấp và sử dụng một tài khoản cá nhân để truy cập hệ thống. Bạn có trách nhiệm bảo mật thông tin đăng nhập, không chia sẻ tài khoản cho người khác và thông báo ngay cho KMA khi phát hiện có dấu hiệu truy cập trái phép.",
  },
  {
    title: "3. Quy tắc cộng đồng",
    body: "Khi sử dụng hệ thống, sinh viên cần ứng xử văn minh, tôn trọng người khác, không đăng tải nội dung vi phạm pháp luật, nội dung phản cảm, gây rối hoặc làm ảnh hưởng đến môi trường học tập của KMA.",
  },
  {
    title: "4. Quyền và trách nhiệm",
    body: "KMA có quyền cập nhật, điều chỉnh hoặc tạm ngừng một phần/toàn bộ dịch vụ để nâng cấp, bảo trì hoặc bảo đảm an toàn hệ thống. Sinh viên có trách nhiệm tuân thủ các quy định hiện hành và thông báo mới nhất từ KMA.",
  },
];

export default function AuthLegalModals({
  activeModal,
  onClose,
  onConfirmRead,
}: AuthLegalModalsProps) {
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const handleCloseAll = useCallback(() => {
    setResetSent(false);
    setResetEmail("");
    setResetError(null);
    onClose();
  }, [onClose]);

  // Khóa cuộn nền, tự focus vào hộp thoại, Focus Trap phím Tab và trả focus khi đóng
  useEffect(() => {
    if (!activeModal) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const raf = window.requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const firstInput = dialog.querySelector<HTMLElement>(
        "input:not([disabled])",
      );
      if (firstInput) {
        firstInput.focus();
      } else {
        const focusables = dialog.querySelectorAll<HTMLElement>(
          FOCUSABLE_SELECTOR,
        );
        focusables[0]?.focus();
      }
    });

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCloseAll();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (
            document.activeElement === first ||
            !dialogRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            last.focus();
          }
        } else if (
          document.activeElement === last ||
          !dialogRef.current.contains(document.activeElement)
        ) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      restoreFocusRef.current?.focus();
    };
  }, [activeModal, handleCloseAll]);

  if (!activeModal) return null;

  function handleResetSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleaned = resetEmail.trim();
    if (!cleaned) {
      setResetError("Vui lòng nhập email sinh viên hoặc mã sinh viên.");
      return;
    }
    if (cleaned.length < 4) {
      setResetError("Thông tin tài khoản quá ngắn, vui lòng kiểm tra lại.");
      return;
    }
    setResetError(null);
    setResetSent(true);
  }

  return (
    <div
      className="kma-auth-modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCloseAll();
      }}
    >
      {/* Modal 1: Chính sách quyền riêng tư (Ảnh 3) */}
      {activeModal === "privacy" && (
        <div
          ref={dialogRef}
          className="kma-auth-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-privacy-title"
        >
          <button
            type="button"
            className="kma-auth-modal-close"
            onClick={handleCloseAll}
            aria-label="Đóng hộp thoại"
          >
            <X size={18} />
          </button>

          <div className="kma-auth-modal-head">
            <div className="kma-auth-shield-ornament" aria-hidden="true">
              <span className="kma-auth-ornament-line" />
              <svg width="34" height="38" viewBox="0 0 36 40">
                <defs>
                  <linearGradient id="kmaGoldShield" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f3dda6" />
                    <stop offset="55%" stopColor="#d4ab58" />
                    <stop offset="100%" stopColor="#a87928" />
                  </linearGradient>
                </defs>
                <path
                  d="M18 2L33 8V19.5C33 28.6 26.4 35.1 18 38C9.6 35.1 3 28.6 3 19.5V8L18 2Z"
                  fill="url(#kmaGoldShield)"
                  stroke="#9c6e20"
                  strokeWidth="1.2"
                />
                <circle cx="18" cy="16.5" r="3.4" fill="#5b3b09" />
                <path d="M16.4 19.2h3.2l.8 6.8h-4.8l.8-6.8Z" fill="#5b3b09" />
              </svg>
              <span className="kma-auth-ornament-line" />
            </div>

            <h2 id="auth-privacy-title" className="kma-auth-modal-title">
              Chính sách <span>quyền riêng tư</span>
            </h2>
            <p className="kma-auth-modal-sub">
              Tìm hiểu cách thông tin của bạn được xử lý.
            </p>
          </div>

          <div className="kma-auth-modal-scroll" tabIndex={0}>
            {PRIVACY_SECTIONS.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.title}
                  className={`kma-auth-privacy-row ${
                    idx > 0 ? "kma-auth-privacy-row--sep" : ""
                  }`}
                >
                  <span className="kma-auth-privacy-icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3>{sec.title}</h3>
                    <p>{sec.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="kma-auth-modal-footer">
            <button
              type="button"
              className="kma-auth-btn-outline"
              onClick={handleCloseAll}
            >
              Đóng
            </button>
            <button
              type="button"
              className="kma-auth-btn-primary"
              onClick={() => {
                onConfirmRead?.("privacy");
                handleCloseAll();
              }}
            >
              Đã đọc
            </button>
          </div>
        </div>
      )}

      {/* Modal 2: Điều khoản dịch vụ (Ảnh 4) */}
      {activeModal === "terms" && (
        <div
          ref={dialogRef}
          className="kma-auth-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-terms-title"
        >
          <button
            type="button"
            className="kma-auth-modal-close"
            onClick={handleCloseAll}
            aria-label="Đóng hộp thoại"
          >
            <X size={18} />
          </button>

          <div className="kma-auth-modal-head">
            <div className="kma-auth-terms-badge" aria-hidden="true">
              <FileText size={26} strokeWidth={1.75} />
            </div>

            <h2
              id="auth-terms-title"
              className="kma-auth-modal-title kma-auth-modal-title--crimson"
            >
              Điều khoản dịch vụ
            </h2>
            <p className="kma-auth-modal-sub">
              Vui lòng đọc kỹ trước khi tiếp tục.
            </p>
          </div>

          <div className="kma-auth-modal-scroll" tabIndex={0}>
            <div className="kma-auth-terms-list">
              {TERMS_SECTIONS.map((sec) => (
                <section key={sec.title} className="kma-auth-terms-item">
                  <h3>{sec.title}</h3>
                  <p>{sec.body}</p>
                </section>
              ))}
            </div>
          </div>

          <div className="kma-auth-modal-footer">
            <button
              type="button"
              className="kma-auth-btn-outline"
              onClick={handleCloseAll}
            >
              Đóng
            </button>
            <button
              type="button"
              className="kma-auth-btn-primary"
              onClick={() => {
                onConfirmRead?.("terms");
                handleCloseAll();
              }}
            >
              Đã đọc
            </button>
          </div>
        </div>
      )}

      {/* Modal 3: Trợ giúp */}
      {activeModal === "help" && (
        <div
          ref={dialogRef}
          className="kma-auth-modal kma-auth-modal--sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-help-title"
        >
          <button
            type="button"
            className="kma-auth-modal-close"
            onClick={handleCloseAll}
            aria-label="Đóng hộp thoại"
          >
            <X size={18} />
          </button>

          <div className="kma-auth-modal-head">
            <div className="kma-auth-terms-badge" aria-hidden="true">
              <HelpCircle size={25} strokeWidth={1.75} />
            </div>
            <h2 id="auth-help-title" className="kma-auth-modal-title">
              Trợ giúp <span>đăng nhập</span>
            </h2>
            <p className="kma-auth-modal-sub">
              Hỗ trợ kỹ thuật cho sinh viên Học viện Kỹ thuật Mật mã.
            </p>
          </div>

          <div className="kma-auth-modal-scroll" tabIndex={0}>
            <div className="kma-auth-terms-list">
              <section className="kma-auth-terms-item">
                <h3>Tài khoản đăng nhập</h3>
                <p>
                  Bạn có thể dùng email sinh viên (ví dụ{" "}
                  <strong>at180324@actvn.edu.vn</strong>) hoặc mã sinh viên
                  (ví dụ <strong>AT180324</strong>) để truy cập Cổng sinh viên
                  KMA Overall.
                </p>
              </section>
              <section className="kma-auth-terms-item">
                <h3>Chưa kích hoạt hoặc quên mật khẩu</h3>
                <p>
                  Sử dụng chức năng <strong>Quên mật khẩu</strong> ngay trên
                  biểu mẫu đăng nhập hoặc liên hệ Phòng Công tác Sinh viên /
                  Trung tâm CNTT KMA (email hỗ trợ:{" "}
                  <strong>hotro@kma.edu.vn</strong>).
                </p>
              </section>
            </div>
          </div>

          <div className="kma-auth-modal-footer">
            <button
              type="button"
              className="kma-auth-btn-primary"
              onClick={handleCloseAll}
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* Modal 4: Quên mật khẩu */}
      {activeModal === "forgot" && (
        <div
          ref={dialogRef}
          className="kma-auth-modal kma-auth-modal--sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-forgot-title"
        >
          <button
            type="button"
            className="kma-auth-modal-close"
            onClick={handleCloseAll}
            aria-label="Đóng hộp thoại"
          >
            <X size={18} />
          </button>

          <div className="kma-auth-modal-head">
            <div className="kma-auth-terms-badge" aria-hidden="true">
              <KeyRound size={24} strokeWidth={1.75} />
            </div>
            <h2 id="auth-forgot-title" className="kma-auth-modal-title">
              Khôi phục <span>mật khẩu</span>
            </h2>
            <p className="kma-auth-modal-sub">
              Nhập email sinh viên hoặc mã sinh viên để nhận liên kết đặt lại mật
              khẩu.
            </p>
          </div>

          {resetSent ? (
            <>
              <div className="kma-auth-reset-done" role="status">
                <CheckCircle2 size={22} aria-hidden="true" />
                <div>
                  <strong>Đã gửi hướng dẫn khôi phục</strong>
                  <p>
                    Nếu tài khoản <strong>{resetEmail}</strong> tồn tại trên hệ
                    thống, liên kết đặt lại mật khẩu sẽ được gửi trong ít phút.
                  </p>
                </div>
              </div>

              <div className="kma-auth-modal-footer">
                <button
                  type="button"
                  className="kma-auth-btn-outline"
                  onClick={() => {
                    setResetSent(false);
                    setResetError(null);
                  }}
                >
                  Đổi email / Gửi lại
                </button>
                <button
                  type="button"
                  className="kma-auth-btn-primary"
                  onClick={handleCloseAll}
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </>
          ) : (
            <form
              className="kma-auth-modal-form"
              onSubmit={handleResetSubmit}
              noValidate
            >
              <div className="kma-auth-field">
                <label htmlFor="auth-reset-input" className="kma-auth-label">
                  Email sinh viên hoặc mã sinh viên
                </label>
                <div className="kma-auth-input-wrap">
                  <Mail
                    size={17}
                    className="kma-auth-input-icon"
                    aria-hidden="true"
                  />
                  <input
                    id="auth-reset-input"
                    type="text"
                    className={`kma-auth-input ${
                      resetError ? "kma-auth-input--error" : ""
                    }`}
                    placeholder="VD: at180324@actvn.edu.vn hoặc AT180324"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value);
                      if (resetError) setResetError(null);
                    }}
                    aria-invalid={resetError ? true : undefined}
                    aria-describedby={
                      resetError ? "auth-reset-error" : undefined
                    }
                  />
                </div>
                {resetError && (
                  <span
                    id="auth-reset-error"
                    className="kma-auth-hint kma-auth-hint--err"
                    role="alert"
                  >
                    <AlertCircle size={13} aria-hidden="true" />
                    {resetError}
                  </span>
                )}
              </div>

              <div className="kma-auth-modal-footer">
                <button
                  type="button"
                  className="kma-auth-btn-outline"
                  onClick={handleCloseAll}
                >
                  Đóng
                </button>
                <button type="submit" className="kma-auth-btn-primary">
                  Gửi yêu cầu
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
