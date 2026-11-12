import BtnSections from "./BtnSections"
import type { SectionProps } from "./type"
export function Introduction({title, description}:SectionProps
){
    return (
        <div className="home-introduction">
            <h1>{title}</h1>
            <p>{description}</p>
            <BtnSections name="Bắt đầu khám phá" />
        </div>
    )
}