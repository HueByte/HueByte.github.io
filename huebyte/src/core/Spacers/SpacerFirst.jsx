import React from "react";

const SpacerFirst = ({ layerSvg }) => {
  return (
    <div
      className="spacer-ver1"
      style={{ backgroundImage: `url(${layerSvg}` }}
    ></div>
  );
};

export default SpacerFirst;
