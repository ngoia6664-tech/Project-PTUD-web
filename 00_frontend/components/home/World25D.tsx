"use client";

import { useEffect, useRef } from "react";
const BASE_Z = -2000;
const QUANG_DUONG = 2000;
export default function World25D() {
  const targetProcess = useRef(0); // vị trí muốn tới
  const currentProcess = useRef(0); // vị trí hiện tại
  const layerRef = useRef<HTMLDivElement>(null); // khai biểu kiểu là HTMLdiv khi có dữ liệu còn không thì current:null
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
      if (layerRef.current){
        layerRef.current.textContent = `current:${currentProcess.current.toFixed(3)} , target:${targetProcess.current.toFixed(3)}`;
        const z = BASE_Z + currentProcess.current * QUANG_DUONG;
        layerRef.current.style.transform = `translate3d(0,0, ${z}px)`;
        layerRef.current.style.opacity = String(currentProcess.current);
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
    <div className="home-track" style={{height:"300vh"}}>
      <div
        className="home-sticky"
        style={{
          top:"0",
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          perspective:"1200px",
          position:"sticky"
        }}
      >
        <div
          className="home-layer"
          ref={layerRef}
          style={{
            color: "white", 
            position:"fixed",  
            fontSize:"30px"       
          }}
        >
          KMA Overall
        </div>
      </div>
    </div>
  );
}
