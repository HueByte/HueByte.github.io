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
            <NavLink to="/" className="item" onClick={ToggleMenu}>
              Home
            </NavLink>
            <a
              href="https://github.com/HueByte"
              target="_blank"
              className="item"
              onClick={ToggleMenu}
            >
              Github
            </a>
            <NavLink to="/Repositories" className="item" onClick={ToggleMenu}>
              Repositories
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
