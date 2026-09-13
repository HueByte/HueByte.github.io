import React from "react";
import Spacer from "../../../core/Spacers/Spacer";
import layer from "../../../assets/layer5.svg";
import "../projects.scss";

const MyThingsSaver = () => {
  return (
    <div className="project-container">
      <section>
        <div className="intro">
          <div className="description">
            <h1 className="title">MyThingsSaver</h1>
            <div>Date 2021</div>
            <div>Web / self hosted</div>
          </div>
          <div className="icon"></div>
        </div>
      </section>
      <Spacer layerSvg={layer} />
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum reiciendis
        officiis totam animi temporibus eligendi, est ducimus expedita eos
        accusantium quisquam harum obcaecati dolorem ex cupiditate quia id
        explicabo ab.
      </div>
      <div>Technologies</div>
      <div>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores omnis
        ratione illo esse nulla libero, aspernatur et voluptatum nostrum odit
        fugiat vero placeat numquam nobis earum quisquam alias labore sed?
      </div>
      <div>MyThingsSaver</div>
    </div>
  );
};

export default MyThingsSaver;
