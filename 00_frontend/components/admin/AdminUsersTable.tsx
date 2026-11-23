"use client";

import { Lock, Search, Unlock } from "lucide-react";
import KmaSegmentedTabs from "@/components/ui/KmaSegmentedTabs";
import type { AdminUserAccount, UserRole } from "@/lib/mock/admin";

/**
 * Bảng quản lý người dùng (/admin/users):
 * Tìm kiếm theo tên/mã/email, lọc theo vai trò, khóa/mở tài khoản và đổi vai trò trực tiếp.
 */

interface AdminUsersTableProps {
  users: AdminUserAccount[];
  query: string;
  onQueryChange: (value: string) => void;
  roleFilter: "all" | UserRole;
  onRoleFilterChange: (value: "all" | UserRole) => void;
  onToggleLock: (id: string) => void;
  onChangeRole: (id: string, role: UserRole) => void;
}

const ROLE_OPTIONS: { value: "all" | UserRole; label: string }[] = [
  { value: "all", label: "Tất cả vai trò" },
  { value: "student", label: "Sinh viên" },
  { value: "lecturer", label: "Giảng viên" },
  { value: "admin", label: "Quản trị viên" },
];

export default function AdminUsersTable({
  users,
  query,
  onQueryChange,
  roleFilter,
  onRoleFilterChange,
  onToggleLock,
  onChangeRole,
}: AdminUsersTableProps) {
  return (
    <section className="admin-card admin-stack" style={{ gap: 16 }}>
      {/* Thanh tìm kiếm và lọc vai trò */}
      <div className="admin-toolbar">
        <div style={{ position: "relative", flex: 1, minWidth: 230 }}>
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
            className="admin-input"
            style={{ paddingLeft: 36 }}
            placeholder="Tìm theo mã, họ tên hoặc email..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label="Tìm kiếm người dùng"
          />
        </div>

        <KmaSegmentedTabs
          ariaLabel="Lọc theo vai trò"
          value={roleFilter}
          onChange={onRoleFilterChange}
          options={ROLE_OPTIONS}
        />
      </div>

      {/* Bảng tài khoản */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Họ và tên / Email</th>
              <th>Lớp / Đơn vị</th>
              <th style={{ width: 170 }}>Vai trò</th>
              <th>Trạng thái</th>
              <th style={{ width: 130 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#5c5249" }}>
                  Không tìm thấy người dùng phù hợp.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="admin-num" style={{ fontWeight: 700, color: "#8b1218" }}>
                    {user.code}
                  </td>
                  <td>
                    <strong style={{ display: "block" }}>{user.fullName}</strong>
                    <span style={{ fontSize: "0.78rem", color: "#5c5249" }}>
                      {user.email}
                    </span>
                  </td>
                  <td>{user.classOrDept}</td>
                  <td>
                    <select
                      className="admin-select"
                      style={{ padding: "6px 10px", fontSize: "0.82rem" }}
                      value={user.role}
                      onChange={(e) =>
                        onChangeRole(user.id, e.target.value as UserRole)
                      }
                      aria-label={`Đổi vai trò cho ${user.fullName}`}
                    >
                      <option value="student">Sinh viên</option>
                      <option value="lecturer">Giảng viên</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${
                        user.status === "active"
                          ? "admin-badge--jade"
                          : "admin-badge--crimson-soft"
                      }`}
                    >
                      {user.status === "active" ? "Đang hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`admin-btn admin-btn--sm ${
                        user.status === "active"
                          ? "admin-btn--danger"
                          : "admin-btn--jade"
                      }`}
                      onClick={() => onToggleLock(user.id)}
                    >
                      {user.status === "active" ? (
                        <>
                          <Lock size={13} />
                          Khóa
                        </>
                      ) : (
                        <>
                          <Unlock size={13} />
                          Mở khóa
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
