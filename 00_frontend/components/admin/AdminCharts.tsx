import { BarChart3, PieChart } from "lucide-react";
import type {
  CategoryDistributionPoint,
  MonthlyGrowthPoint,
} from "@/lib/mock/admin";

/**
 * 2 biểu đồ đơn giản tự dựng bằng SVG & CSS thuần (không dùng thư viện biểu đồ ngoài):
 * 1. Biểu đồ cột + nhãn số: Người dùng mới theo 6 tháng gần nhất
 * 2. Biểu đồ phân bổ tài liệu theo nhóm ngành (vòng tròn SVG + thanh tỷ lệ ngang)
 */

interface AdminChartsProps {
  growth: MonthlyGrowthPoint[];
  distribution: CategoryDistributionPoint[];
}

export default function AdminCharts({
  growth,
  distribution,
}: AdminChartsProps) {
  const maxNewUsers = Math.max(...growth.map((g) => g.newUsers), 1);
  const totalDocs = distribution.reduce((sum, d) => sum + d.count, 0) || 1;

  // Tính đoạn strokeDasharray & strokeDashoffset cho vòng tròn SVG phân bổ ngành
  const segments = distribution.reduce<
    {
      label: string;
      count: number;
      color: string;
      percent: number;
      offset: number;
    }[]
  >((acc, item) => {
    const prevEnd =
      acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].percent : 0;
    const percent = (item.count / totalDocs) * 100;
    acc.push({ ...item, percent, offset: prevEnd });
    return acc;
  }, []);

  return (
    <section className="admin-charts-grid" aria-label="Biểu đồ thống kê hệ thống">
      {/* Biểu đồ 1: Biểu đồ cột SVG thuần - Người dùng mới theo tháng */}
      <article className="admin-card">
        <div className="admin-card-head">
          <h2 className="admin-card-title">
            <BarChart3 size={19} color="#8b1218" />
            Người dùng mới 6 tháng gần đây
          </h2>
          <span className="admin-badge admin-badge--gold">SVG thuần</span>
        </div>

        <svg
          viewBox="0 0 480 220"
          width="100%"
          height="220"
          role="img"
          aria-label="Biểu đồ cột số lượng người dùng mới từ tháng 6 đến tháng 11"
        >
          {/* Đường lưới ngang */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = 180 - ratio * 145;
            return (
              <line
                key={ratio}
                x1="28"
                y1={y}
                x2="462"
                y2={y}
                stroke="#eadfce"
                strokeDasharray="4 4"
              />
            );
          })}

          {growth.map((point, index) => {
            const barWidth = 42;
            const gap = 72;
            const x = 44 + index * gap;
            const barHeight = Math.round((point.newUsers / maxNewUsers) * 138);
            const y = 180 - barHeight;
            const isLatest = index === growth.length - 1;

            return (
              <g key={point.month}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="8"
                  fill={isLatest ? "#8b1218" : "#c79a4b"}
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 7}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#1e1916"
                >
                  {point.newUsers}
                </text>
                <text
                  x={x + barWidth / 2}
                  y="202"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#5c5249"
                >
                  {point.month}
                </text>
              </g>
            );
          })}
        </svg>
      </article>

      {/* Biểu đồ 2: Vòng tròn SVG + thanh ngang phân bổ tài liệu theo ngành */}
      <article className="admin-card">
        <div className="admin-card-head">
          <h2 className="admin-card-title">
            <PieChart size={19} color="#8b1218" />
            Phân bổ tài liệu theo khối ngành
          </h2>
          <span className="admin-badge admin-badge--crimson-soft admin-num">
            {totalDocs.toLocaleString("vi-VN")} tài liệu
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "136px 1fr",
            gap: 18,
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 132,
              height: 132,
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg viewBox="0 0 120 120" width="132" height="132" aria-hidden="true">
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#ede3d3"
                strokeWidth="14"
              />
              {segments.map((seg) => (
                <circle
                  key={seg.label}
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="14"
                  pathLength={100}
                  strokeDasharray={`${seg.percent} ${100 - seg.percent}`}
                  strokeDashoffset={-seg.offset}
                  transform="rotate(-90 60 60)"
                />
              ))}
            </svg>
            <div style={{ position: "absolute", textAlign: "center" }}>
              <strong className="admin-num" style={{ fontSize: "1.15rem" }}>
                100%
              </strong>
              <span
                style={{
                  display: "block",
                  fontSize: "0.7rem",
                  color: "#5c5249",
                }}
              >
                Thư viện
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {segments.map((seg) => (
              <div key={seg.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.82rem",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{seg.label}</span>
                  <span className="admin-num" style={{ color: "#5c5249" }}>
                    {seg.count.toLocaleString("vi-VN")} ({Math.round(seg.percent)}%)
                  </span>
                </div>
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill"
                    style={{
                      width: `${seg.percent}%`,
                      backgroundColor: seg.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
