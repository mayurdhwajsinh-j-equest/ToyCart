import { useState } from "react";
import "./FurtherDetails.css";
import puppyfd from "../../../public/images/puppy-fd.png"

function FurtherDetails({ items, blackline, instructionupicon, instructiondownicon }) {
    const [expandedItem, setExpandedItem] = useState(null);

    const toggleAccordion = (index) => {
        setExpandedItem(expandedItem === index ? null : index);
    };

    return (
        <section className="furtherDetails-section">
            <img src={puppyfd} alt="puppy icon" className="puppy-fd"/>
            <div className="furtherDetails-content">
                <h3>Further details</h3>
                <img src={blackline} alt="black line" className="black-line" />

                {items.map((item, index) => (
                    <div key={index}>
                        <button
                            className="furtherDetails-content__text"
                            onClick={() => toggleAccordion(index)}
                        >
                            <p className="furtherDetails-content__text-label">{item.title}</p>
                            <img
                                src={expandedItem === index ? instructionupicon : instructiondownicon}
                                alt="instruction icon"
                                className="instruction-icon"
                            />
                        </button>
                        {expandedItem === index && (
                            <><img src={blackline} alt="black line" className="black-line" /><p className="accordion-content">{item.content}</p></>
                        )}
                        <img src={blackline} alt="black line" className="black-line" />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FurtherDetails;
