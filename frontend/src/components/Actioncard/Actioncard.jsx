import "./Actioncard.css"
import BeaverImg from "../../../public/images/Beaver3.png";

function Actioncard({ title, text, button, variant }) {
    return (
        <>
        <div className={`card card--${variant}`}>
            <h3>{title}</h3>
            <p>{text}</p>
            <button>{button}</button>
            {variant === "white" && <img src={BeaverImg} alt="beaver" className="card-beaver-img" />}   
        </div>
        </>
    );
}

export default Actioncard;