import "./Actioncard.css"

function Actioncard({ title, text, button, variant }) {
    return (
        <div className={`card card--${variant}`}>
            <h3>{title}</h3>
            <p>{text}</p>
            <button>{button}</button>
        </div>
    );
}

export default Actioncard;