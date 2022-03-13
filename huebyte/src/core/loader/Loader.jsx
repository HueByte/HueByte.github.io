import React from "react";

const Loader = () => {
  return (
    <div className="loader" style={loaderClass}>
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

const loaderClass = {
  position: "absolute",
  top: "0",
  left: "0",
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: "9999",
};

export default Loader;
