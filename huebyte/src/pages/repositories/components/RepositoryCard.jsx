import React from "react";
import { RiGitBranchLine } from "react-icons/ri";
import { FaStar, FaEye } from "react-icons/fa";
import { BiGitRepoForked } from "react-icons/bi";

const RepositoryCard = ({ repo, getLanguageColor }) => {
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now - date);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays < 30) {
			return `${diffDays} days ago`;
		} else if (diffDays < 365) {
			return `${Math.floor(diffDays / 30)} months ago`;
		} else {
			return `${Math.floor(diffDays / 365)} years ago`;
		}
	};

	return (
		<a
			href={repo.html_url}
			target="_blank"
			className="repository-container"
			rel="noreferrer"
		>
			<div className="card-header">
				<div className="name">
					<RiGitBranchLine className="repo-icon" /> 
					<span>{repo.name}</span>
					{repo.private && <span className="private-badge">Private</span>}
				</div>
				{repo.language && (
					<div className="language-badge">
						<span 
							className="language-dot"
							style={{ backgroundColor: getLanguageColor(repo.language) }}
						></span>
						{repo.language}
					</div>
				)}
			</div>
			
			<div className="description">
				{repo.description || "No description available"}
			</div>
			
			<div className="card-footer">
				<div className="stats">
					<div className="stat-item">
						<FaStar className="stat-icon" />
						<span>{repo.stargazers_count}</span>
					</div>
					<div className="stat-item">
						<BiGitRepoForked className="stat-icon" />
						<span>{repo.forks_count}</span>
					</div>
					<div className="stat-item">
						<FaEye className="stat-icon" />
						<span>{repo.watchers_count}</span>
					</div>
				</div>
				<div className="updated-date">
					Updated {formatDate(repo.updated_at)}
				</div>
			</div>
		</a>
	);
};

export default RepositoryCard;