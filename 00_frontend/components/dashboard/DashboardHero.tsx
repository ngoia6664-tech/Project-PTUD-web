/**
 * Banner đầu trang mang dấu ấn Học viện Kỹ thuật Mật mã (KMA) dùng chung
 * trên mọi trang con của /dashboard theo đúng 5 bản thiết kế mẫu.
 */

interface DashboardHeroProps {
  eyebrow?: string;
  titlePrefix: string;
  titleHighlight?: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function DashboardHero({
  eyebrow = "Học viện Kỹ thuật Mật mã",
  titlePrefix,
  titleHighlight,
  subtitle,
  children,
}: DashboardHeroProps) {
  return (
    <section className="dash-hero">
      <div className="dash-hero-art" aria-hidden="true" />
      <div className="dash-hero-fade" aria-hidden="true" />

      <div className="dash-hero-inner">
        <div className="dash-hero-copy">
          <span className="dash-eyebrow">{eyebrow}</span>
          <h1 className="dash-hero-title">
            {titlePrefix}
            {titleHighlight ? (
              <>
                {" "}
                <span>{titleHighlight}</span>
              </>
            ) : null}
          </h1>
          <p className="dash-hero-subtitle">{subtitle}</p>
          {children && <div className="dash-hero-extra">{children}</div>}
        </div>
      </div>
    </section>
  );
}
