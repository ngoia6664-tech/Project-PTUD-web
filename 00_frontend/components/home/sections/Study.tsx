import BtnSections from "./BtnSections";
import type { SectionProps } from "./type";
export default function Study({ title, description }: SectionProps) {
  return (
    <div className="home-study">
      <header className ="home-header-study">
          <h1>{title}</h1>
          <p>{description}</p>
      </header>
      <main className="home-main-study">
          <div className="study-featureGPA">
            <h3>GPA Calculator</h3>
            <p>
              Tính GPA theo thang 4 và thử xem cần đạt bao nhiêu điểm ở kì sau để
              chạm mục tiêu
            </p>
            <BtnSections name="Tính GPA" />
          </div>
          <div className="">
          </div>
      </main>
    </div>
  );
}

