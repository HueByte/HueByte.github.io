import React from "react";
import jiroImg from "../../../assets/jiro.png";
import huebotImg from "../../../assets/huebot.png";
import huppyImg from "../../../assets/huppy.png";
import amiquin from "../../../assets/amiquin.png";
import consoleImagerImg from "../../../assets/hue2.png";
import "./Projects.scss";
import waver from "../../../assets/waver.svg";

const Projects = () => {
	const projects = [
		{
			name: "Jiro",
			description:
				"Virtual Assistant powered by ChatGPT and custom code integration!",
			image: jiroImg,
			link: "https://github.com/HueByte/Jiro",
			alt: "Jiro Image",
		},
		{
			name: "Jiro.Shared",
			description:
				"Common types, models, and utilities used across the Jiro ecosystem, including JiroCloud and Jiro instances.",
			image: jiroImg,
			link: "https://github.com/HueByte/Jiro.Shared",
			alt: "Jiro.Shared Image",
		},
		{
			name: "Jiro.Libs",
			description:
				"Robust, extensible system for building plugins and runtime commands for the Jiro platform with modular development.",
			image: jiroImg,
			link: "https://github.com/HueByte/Jiro.Libs",
			alt: "Jiro.Libs Image",
		},
		{
			name: "Amiquin",
			description:
				"Modular and extensible discord bot designed to streamline development with configurability, logging, and dependency injection.",
			image: amiquin,
			link: "https://github.com/HueByte/Amiquin",
			alt: "Amiquin Image",
		},
		{
			name: "Huppy",
			description:
				"Discord bot with complex microservice architecture, based on ASP.NET core style.",
			image: huppyImg,
			link: "https://github.com/HueByte/Huppy",
			alt: "Huppy Image",
		},
		{
			name: "My Things Saver",
			description:
				"Modern and comfortable application with a powerful markdown editor",
			image:
				"https://raw.githubusercontent.com/HueByte/MyThingsSaver/master/backend/App/client/public/favicon.png",
			link: "https://github.com/HueByte/MyThingsSaver",
			alt: "My Things Saver Image",
		},
		{
			name: "ConsoleImager",
			description:
				"A small project that allows you to display any image from internet in your console!",
			image: consoleImagerImg,
			link: "https://github.com/HueByte/ConsoleImager",
			alt: "ConsoleImager Image",
		},

		{
			name: "HueBot",
			description:
				"One of my first bigger projects, bot made for fun with quite a few random ideas",
			image: huebotImg,
			link: "https://github.com/HueByte/HueBot-Public",

			alt: "HueBot Image",
		},
		{
			name: "Capital Cloud",
			description:
				"Project I've used for discovering SignalR technology & with chat feature",
			image:
				"https://png.pngtree.com/template/20190717/ourlarge/pngtree-cloud-computing-and-storage-vector-logo--technology-design-template-image_230027.jpg",
			link: "https://github.com/HueByte/CapitalCloud",
			alt: "Capital Cloud Image",
		},
		{
			name: "Print it 3D",
			description:
				"Website I've made for university project about imaginary business.",
			image: "https://huebyte.github.io/PrintIt3D/logo.png",
			link: "https://huebyte.github.io/PrintIt3D/",
			alt: "Print it 3D Image",
		},
	];

	return (
		<section>
			<div className="projects">
				<div className="projects-title">
					<h1>Personal Projects</h1>
				</div>
				<div className="projects-container">
					{projects.map((project) => (
						<a
							href={project.link}
							target="_blank"
							className="project-card"
							rel="noreferrer"
						>
							<div className="top-magic plus-bg">
								<div className="icon-container">
									<div className="icon">
										<img src={project.image} alt={project.alt} loading="lazy" />
									</div>
								</div>
							</div>
							<div className="title">{project.name}</div>
							<div className="content">
								<div className="text">{project.description}</div>
								<div
									className="content-wave"
									style={{ backgroundImage: `url(${waver}` }}
								></div>
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
};

export default Projects;
