import BtnSections from "./BtnSections";
import TiltCard from "./TiltCard";
import type { SectionProps } from "./type";

export default function News({ title, description }: SectionProps) {
  return (
    <section className="home-news" aria-labelledby="homeNewsTitle">
      <div className="home-stage home-news-inner">
        <header className="home-head">
          <h2 id="homeNewsTitle">{title}</h2>
          <p>{description}</p>
        </header>

        <TiltCard>
          <div className="home-board home-glass home-spot">
            <div className="home-board-top">
              <h3>Bảng tin</h3>
              <span className="home-status">Đang phát triển</span>
            </div>

            <div className="home-board-sample" aria-hidden="true">
              <div className="home-row">
                <span className="home-row-tag">Nhóm tin</span>
                <span className="home-row-title">Tiêu đề thông báo</span>
                <span className="home-row-meta">Ngày đăng</span>
                <span className="home-row-meta">Tên nguồn</span>
                <span className="home-row-link">Bài gốc</span>
              </div>
              <div className="home-row home-row--ghost">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="home-row home-row--ghost">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="home-empty">
              <p>
                <strong>Chưa có tin nào.</strong> Tin sẽ hiện ở đây sau khi hệ
                thống kết nối nguồn của Học viện và được kiểm duyệt.
              </p>
              <BtnSections
                name="Xem thông báo trên website Học viện"
                variant="quiet"
                effect="stamp"
                href="https://actvn.edu.vn"
              />
            </div>

            <p className="home-board-foot">
              Cập nhật gần nhất: chưa có dữ liệu
            </p>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
