import "./Pdp.css";
import slideBaby from "../../public/images/slideBaby-big.png";
import small1 from "../../public/images/small-img1.png";
import Textbox from "../components/Textbox/Textbox.jsx";
import earth from "../../public/images/earth.png";

function Pdp() {
    return (
        <>
            <section className="sustainability-section">
                <div className="sustainability-content">
                    <div className="sustainability-section__top">
                        <div className="sustainability-section__top-h2">
                            <h2>This toys saves</h2>
                        </div>
                        <div>
                            <p className="sustainability-section__top-img">
                                <img src={earth} alt="earth img" className="earth-img" />
                                000,000</p>
                        </div>
                    </div>
                    <div className="sustainability-section__center">
                        <h2>carbon from the atmosphere</h2>
                    </div>
                    <div className="sustainability-section__bottom">
                        <p className="sustainability-section__bottom-p">Elit et libero turpis integer nam neque. Feugiat tellus non arcu vitae eget urna aliquam. Nisl sit eu massa sed mollis tellus commodo. Id at viverra.</p>
                    </div>
                </div>
            </section>
            <section className="safety-section">
                <div className="safety-content">
                    <div className="safety-image">
                        <img src={slideBaby} alt="Safety1" className="safety-img1" />
                        <img src={small1} alt="Safety2" className="safety-img2" />
                    </div>
                    <div className="safety-text">
                        <Textbox
                            h2text="Sparkling & child-safe, every time."
                            ptext="Massa faucibus cras dignissim convallis donec scelerisque eget placerat sit. Luctus morbi et mi vitae massa mattis velit. Amet dignissim quis diam massa lectus velit non. Faucibus sagittis posuere ultrices."
                            linkText="Read our safety policy"
                            linkHref="#"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

export default Pdp;