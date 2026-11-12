"use client";

import { useEffect, useRef } from "react";

export default function World25D() {
  const targetProcess = useRef(0); // vị trí muốn tới
  const currentProcess = useRef(0); // vị trí hiện tại
  const layerRef = useRef<HTMLDivElement>(null); // em chưa hiểu đoạn này
  useEffect(() => {
    let frameId = 0;
    function xulicuon() {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight; // đoạn này chưa hiểu các thuộc tính nó lấy gì
      let progress = 0;
      if (maxScroll > 0)
        progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1); // trong code mẫu nhưng tại sao phải xử lí tận 2 lần max min , nếu xử lì if esle có được không
      targetProcess.current = progress;
    }
    function veMotKhung() {
      currentProcess.current +=
        (targetProcess.current - currentProcess.current) * 0.085;
      frameId = requestAnimationFrame(veMotKhung);
      if (layerRef.current)
        layerRef.current.textContent = `current:${currentProcess.current.toFixed(3)} , target:${targetProcess.current.toFixed(3)}`;
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
    <div className="home-track">
      <div
        className="home-sticky"
        style={{
          display: "flex",
          height: "300vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="home-layer" ref={layerRef} style={{ color: "black" , position:"fixed" , top:"50%" , left:"50%" , transform:"translate(-50% , -50%)" }}>
          KMA Overall
        </div>
      </div>
    </div>
  );
}
