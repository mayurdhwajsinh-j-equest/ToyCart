import "./Reviewcard.css";
import reviewstar from "../../../public/images/review-star.png";

function Reviewcard({ msgTitle, msgText, fanName }) {
    return (
        <div className="review-content">
            <img src={reviewstar} alt="review star" className="review-star" />
            <h2 className="review-msg__title">{msgTitle}</h2>
            <p className="review-msg__text">{msgText}</p>
            <p className="review-msg__fanname">{fanName}</p>
        </div>
    );
}

export default Reviewcard;
