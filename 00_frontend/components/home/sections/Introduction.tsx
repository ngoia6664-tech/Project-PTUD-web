import BtnSections from "./BtnSections";
import type { SectionProps } from "./type";

export function Introduction({
  title,
  description,
  goToSection,
}: SectionProps) {
  const lines = title
    .split(".")
    .map((s) => s.trim())
    .filter(Boolean);
  const firstLine = lines[0] ? `${lines[0]}.` : title;
  const secondLine = lines[1] ? `${lines[1]}.` : "";

  return (
    <section className="home-introduction" aria-labelledby="homeHeroTitle">
      <div className="home-hero-layers" aria-hidden="true">
        <div className="home-hero-far" />
        <img
          className="home-hero-gate"
          src="/assets/kma-gate-hero.png"
          width={1280}
          height={720}
          alt="Cổng Học viện Kỹ thuật Mật mã: mái ngói đỏ, hàng chữ vàng trên nền tường đỏ, cây xanh phía trong trường"
        />
        <div className="home-hero-sun" />
        <div className="home-hero-veil" />
        <svg
          className="home-hero-leaves"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <path
              id="homeHeroLeaf"
              d="M0 0C30-40 90-46 130-20 92 6 36 18 0 0Z"
            />
          </defs>
          <g transform="translate(-40 40)">
            <use href="#homeHeroLeaf" transform="rotate(18) scale(1.6)" />
            <use
              href="#homeHeroLeaf"
              transform="translate(60 70) rotate(42) scale(1.3)"
            />
            <use
              href="#homeHeroLeaf"
              transform="translate(10 150) rotate(64) scale(1.5)"
            />
            <use
              href="#homeHeroLeaf"
              transform="translate(140 10) rotate(-8) scale(1.1)"
            />
          </g>
          <g transform="translate(1480 860) rotate(180)">
            <use href="#homeHeroLeaf" transform="rotate(14) scale(1.8)" />
            <use
              href="#homeHeroLeaf"
              transform="translate(70 80) rotate(38) scale(1.4)"
            />
            <use
              href="#homeHeroLeaf"
              transform="translate(180 20) rotate(-4) scale(1.2)"
            />
          </g>
        </svg>
      </div>

      <div className="home-hero-copy">
        <h1 className="home-hero-title" id="homeHeroTitle">
          <span className="home-line">
            <span>{firstLine}</span>
          </span>
          {secondLine && (
            <span className="home-line">
              <span>{secondLine}</span>
            </span>
          )}
        </h1>
        <p className="home-hero-lead">{description}</p>
        <div className="home-hero-actions">
          <BtnSections
            name="Bắt đầu khám phá"
            variant="primary"
            effect="shimmer"
            onClick={() => goToSection(1)}
          />
        </div>
      </div>

      <div className="home-hero-cue" aria-hidden="true">
        <span />
        Cuộn để đi qua cổng
      </div>
    </section>
  );
}
