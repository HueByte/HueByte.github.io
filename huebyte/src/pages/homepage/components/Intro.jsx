import React from "react";
import { AiFillGithub } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import layer1 from "../../../assets/layer1.svg";

const Intro = () => {
  return (
    <div className="intro">
      <div className="avatar">
        <img src="https://github.com/huebyte.png" alt="huebyte" />
      </div>
      <div className="buttons-container">
        <a
          href="https://discordapp.com/users/215556401467097088"
          target="_blank"
          className="basic-button button"
        >
          <FaDiscord />
          Discord
        </a>
        <a
          href="https://github.com/HueByte"
          target="_blank"
          className="basic-button button"
        >
          <AiFillGithub /> Github
        </a>
      </div>
      <div
        className="spacer-intro"
        style={{ backgroundImage: `url(${layer1}` }}
      ></div>
    </div>
  );
};

export default Intro;
