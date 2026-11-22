"use client";

import { useState } from "react";
import { KeyRound, Link2, Save, UserCheck } from "lucide-react";
import type { User } from "@/lib/mock/dashboard";

/**
 * Giao diện Hồ sơ cá nhân gồm 3 khối rõ ràng:
 * 1. Thông tin cá nhân sinh viên
 * 2. Đổi mật khẩu (giao diện mẫu)
 * 3. Nút "Liên kết Google" (chỉ giao diện, chưa gọi OAuth thật)
 */

interface ProfileFormProps {
  initialUser: User;
}

export default function ProfileForm({ initialUser }: ProfileFormProps) {
  const [user, setUser] = useState<User>(initialUser);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3200);
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    showNotice("Đã cập nhật thông tin cá nhân (dữ liệu mẫu trên trình duyệt).");
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showNotice("Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotice("Xác nhận mật khẩu mới chưa khớp.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showNotice("Đã gửi yêu cầu đổi mật khẩu (giao diện mẫu).");
  }

  function handleToggleGoogle() {
    setUser((prev) => ({
      ...prev,
      googleLinked: !prev.googleLinked,
      googleEmail: !prev.googleLinked ? prev.email : undefined,
    }));
    showNotice(
      user.googleLinked
        ? "Đã hủy liên kết Google (giao diện mẫu)."
        : "Đã mô phỏng liên kết tài khoản Google thành công.",
    );
  }

  return (
    <div className="dash-stack">
      {notice && (
        <div className="dash-toast" role="status">
          {notice}
        </div>
      )}

      <div className="dash-profile-grid">
        {/* Thông tin sinh viên */}
        <form className="dash-card dash-stack" style={{ gap: 16 }} onSubmit={handleSaveProfile}>
          <div className="dash-card-head" style={{ marginBottom: 0 }}>
            <h2 className="dash-card-title">
              <UserCheck size={19} color="#8b1218" />
              Thông tin sinh viên
            </h2>
            <span className="dash-badge dash-badge--crimson-soft">
              {user.studentCode}
            </span>
          </div>

          <div className="dash-form-grid">
            <label className="dash-field">
              <span className="dash-label">Họ và tên</span>
              <input
                type="text"
                className="dash-input"
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              />
            </label>

            <label className="dash-field">
              <span className="dash-label">Mã sinh viên</span>
              <input
                type="text"
                className="dash-input"
                value={user.studentCode}
                disabled
              />
            </label>

            <label className="dash-field">
              <span className="dash-label">Email học viện</span>
              <input
                type="email"
                className="dash-input"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </label>

            <label className="dash-field">
              <span className="dash-label">Số điện thoại</span>
              <input
                type="tel"
                className="dash-input"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
            </label>

            <label className="dash-field">
              <span className="dash-label">Ngành đào tạo</span>
              <input
                type="text"
                className="dash-input"
                value={user.majorName}
                disabled
              />
            </label>

            <label className="dash-field">
              <span className="dash-label">Lớp / Khóa</span>
              <input
                type="text"
                className="dash-input"
                value={`${user.className} • ${user.cohort}`}
                disabled
              />
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="dash-btn dash-btn--primary">
              <Save size={16} />
              Lưu thay đổi
            </button>
          </div>
        </form>

        {/* Đổi mật khẩu & Liên kết Google */}
        <div className="dash-stack" style={{ gap: 18 }}>
          <form className="dash-card dash-stack" style={{ gap: 12 }} onSubmit={handleChangePassword}>
            <h2 className="dash-card-title">
              <KeyRound size={19} color="#7d5616" />
              Đổi mật khẩu
            </h2>

            <label className="dash-field">
              <span className="dash-label">Mật khẩu hiện tại</span>
              <input
                type="password"
                className="dash-input"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>

            <label className="dash-field">
              <span className="dash-label">Mật khẩu mới</span>
              <input
                type="password"
                className="dash-input"
                placeholder="Tối thiểu 8 ký tự"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>

            <label className="dash-field">
              <span className="dash-label">Nhập lại mật khẩu mới</span>
              <input
                type="password"
                className="dash-input"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                className="dash-btn dash-btn--outline-crimson dash-btn--sm"
              >
                Cập nhật mật khẩu
              </button>
            </div>
          </form>

          <section className="dash-card dash-stack" style={{ gap: 12 }}>
            <h2 className="dash-card-title">
              <Link2 size={19} color="#8b1218" />
              Tài khoản liên kết
            </h2>

            <div
              className="dash-upcoming-item"
              style={{ justifyContent: "space-between", flexWrap: "wrap" }}
            >
              <div>
                <strong style={{ display: "block" }}>Google Account</strong>
                <span style={{ fontSize: "0.8rem", color: "#6e6359" }}>
                  {user.googleLinked
                    ? `Đã liên kết với ${user.googleEmail}`
                    : "Chưa liên kết (chỉ giao diện mẫu, chưa kết nối OAuth)"}
                </span>
              </div>

              <button
                type="button"
                className={`dash-btn dash-btn--sm ${
                  user.googleLinked ? "dash-btn--danger" : "dash-btn--primary"
                }`}
                onClick={handleToggleGoogle}
              >
                {user.googleLinked ? "Hủy liên kết" : "Liên kết Google"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
