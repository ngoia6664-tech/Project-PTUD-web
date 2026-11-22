import Link from "next/link";
import { ArrowRight, Shield, Swords } from "lucide-react";

/**
 * Banner đỏ sơn mài cuối trang Tổng quan kết hợp CTA "Chơi KMA Battle Royale"
 * dẫn tới trang game để trống (/battleground), đồng bộ Ảnh 1.
 */

export default function BattleRoyaleCard() {
  return (
    <section className="dash-crimson-banner" aria-label="Đồng hành cùng sinh viên KMA">
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <span
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            border: "1px solid rgba(255, 240, 210, 0.35)",
            background: "rgba(255, 255, 255, 0.08)",
            display: "grid",
            placeItems: "center",
            flex: "none",
          }}
          aria-hidden="true"
        >
          <Shield size={26} color="#f5dfae" />
        </span>

        <div>
          <h3>Đồng hành cùng bạn trên hành trình sinh viên KMA</h3>
          <p>
            Học tập hiệu quả, cập nhật tin tức kịp thời — và giải trí cùng bạn bè tại{" "}
            <strong>KMA Battle Royale</strong>.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/battleground" className="dash-btn dash-btn--cream">
          <Swords size={16} />
          Chơi KMA Battle Royale
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
