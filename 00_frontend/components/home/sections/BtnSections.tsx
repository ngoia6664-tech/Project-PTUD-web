export default function BtnSections(props:{
    name:string,
    onClick?:() => void
}){
    return (
        <button className="home-btn-section"  onClick={props.onClick}>{props.name}</button>
    )
}