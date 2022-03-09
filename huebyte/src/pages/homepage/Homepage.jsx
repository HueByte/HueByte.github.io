import React from "react";
import "./Homepage.scss";
import "../../styles/CoreStyles.scss";
import layer2 from "../../assets/layer2.svg";
import layer3 from "../../assets/layer3.svg";
import Intro from "./components/Intro";
import WhoAmI from "./components/WhoAmI";
import Spacer from "../../core/Spacers/Spacer";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Footer from "../../core/Footer/Footer";
import Menu from "../../core/menu/Menu";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <Menu />

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
