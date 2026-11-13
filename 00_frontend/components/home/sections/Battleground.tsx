"use client";
import { useEffect, useRef } from "react";
import BtnSections from "./BtnSections";
import type { SectionProps } from "./type";

const TW = 72;
const TH = 36;
const N = 9;
const CYCLE = 4.2;

const iso = (x: number, y: number): [number, number] => [
  ((x - y) * TW) / 2,
  ((x + y) * TH) / 2,
];

const pts = (arr: [number, number][]) => arr.map((p) => p.join(",")).join(" ");
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const TILES_DATA = Array.from({ length: N * N }, (_, idx) => {
  const i = Math.floor(idx / N);
  const j = idx % N;
  const edge = i === 0 || j === 0 || i === N - 1 || j === N - 1;
  const dc = Math.hypot(i - 4, j - 4);
  const fill = edge
    ? "#24101A"
    : dc < 2.2
      ? (i + j) % 2
        ? "#43161F"
        : "#3B141D"
      : (i + j) % 2
        ? "#311219"
        : "#2B1018";
  return {
    key: `${i}-${j}`,
    fill,
    points: pts([iso(i, j), iso(i + 1, j), iso(i + 1, j + 1), iso(i, j + 1)]),
  };
});

function IsoCube({
  i,
  j,
  h,
  top,
  left,
  right,
  s = 1,
}: {
  i: number;
  j: number;
  h: number;
  top: string;
  left: string;
  right: string;
  s?: number;
}) {
  const o = (1 - s) / 2;
  const a = iso(i + o, j + o);
  const b = iso(i + 1 - o, j + o);
  const c = iso(i + 1 - o, j + 1 - o);
  const d = iso(i + o, j + 1 - o);
  const up = (p: [number, number]): [number, number] => [p[0], p[1] - h];

  return (
    <g>
      <polygon fill={left} points={pts([d, c, up(c), up(d)])} />
      <polygon fill={right} points={pts([b, c, up(c), up(b)])} />
      <polygon
        className="home-cube-top"
        fill={top}
        points={pts([up(a), up(b), up(c), up(d)])}
      />
    </g>
  );
}

function IsoTree({ i, j }: { i: number; j: number }) {
  const [x, y] = iso(i + 0.5, j + 0.5);
  return (
    <g>
      <rect x={x - 3} y={y - 26} width={6} height={26} fill="#5A3A2A" />
      <circle cx={x} cy={y - 40} r={22} fill="#2F8A63" />
      <circle cx={x - 7} cy={y - 47} r={10} fill="#3DAA7D" opacity={0.8} />
    </g>
  );
}

function IsoChest({ i, j }: { i: number; j: number }) {
  const [x, y] = iso(i + 0.5, j + 0.5);
  return (
    <g>
      <IsoCube
        i={i}
        j={j}
        h={16}
        top="#E9C46A"
        left="#8C6A26"
        right="#A47D2E"
        s={0.45}
      />
      <polygon
        className="home-gem"
        fill="#F3DCA2"
        points={pts([
          [x, y - 44],
          [x + 7, y - 34],
          [x, y - 24],
          [x - 7, y - 34],
        ])}
      />
    </g>
  );
}

