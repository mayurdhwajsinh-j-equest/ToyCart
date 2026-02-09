import "./Home.css";

import boxClosed from "../../public/images/box-closed.png";
import boxOpen from "../../public/images/box-open.png";
import Callout from "../components/Callout/Callout.jsx";
import puppy from "../../public/images/puppy.png";
import simpleFlamingo from "../../public/images/simple-flamingo.png";
import beaver from "../../public/images/beaver.png";
import moveup from "../assets/moveup.svg";
import arrowdown from "../assets/arrow-down.svg";
import dinosaur from "../../public/images/dinosaur.png";
import dinosaur1 from "../../public/images/dinosaur1.png";
import pilePhoto from "../../public/images/photo-pile.png";
import workflowPhone from "../../public/images/Video.png";
import ball from "../../public/images/ball.png";

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
                <p className="scrollTo">Scroll to open the box</p>
                <img src={arrowdown} alt="arrow-down img" className="arrow-down"/>
              </div>
            </div>


            <div className="hero-buttons">
              <button className="btn-outline">Browse toys</button>
              <button className="btn-primary">Start your toy box</button>
            </div>
          </div>
        </section>
        <section className="openbox-section">
          <div className="openbox-section__top">
            <Callout
              text="We have over 1000 toys you can borrow from our collection."
              linkText="Browse toys"
              direction="left"
            />
          </div>
          <div className="openbox-section__center">
            <div className="floating-image__left">
              <img src={dinosaur1} alt="Dinosaur" className="dinosaur-img1" />
              <img src={puppy} alt="puppy" className="puppy-img" />
            </div>
            <div>
              <img src={boxOpen} alt="Open box" className="open-box" />
              <img src={ball} alt="ball" className="ball-img" />
            </div>
            <div>
              <Callout
                text="Our toy's life-cycles are x10 longer than the average toy."
                linkText="Read about our impact"
                direction="right"
              />
            </div>
            <div className="floating-image__right">
              <img src={beaver} alt="beaver" className="beaver-img" />
              <img src={simpleFlamingo} alt="simple flamingo" className="simpleFlamingo-img" />
            </div>
          </div>
          <div className="openbox-section__bottom">
            <Callout
              text="An incredible company that rents toys to families who want to play more and spend less."
              linkText="Read our story"
              direction="bottom"
            />
            <img src={moveup} alt="moveup icon" className="moveup-icon" />
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
