import { useEffect, useState } from "react";

const CACHE_KEY = "github-data-cache";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const readCache = () => {
	try {
		const raw = sessionStorage.getItem(CACHE_KEY);
		if (!raw) return null;

		const cached = JSON.parse(raw);
		if (Date.now() - cached.timestamp > CACHE_TTL) return null;

		return cached;
	} catch {
		return null;
	}
};

const writeCache = (repos, user) => {
	try {
		sessionStorage.setItem(
			CACHE_KEY,
			JSON.stringify({ repos, user, timestamp: Date.now() })
		);
	} catch {
		// storage full or unavailable - not critical
	}
};

export const useGitHubData = () => {
	const [isFetching, setIsFetching] = useState(true);
	const [repos, setRepos] = useState([]);
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const cached = readCache();
		if (cached) {
			setRepos(cached.repos);
			setUser(cached.user);
			setIsFetching(false);
			return;
		}

		const fetchGitHubData = async () => {
			try {
				const [reposResponse, userResponse] = await Promise.all([
					fetch("https://api.github.com/users/huebyte/repos?per_page=100"),
					fetch("https://api.github.com/users/huebyte"),
				]);

				if (!reposResponse.ok || !userResponse.ok) {
					throw new Error(
						`GitHub API responded with ${reposResponse.status}/${userResponse.status}`
					);
				}

				const reposData = await reposResponse.json();
				const userData = await userResponse.json();

				if (!Array.isArray(reposData)) {
					throw new Error("Unexpected GitHub API response");
				}

				const filteredRepos = reposData
					.filter((item) => !item.fork)
					.sort((a, b) => b.stargazers_count - a.stargazers_count);

				setRepos(filteredRepos);
				setUser(userData);
				writeCache(filteredRepos, userData);
			} catch (error) {
				console.error("Error fetching GitHub data:", error);
				setError(error);
			} finally {
				setIsFetching(false);
			}
		};

		fetchGitHubData();
	}, []);

	return { isFetching, repos, user, error };
};
