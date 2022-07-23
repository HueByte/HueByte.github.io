import React from "react";
import layer4 from "../../assets/layer4.svg";
import "./Footer.scss";

const Footer = () => {
  return (
    <div className="footer">
      <div
        className="footer-spacer"
        style={{ backgroundImage: `url(${layer4}` }}
      ></div>
      <div className="content">
        © Copyright {new Date().getFullYear()} by HueByte
        <br />
        Website is still under construction
      </div>
    </div>
  );
};

export default Footer;
