"use client";

import Link from "next/link";
import { AreaChart, User, Mail, Lock, LockKeyhole } from "lucide-react";
import "@/components/auth/auth.css";

export default function Register() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Tên dự án đăng ký</h1>

        {/* Logo có icon */}
        <div className="logo-container">
          <div className="logo">
            <AreaChart size={22} color="white" />
          </div>
        </div>

        {/* Thanh điều hướng đăng nhập / đăng ký */}
        <nav className="auth-nav">
          <Link href="/register" className="active" >
            Đăng ký
          </Link>
          <span className=" divider">/</span>
          <Link href="/login" className="auth-link">Đăng nhập</Link>
        </nav>

        {/* Khối đăng ký với Google */}
        <button className="google-btn" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"/>
            <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"/>
          </svg>
          <span>Đăng ký với Google</span>
        </button>

        <div className="separator">
          <span>Hoặc với email</span>
        </div>

        {/* Form đăng ký với email */}
        <form className="auth-form" action="" method="get">
          <div className="input-group">
            <label>Họ tên</label>
            <div className="input-wrapper">
              <User className="field-icon" size={16} />
              <input type="text" placeholder="Nguyễn Văn A" required />
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail className="field-icon" size={16} />
              <input type="email" placeholder="A@gmail.com" required />
            </div>
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <div className="input-wrapper">
              <Lock className="field-icon" size={16} />
              <input type="password" placeholder="••••••••" required />
            </div>
          </div>

          <div className="input-group">
            <label>Xác nhận mật khẩu</label>
            <div className="input-wrapper">
              <LockKeyhole className="field-icon" size={16} />
              <input type="password" placeholder="••••••••" required />
            </div>
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">Bạn đồng ý với điều khoản của tôi</label>
          </div>

          <button type="submit" className="submit-btn">
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}
