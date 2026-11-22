"use client";

import { useState } from "react";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import {
  DataSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/DataStates";
import { useDemoState } from "@/components/ui/useDemoState";
import {
  MOCK_ADMIN_USERS_RESPONSE,
  type AdminUserAccount,
  type UserRole,
} from "@/lib/mock/admin";

/**
 * Trang Quản lý Người dùng (/admin/users) theo đặc tả B4:
 * Tìm kiếm, lọc vai trò + trạng thái, khóa/mở tài khoản, đổi vai trò và hỗ trợ ?demo=loading|empty|error.
 */
export default function AdminUsersPage() {
  const { demoMode, retryDemo } = useDemoState();
  const [users, setUsers] = useState<AdminUserAccount[]>(
    MOCK_ADMIN_USERS_RESPONSE.data,
  );
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "locked">(
    "all",
  );
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
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
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
            Tra cứu tài khoản sinh viên, giảng viên, quản trị viên; lọc vai trò, trạng thái và phân quyền.
          </p>
        </div>

        <div className="admin-toolbar">
          <select
            className="admin-select"
            style={{ width: "auto", minWidth: 160 }}
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "active" | "locked")
            }
            aria-label="Lọc theo trạng thái tài khoản"
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="locked">Đã khóa</option>
          </select>

          <span className="admin-badge admin-badge--gold admin-num">
            {filtered.length} / {users.length} tài khoản
          </span>
        </div>
      </div>

      {toast && (
        <div className="admin-toast" role="status">
          {toast}
        </div>
      )}

      {demoMode === "loading" ? (
        <DataSkeleton variant="table" count={5} />
      ) : demoMode === "error" ? (
        <ErrorState
          title="Không thể tải danh sách người dùng"
          message="Hệ thống chưa thể truy vấn danh sách tài khoản. Vui lòng thử lại."
          onRetry={retryDemo}
        />
      ) : demoMode === "empty" ? (
        <EmptyState
          title="Chưa có tài khoản nào"
          description="Thử xóa bộ lọc tìm kiếm hoặc tải lại danh sách người dùng mẫu."
          actionLabel="Tải lại danh sách"
          onAction={retryDemo}
        />
      ) : (
        <AdminUsersTable
          users={filtered}
          query={query}
          onQueryChange={setQuery}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          onToggleLock={handleToggleLock}
          onChangeRole={handleChangeRole}
        />
      )}
    </div>
  );
}
