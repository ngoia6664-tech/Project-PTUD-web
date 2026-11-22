import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ProfileForm from "@/components/dashboard/ProfileForm";
import { MOCK_USER_RESPONSE } from "@/lib/mock/dashboard";

/**
 * Trang Hồ sơ cá nhân (/dashboard/profile) theo đặc tả A8:
 * Page header gọn (Q1) + thông tin sinh viên, đổi mật khẩu và liên kết Google.
 */
export default function DashboardProfilePage() {
  const user = MOCK_USER_RESPONSE.data;

  return (
    <>
      <DashboardPageHeader
        breadcrumbs={[
          { label: "Tổng quan", href: "/dashboard" },
          { label: "Hồ sơ cá nhân" },
        ]}
        title="Hồ sơ"
        titleHighlight="cá nhân"
        description={`${user.fullName} • ${user.studentCode} • Lớp ${user.className} — Quản lý thông tin liên hệ, mật khẩu và liên kết Google.`}
      />

      <main className="dash-main">
        <ProfileForm initialUser={user} />
      </main>
    </>
  );
}
