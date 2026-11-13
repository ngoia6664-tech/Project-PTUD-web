"use client";
import "./home.css";
import { Introduction } from "./sections/Introduction";
import Study from "./sections/Study";
import Library from "./sections/Library";
import Battleground from "./sections/Battleground";
import News from "./sections/News";
import Community from "./sections/Community";
import BtnSections from "./sections/BtnSections";
import { isMuted, setMuted, subscribeMuted } from "./sfx";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const allSection = [
  {
    id: 1,
    navLabel: "Trang chủ",
    Component: Introduction,
    title: "Học hết mình. Chơi cùng nhau.",
    description:
      "Không gian dành cho sinh viên KMA học tập, chia sẻ và kết nối cùng nhau.",
    sky: ["#0E1322", "#0E1322", "#E9C46A", "#C1272D"],
  },
  {
    id: 2,
    navLabel: "Học tập",
    Component: Study,
    title: "Học tập",
    description:
      "Ba công cụ nối với nhau: tính điểm, xem chương trình của ngành, và biết mình đã đi được bao xa.",
    sky: ["#111A33", "#0E1322", "#E9C46A", "#C1272D"],
  },
  {
    id: 3,
    navLabel: "Thư viện",
    Component: Library,
    title: "Kiến thức của KMA, cùng nhau chia sẻ.",
    description: "",
    sky: ["#0B1B1F", "#0C1421", "#3DAA7D", "#E9C46A"],
  },
  {
    id: 4,
    navLabel: "Battleground",
    Component: Battleground,
    title: "Sau giờ học, vào trận cùng nhau.",
    description:
      "Sinh tồn theo lượt: di chuyển trên bản đồ, tìm vật phẩm và đối đầu cùng các bạn trong cộng đồng KMA.",
    sky: ["#1D0A12", "#2B0E15", "#C1272D", "#E9C46A"],
  },
  {
    id: 5,
    navLabel: "Tin tức",
    Component: News,
    title: "Tin tức KMA",
    description:
      "Thông báo, tin học vụ và thời hạn từ nguồn của Học viện, gom về một chỗ. Mỗi tin ghi rõ nguồn và dẫn về bài gốc.",
    sky: ["#0D1528", "#0E1322", "#8FA6C4", "#3DAA7D"],
  },
  {
    id: 6,
    navLabel: "Cộng đồng",
    Component: Community,
    title: "Một cộng đồng KMA, nhiều hành trình chung.",
    description:
      "Cùng học tập, chia sẻ kiến thức và tạo nên những trải nghiệm đáng nhớ.",
    sky: ["#1B1226", "#2A1318", "#E9C46A", "#C1272D"],
  },
];

const hexToRgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

const parsedSkies = allSection.map((s) => s.sky.map(hexToRgb));

const DEPTH = 2000;
const TONG = (allSection.length - 1) * DEPTH;
const VUNG_TRUOC = 1500;
const VUNG_SAU = 600;

