import React from "react";
import { RiGitBranchLine } from "react-icons/ri";
import { FaStar } from "react-icons/fa";

const RepositoryCard = ({ repo, getLanguageColor }) => {
	return (
		<a
			href={repo.html_url}
			target="_blank"
			className="repository-container"
			rel="noreferrer"
		>
			<div className="name">
				<RiGitBranchLine /> {repo.name}
			</div>
			<div className="description">{repo.description}</div>
			<div className="info-container">
				<div className="item">
					<div className="key">Main Language</div>
					<div
						className="value"
						style={{
							color: getLanguageColor(repo.language),
							fontSize: "1.1em",
						}}
					>
						{repo.language ?? "null"}
					</div>
				</div>
				<div className="item">
					<div className="key">Created Date</div>
					<div className="value">
						{new Date(repo.created_at).toLocaleDateString()}
					</div>
				</div>
				<div className="item">
					<div className="key">
						<FaStar />
					</div>
					<div className="value">{repo.stargazers_count}</div>
				</div>
			</div>
		</a>
	);
};

export default RepositoryCard;