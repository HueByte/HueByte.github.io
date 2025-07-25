import React from "react";
import layer1 from "../../../assets/layer1.svg";
import AnimatedAvatar from "./AnimatedAvatar";
import SocialLinks from "./SocialLinks";

const Intro = () => {
	return (
		<div className="intro">
			<div className="avatar">
				<AnimatedAvatar />
				<SocialLinks />
			</div>
			<div
				className="intro-spacer"
				style={{ backgroundImage: `url(${layer1}` }}
			></div>
		</div>
	);
};

export default Intro;
