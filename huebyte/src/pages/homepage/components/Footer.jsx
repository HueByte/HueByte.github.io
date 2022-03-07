import React from "react";
import layer4 from "../../../assets/layer4.svg";

const Footer = () => {
  return (
    <div className="footer">
      <div
        className="footer-spacer"
        style={{ backgroundImage: `url(${layer4}` }}
      ></div>
      <div className="content"> © Copyright 2022 by HueByte</div>
    </div>
  );
};

export default Footer;
