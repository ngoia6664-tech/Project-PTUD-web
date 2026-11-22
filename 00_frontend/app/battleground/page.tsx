import Link from "next/link";
import { ArrowLeft, Swords } from "lucide-react";
import "@/components/dashboard/dashboard.css";

/**
 * Trang đích để trống (placeholder) cho thẻ "Chơi KMA Battle Royale".
 * Nội dung trò chơi sẽ do nhóm phụ trách đấu trường bổ sung sau.
 */
export default function BattlegroundPlaceholderPage() {
  return (
    <main className="dash-game-placeholder">
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 18,
          display: "grid",
          placeItems: "center",
          background: "#fdf1f1",
          border: "1px solid rgba(139, 18, 24, 0.25)",
          color: "#8b1218",
        }}
      >
        <Swords size={30} />
      </div>
      <h1
        style={{
          margin: 0,
          fontSize: "2rem",
          color: "#8b1218",
          fontFamily: "Playfair Display, Georgia, serif",
        }}
      >
        KMA Battle Royale
      </h1>
      <p style={{ margin: 0, maxWidth: 460, color: "#6e6359" }}>
        Trang trò chơi hiện đang để trống theo yêu cầu giao diện mẫu.
      </p>
      <Link href="/dashboard" className="dash-btn dash-btn--primary">
        <ArrowLeft size={16} />
        Quay lại Dashboard sinh viên
      </Link>
    </main>
  );
}
