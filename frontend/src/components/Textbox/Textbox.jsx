import "./Textbox.css";

function Textbox({ h2text, ptext, linkText, linkHref }) {
    return (
        <div className="textbox">
            <h2>{h2text}</h2>
            <p>{ptext}</p>
            <a href={linkHref} className="textbox-link">{linkText}</a>
        </div>
    );
}

export default Textbox;
