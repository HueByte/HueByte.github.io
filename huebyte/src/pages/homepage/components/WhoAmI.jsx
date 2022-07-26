import React from "react";
import { IoSparkles } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi";

const WhoAmI = () => {
  return (
    <section className="maron">
      <div className="content-container">
        <div
          className="sparkle"
          style={{ top: "20%", left: "20%", color: "#262853" }}
        >
          <HiSparkles />
        </div>
        <div
          className="sparkle"
          style={{ top: "70%", right: "20%", color: "#051929" }}
        >
          <HiSparkles />
        </div>
        <div
          className="sparkle"
          style={{ top: "10%", right: "15%", color: "#171718" }}
        >
          <IoSparkles />
        </div>
        <div className="sparkle" style={{ bottom: "10%", left: "20%" }}>
          <IoSparkles />
        </div>
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
