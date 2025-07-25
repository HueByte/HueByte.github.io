import React from "react";
import RepositoryCard from "./RepositoryCard";

const RepositoryList = ({ repos, getLanguageColor }) => {
	return (
		<div className="repositories">
			<div className="title">HueByte@Repositories:~ $</div>
			{repos.length > 0 ? (
				repos.map((repo) => (
					<RepositoryCard 
						key={repo.id}
						repo={repo} 
						getLanguageColor={getLanguageColor} 
					/>
				))
			) : (
				<div>No repositories found</div>
			)}
		</div>
	);
};

export default RepositoryList;