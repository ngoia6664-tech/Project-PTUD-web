"use client"

import { useEffect,useRef } from "react"

export default function World25D(){
    const targetProcess = useRef(0); // vị trí muốn tới
    const currentProcess = useRef(0); // vị trí hiện tại
    const layerRef = useRef<HTMLDivElement>(null);// em chưa hiểu đoạn này 
    useEffect(()=>{
        return () =>{

        }
    },[])
    return (
        <div className="home-track">
            <div className="home-sticky">
                <div className="home-layer" ref={layerRef} style={{color:"black"}}>KMA Overall</div>
            </div>
        </div>
    )
}