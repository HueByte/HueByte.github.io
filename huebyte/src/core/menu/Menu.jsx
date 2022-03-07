import React, { useState } from "react";
import { HiMenu } from "react-icons/hi";
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
            <HiMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