export default function World25D() {
  const targetProcess = useRef(0); // vị trí muốn tới
  const currentProcess = useRef(0); // vị trí hiện tại
  const layerRef = useRef<(HTMLDivElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const muted = useSyncExternalStore(subscribeMuted, isMuted, () => false);

  useEffect(() => {
    let frameId = 0;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;

    function onPointerMove(e: PointerEvent) {
      tmx = e.clientX / (window.innerWidth || 1) - 0.5;
      tmy = e.clientY / (window.innerHeight || 1) - 0.5;
    }

    function onPointerLeave() {
      tmx = 0;
      tmy = 0;
    }


    function xulicuon() {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      let progress = 0;
      if (maxScroll > 0)
        progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1); // lấy progress trong khoảng 0 1 để đo % vị trí so với cả trang
      targetProcess.current = progress;
      const nextScrolled = window.scrollY > 30;
      setIsScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
    }

    function veMotKhung() {
      currentProcess.current +=
        (targetProcess.current - currentProcess.current) * 0.085;
      frameId = requestAnimationFrame(veMotKhung);

      if (finePointer && !reduced) {
        const prevMx = mx;
        const prevMy = my;
        mx += (tmx - mx) * 0.06;
        my += (tmy - my) * 0.06;
        if (
          stickyRef.current &&
          (Math.abs(mx - prevMx) > 0.0002 || Math.abs(my - prevMy) > 0.0002)
        ) {
          stickyRef.current.style.setProperty("--mx", mx.toFixed(4));
          stickyRef.current.style.setProperty("--my", my.toFixed(4));
        }
      }

      const worldTilt =
        finePointer && !reduced
          ? `translate3d(${(mx * -22).toFixed(1)}px, ${(my * -14).toFixed(1)}px, 0) rotateX(${(-my * 4.5).toFixed(2)}deg) rotateY(${(mx * 6).toFixed(2)}deg) `
          : "";

      if (allSection.length > 0) {
        allSection.forEach((_, i) => {
          const el = layerRef.current[i];
          if (!el) return;
          const z = -i * DEPTH + currentProcess.current * TONG;
          el.style.transform = `${worldTilt}translate3d(0,0, ${z.toFixed(1)}px)`;
          const opacity =
            z > 0
              ? Math.max(0, 1 - z / VUNG_SAU)
              : Math.max(0, 1 - Math.abs(z) / VUNG_TRUOC); // Tính độ mờ, rõ theo khoảng cách
          el.style.opacity = String(opacity);
          // el.style.visibility = opacity <= 0.01 ? "hidden" : "visible"; // nếu độ mờ <=0.01 thì trình duyệt xóa ảnh của section đi , còn nếu không thì vẫn chiếm chỗ 
          //không có visibility cũng được vì sections đã được xử lí bằng opacity nên ảnh vẫn còn lưu trên trình duyệt dù opacity về 0 , xử lí chặn sự kiện bằng pointevent 
          el.style.pointerEvents = opacity > 0.5 ? "auto" : "none"; // nếu độ mờ > 0.5 thì tương tác sự kiện được, nếu không thì chặn sự kiện
        });
      }

      if (trackRef.current) {
        const cam = currentProcess.current * (allSection.length - 1);
        const ia = Math.min(allSection.length - 1, Math.floor(cam));
        const ib = Math.min(allSection.length - 1, ia + 1);
        const k = cam - ia;
        const sky = [0, 1, 2, 3].map((n) =>
          parsedSkies[ia][n].map((v, c) =>
            Math.round(v + (parsedSkies[ib][n][c] - v) * k),
          ),
        );
        trackRef.current.style.setProperty("--sky-a", `rgb(${sky[0]})`);
        trackRef.current.style.setProperty("--sky-b", `rgb(${sky[1]})`);
        trackRef.current.style.setProperty("--glow-1", `rgb(${sky[2]})`);
        trackRef.current.style.setProperty("--glow-2", `rgb(${sky[3]})`);
      }

      const nextActive = Math.round(
        currentProcess.current * (allSection.length - 1),
      );
      setActiveIndex((prev) => (prev === nextActive ? prev : nextActive));
    }

    window.addEventListener("scroll", xulicuon, { passive: true });
    if (finePointer && !reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave, {
        passive: true,
      });
    }
    xulicuon();
    frameId = requestAnimationFrame(veMotKhung);
    return () => {
      window.removeEventListener("scroll", xulicuon);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(frameId);
    };
  }, []);

  function goToSection(index: number) {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = (index * DEPTH) / TONG;
    window.scrollTo({ top: progress * maxScroll, behavior: "smooth" });
  }

  return (
    <div
      ref={trackRef}
      className="home-track"
      style={{ height: `${allSection.length * 100}vh` }}
    >
      <div ref={stickyRef} className="home-sticky">
        <div className="home-world" aria-hidden="true">
          <div className="home-world-sky" />
          <div className="home-world-orb home-world-orb--a" />
          <div className="home-world-orb home-world-orb--b" />
          <div className="home-world-orb home-world-orb--c" />
        </div>

        <header className={`home-bar${isScrolled ? " is-scrolled" : ""}`}>
          <button
            type="button"
            className="home-brand"
            aria-label="KMA Overrows, về đầu trang chủ"
            onClick={() => goToSection(0)}
          >
            <svg
              className="home-brand-mark"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M3 10 16 5l13 5" />
              <path d="M6 10v17M26 10v17M10 27v-7a6 6 0 0 1 12 0v7" />
            </svg>
            <span className="home-brand-name">
              KMA <b>Overrows</b>
            </span>
          </button>

          <nav className="home-dots" aria-label="Các phần của trang chủ">
            {allSection.map((section, i) => (
              <button
                key={section.id}
                type="button"
                className={
                  i === activeIndex ? "home-dot home-dot-active" : "home-dot"
                }
                onClick={() => goToSection(i)}
              >
                {section.navLabel}
              </button>
            ))}
          </nav>

          <div className="home-bar-end">
            <button
              type="button"
              className="home-sound"
              aria-pressed={!muted}
              aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"}
              onClick={() => {
                setMuted(!muted);
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9z" />
                {muted ? (
                  <path d="m17 9 5 6m0-6-5 6" />
                ) : (
                  <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
                )}
              </svg>
            </button>
            <BtnSections name="Đăng nhập" variant="login" />
          </div>
        </header>

        {allSection.map((section, i) => (
          <div
            key={section.id}
            className="home-layer"
            ref={(el) => {
              layerRef.current[i] = el;
            }}
          >
            <section.Component
              title={section.title}
              description={section.description}
              goToSection={goToSection}
              isActive={i === activeIndex}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
