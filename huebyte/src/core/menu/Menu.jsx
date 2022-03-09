import React, { useState } from "react";
import { HiMenu, HiOutlineX } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import "./Menu.scss";

const Menu = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const ToggleMenu = () => setIsExpanded(!isExpanded);
  return (
    <>
      <div
        className={`menu-expander open${isExpanded ? " hide" : ""}`}
        onClick={ToggleMenu}
      >
        <HiMenu />
      </div>
      <div className={`menu${isExpanded ? "" : " menu-hidden"}`}>
        <div className="menu-container">
          <div
            className={`menu-expander close${isExpanded ? "" : " hide"}`}
            onClick={ToggleMenu}
          >
            <HiOutlineX />
          </div>
          <div className="menu-items">
            <NavLink to="/" className="item" activeClassName="active-menu-item">
              Home
            </NavLink>
            <a
              href="https://github.com/HueByte"
              target="_blank"
              className="item"
            >
              Github
            </a>
            <div className="item">Repositories (in progress)</div>
            <div className="item">Code Showcase (in progress)</div>
            <div className="item">Research (in progress)</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
