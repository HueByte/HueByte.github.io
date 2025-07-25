import React from "react";
import { AiFillGithub } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import { BiMailSend } from "react-icons/bi";

const SocialLinks = () => {
	return (
		<>
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
		</>
	);
};

export default SocialLinks;