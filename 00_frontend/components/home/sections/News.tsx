import BtnSections from "./BtnSections"
import type { SectionProps } from "./type"
export default function News({title, description}:SectionProps
){
    return (
        <div className="home-news">
            <h1>{title}</h1>
            <p>{description}</p>
            <BtnSections name="Xem thông báo trên website học viện" />
        </div>
    )
}