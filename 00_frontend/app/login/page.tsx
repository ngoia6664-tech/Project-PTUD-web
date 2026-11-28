"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import AuthShell, { useAuthModal } from "@/components/auth/AuthShell";
import GoogleGlyph from "@/components/auth/GoogleGlyph";
import { ApiError, apiFetch, setAuthToken } from "@/lib/api";

/**
 * Trang Đăng nhập KMA Overall (/login):
 * - Gọi API thật POST /auth/login { email, password }.
 * - Lưu token vào localStorage (khóa "token") và chuyển sang /dashboard.
 * - Hiển thị lỗi trả về từ server (400 / 401 / 403 / 500).
 * - Không console.log mật khẩu hay token.
 */

interface LoginErrors {
  email?: string;
  password?: string;
}

interface LoginResponse {
  token: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function LoginCardForm() {
  const router = useRouter();
  const { openModal } = useAuthModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setFeedback(null);

    const cleanEmail = email.trim();
    const nextErrors: LoginErrors = {};
    if (!cleanEmail) {
      nextErrors.email = "Vui lòng nhập email đăng nhập.";
    } else if (!EMAIL_PATTERN.test(cleanEmail)) {
      nextErrors.email = "Địa chỉ email chưa đúng định dạng.";
    }
    if (!password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      if (nextErrors.email) {
        emailRef.current?.focus();
      } else if (nextErrors.password) {
        passwordRef.current?.focus();
      }
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: { email: cleanEmail, password },
        skipAuth: true,
        redirectOn401: false,
      });

      if (!data?.token) {
        setFeedback({
          type: "error",
          text: "Phản hồi đăng nhập từ máy chủ không hợp lệ.",
        });
        setSubmitting(false);
        return;
      }

      setAuthToken(data.token);
      setFeedback({
        type: "success",
        text: data.message || "Đăng nhập thành công! Đang chuyển tới Cổng sinh viên...",
      });
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Đăng nhập thất bại. Vui lòng thử lại.";
      setFeedback({ type: "error", text: message });
      setSubmitting(false);
    }
  }

  function handleGoogleClick() {
    if (submitting) return;
    setFeedback({
      type: "error",
      text: "Đăng nhập bằng Google hiện chưa được hỗ trợ. Vui lòng dùng email và mật khẩu.",
    });
  }

  function handleCapsCheck(e: React.KeyboardEvent<HTMLInputElement>) {
    setCapsLockOn(e.getModifierState("CapsLock"));
  }

  return (
    <div className="kma-auth-card">
      <div className="kma-auth-card-head-center">
        <h2 className="kma-auth-card-title">
          Chào mừng <span>trở lại</span>
        </h2>
        <p className="kma-auth-card-sub">
          Đăng nhập để tiếp tục hành trình học tập.
        </p>
      </div>

      <form className="kma-auth-form" onSubmit={handleSubmit} noValidate>
        {feedback && (
          <div
            className={`kma-auth-alert ${
              feedback.type === "error"
                ? "kma-auth-alert--error"
                : "kma-auth-alert--success"
            }`}
            role={feedback.type === "error" ? "alert" : "status"}
          >
            {feedback.text}
          </div>
        )}

        <div className="kma-auth-field">
          <label htmlFor="login-email" className="kma-auth-label">
            Email sinh viên
          </label>
          <div className="kma-auth-input-wrap">
            <Mail size={17} className="kma-auth-input-icon" aria-hidden="true" />
            <input
              ref={emailRef}
              id="login-email"
              type="email"
              className={`kma-auth-input ${
                errors.email ? "kma-auth-input--error" : ""
              }`}
              placeholder="VD: at180324@actvn.edu.vn"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "login-email-err" : undefined}
              disabled={submitting}
            />
          </div>
          {errors.email && (
            <span
              id="login-email-err"
              className="kma-auth-hint kma-auth-hint--err"
              role="alert"
            >
              <AlertCircle size={13} aria-hidden="true" />
              {errors.email}
            </span>
          )}
        </div>

        <div className="kma-auth-field">
          <label htmlFor="login-password" className="kma-auth-label">
            Mật khẩu
          </label>
          <div className="kma-auth-input-wrap">
            <Lock size={17} className="kma-auth-input-icon" aria-hidden="true" />
            <input
              ref={passwordRef}
              id="login-password"
              type={showPassword ? "text" : "password"}
              className={`kma-auth-input kma-auth-input--with-eye ${
                errors.password ? "kma-auth-input--error" : ""
              }`}
              placeholder="Nhập mật khẩu của bạn"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              onKeyUp={handleCapsCheck}
              onKeyDown={handleCapsCheck}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={
                errors.password ? "login-password-err" : undefined
              }
              disabled={submitting}
            />
            <button
              type="button"
              className="kma-auth-eye-btn"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              disabled={submitting}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && (
            <span
              id="login-password-err"
              className="kma-auth-hint kma-auth-hint--err"
              role="alert"
            >
              <AlertCircle size={13} aria-hidden="true" />
              {errors.password}
            </span>
          )}
          {capsLockOn && !errors.password && (
            <span className="kma-auth-hint kma-auth-hint--warn" role="status">
              <AlertCircle size={13} aria-hidden="true" />
              Phím Caps Lock đang bật.
            </span>
          )}
        </div>

        <div className="kma-auth-row-between">
          <label className="kma-auth-checkbox-label">
            <input
              type="checkbox"
              className="kma-auth-checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={submitting}
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>

          <button
            type="button"
            className="kma-auth-inline-link kma-auth-forgot-link"
            onClick={() => openModal("forgot")}
            disabled={submitting}
          >
            Quên mật khẩu?
          </button>
        </div>

        <button
          type="submit"
          className="kma-auth-submit"
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting && (
            <span className="kma-auth-spinner" aria-hidden="true" />
          )}
          <span>{submitting ? "Đang đăng nhập..." : "Đăng nhập"}</span>
        </button>

        <div className="kma-auth-divider">
          <span>hoặc</span>
        </div>

        <button
          type="button"
          className="kma-auth-google"
          onClick={handleGoogleClick}
          disabled={submitting}
        >
          <GoogleGlyph />
          <span>Tiếp tục với Google</span>
        </button>

        <p className="kma-auth-switch">
          Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Học viện Kỹ thuật Mật mã"
      showEyebrowDot
      heroTitlePrefix="Tiếp tục"
      heroTitleHighlight="hành trình"
      heroTitleLine2="học tập KMA."
      heroDescription="Theo dõi lịch học, tính điểm GPA, tra cứu tài liệu và cập nhật thông báo học vụ trong một cổng thống nhất."
    >
      <LoginCardForm />
    </AuthShell>
  );
}
