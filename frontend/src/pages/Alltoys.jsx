import Actioncard from "../components/Actioncard/Actioncard.jsx";
import arrow from "../assets/arrow.svg"
import "./Alltoys.css";
import fanimg1 from "../../public/images/fan-img1.jpg";
import fanimg2 from "../../public/images/fan-img2.png";
import fanimg3 from "../../public/images/fan-img3.png";
import fanimg4 from "../../public/images/fan-img4.png";
import fanimg5 from "../../public/images/fan-img5.png";
import fanimg6 from "../../public/images/fan-img6.png";
import fanimg7 from "../../public/images/fan-img7.png";
import fanimg8 from "../../public/images/fan-img8.png";

import Reviewcard from "../components/Reviewcard/Reviewcard.jsx";

function Alltoys() {
  return (<>
    <section className="hero">
      <div className="hero-content">
        <p className="hero-content__p1">Browse toys  <span><img src={arrow} alt="arrow icon" className="arrow-icon" /></span>  All toys</p>
        <h1 className="hero-content__h1">All toys</h1>
        <p className="hero-content__p2">Nam leo porta sit id aliquam in lobortis vitae consequat. Massa purus orci volutpat duis parturient. Ut nunc id bibe. Massa egestas arcu blandit a. Suspen disse lectus.</p>
      </div>
    </section>

    <section className="fan-section">
      <div className="fan-content">
        <div className="fan-content__top">
          <h2 className="fan-content__top-h2">Our smallest fans</h2>
        </div>
        <div className="fan-content__center">
          <img src={fanimg1} alt="fan image1" className="fan-img1" />
          <Reviewcard
            msgTitle="Thank you whirli!!"
            msgText="It’s been wonderful for my three kids to play with so many different toys in such an environmentally friendly and cost effective way. "
            fanName="– Jessica Lucey, Mum of three"
          />
          <img src={fanimg2} alt="fan image2" className="fan-img2" />
          <Reviewcard
            msgTitle="What a great idea!"
            msgText="Children get bored of toys so quickly and we were able to send back and get different toys whenever we wanted easily. Their customer service is also 10/10..."
            fanName="– Jennifer Mello, Mum of two"
          />
          <img src={fanimg3} alt="fan image3" className="fan-img3" />
        </div>
        <div className="fan-content__bottom">
          <Reviewcard
            msgTitle="Thank you whirli!!"
            msgText="It’s been wonderful for my three kids to play with so many different toys in such an environmentally friendly and cost effective way. "
            fanName="– Jessica Lucey, Mum of three"
          />
          <img src={fanimg4} alt="fan image4" className="fan-img4" />
          <img src={fanimg5} alt="fan image5" className="fan-img5" />
          <div className="fan-content__bottom-img">
            <img src={fanimg6} alt="fan image6" className="fan-img6" />
            <img src={fanimg7} alt="fan image7" className="fan-img7" />
          </div>
          <Reviewcard
            msgTitle="Thank you whirli!!"
            msgText="It’s been wonderful for my three kids to play with so many different toys in such an environmentally friendly and cost effective way. "
            fanName="– Jessica Lucey, Mum of three"
          />
          <img src={fanimg8} alt="fan image8" className="fan-img8" />
        </div>
      </div>
    </section>

    <section className="toy-actions">
      <Actioncard
        title="Buy this toy new and pre-loved"
        text="Nam leo porttitor sit aliquam in lobortis vitae consequat. Massa purus orci volutpat duis parturient. Ut nunc id bibendum."
        button="Buy this toy"
        variant="yellow"
      />

      <Actioncard
        title="Sell a toy like this back to Whirli"
        text="Placerat sollicitudin faucibus egestas viverra, cursus nascetur fermentum nam. Massa egestas arcu blandit a. Suspendisse lectus orci."
        button="Sell this toy back"
        variant="white"
      />

      <Actioncard
        title="Gift this toy with a Whirli subscription"
        text="Porta sit id aliquam in lobortis vitae consequat. Massa purus orci volutpat duis parturient. Ut nunc id bibendum."
        button="Gift this toy"
        variant="pink"
      />
    </section>
  </>
  );
}

export default Alltoys;