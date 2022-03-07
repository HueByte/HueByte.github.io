import React, { useState } from "react";
import { HiMenu, HiOutlineX } from "react-icons/hi";
import "./Menu.scss";

const Menu = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const ToggleMenu = () => setIsExpanded(!isExpanded);
  return (
    <>
      <div
        className={`menu-expander open ${isExpanded ? " hide" : ""}`}
        onClick={ToggleMenu}
      >
        <HiMenu />
      </div>
      <div className={`menu${isExpanded ? "" : " menu-hidden"}`}>
        <div className="menu-container">
          <div
            className={`menu-expander close ${isExpanded ? "" : " hide"}`}
            onClick={ToggleMenu}
          >
            <HiOutlineX />
          </div>
          <div className="menu-items">
            <a
              href="https://github.com/HueByte"
              target="_blank"
              className="item"
            >
              Github
            </a>
            <div className="item">Repositories</div>
            <div className="item">Code Showcase</div>
            <div className="item">Research</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