export default function Battleground({
  title,
  description,
  isActive,
}: SectionProps) {
  const arenaWorldRef = useRef<SVGGElement | null>(null);
  const fightersRef = useRef<SVGGElement | null>(null);
  const fighterARef = useRef<SVGGElement | null>(null);
  const fighterBRef = useRef<SVGGElement | null>(null);
  const armARef = useRef<SVGGElement | null>(null);
  const armBRef = useRef<SVGGElement | null>(null);
  const sparkRef = useRef<SVGGElement | null>(null);
  const cipherRef = useRef<HTMLCanvasElement | null>(null);
  const heatTargetRef = useRef(0);
  const isActiveRef = useRef(Boolean(isActive));

  useEffect(() => {
    isActiveRef.current = Boolean(isActive);
  }, [isActive]);

  useEffect(() => {
    const fA = fighterARef.current;
    const fB = fighterBRef.current;
    const armA = armARef.current;
    const armB = armBRef.current;
    const spark = sparkRef.current;
    const arenaWorld = arenaWorldRef.current;
    const fighters = fightersRef.current;
    const cipher = cipherRef.current;
    if (!fA || !fB || !armA || !armB || !spark || !arenaWorld || !fighters) {
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const center = 4.5;
    let arenaT = 0;
    let theta = -Math.PI / 4;

    const placeFighter = (
      el: SVGGElement,
      arm: SVGGElement,
      x: number,
      y: number,
      face: number,
      hop: number,
      armDeg: number,
    ): [number, number] => {
      const [sx, sy] = iso(x, y);
      el.setAttribute(
        "transform",
        `translate(${sx.toFixed(1)} ${(sy - hop).toFixed(1)}) scale(${face * 1.35} 1.35)`,
      );
      arm.setAttribute("transform", `rotate(${armDeg.toFixed(1)} 4 -26)`);
      return [sx, sy];
    };

    const renderArena = (t: number) => {
      let d: number;
      let hopA = 0;
      let hopB = 0;
      let armA_ = -35;
      let armB_ = -35;
      let th = theta;

      if (t < 0.3) {
        const p = easeInOut(t / 0.3);
        d = lerp(2.5, 0.62, p);
        hopA = hopB = Math.abs(Math.sin(p * Math.PI * 3)) * 6;
        armA_ = armB_ = lerp(-35, -60, p);
      } else if (t < 0.62) {
        d = 0.62;
        const local = (t - 0.3) / 0.32;
        const beat = (local * 2) % 1;
        const swing =
          beat < 0.45
            ? lerp(-60, -115, easeOut(beat / 0.45))
            : lerp(-115, 18, easeOut((beat - 0.45) / 0.55));
        armA_ = swing;
        armB_ = local < 0.5 ? lerp(-60, 10, easeOut(beat)) : swing;
      } else if (t < 0.78) {
        const p = easeOut((t - 0.62) / 0.16);
        d = lerp(0.62, 2.5, p);
        hopA = hopB = Math.sin(p * Math.PI) * 18;
        armA_ = armB_ = lerp(10, -35, p);
      } else {
        d = 2.5;
        const p = easeInOut((t - 0.78) / 0.22);
        th = theta + p * (Math.PI / 2.6);
        hopA = hopB = Math.abs(Math.sin(p * Math.PI * 4)) * 4;
      }

      const cx = Math.cos(th) * d;
      const cy = Math.sin(th) * d;
      const ax = center + cx;
      const ay = center + cy;
      const bx = center - cx;
      const by = center - cy;

      const [sax] = iso(ax, ay);
      const [sbx] = iso(bx, by);
      const faceA = sax <= sbx ? 1 : -1;

      const pa = placeFighter(fA, armA, ax, ay, faceA, hopA, armA_);
      const pb = placeFighter(fB, armB, bx, by, -faceA, hopB, armB_);

      if ((ax + ay > bx + by) !== (fighters.lastElementChild === fA)) {
        fighters.appendChild(ax + ay > bx + by ? fA : fB);
      }

      let s = 0;
      for (const hit of [0.42, 0.58]) {
        const k = (t - hit) / 0.07;
        if (k >= 0 && k < 1) s = Math.max(s, 1 - k);
      }
      const mxp = (pa[0] + pb[0]) / 2;
      const myp = (pa[1] + pb[1]) / 2 - 40;
      spark.setAttribute("opacity", s.toFixed(2));
      spark.setAttribute(
        "transform",
        `translate(${mxp.toFixed(1)} ${myp.toFixed(1)}) scale(${(0.6 + (1 - s) * 0.9).toFixed(2)})`,
      );
      const shake = s > 0.6 ? (Math.random() - 0.5) * 5 : 0;
      arenaWorld.setAttribute(
        "transform",
        `translate(${shake.toFixed(1)} ${(shake * 0.5).toFixed(1)})`,
      );
    };

    // Setup hex cipher rain canvas
    const cctx = cipher && !reduced ? cipher.getContext("2d") : null;
    const CF = 15;
    const HEX = "0123456789ABCDEF";
    let drops: { y: number; v: number; len: number }[] = [];
    let heat = 0;

    const sizeCipher = () => {
      if (!cipher || !cctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = cipher.offsetWidth;
      const h = cipher.offsetHeight;
      cipher.width = w * dpr;
      cipher.height = h * dpr;
      cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cctx.font = `500 ${CF - 2}px ui-monospace, Consolas, monospace`;
      drops = Array.from({ length: Math.ceil(w / CF) }, () => ({
        y: Math.random() * h,
        v: 18 + Math.random() * 42,
        len: 6 + ((Math.random() * 14) | 0),
      }));
    };

    const drawCipher = (dt: number) => {
      if (!cipher || !cctx) return;
      const w = cipher.offsetWidth;
      const h = cipher.offsetHeight;
      heat = lerp(heat, heatTargetRef.current, 0.06);
      cctx.clearRect(0, 0, w, h);
      const r = Math.round(lerp(233, 230, heat));
      const g = Math.round(lerp(196, 60, heat));
      const b = Math.round(lerp(106, 66, heat));
      drops.forEach((d, i) => {
        d.y += d.v * (1 + heat * 1.8) * dt;
        if (d.y - d.len * CF > h) {
          d.y = -Math.random() * h * 0.5;
          d.len = 6 + ((Math.random() * 14) | 0);
        }
        for (let k = 0; k < d.len; k++) {
          const y = d.y - k * CF;
          if (y < -CF || y > h + CF) continue;
          const a =
            (k === 0 ? 0.55 : 0.28 * (1 - k / d.len)) * (0.6 + heat * 0.6);
          cctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
          cctx.fillText(
            HEX[(i * 7 + k * 13 + ((y / CF) | 0)) & 15],
            i * CF,
            y,
          );
        }
      });
    };

    sizeCipher();
    window.addEventListener("resize", sizeCipher, { passive: true });

    if (reduced) {
      renderArena(0.43);
      return () => {
        window.removeEventListener("resize", sizeCipher);
      };
    }

    renderArena(0);
    let lastFrame = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;
      if (isActiveRef.current && document.visibilityState === "visible") {
        arenaT += dt / CYCLE;
        if (arenaT >= 1) {
          arenaT -= 1;
          theta += Math.PI / 2.6;
        }
        renderArena(arenaT);
        if (cctx) drawCipher(dt);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", sizeCipher);
    };
  }, []);

  return (
    <section className="home-battle" aria-labelledby="homeBattleTitle">
      <canvas className="home-cipher" ref={cipherRef} aria-hidden="true" />
      <div className="home-stage home-battle-inner">
        <div className="home-battle-text">
          <h2 id="homeBattleTitle">{title}</h2>
          <p>{description}</p>
          <div
            onPointerEnter={() => {
              heatTargetRef.current = 1;
            }}
            onPointerLeave={() => {
              heatTargetRef.current = 0;
            }}
            style={{ display: "inline-block" }}
          >
            <BtnSections
              name="Vào đấu trường"
              variant="primary"
              effect="sword"
            />
          </div>
          <p className="home-note">
            Battleground do nhóm khác phát triển. Cảnh bên cạnh là minh họa,
            không phải hình ảnh trong game.
          </p>
        </div>

        <figure
          className="home-arena"
          onPointerEnter={() => {
            heatTargetRef.current = 1;
          }}
          onPointerLeave={() => {
            heatTargetRef.current = 0;
          }}
        >
          <svg
            className="home-arena-svg"
            viewBox="-360 -120 720 500"
            role="img"
            aria-label="Minh họa: hai nhân vật đấu kiếm trên bản đồ ô vuông nhìn nghiêng"
          >
            <defs>
              <radialGradient id="homeArenaGlow">
                <stop offset="0" stopColor="#C1272D" stopOpacity=".55" />
                <stop offset="1" stopColor="#C1272D" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="homeSparkCore">
                <stop offset="0" stopColor="#fff" />
                <stop offset=".4" stopColor="#F6D98E" />
                <stop offset="1" stopColor="#E9C46A" stopOpacity="0" />
              </radialGradient>
              <g id="homeFighter">
                <ellipse
                  className="home-f-shadow"
                  cx="0"
                  cy="0"
                  rx="15"
                  ry="6"
                />
                <g className="home-f-body">
                  <path
                    className="home-f-cape"
                    d="M-5-33Q-17-18-13-3L-2-6Z"
                  />
                  <rect
                    className="home-f-leg"
                    x="-6"
                    y="-12"
                    width="5"
                    height="12"
                    rx="2"
                  />
                  <rect
                    className="home-f-leg"
                    x="1"
                    y="-12"
                    width="5"
                    height="12"
                    rx="2"
                  />
                  <rect
                    className="home-f-torso"
                    x="-8"
                    y="-32"
                    width="16"
                    height="22"
                    rx="6"
                  />
                  <circle className="home-f-head" cx="0" cy="-41" r="9" />
                  <rect
                    className="home-f-visor"
                    x="1"
                    y="-44"
                    width="7"
                    height="4"
                    rx="2"
                  />
                </g>
              </g>
            </defs>

            <g ref={arenaWorldRef}>
              <ellipse
                cx="0"
                cy="170"
                rx="300"
                ry="150"
                fill="url(#homeArenaGlow)"
              />
              <g>
                {TILES_DATA.map((tile) => (
                  <polygon
                    key={tile.key}
                    className="home-tile"
                    fill={tile.fill}
                    points={tile.points}
                  />
                ))}
              </g>
              <g>
                <IsoCube
                  i={0}
                  j={1}
                  h={70}
                  top="#C1272D"
                  left="#7A161B"
                  right="#96191F"
                />
                <IsoCube
                  i={1}
                  j={0}
                  h={34}
                  top="#5A2A30"
                  left="#341519"
                  right="#42191E"
                />
                <IsoCube
                  i={7}
                  j={1}
                  h={26}
                  top="#4B5568"
                  left="#2A3040"
                  right="#353D50"
                  s={0.8}
                />
                <IsoTree i={4} j={0} />
                <IsoChest i={2} j={1} />
                <IsoChest i={0} j={5} />
              </g>
              <g ref={fightersRef}>
                <g className="home-f home-f--a" ref={fighterARef}>
                  <use href="#homeFighter" />
                  <g className="home-f-arm" ref={armARef}>
                    <rect
                      className="home-f-hilt"
                      x="2"
                      y="-29"
                      width="7"
                      height="5"
                      rx="2"
                    />
                    <rect
                      className="home-f-blade"
                      x="8"
                      y="-28"
                      width="30"
                      height="3"
                      rx="1.5"
                    />
                  </g>
                </g>
                <g className="home-f home-f--b" ref={fighterBRef}>
                  <use href="#homeFighter" />
                  <g className="home-f-arm" ref={armBRef}>
                    <rect
                      className="home-f-hilt"
                      x="2"
                      y="-29"
                      width="7"
                      height="5"
                      rx="2"
                    />
                    <rect
                      className="home-f-blade"
                      x="8"
                      y="-28"
                      width="30"
                      height="3"
                      rx="1.5"
                    />
                  </g>
                </g>
              </g>
              <g>
                <IsoCube
                  i={1}
                  j={7}
                  h={22}
                  top="#4B5568"
                  left="#2A3040"
                  right="#353D50"
                  s={0.7}
                />
                <IsoCube
                  i={7}
                  j={7}
                  h={44}
                  top="#C1272D"
                  left="#7A161B"
                  right="#96191F"
                  s={0.9}
                />
                <IsoTree i={8} j={4} />
                <IsoChest i={6} j={7} />
              </g>
              <g ref={sparkRef} className="home-spark" opacity="0">
                <circle r="20" fill="url(#homeSparkCore)" />
                <circle className="home-spark-ring" r="16" />
                <path
                  className="home-spark-rays"
                  d="M0-30V-18M0 18V30M-30 0H-18M18 0H30M-21-21l8 8M13 13l8 8M21-21l-8 8M-13 13l-8 8"
                />
              </g>
            </g>
          </svg>
          <figcaption className="home-chip">Cảnh minh họa</figcaption>
        </figure>
      </div>
    </section>
  );
}
