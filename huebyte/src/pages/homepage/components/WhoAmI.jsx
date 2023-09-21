import React from "react";
import { IoSparkles } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi";

const WhoAmI = () => {
	const getAge = () => {
		var bd = new Date("2001-10-08T00:00:01");
		var ageDiff = Date.now() - bd;

		return Math.abs(new Date(ageDiff).getUTCFullYear() - 1970);
	};

	return (
		<section className="maron">
			<div className="content-container">
				<div
					className="sparkle"
					style={{ top: "20%", left: "20%", color: "#262853" }}
				>
					<HiSparkles />
				</div>
				<div
					className="sparkle"
					style={{
						top: "70%",
						right: "20%",
						color: "#051929",
						animationDelay: "200ms",
						animationDuration: "3.5s",
					}}
				>
					<HiSparkles />
				</div>
				<div
					className="sparkle"
					style={{
						top: "10%",
						right: "15%",
						color: "#171718",
						animationDelay: "500ms",
						animationDuration: "4s",
					}}
				>
					<IoSparkles />
				</div>
				<div
					className="sparkle"
					style={{
						top: "50%",
						right: "10%",
						color: "#171718",
						animationDelay: "500ms",
						animationDuration: "5s",
					}}
				>
					<IoSparkles />
				</div>
				<div
					className="sparkle"
					style={{
						bottom: "10%",
						left: "20%",
						animationDelay: "50ms",
						animationDuration: "5s",
					}}
				>
					<IoSparkles />
				</div>
				<div className="whoami">
					<div className="title">
						<h1>whoami</h1>
					</div>
					<div className="text">
						<p>
							<strong>
								Hello! On the internet I appear under the name{" "}
								<span className="k-word">Hue </span>or
								<span className="k-word"> HueByte</span>, as for now
								<span className="k-word"> {getAge()}</span> years old
								<span className="k-word">
									{" "}
									Advanced Software Engineer
								</span> &&{" "}
								<span className="k-word">Computer Science Student</span>.
							</strong>
							<br />
						</p>
						<p>
							I'm passionate about coding and though I consider{" "}
							<span className="k-word">.NET</span> as my main technology I'm
							always open for learning and mastering new ones!
							<br />
							My future goal is to work with Artificial Intelligence
							development.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default WhoAmI;
