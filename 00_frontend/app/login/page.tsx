"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import AuthShell, { useAuthModal } from "@/components/auth/AuthShell";
import GoogleGlyph from "@/components/auth/GoogleGlyph";

/**
 * Trang Đăng nhập KMA Overall (/login):
 * - Có nhãn <label> hiển thị rõ ràng, validation inline theo từng trường (aria-invalid/aria-describedby)
 * - Cảnh báo Caps Lock ở ô mật khẩu, spinner khi đang xử lý, chống double-click nút Google & cleanup timer.
 */

interface LoginErrors {
  identifier?: string;
  password?: string;
}

function LoginCardForm() {
  const router = useRouter();
  const { openModal } = useAuthModal();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [submittingMode, setSubmittingMode] = useState<
    null | "credentials" | "google"
  >(null);

  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const isBusy = submittingMode !== null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isBusy) return;
    setFeedback(null);

    const nextErrors: LoginErrors = {};
    if (!identifier.trim()) {
      nextErrors.identifier = "Vui lòng nhập email hoặc mã sinh viên.";
    }
    if (!password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      if (nextErrors.identifier) {
        identifierRef.current?.focus();
      } else if (nextErrors.password) {
        passwordRef.current?.focus();
      }
      return;
    }

    setErrors({});
    setSubmittingMode("credentials");
    setFeedback({
      type: "success",
      text: "Đăng nhập thành công! Đang chuyển tới Cổng sinh viên KMA...",
    });

    timerRef.current = window.setTimeout(() => {
      router.push("/dashboard");
    }, 450);
  }

  function handleGoogleClick() {
    if (isBusy) return;
    setErrors({});
    setSubmittingMode("google");
    setFeedback({
      type: "success",
      text: "Đang mô phỏng đăng nhập bằng tài khoản Google KMA...",
    });
    timerRef.current = window.setTimeout(() => {
      router.push("/dashboard");
    }, 550);
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
          <label htmlFor="login-identifier" className="kma-auth-label">
            Email hoặc mã sinh viên
          </label>
          <div className="kma-auth-input-wrap">
            <Mail size={17} className="kma-auth-input-icon" aria-hidden="true" />
            <input
              ref={identifierRef}
              id="login-identifier"
              type="text"
              className={`kma-auth-input ${
                errors.identifier ? "kma-auth-input--error" : ""
              }`}
              placeholder="VD: at180324@actvn.edu.vn hoặc AT180324"
              autoComplete="username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier) {
                  setErrors((prev) => ({ ...prev, identifier: undefined }));
                }
              }}
              aria-invalid={errors.identifier ? true : undefined}
              aria-describedby={
                errors.identifier ? "login-identifier-err" : undefined
              }
              disabled={isBusy}
            />
          </div>
          {errors.identifier && (
            <span
              id="login-identifier-err"
              className="kma-auth-hint kma-auth-hint--err"
              role="alert"
            >
              <AlertCircle size={13} aria-hidden="true" />
              {errors.identifier}
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
              disabled={isBusy}
            />
            <button
              type="button"
              className="kma-auth-eye-btn"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              disabled={isBusy}
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
              disabled={isBusy}
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>

          <button
            type="button"
            className="kma-auth-inline-link kma-auth-forgot-link"
            onClick={() => openModal("forgot")}
            disabled={isBusy}
          >
            Quên mật khẩu?
          </button>
        </div>

        <button
          type="submit"
          className="kma-auth-submit"
          disabled={isBusy}
          aria-busy={submittingMode === "credentials"}
        >
          {submittingMode === "credentials" && (
            <span className="kma-auth-spinner" aria-hidden="true" />
          )}
          <span>
            {submittingMode === "credentials"
              ? "Đang đăng nhập..."
              : "Đăng nhập"}
          </span>
        </button>

        <div className="kma-auth-divider">
          <span>hoặc</span>
        </div>

        <button
          type="button"
          className="kma-auth-google"
          onClick={handleGoogleClick}
          disabled={isBusy}
          aria-busy={submittingMode === "google"}
        >
          {submittingMode === "google" ? (
            <span
              className="kma-auth-spinner kma-auth-spinner--crimson"
              aria-hidden="true"
            />
          ) : (
            <GoogleGlyph />
          )}
          <span>
            {submittingMode === "google"
              ? "Đang kết nối Google..."
              : "Tiếp tục với Google"}
          </span>
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
