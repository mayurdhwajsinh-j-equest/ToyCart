import "./Home.css";

import boxClosed from "../../public/images/box-closed.png";
import boxOpen from "../../public/images/box-open.png";
import dinosaur from "../../public/images/dinosaur.png";
import pilePhoto from "../../public/images/photo-pile.png";
import workflowPhone from "../../public/images/Video.png";

function Home() {
  return (
    <>
      <div className="home-wrapper">
        <section className="home-hero">
          <div className="hero-title-wrapper">
            <h1 className="hero-title">
              Share toys
              <br />
              <span className="highlight1">Grow</span> <span className="highlight2">minds</span>
            </h1>
          </div>

          <div className="hero-content-wrapper">
            <div className="hero-text">
              <p>
                A world of play without the waste.
                <br />
                Open up endless learning possibilities
                <br />
                by renting our pre-loved toys.
              </p>
            </div>

            <div className="hero-box-wrapper">
              <div className="box-with-dino">
                <img src={dinosaur} alt="Dinosaur" className="dinosaur-img" />
                <img src={boxClosed} alt="Closed box" className="closed-box" />
              </div>
            </div>


            <div className="hero-buttons">
              <button className="btn-outline">Browse toys</button>
              <button className="btn-primary">Start your toy box</button>
            </div>
          </div>
        </section>


        <section className="pile-section">
          <img src={pilePhoto} alt="Pile of toys" className="pile-photo" />
        </section>
      </div>

      <section className="workflow">
        <h2 className="workflow-title">How it works</h2>

        <div className="workflow-content">
          <div className="workflow-phone">
            <img
              src={workflowPhone}
              alt="Phone mockup"
              className="phone-image"
            />

            <div className="workflow-actions">
              <button className="btn btn-active">Rent</button>
              <button className="btn">Buy</button>
              <button className="btn">Sell</button>
            </div>
          </div>

          <div className="workflow-steps">
            <ol>
              <li>
                <strong>Choose your plan</strong>
                <p>
                  Rhoncus augue imperdiet ullamcorper egestas. Elit quis libero
                  sed orci sed dolor sit.
                </p>
              </li>
              <li>
                <strong>Fill your box</strong>
                <p>
                  Augue imperdiet ullamcorper egestas. Elit quis libero sed orci
                  sed maecenas.
                </p>
              </li>
              <li>
                <strong>Keep the toys until you’re done</strong>
                <p>
                  Molestie malesuada sapien amet massa tellus lectus sed
                  maecenas.
                </p>
              </li>
              <li>
                <strong>Return and refresh</strong>
                <p>
                  Rhoncus augue imperdiet ullamcorper eget as. Molestie malesuada
                  sapien.
                </p>
              </li>
            </ol>

            <button className="btn-start">Get started</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
