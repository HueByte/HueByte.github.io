import React from "react";

const Loader = ({ local = false }) => {
  const loaderClass = {
    position: "absolute",
    top: "0",
    left: "0",
    width: local ? "100%" : "100vw",
    height: local ? "100%" : "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "9999",
  };

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

export default Loader;
