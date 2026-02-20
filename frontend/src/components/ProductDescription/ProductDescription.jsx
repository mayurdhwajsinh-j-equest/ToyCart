import "./ProductDescription.css";
import { useCart } from "../../hooks/useCart";

function ProductDescription({ product, productId }) {
  const {
    title,
    price,
    mainImage,
    images,
    ratingImage,
    description,
    details,
    coinIcon,
    lineIcon,
  } = product;

  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      id: productId || 1,
      ProductName: title,
      Price: price,
      ProductImage: mainImage,
    });
  };

  return (
    <div className="product-description">
      
      {/* LEFT SIDE - IMAGES */}
      <div className="product-description__images">
        <img src={mainImage} alt={title} className="product-main-img" />

        <div className="product-description__images-bottom">
          {images?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`thumbnail-${index}`}
              className="product-thumb"
            />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - CONTENT */}
      <div className="product-description__content">
        <div>
          <h2 className="product-description__content-title">
            {title}
          </h2>

          <p className="product-description__content-price">
            {coinIcon && (
              <span>
                <img src={coinIcon} alt="coin icon" />
              </span>
            )}
            {price}
          </p>

          {ratingImage && (
            <img
              src={ratingImage}
              alt="rating"
              className="review-4star"
            />
          )}

          <p className="product-description__content-text">
            {description}
          </p>

          {lineIcon && <img src={lineIcon} alt="line" className="line" />}

          <button className="addToCart" onClick={handleAddToCart}>Add to cart</button>

          {lineIcon && <img src={lineIcon} alt="line" className="line" />}
        </div>

        {/* PRODUCT DETAILS */}
        <div className="product-details">
          {details?.map((item, index) => (
            <div key={index}>
              <div className="product-details__item">
                <div className="product-details__icon">
                  <img src={item.icon} alt={item.title} />
                </div>
                <div className="product-details__text">
                  <p className="product-details__title">{item.title}</p>
                  <p className="product-details__desc">{item.value}</p>
                </div>
              </div>

              {lineIcon && <img src={lineIcon} alt="line" className="line" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDescription;
