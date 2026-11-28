"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Info,
  Lock,
  Mail,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import AuthShell, { useAuthModal } from "@/components/auth/AuthShell";
import GoogleGlyph from "@/components/auth/GoogleGlyph";
import { ApiError, apiFetch } from "@/lib/api";

/**
 * Trang Đăng ký tài khoản KMA Overall (/register):
 * - Gọi API thật POST /auth/register với đủ 7 trường:
 *   { student_code, full_name, email, password, major, class_name, admission_year }.
 * - Hiển thị lỗi trả về từ server (400 / 409 trùng email hoặc mã SV / 500).
 * - Không console.log mật khẩu hay token.
 */

interface RegisterErrors {
  fullName?: string;
  studentCode?: string;
  email?: string;
  major?: string;
  className?: string;
  admissionYear?: string;
  password?: string;
  confirmPassword?: string;
  agreed?: string;
}

interface RegisterResponse {
  message?: string;
  ok?: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAJOR_OPTIONS = ["CNTT", "ATTT", "DTVT"] as const;

function getPasswordStrength(pw: string): {
  level: 0 | 1 | 2 | 3;
  label: string;
} {
  if (!pw) return { level: 0, label: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;

  if (pw.length < 8) return { level: 1, label: "Yếu (cần tối thiểu 8 ký tự)" };
  if (score <= 2) return { level: 2, label: "Trung bình" };
  return { level: 3, label: "Mạnh" };
}

interface RegisterCardFormProps {
  agreed: boolean;
  legalReadHint: string | null;
  onAgreedChange: (value: boolean) => void;
}

function RegisterCardForm({
  agreed,
  legalReadHint,
  onAgreedChange,
}: RegisterCardFormProps) {
  const router = useRouter();
  const { openModal } = useAuthModal();

  const [fullName, setFullName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState<string>("CNTT");
  const [className, setClassName] = useState("");
  const [admissionYear, setAdmissionYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fullNameRef = useRef<HTMLInputElement>(null);
  const studentCodeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const majorRef = useRef<HTMLSelectElement>(null);
  const classNameRef = useRef<HTMLInputElement>(null);
  const admissionYearRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const agreedRef = useRef<HTMLInputElement>(null);
  const redirectTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const strength = getPasswordStrength(password);
  const liveMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;
  const confirmErrorText =
    errors.confirmPassword ??
    (liveMismatch ? "Mật khẩu xác nhận chưa trùng khớp." : undefined);

  function clearFieldError(field: keyof RegisterErrors) {
    setErrors((prev) =>
      prev[field] ? { ...prev, [field]: undefined } : prev,
    );
  }

  function handleCapsCheck(e: React.KeyboardEvent<HTMLInputElement>) {
    setCapsLockOn(e.getModifierState("CapsLock"));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setFeedback(null);

    const nextErrors: RegisterErrors = {};
    const cleanName = fullName.trim();
    const cleanCode = studentCode.trim();
    const cleanEmail = email.trim();
    const cleanMajor = major.trim();
    const cleanClass = className.trim();
    const parsedYear = Number(admissionYear.trim());

    if (cleanName.length < 2) {
      nextErrors.fullName = "Vui lòng nhập họ và tên đầy đủ.";
    }
    if (cleanCode.length < 3 || /\s/.test(cleanCode)) {
      nextErrors.studentCode = "Mã sinh viên không hợp lệ (VD: AT180324).";
    }
    if (!cleanEmail) {
      nextErrors.email = "Vui lòng nhập địa chỉ email.";
    } else if (!EMAIL_PATTERN.test(cleanEmail)) {
      nextErrors.email = "Địa chỉ email chưa đúng định dạng.";
    }
    if (!cleanMajor) {
      nextErrors.major = "Vui lòng chọn ngành học.";
    }
    if (!cleanClass) {
      nextErrors.className = "Vui lòng nhập tên lớp (VD: CT9C).";
    }
    if (
      !admissionYear.trim() ||
      !Number.isInteger(parsedYear) ||
      parsedYear < 1990 ||
      parsedYear > 2100
    ) {
      nextErrors.admissionYear = "Năm nhập học phải là số nguyên hợp lệ.";
    }
    if (password.length < 8) {
      nextErrors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Vui lòng xác nhận lại mật khẩu.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Mật khẩu xác nhận chưa trùng khớp.";
    }
    if (!agreed) {
      nextErrors.agreed =
        "Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      if (nextErrors.fullName) fullNameRef.current?.focus();
      else if (nextErrors.studentCode) studentCodeRef.current?.focus();
      else if (nextErrors.email) emailRef.current?.focus();
      else if (nextErrors.major) majorRef.current?.focus();
      else if (nextErrors.className) classNameRef.current?.focus();
      else if (nextErrors.admissionYear) admissionYearRef.current?.focus();
      else if (nextErrors.password) passwordRef.current?.focus();
      else if (nextErrors.confirmPassword) confirmRef.current?.focus();
      else if (nextErrors.agreed) agreedRef.current?.focus();
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await apiFetch<RegisterResponse>("/auth/register", {
        method: "POST",
        body: {
          student_code: cleanCode,
          full_name: cleanName,
          email: cleanEmail,
          password,
          major: cleanMajor,
          class_name: cleanClass,
          admission_year: parsedYear,
        },
        skipAuth: true,
        redirectOn401: false,
      });

      setFeedback({
        type: "success",
        text:
          res?.message ||
          "Tạo tài khoản thành công! Đang chuyển tới trang đăng nhập...",
      });

      redirectTimerRef.current = window.setTimeout(() => {
        router.push("/login");
      }, 800);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Đăng ký không thành công. Vui lòng thử lại.";
      setFeedback({ type: "error", text: message });
      setSubmitting(false);
    }
  }

  function handleGoogleRegister() {
    if (submitting) return;
    setFeedback({
      type: "error",
      text: "Đăng ký bằng Google hiện chưa được hỗ trợ. Vui lòng điền thông tin sinh viên bên trên.",
    });
  }

  return (
    <div className="kma-auth-card kma-auth-card--register">
      <div className="kma-auth-card-head-row">
        <span className="kma-auth-register-icon" aria-hidden="true">
          <UserPlus size={23} strokeWidth={1.8} />
        </span>
        <div>
          <h2 className="kma-auth-card-title">Tạo tài khoản</h2>
          <p className="kma-auth-card-sub">
            Tham gia cộng đồng sinh viên KMA Overall.
          </p>
        </div>
      </div>

      <form
        className="kma-auth-form kma-auth-form--compact"
        onSubmit={handleSubmit}
        noValidate
      >
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

        <div className="kma-auth-grid-2">
          <div className="kma-auth-field">
            <label htmlFor="reg-fullname" className="kma-auth-label">
              Họ và tên
            </label>
            <div className="kma-auth-input-wrap">
              <User
                size={16}
                className="kma-auth-input-icon"
                aria-hidden="true"
              />
              <input
                ref={fullNameRef}
                id="reg-fullname"
                type="text"
                className={`kma-auth-input ${
                  errors.fullName ? "kma-auth-input--error" : ""
                }`}
                placeholder="Nguyễn Minh Khôi"
                autoComplete="name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  clearFieldError("fullName");
                }}
                aria-invalid={errors.fullName ? true : undefined}
                aria-describedby={
                  errors.fullName ? "reg-fullname-err" : undefined
                }
                disabled={submitting}
              />
            </div>
            {errors.fullName && (
              <span
                id="reg-fullname-err"
                className="kma-auth-hint kma-auth-hint--err"
                role="alert"
              >
                <AlertCircle size={13} aria-hidden="true" />
                {errors.fullName}
              </span>
            )}
          </div>

          <div className="kma-auth-field">
            <label htmlFor="reg-student-code" className="kma-auth-label">
              Mã sinh viên
            </label>
            <div className="kma-auth-input-wrap">
              <GraduationCap
                size={17}
                className="kma-auth-input-icon"
                aria-hidden="true"
              />
              <input
                ref={studentCodeRef}
                id="reg-student-code"
                type="text"
                className={`kma-auth-input ${
                  errors.studentCode ? "kma-auth-input--error" : ""
                }`}
                placeholder="VD: AT180324"
                value={studentCode}
                onChange={(e) => {
                  setStudentCode(e.target.value.toUpperCase());
                  clearFieldError("studentCode");
                }}
                aria-invalid={errors.studentCode ? true : undefined}
                aria-describedby={
                  errors.studentCode ? "reg-code-err" : undefined
                }
                disabled={submitting}
              />
            </div>
            {errors.studentCode && (
              <span
                id="reg-code-err"
                className="kma-auth-hint kma-auth-hint--err"
                role="alert"
              >
                <AlertCircle size={13} aria-hidden="true" />
                {errors.studentCode}
              </span>
            )}
          </div>
        </div>

        <div className="kma-auth-field">
          <label htmlFor="reg-email" className="kma-auth-label">
            Email sinh viên
          </label>
          <div className="kma-auth-input-wrap">
            <Mail size={16} className="kma-auth-input-icon" aria-hidden="true" />
            <input
              ref={emailRef}
              id="reg-email"
              type="email"
              className={`kma-auth-input ${
                errors.email ? "kma-auth-input--error" : ""
              }`}
              placeholder="at180324@actvn.edu.vn"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "reg-email-err" : undefined}
              disabled={submitting}
            />
          </div>
          {errors.email && (
            <span
              id="reg-email-err"
              className="kma-auth-hint kma-auth-hint--err"
              role="alert"
            >
              <AlertCircle size={13} aria-hidden="true" />
              {errors.email}
            </span>
          )}
        </div>

        {/* Ngành, Lớp và Năm nhập học theo contract POST /auth/register */}
        <div className="kma-auth-grid-3">
          <div className="kma-auth-field">
            <label htmlFor="reg-major" className="kma-auth-label">
              Ngành
            </label>
            <div className="kma-auth-input-wrap">
              <BookOpen
                size={15}
                className="kma-auth-input-icon"
                aria-hidden="true"
              />
              <select
                ref={majorRef}
                id="reg-major"
                className={`kma-auth-input kma-auth-select ${
                  errors.major ? "kma-auth-input--error" : ""
                }`}
                value={major}
                onChange={(e) => {
                  setMajor(e.target.value);
                  clearFieldError("major");
                }}
                aria-invalid={errors.major ? true : undefined}
                disabled={submitting}
              >
                {MAJOR_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {errors.major && (
              <span className="kma-auth-hint kma-auth-hint--err" role="alert">
                {errors.major}
              </span>
            )}
          </div>

          <div className="kma-auth-field">
            <label htmlFor="reg-class" className="kma-auth-label">
              Lớp
            </label>
            <div className="kma-auth-input-wrap">
              <Users
                size={15}
                className="kma-auth-input-icon"
                aria-hidden="true"
              />
              <input
                ref={classNameRef}
                id="reg-class"
                type="text"
                className={`kma-auth-input ${
                  errors.className ? "kma-auth-input--error" : ""
                }`}
                placeholder="VD: CT9C"
                value={className}
                onChange={(e) => {
                  setClassName(e.target.value.toUpperCase());
                  clearFieldError("className");
                }}
                aria-invalid={errors.className ? true : undefined}
                disabled={submitting}
              />
            </div>
            {errors.className && (
              <span className="kma-auth-hint kma-auth-hint--err" role="alert">
                {errors.className}
              </span>
            )}
          </div>

          <div className="kma-auth-field">
            <label htmlFor="reg-year" className="kma-auth-label">
              Năm nhập học
            </label>
            <div className="kma-auth-input-wrap">
              <Calendar
                size={15}
                className="kma-auth-input-icon"
                aria-hidden="true"
              />
              <input
                ref={admissionYearRef}
                id="reg-year"
                type="number"
                min={1990}
                max={2100}
                step={1}
                className={`kma-auth-input ${
                  errors.admissionYear ? "kma-auth-input--error" : ""
                }`}
                placeholder="2024"
                value={admissionYear}
                onChange={(e) => {
                  setAdmissionYear(e.target.value);
                  clearFieldError("admissionYear");
                }}
                aria-invalid={errors.admissionYear ? true : undefined}
                disabled={submitting}
              />
            </div>
            {errors.admissionYear && (
              <span className="kma-auth-hint kma-auth-hint--err" role="alert">
                {errors.admissionYear}
              </span>
            )}
          </div>
        </div>

        <div className="kma-auth-field">
          <label htmlFor="reg-password" className="kma-auth-label">
            Mật khẩu
          </label>
          <div className="kma-auth-input-wrap">
            <Lock size={16} className="kma-auth-input-icon" aria-hidden="true" />
            <input
              ref={passwordRef}
              id="reg-password"
              type={showPass ? "text" : "password"}
              className={`kma-auth-input kma-auth-input--with-eye ${
                errors.password ? "kma-auth-input--error" : ""
              }`}
              placeholder="Tối thiểu 8 ký tự"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              onKeyUp={handleCapsCheck}
              onKeyDown={handleCapsCheck}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby="reg-password-help"
              disabled={submitting}
            />
            <button
              type="button"
              className="kma-auth-eye-btn"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              disabled={submitting}
            >
              {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {password.length > 0 ? (
            <div id="reg-password-help" className="kma-auth-strength-wrap">
              <div className="kma-auth-strength-bars" aria-hidden="true">
                {[1, 2, 3].map((step) => (
                  <span
                    key={step}
                    className={`kma-auth-strength-bar ${
                      strength.level >= step
                        ? `kma-auth-strength-bar--lvl-${strength.level}`
                        : ""
                    }`}
                  />
                ))}
              </div>
              <span
                className={`kma-auth-strength-text kma-auth-strength-text--lvl-${strength.level}`}
              >
                Độ mạnh: {strength.label}
              </span>
            </div>
          ) : (
            <span id="reg-password-help" className="kma-auth-hint">
              <Info size={13} aria-hidden="true" />
              Ít nhất 8 ký tự, nên kết hợp chữ hoa và số
            </span>
          )}

          {errors.password && (
            <span className="kma-auth-hint kma-auth-hint--err" role="alert">
              <AlertCircle size={13} aria-hidden="true" />
              {errors.password}
            </span>
          )}
          {capsLockOn && (
            <span className="kma-auth-hint kma-auth-hint--warn" role="status">
              <AlertCircle size={13} aria-hidden="true" />
              Phím Caps Lock đang bật.
            </span>
          )}
        </div>

        <div className="kma-auth-field">
          <label htmlFor="reg-confirm-password" className="kma-auth-label">
            Xác nhận mật khẩu
          </label>
          <div className="kma-auth-input-wrap">
            <Lock size={16} className="kma-auth-input-icon" aria-hidden="true" />
            <input
              ref={confirmRef}
              id="reg-confirm-password"
              type={showConfirm ? "text" : "password"}
              className={`kma-auth-input kma-auth-input--with-eye ${
                confirmErrorText ? "kma-auth-input--error" : ""
              }`}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError("confirmPassword");
              }}
              onKeyUp={handleCapsCheck}
              onKeyDown={handleCapsCheck}
              aria-invalid={confirmErrorText ? true : undefined}
              aria-describedby={
                confirmErrorText ? "reg-confirm-err" : undefined
              }
              disabled={submitting}
            />
            <button
              type="button"
              className="kma-auth-eye-btn"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={
                showConfirm ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"
              }
              disabled={submitting}
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {confirmErrorText && (
            <span
              id="reg-confirm-err"
              className="kma-auth-hint kma-auth-hint--err"
              role="alert"
            >
              <AlertCircle size={13} aria-hidden="true" />
              {confirmErrorText}
            </span>
          )}
        </div>

        <div className="kma-auth-field">
          <label className="kma-auth-checkbox-label kma-auth-terms-check">
            <input
              ref={agreedRef}
              type="checkbox"
              className="kma-auth-checkbox"
              checked={agreed}
              onChange={(e) => {
                onAgreedChange(e.target.checked);
                clearFieldError("agreed");
              }}
              aria-invalid={errors.agreed ? true : undefined}
              aria-describedby={errors.agreed ? "reg-agreed-err" : undefined}
              disabled={submitting}
            />
            <span>
              Tôi đã đọc và đồng ý với{" "}
              <button
                type="button"
                className="kma-auth-inline-link"
                onClick={(e) => {
                  e.preventDefault();
                  openModal("terms");
                }}
              >
                Điều khoản dịch vụ
              </button>{" "}
              và{" "}
              <button
                type="button"
                className="kma-auth-inline-link"
                onClick={(e) => {
                  e.preventDefault();
                  openModal("privacy");
                }}
              >
                Chính sách quyền riêng tư
              </button>
              .
            </span>
          </label>

          {legalReadHint && !errors.agreed && (
            <span className="kma-auth-hint kma-auth-hint--ok" role="status">
              <CheckCircle2 size={13} aria-hidden="true" />
              {legalReadHint}
            </span>
          )}

          {errors.agreed && (
            <span
              id="reg-agreed-err"
              className="kma-auth-hint kma-auth-hint--err"
              role="alert"
            >
              <AlertCircle size={13} aria-hidden="true" />
              {errors.agreed}
            </span>
          )}
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
          <span>{submitting ? "Đang tạo tài khoản..." : "Đăng ký"}</span>
        </button>

        <div className="kma-auth-divider">
          <span>hoặc</span>
        </div>

        <button
          type="button"
          className="kma-auth-google"
          onClick={handleGoogleRegister}
          disabled={submitting}
        >
          <GoogleGlyph />
          <span>Đăng ký với Google</span>
        </button>

        <p className="kma-auth-switch">
          Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  const [agreed, setAgreed] = useState(false);
  const [legalReadHint, setLegalReadHint] = useState<string | null>(null);

  function handleConfirmLegal(kind: "privacy" | "terms") {
    setAgreed(true);
    setLegalReadHint(
      kind === "terms"
        ? "Đã xác nhận đọc Điều khoản dịch vụ và tự động đồng ý."
        : "Đã xác nhận đọc Chính sách quyền riêng tư và tự động đồng ý.",
    );
  }

  return (
    <AuthShell
      eyebrow="KMA OVERALL"
      heroTitlePrefix="Bắt đầu"
      heroTitleHighlight="hành trình"
      heroTitleLine2="của bạn."
      heroDescription="Khởi tạo tài khoản sinh viên để quản lý tiến độ tín chỉ, lịch học tuần và kho tài liệu chuyên ngành."
      onConfirmLegal={handleConfirmLegal}
    >
      <RegisterCardForm
        agreed={agreed}
        legalReadHint={legalReadHint}
        onAgreedChange={(val) => {
          setAgreed(val);
          if (!val) setLegalReadHint(null);
        }}
      />
    </AuthShell>
  );
}
