import React from "react";
import "./Homepage.scss";
import "../../core/CoreStyles.scss";
import { AiFillGithub } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import layer1 from "../../assets/layer1.svg";
import layer2 from "../../assets/layer2.svg";
import layer3 from "../../assets/layer3.svg";
import layer4 from "../../assets/layer4.svg";
import { useEffect } from "react";
import Intro from "./components/Intro";
import WhoAmI from "./components/WhoAmI";
import Spacer from "../../core/Spacers/Spacer";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Footer from "./components/Footer";

const HomePage = () => {
  useEffect(() => {
    var projectTiles = document.querySelectorAll(".projects-container .item");
    console.log(projectTiles);
    projectTiles.forEach((el) => {
      el.style.animationDelay = getRandomDelay();
      console.log(el.style.animationDelay);
    });
  }, []);

  const getRandomDelay = () => {
    return `${Math.floor(Math.random() * 1000) + 1}ms`;
  };

  return (
    <div className="homepage-container">
      <Intro />

      <WhoAmI />

      <Spacer layerSvg={layer2} />

      <Skills />

      <Spacer layerSvg={layer3} />

      <Projects />

      <Footer />
    </div>
  );
};

export default HomePage;
