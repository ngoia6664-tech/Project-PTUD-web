"use client";

import { useState } from "react";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import {
  MOCK_ADMIN_USERS_RESPONSE,
  type AdminUserAccount,
  type UserRole,
} from "@/lib/mock/admin";

/**
 * Trang Quản lý Người dùng (/admin/users).
 */
export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserAccount[]>(
    MOCK_ADMIN_USERS_RESPONSE.data,
  );
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  }

  function handleToggleLock(id: string) {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const nextStatus = u.status === "active" ? "locked" : "active";
        showToast(
          nextStatus === "locked"
            ? `Đã khóa tài khoản ${u.fullName} (mô phỏng).`
            : `Đã mở khóa tài khoản ${u.fullName} (mô phỏng).`,
        );
        return { ...u, status: nextStatus };
      }),
    );
  }

  function handleChangeRole(id: string, role: UserRole) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u)),
    );
    showToast("Đã cập nhật vai trò người dùng (dữ liệu mẫu).");
  }

  const keyword = query.trim().toLowerCase();
  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (!keyword) return true;
    return (
      u.fullName.toLowerCase().includes(keyword) ||
      u.code.toLowerCase().includes(keyword) ||
      u.email.toLowerCase().includes(keyword) ||
      u.classOrDept.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div>
          <h2 className="admin-page-title">
            Quản lý <span>Người dùng</span>
          </h2>
          <p className="admin-page-desc">
            Tra cứu tài khoản sinh viên, giảng viên, quản trị viên; khóa/mở hoặc đổi vai trò.
          </p>
        </div>

        <span className="admin-badge admin-badge--gold admin-num">
          {filtered.length} / {users.length} tài khoản
        </span>
      </div>

      {toast && (
        <div className="admin-toast" role="status">
          {toast}
        </div>
      )}

      <AdminUsersTable
        users={filtered}
        query={query}
        onQueryChange={setQuery}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        onToggleLock={handleToggleLock}
        onChangeRole={handleChangeRole}
      />
    </div>
  );
}
