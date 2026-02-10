import "./Home.css";

import Callout from "../components/Callout/Callout.jsx";
import Textbox from "../components/Textbox/Textbox.jsx";
import boxClosed from "../../public/images/box-closed.png";
import boxOpen from "../../public/images/box-open.png";
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
import toyimg from "../../public/images/toy-img.png";
import beaver2 from "../../public/images/beaver2.png";
import slideBaby from "../../public/images/slideBaby-big.png";
import small1 from "../../public/images/small-img1.png";

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
                <img src={arrowdown} alt="arrow-down img" className="arrow-down" />
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

      <section className="time-for-toys">
        <div className="time-for-toys__top">
          <img src={beaver2} alt="beaver2 img" className="beaver2-img" />
          <h2 className="time-for-toys__title">It's time for the toys</h2>
        </div>
        <p className="time-for-toys__label">We categorise our toy collection by <a href="#" className="play-style">Play style</a> and <a href="#" className="age">Age</a></p>
        <div className="toys-grid">
          <div className="toy-card">
            <img src={toyimg} alt="Toy 1" className="toy-image" />
            <p>Pritend play</p>
          </div>
          <div className="toy-card">
            <img src={toyimg} alt="Toy 2" className="toy-image" />
            <p>Construction</p>
          </div>
          <div className="toy-card">
            <img src={toyimg} alt="Toy 3" className="toy-image" />
            <p>STEM</p>
          </div>
          <div className="toy-card">
            <img src={toyimg} alt="Toy 4" className="toy-image" />
            <p>Messy</p>
          </div>
          <div className="toy-card">
            <img src={toyimg} alt="Toy 5" className="toy-image" />
            <p>Open ended</p>
          </div>
          <div className="toy-card">
            <img src={toyimg} alt="Toy 6" className="toy-image" />
            <p>Open ended</p>
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

      {/* <section className="sustainability-section">
        <h2>We have saved</h2>
        <div className="impact-stats">
          <div className="stat">
            <h3>1000+ Toys</h3>
            <p>From landfills</p>
          </div>
          <div className="stat">
            <h3>50k+ Hours</h3>
            <p>Of playtime</p>
          </div>
          <div className="stat">
            <h3>100k+ CO2</h3>
            <p>Kg emissions saved</p>
          </div>
        </div>
        <p className="sustainability-text">
          <span className="highlight">We have saved</span> toys from landfills so far
        </p>
      </section>

      <section className="gift-section">
        <div className="gift-content">
          <div className="gift-image">
            <img src="" alt="Gift of endless play" className="gift-img" />
          </div>
          <div className="gift-text">
            <h2>The gift of endless play</h2>
            <p>
              Give the gift that keeps on giving. A ToyCart subscription
              opens a world of possibilities for child development, creativity,
              and joyful moments that matter.
            </p>
            <button className="btn-gift">Gift a subscription</button>
          </div>
        </div>
      </section>


      <section className="blog-section">
        <h2>Blogs & News</h2>
        <div className="blog-grid">
          <article className="blog-card">
            <img src="" alt="Blog 1" className="blog-image" />
            <h3>Blog Post Title</h3>
            <p>Short description of the blog post goes here...</p>
            <a href="#" className="read-more">Read more →</a>
          </article>
          <article className="blog-card">
            <img src="" alt="Blog 2" className="blog-image" />
            <h3>Blog Post Title</h3>
            <p>Short description of the blog post goes here...</p>
            <a href="#" className="read-more">Read more →</a>
          </article>
          <article className="blog-card">
            <img src="" alt="Blog 3" className="blog-image" />
            <h3>Blog Post Title</h3>
            <p>Short description of the blog post goes here...</p>
            <a href="#" className="read-more">Read more →</a>
          </article>
          <article className="blog-card">
            <img src="" alt="Blog 4" className="blog-image" />
            <h3>Blog Post Title</h3>
            <p>Short description of the blog post goes here...</p>
            <a href="#" className="read-more">Read more →</a>
          </article>
        </div>
      </section> */}

    </>
  );
}

export default Home;
