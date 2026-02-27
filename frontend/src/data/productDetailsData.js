// Static Product Details Data
// Used for PDP (Product Details Page)
// Structure: { [productId]: productDetailsObject }

import coin from "../assets/coin.svg";
import union from "../assets/Union.svg";
import stacktoy from "../assets/Stacktoy.svg";
import earth1 from "../assets/earth.svg";
import line from "../public/images/horizontal-line.png";
import toy2img from "../../public/images/toy2-img.png";
import toy2img1 from "../../public/images/toy2-img1.png";
import toy2img2 from "../../public/images/toy2-img2.png";
import toy2img3 from "../../public/images/toy2-img3.png";
import toy2img4 from "../../public/images/toy2-img4.png";
import review4star from "../../public/images/review-4star.png";

const productDetailsData = {
  1: {
    title: "VTech Toot-Toot Drivers Garage Playset",
    price: 88,
    mainImage: toy2img,
    images: [toy2img4, toy2img3, toy2img2, toy2img1],
    ratingImage: review4star,
    description:
      "Vel diam a lobortis rhoncus nunc adipiscing habitant vitae. Scelerisque condimentum in vulputate condimentum sollicitudin. Libero vel placerat dictumst a praesent neque et.",
    coinIcon: coin,
    lineIcon: line,
    details: [
      {
        icon: union,
        title: "Age recommendation",
        value: "1 year - 3 years",
      },
      { 
        icon: stacktoy,
        title: "Skills & Learning",
        value: "Helps with independent play and sensory learning",
      },
      {
        icon: earth1,
        title: "Toy impact",
        value: "Lorem ipsum dolor sit",
      },
    ],
  },
  // Add more products as needed
};

export default productDetailsData;
