"use client";

import { BarChart3, PieChart } from "lucide-react";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { useInViewOnce } from "@/components/ui/useInViewOnce";
import type {
  CategoryDistributionPoint,
  MonthlyGrowthPoint,
} from "@/lib/mock/admin";

/**
 * 2 biểu đồ SVG thuần (không thư viện ngoài) vẽ dần ĐÚNG MỘT LẦN khi cuộn tới (IntersectionObserver):
 * 1. "Người dùng mới 6 tháng": cột mọc từ đáy so le 60ms + đường xu hướng stroke-dashoffset + vùng tô + điểm nảy.
 * 2. "Tài liệu theo khối ngành": donut vẽ từng cung theo stroke-dashoffset; số giữa donut tính trực tiếp từ dữ liệu.
 */

interface AdminChartsProps {
  growth: MonthlyGrowthPoint[];
  distribution: CategoryDistributionPoint[];
}

export default function AdminCharts({
  growth,
  distribution,
}: AdminChartsProps) {
  const { ref: sectionRef, inView } = useInViewOnce<HTMLElement>(0.18);

  const maxNewUsers = Math.max(...growth.map((g) => g.newUsers), 1);
  const totalDocs = distribution.reduce((sum, d) => sum + d.count, 0);
  const safeTotalDocs = totalDocs || 1;

  // Tọa độ cột và đường xu hướng cho Biểu đồ 1
  const points = growth.map((point, index) => {
    const barWidth = 36;
    const gap = 72;
    const x = 44 + index * gap;
    const barHeight = Math.round((point.newUsers / maxNewUsers) * 132);
    const y = 180 - barHeight;
    return {
      ...point,
      x,
      barWidth,
      barHeight,
      y,
      cx: x + barWidth / 2,
    };
  });

  const linePath = points
    .map((p, idx) => `${idx === 0 ? "M" : "L"}${p.cx} ${p.y}`)
    .join(" ");
  const areaPath =
    points.length > 0
      ? `${linePath} L${points[points.length - 1].cx} 180 L${points[0].cx} 180 Z`
      : "";

  // Tính từng cung tròn donut từ dữ liệu thật (không gắn chữ "100%" cứng)
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
    const percent = (item.count / safeTotalDocs) * 100;
    acc.push({ ...item, percent, offset: prevEnd });
    return acc;
  }, []);

  return (
    <section
      ref={sectionRef}
      className="admin-charts-grid"
      aria-label="Biểu đồ thống kê hệ thống"
    >
      {/* Biểu đồ 1: Cột mọc so le 60ms + đường xu hướng vẽ dần */}
      <article className="admin-card">
        <div className="admin-card-head">
          <h2 className="admin-card-title">
            <BarChart3 size={19} color="#8b1218" strokeWidth={1.75} />
            Người dùng mới 6 tháng gần đây
          </h2>
          <span className="admin-badge admin-badge--gold">Xu hướng tăng</span>
        </div>

        <svg
          viewBox="0 0 480 220"
          width="100%"
          height="220"
          role="img"
          aria-label="Biểu đồ cột và đường xu hướng người dùng mới 6 tháng gần đây"
        >
          <defs>
            <linearGradient id="adminGrowthArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b1218" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#8b1218" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = 180 - ratio * 136;
            return (
              <line
                key={ratio}
                x1="28"
                y1={y}
                x2="462"
                y2={y}
                stroke="#e7dccb"
                strokeDasharray="4 4"
              />
            );
          })}

          {areaPath && (
            <path
              d={areaPath}
              fill="url(#adminGrowthArea)"
              className={`kma-svg-area ${inView ? "kma-svg-area--visible" : ""}`}
            />
          )}

          {points.map((point, index) => {
            const isLatest = index === points.length - 1;
            return (
              <g key={point.month}>
                <rect
                  x={point.x}
                  y={point.y}
                  width={point.barWidth}
                  height={point.barHeight}
                  rx="7"
                  fill={isLatest ? "#8b1218" : "#d8b46d"}
                  className={`kma-svg-bar ${inView ? "kma-svg-bar--visible" : ""}`}
                  style={{ animationDelay: `${index * 60}ms` }}
                />
                <text
                  x={point.cx}
                  y="204"
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

          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#6b0c11"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              className={`kma-svg-line ${inView ? "kma-svg-line--visible" : ""}`}
            />
          )}

          {points.map((point, index) => (
            <g key={`dot-${point.month}`}>
              <circle
                cx={point.cx}
                cy={point.y}
                r="4.5"
                fill="#fffdf9"
                stroke="#8b1218"
                strokeWidth="2.4"
                className={`kma-svg-dot ${inView ? "kma-svg-dot--visible" : ""}`}
                style={{ animationDelay: `${340 + index * 70}ms` }}
              />
              <text
                x={point.cx}
                y={point.y - 10}
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="700"
                fill="#1e1916"
              >
                {point.newUsers}
              </text>
            </g>
          ))}
        </svg>
      </article>

      {/* Biểu đồ 2: Donut vẽ từng cung bằng stroke-dashoffset; số giữa tính từ dữ liệu */}
      <article className="admin-card">
        <div className="admin-card-head">
          <h2 className="admin-card-title">
            <PieChart size={19} color="#8b1218" strokeWidth={1.75} />
            Tài liệu theo khối ngành
          </h2>
          <span className="admin-badge admin-badge--crimson-soft admin-num">
            {totalDocs.toLocaleString("vi-VN")} tài liệu
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "144px 1fr",
            gap: 18,
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 140,
              height: 140,
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg viewBox="0 0 120 120" width="140" height="140" aria-hidden="true">
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#ede3d3"
                strokeWidth="14"
              />
              {segments.map((seg, idx) => (
                <circle
                  key={seg.label}
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="14"
                  pathLength={100}
                  strokeDasharray={`${seg.percent} 100`}
                  strokeDashoffset={inView ? -seg.offset : 100}
                  transform="rotate(-90 60 60)"
                  className="kma-svg-arc"
                  style={{ transitionDelay: `${idx * 120}ms` }}
                />
              ))}
            </svg>
            <div style={{ position: "absolute", textAlign: "center", lineHeight: 1.2 }}>
              <strong className="admin-num" style={{ fontSize: "1.1rem", color: "#1e1916" }}>
                <AnimatedNumber value={totalDocs} locale />
              </strong>
              <span
                style={{
                  display: "block",
                  fontSize: "0.72rem",
                  color: "#5c5249",
                }}
              >
                tài liệu
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
                      width: `${inView ? seg.percent : 0}%`,
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
