import React from "react";

const WhoAmI = () => {
  return (
    <section className="maron">
      <div className="content-container">
        <div className="whoami">
          <div className="title">
            <h1>whoami</h1>
          </div>
          <div className="text">
            <p>
              <strong>
                Hello! On the internet I appear under the name Hue or HueByte,
                as for now <span className="k-word">20</span> years old
                professional Fullstack developer{" "}
                <span className="k-word">&&</span> Computer Science student.
              </strong>
              <br />
            </p>
            <p>
              I'm passionate about coding and though I consider{" "}
              <span className="k-word">.NET</span> as my main technology I'm
              always open for learning and mastering new ones!
              <br />
              My future goal is to work with Artificial Intelligence
              development.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoAmI;
