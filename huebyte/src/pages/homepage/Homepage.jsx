import React from "react";
import "./Homepage.scss";
import "../../core/CoreStyles.scss";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className="intro">
        <div className="avatar">
          <img src="https://github.com/huebyte.png" alt="huebyte" />
        </div>
        <div className="buttons-container">
          <div className="basic-button button">Discord</div>
          <div className="basic-button button">github</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
