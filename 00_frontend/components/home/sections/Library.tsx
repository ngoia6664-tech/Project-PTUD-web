"use client";
import { useRef } from "react";
import BtnSections from "./BtnSections";
import type { SectionProps } from "./type";

export default function Library({ title }: SectionProps) {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  return (
    <section className="home-library" aria-labelledby="homeLibTitle">
      <div className="home-stage home-library-inner">
        <div className="home-library-text">
          <h2 id="homeLibTitle">{title}</h2>
          <ul className="home-points">
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4.5 4.5" />
              </svg>
              <span>Tìm tài liệu theo ngành hoặc theo học phần.</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
              </svg>
              <span>Đóng góp tài liệu của bạn cho cộng đồng.</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>Tài liệu được kiểm duyệt trước khi công khai.</span>
            </li>
          </ul>
          <BtnSections name="Khám phá thư viện" variant="primary" effect="shelf" />
        </div>

        <div className="home-pages">
          <div className="home-page home-page--3" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="home-page home-page--2" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div
            ref={pageRef}
            className="home-page home-page--1 home-spot"
            onPointerEnter={() => {
              if (pageRef.current) {
                rectRef.current = pageRef.current.getBoundingClientRect();
              }
            }}
            onPointerMove={(e) => {
              const el = pageRef.current;
              if (!el) return;
              const r = rectRef.current || el.getBoundingClientRect();
              el.style.setProperty("--sx", `${(e.clientX - r.left).toFixed(1)}px`);
              el.style.setProperty("--sy", `${(e.clientY - r.top).toFixed(1)}px`);
            }}
            onPointerLeave={() => {
              rectRef.current = null;
            }}
          >
            <span className="home-chip">Nội dung minh họa</span>
            <strong>Tài liệu học phần</strong>
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    </section>
  );
}
