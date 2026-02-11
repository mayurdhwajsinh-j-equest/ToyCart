import "./Reviewcard.css";



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
