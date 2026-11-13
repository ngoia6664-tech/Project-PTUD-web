"use client";
import { useEffect, useRef } from "react";
import { playSword } from "../sfx";

const CLASH_MS = 200; // thời điểm 2 kiếm chạm nhau (khớp transition trong home.css)

type Effect = "shimmer" | "book" | "sword" | "shelf" | "orbit" | "stamp";

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Sword({ side }: { side: "l" | "r" }) {
  return (
    <svg className={`home-sword home-sword--${side}`} viewBox="0 0 14 60">
      <path className="home-sword-blade" d="M7 0 10 8V44H4V8Z" />
      <rect className="home-sword-guard" x="0" y="44" width="14" height="3" rx="1.5" />
      <rect className="home-sword-hilt" x="5" y="47" width="4" height="9" rx="1" />
      <circle className="home-sword-guard" cx="7" cy="58" r="2" />
    </svg>
  );
}

// Phần trang trí riêng của từng hiệu ứng (chỉ để nhìn, ẩn với trình đọc màn hình)
function Decor({ effect, sparkRef }: { effect?: Effect; sparkRef: React.RefObject<HTMLSpanElement | null> }) {
  switch (effect) {
    case "sword":
      return (
        <span className="home-swords" aria-hidden="true">
          <Sword side="l" />
          <Sword side="r" />
          <span className="home-sword-spark" ref={sparkRef} />
        </span>
      );
    case "book":
      return <span className="home-fx-page" aria-hidden="true" />;
    case "shelf":
      return (
        <span className="home-fx-shelf" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      );
    case "orbit":
      return (
        <span className="home-fx-orbit" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse cx="50" cy="50" rx="49" ry="48" pathLength={1} />
          </svg>
          <i />
          <i />
          <i />
          <i />
        </span>
      );
    case "stamp":
      return (
        <span className="home-fx-stamp" aria-hidden="true">
          MỚI
        </span>
      );
    default:
      return null;
  }
}

export default function BtnSections(props: {
  name: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "quiet" | "login";
  effect?: Effect;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const sparkRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const isLogin = props.variant === "login";

  // Nút đăng nhập "thở" nhẹ để thu hút
  useEffect(() => {
    if (!isLogin || !glowRef.current || reducedMotion()) return;
    const a = glowRef.current.animate([{ opacity: 0.15 }, { opacity: 0.7 }], {
      duration: 1800,
      iterations: Infinity,
      direction: "alternate",
      easing: "ease-in-out",
    });
    return () => a.cancel();
  }, [isLogin]);

  const variantClass =
    props.variant === "quiet"
      ? "home-btn-section--quiet"
      : isLogin
        ? "home-btn-section--login"
        : "home-btn-section--primary";

  const onEnter = () => {
    if (props.effect !== "sword") return;
    playSword(CLASH_MS);
    if (reducedMotion()) return;
    ref.current?.animate(
      [
        { translate: "0 0" },
        { translate: "-3px 1px" },
        { translate: "3px -1px" },
        { translate: "-2px 0" },
        { translate: "0 0" },
      ],
      { duration: 160, delay: CLASH_MS, easing: "ease-out" },
    );
    sparkRef.current?.animate(
      [
        { opacity: 0, scale: 0.2, rotate: "0deg" },
        { opacity: 1, scale: 1.2, rotate: "20deg", offset: 0.3 },
        { opacity: 0, scale: 1.6, rotate: "45deg" },
      ],
      { duration: 380, delay: CLASH_MS - 20, easing: "ease-out" },
    );
  };

  // Nghiêng 3D theo vị trí chuột trên nút
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--ty", `${(x * 14).toFixed(1)}deg`);
    e.currentTarget.style.setProperty("--tx", `${(-y * 18).toFixed(1)}deg`);
  };

  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.removeProperty("--tx");
    e.currentTarget.style.removeProperty("--ty");
  };

  const shared = {
    ref,
    className: `home-btn-section ${variantClass}${props.effect ? ` home-btn-fx--${props.effect}` : ""}${props.className ? ` ${props.className}` : ""}`,
    onPointerEnter: onEnter,
    onPointerMove: onMove,
    onPointerLeave: onLeave,
    onFocus: onEnter,
  };

  const content = (
    <>
      <Decor effect={props.effect} sparkRef={sparkRef} />
      {isLogin && (
        <>
          <span className="home-fx-glow" ref={glowRef} aria-hidden="true" />
          <svg className="home-fx-lock" viewBox="0 0 16 18" aria-hidden="true">
            <path className="home-fx-shackle" d="M4.5 8V5.5a3.5 3.5 0 0 1 7 0V8" />
            <rect x="2" y="8" width="12" height="9" rx="2" />
          </svg>
        </>
      )}
      <span className="home-btn-label">{props.name}</span>
    </>
  );

  if (props.href) {
    const external = /^https?:/.test(props.href);
    return (
      <a
        {...shared}
        href={props.href}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {content}
      </a>
    );
  }

  return (
    <button {...shared} type="button" onClick={props.onClick}>
      {content}
    </button>
  );
}
