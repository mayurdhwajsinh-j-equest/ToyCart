import Actioncard from "../components/Actioncard/Actioncard.jsx";
import "./About.css";

function About() {
  return (
    <main className="home">
      <section className="hero">
        <h1>Welcome to about page</h1>
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
    </main>
  );
}

export default About;
