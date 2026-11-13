import BtnSections from "./BtnSections";
import type { SectionProps } from "./type";

export default function Community({
  title,
  description,
  goToSection,
}: SectionProps) {
  return (
    <section className="home-community" aria-labelledby="homeCommTitle">
      <div className="home-stage home-community-inner">
        <div className="home-gateline" aria-hidden="true">
          <svg viewBox="0 0 480 280">
            <path
              className="home-gateline-path"
              pathLength={1}
              d="M20 70 240 30 460 70M44 70h392M44 70v196M436 70v196M44 104h392M112 266v-92a50 50 0 0 1 100 0v92M268 266v-92a50 50 0 0 1 100 0v92M20 266h440"
            />
          </svg>
          <svg className="home-glyph home-glyph--book" viewBox="0 0 48 48">
            <path d="M8 10h14a4 4 0 0 1 4 4v24a3 3 0 0 0-3-3H8zM40 10H28a4 4 0 0 0-4 4v24a3 3 0 0 1 3-3h13z" />
          </svg>
          <svg className="home-glyph home-glyph--ring" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="15" />
            <path d="M24 9a15 15 0 0 1 13 22" className="hi" />
          </svg>
          <svg className="home-glyph home-glyph--sword" viewBox="0 0 48 48">
            <path d="M10 38 34 14l4-4M30 10h8v8M14 30l4 4M8 40l4-4" />
          </svg>
        </div>

        <h2 id="homeCommTitle">{title}</h2>
        <p className="home-community-lead">{description}</p>
        <div className="home-community-actions">
          <BtnSections
            name="Đăng nhập để tham gia"
            variant="primary"
            effect="orbit"
          />
          <BtnSections
            name="Quay lại cổng trường"
            variant="quiet"
            onClick={() => goToSection(0)}
          />
        </div>
      </div>
    </section>
  );
}
