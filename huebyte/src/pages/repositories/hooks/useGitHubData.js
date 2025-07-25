import { useEffect, useState } from "react";

export const useGitHubData = () => {
	const [isFetching, setIsFetching] = useState(true);
	const [repos, setRepos] = useState([]);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchGitHubData = async () => {
			try {
				const [reposResponse, userResponse] = await Promise.all([
					fetch("https://api.github.com/users/huebyte/repos"),
					fetch("https://api.github.com/users/huebyte")
				]);

				const reposData = await reposResponse.json();
				const userData = await userResponse.json();

				const filteredRepos = reposData
					.filter((item) => !item.fork)
					.sort((a, b) => b.stargazers_count - a.stargazers_count);

				setRepos(filteredRepos);
				setUser(userData);
			} catch (error) {
				console.error("Error fetching GitHub data:", error);
			} finally {
				setIsFetching(false);
			}
		};

		fetchGitHubData();
	}, []);

	return { isFetching, repos, user };
};