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
          <div className="menu-expander close" onClick={ToggleMenu}>
            <HiOutlineX />
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
