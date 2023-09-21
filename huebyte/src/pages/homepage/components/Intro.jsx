import React from "react";
import { AiFillGithub } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import { BiMailSend } from "react-icons/bi";
import layer1 from "../../../assets/layer1.svg";

const Intro = () => {
	return (
		<div className="intro">
			<div className="avatar">
				<img src="https://github.com/huebyte.png" alt="huebyte" />
				<a
					href="https://discordapp.com/users/215556401467097088"
					target="_blank"
					className="orb-icon"
					rel="noreferrer"
				>
					<FaDiscord />
				</a>
				<a
					href="https://github.com/HueByte"
					target="_blank"
					className="orb-icon"
					rel="noreferrer"
				>
					<AiFillGithub />
				</a>
				<a
					href="mailto:ihuebyte@gmail.com"
					target="_blank"
					className="orb-icon"
					rel="noreferrer"
				>
					<BiMailSend />
				</a>
			</div>
			<div
				className="intro-spacer"
				style={{ backgroundImage: `url(${layer1}` }}
			></div>
		</div>
	);
};

export default Intro;
