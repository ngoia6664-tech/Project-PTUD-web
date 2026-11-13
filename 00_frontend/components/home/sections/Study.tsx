"use client";
import { useEffect, useRef, useState } from "react";
import BtnSections from "./BtnSections";
import TiltCard from "./TiltCard";
import type { SectionProps } from "./type";

const TARGET_GPA = 3.42;
const TARGET_PROGRESS = 75;

export default function Study({
  title,
  description,
  isActive,
}: SectionProps) {
  const [gpa, setGpa] = useState(0);
  const [progress, setProgress] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isActive || hasAnimated.current) return;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const dur = 1500;
    const t0 = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / dur));
      const e = easeOut(p);
      setGpa(TARGET_GPA * e);
      setProgress(Math.round(TARGET_PROGRESS * e));
      if (p < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        // Chỉ đánh dấu khi đếm xong: lướt ngang qua section sẽ hủy giữa chừng, lần sau phải đếm lại
        hasAnimated.current = true;
      }
    };

    const timer = window.setTimeout(() => {
      rafId = requestAnimationFrame(step);
    }, 250);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(rafId);
    };
  }, [isActive]);

  return (
    <section className="home-study" aria-labelledby="homeStudyTitle">
      <div className="home-stage">
        <header className="home-header-study home-head">
          <h2 id="homeStudyTitle">{title}</h2>
          <p>{description}</p>
        </header>

        <div className="home-main-study">
          <TiltCard className="study-featureGPA">
            <div className="home-glass home-glass--near home-spot">
              <h3>GPA Calculator</h3>
              <p>
                Tính GPA theo thang 4 và thử xem cần đạt bao nhiêu ở các kỳ sau
                để chạm mục tiêu.
              </p>
              <div className="home-gpa" data-float="1.2">
                <output className="home-gpa-num" aria-describedby="homeGpaNote">
                  {gpa.toFixed(2)}
                </output>
                <span className="home-gpa-scale">/ 4.00</span>
              </div>
              <div className="home-meter" aria-hidden="true">
                <span style={{ width: `${(gpa / 4) * 100}%` }} />
              </div>
              <p className="home-note" id="homeGpaNote">
                GPA minh họa, không phải điểm của bạn.
              </p>
              <BtnSections name="Tính GPA" variant="primary" effect="book" />
            </div>
          </TiltCard>

          <TiltCard className="study-program">
            <div className="home-glass home-spot">
              <h3>Chương trình đào tạo</h3>
              <p>
                Xem chương trình theo ngành và khóa: học phần, tín chỉ, môn bắt
                buộc và tự chọn.
              </p>
              <ul className="home-majors" aria-label="Chọn ngành">
                <li>
                  <button type="button" className="home-spot" data-float="0.8">
                    <b>CNTT</b>
                    <span>Công nghệ thông tin</span>
                  </button>
                </li>
                <li>
                  <button type="button" className="home-spot" data-float="1.1">
                    <b>ATTT</b>
                    <span>An toàn thông tin</span>
                  </button>
                </li>
                <li>
                  <button type="button" className="home-spot" data-float="1.4">
                    <b>ĐTVT</b>
                    <span>Điện tử – viễn thông</span>
                  </button>
                </li>
              </ul>
              <p className="home-note">
                Dữ liệu từng ngành đang được đối chiếu, trang ngành sẽ mở khi
                xác minh xong.
              </p>
            </div>
          </TiltCard>

          <TiltCard className="study-audit">
            <div className="home-glass home-glass--far home-spot">
              <svg
                className="home-ring"
                viewBox="0 0 100 100"
                data-float="1"
                aria-hidden="true"
              >
                <circle cx="50" cy="50" r="42" />
                <circle
                  className="home-ring-val"
                  cx="50"
                  cy="50"
                  r="42"
                  pathLength={100}
                  style={{ strokeDasharray: `${progress} 100` }}
                />
              </svg>
              <span className="home-ring-label" aria-hidden="true">
                {progress}%
              </span>
              <h3>Tiến độ học tập</h3>
              <p>
                Biết mình đã đi đến đâu. Theo dõi những học phần đã hoàn thành và
                những gì còn lại trong chương trình học.
              </p>
              <p className="home-note">Vòng 75% là minh họa.</p>
              <BtnSections name="Xem tiến độ" variant="quiet" effect="book" />
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
