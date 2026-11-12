"use client";
import { Introduction } from "./sections/Introduction";
import Study from "./sections/Study";
import News from "./sections/News";
import { useEffect, useRef } from "react";
const allSection = [
  { id: 1, Component:Introduction , title:"Học hết mình Chơi cùng nhau" , description:"Không gian dành cho KMA học tập , chia sẻ và kết nối cùng nhau" },
  { id: 2, Component:Study ,title:"Học tập" , description:"Ba công cụ để nối với nhau , tính điểm , xem chương trình học của ngành , biết được mình đã học tới đâu"},
  { id: 3, Component:News, title:"Tin tức KMA" , description:"Thông báo ,tin học vụ và thời hạn các nguồn từ học viện , gom về một chỗ , một tin ghi rõ nguồn và link bài gốc" },
];
const DEPTH = 2000;
const TONG = (allSection.length - 1) * 2000;
const VUNG = 1500;
export default function World25D() {
  const targetProcess = useRef(0); // vị trí muốn tới
  const currentProcess = useRef(0); // vị trí hiện tại
  const layerRef = useRef<(HTMLDivElement | null)[]>([]); // khai biểu kiểu là HTMLdiv khi có dữ liệu còn không thì trả về mảng rỗng
  useEffect(() => {
    let frameId = 0;
    function xulicuon() {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      let progress = 0;
      if (maxScroll > 0)
        progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1); // lấy progress trong khoảng 0 1 để do % vị trí so với cả trang
      targetProcess.current = progress;
    }
    function veMotKhung() {
      currentProcess.current +=
        (targetProcess.current - currentProcess.current) * 0.085;
      frameId = requestAnimationFrame(veMotKhung);
      if (allSection.length > 0) {
        allSection.map((_, i) => {
          const el = layerRef.current[i];
          if (!el) return;
          const z = -i * DEPTH + currentProcess.current * TONG;
          el.style.transform = `translate3d(0,0, ${z}px)`;
          el.style.opacity = String(Math.max(0, 1 - Math.abs(z) / VUNG));
        });
      }
    }
    window.addEventListener("scroll", xulicuon);
    xulicuon();
    frameId = requestAnimationFrame(veMotKhung);
    return () => {
      window.removeEventListener("scroll", xulicuon);
      cancelAnimationFrame(frameId);
    };
  }, []);
  return (
    <div className="home-track" style={{ height: "300vh" }}>
      <div
        className="home-sticky"
        style={{  
          top: "0",
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1200px",
          position: "sticky",
          overflow:"hidden"
        }}
      >
        {allSection.map((section, i) => (
          <div
            key={section.id}
            className="home-layer"
            ref={(el) => {
              layerRef.current[i] = el;
            }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 30,
              opacity: 0,
            }}
          >
            <section.Component title={section.title} description={section.description}/>
          </div>
        ))}
      </div>
    </div>
  );
}
