"use client";
import { useEffect, useRef, type ReactNode } from "react";

export default function TiltCard({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const tiltRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (reduced || !finePointer) return;

    const spotTargets = Array.from(
      el.querySelectorAll<HTMLElement>(".home-spot"),
    );
    const floats = Array.from(el.querySelectorAll<HTMLElement>("[data-float]")).map(
      (node) => ({
        node,
        factor: parseFloat(node.dataset.float || "1") || 1,
      }),
    );

    let rect: DOMRect | null = null;
    let rx = 0;
    let ry = 0;
    let lift = 0;
    let tx = 0;
    let ty = 0;
    let tl = 0;
    let pointerX = 0;
    let pointerY = 0;
    let hasPointer = false;
    let rafId = 0;
    let lastTime = 0;

    const applyTransform = () => {
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(${(lift * 22).toFixed(1)}px)`;
      for (const f of floats) {
        f.node.style.transform = `translate3d(${(ry * f.factor * 1.7).toFixed(1)}px, ${(-rx * f.factor * 1.7 - lift * f.factor * 5).toFixed(1)}px, 0)`;
      }
      if (hasPointer && rect) {
        const sx = pointerX - rect.left;
        const sy = pointerY - rect.top;
        for (const target of spotTargets) {
          if (target === el.firstElementChild) {
            target.style.setProperty("--sx", `${sx.toFixed(1)}px`);
            target.style.setProperty("--sy", `${sy.toFixed(1)}px`);
          } else {
            const tr = target.getBoundingClientRect();
            target.style.setProperty("--sx", `${(pointerX - tr.left).toFixed(1)}px`);
            target.style.setProperty("--sy", `${(pointerY - tr.top).toFixed(1)}px`);
          }
        }
      }
    };

    const tick = (now: number) => {
      const dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 1 / 60;
      lastTime = now;
      const k = 1 - Math.pow(1 - 0.12, dt * 60);

      rx += (ty - rx) * k;
      ry += (tx - ry) * k;
      lift += (tl - lift) * k;

      applyTransform();

      const settled =
        tl === 0 &&
        Math.abs(rx) < 0.02 &&
        Math.abs(ry) < 0.02 &&
        Math.abs(lift) < 0.005;

      if (settled) {
        rx = 0;
        ry = 0;
        lift = 0;
        el.style.transform = "";
        for (const f of floats) {
          f.node.style.transform = "";
        }
        rafId = 0;
        lastTime = 0;
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const onEnter = (e: PointerEvent) => {
      rect = el.getBoundingClientRect();
      hasPointer = true;
      pointerX = e.clientX;
      pointerY = e.clientY;
      tl = 1;
      startLoop();
    };

    const onMove = (e: PointerEvent) => {
      if (!rect) rect = el.getBoundingClientRect();
      pointerX = e.clientX;
      pointerY = e.clientY;
      const px = (e.clientX - rect.left) / (rect.width || 1) - 0.5;
      const py = (e.clientY - rect.top) / (rect.height || 1) - 0.5;
      tx = px * 10;
      ty = -py * 8;
      tl = 1;
      startLoop();
    };

    const onLeave = () => {
      hasPointer = false;
      rect = null;
      tx = 0;
      ty = 0;
      tl = 0;
      startLoop();
    };

    el.addEventListener("pointerenter", onEnter, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <article className={`home-card ${className}`.trim()}>
      <div ref={tiltRef} className="home-tilt">
        {children}
      </div>
    </article>
  );
}
