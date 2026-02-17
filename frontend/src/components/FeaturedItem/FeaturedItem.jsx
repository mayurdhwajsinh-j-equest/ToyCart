import { useState } from "react";
import "./FeaturedItem.css";

function FeaturedItem({ items }) {
  const [activeTab, setActiveTab] = useState(0);
  const activeItem = items[activeTab];

  return (
    <section className="pdp-featured-section">
      <h1 className="pdp-featured-section__h1">The features</h1>
      <ul className="pdp-featured-items">
        {items.map((item, index) => (
          <li key={index} className="pdp-featured-item">
            <button
              className={`pdp-featured-item__link ${
                activeTab === index ? "active" : ""
              }`}
              onClick={() => setActiveTab(index)}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
      <div className="pdp-featured-section__bottom">
        <div className="pdp-featured-section__bottom-left">
          <img src={activeItem.image} alt={activeItem.imageAlt} className="featured-image" />
        </div>
        <div className="pdp-featured-section__bottom-right">
          <h1 className="pdp-featured-section__bottom-right-h1">
            {activeItem.heading}
          </h1>
          {activeItem.descriptions.map((desc, index) => (
            <p key={index}>{desc}</p>
          ))}
          <a href="#" className="add">
            Add to toy box
          </a>
        </div>
      </div>
    </section>
  );
}

export default FeaturedItem;
