import DashboardHero from "@/components/dashboard/DashboardHero";
import ProfileForm from "@/components/dashboard/ProfileForm";
import { MOCK_USER_RESPONSE } from "@/lib/mock/dashboard";

/**
 * Trang Hồ sơ cá nhân (/dashboard/profile).
 */
export default function DashboardProfilePage() {
  const user = MOCK_USER_RESPONSE.data;

  return (
    <>
      <DashboardHero
        eyebrow="Tài khoản sinh viên"
        titlePrefix="Hồ sơ"
        titleHighlight="cá nhân"
        subtitle={`${user.fullName} • ${user.studentCode} • Lớp ${user.className} — Quản lý thông tin liên hệ, mật khẩu và liên kết Google.`}
      />

      <main className="dash-main">
        <ProfileForm initialUser={user} />
      </main>
    </>
  );
}
