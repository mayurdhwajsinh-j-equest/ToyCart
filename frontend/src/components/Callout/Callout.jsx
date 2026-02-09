import arrowLeft from "../../assets/arrow-left.svg";
import arrowRight from "../../assets/arrow-right.svg";
import arrowBottom from "../../assets/arrow-bottom.svg";
import "./Callout.css";

const arrows = { left: arrowLeft, right: arrowRight, bottom: arrowBottom };

function Callout({ text, linkText, direction }) {
    return (
        <>
            <div className={`callout callout-${direction}`}>
                <div className="content">
                    <p>{text}</p>
                    <a href="#">{linkText}</a>
                </div>
                <div>
                    <img className={`arrow-${direction}`} src={arrows[direction]} alt="" />
                </div>
            </div>
        </>
    );
}

export default Callout; 