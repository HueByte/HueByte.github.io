import React from "react";
import Footer from "../../core/Footer/Footer";
import Loader from "../../core/loader/Loader";
import "./Repositories.scss";
import bg from "../../assets/sprinkle.svg";
import { useGitHubData } from "./hooks/useGitHubData";
import UserProfile from "./components/UserProfile";
import RepositoryList from "./components/RepositoryList";

const Repositories = () => {
  const { isFetching, repos, user } = useGitHubData();
  
  const langs = {
    "c#": "#239120",
    "c++": "#f34b7d",
    "c": "#555555",
    css: "#1572B6",
    dart: "#0175C2",
    dockerfile: "#384d54",
    go: "#00ADD8",
    html: "#e34c26",
    java: "#ED8B00",
    javascript: "#f1e05a",
    json: "#292929",
    kotlin: "#A97BFF",
    lua: "#000080",
    markdown: "#083fa1",
    php: "#4F5D95",
    python: "#3572A5",
    ruby: "#701516",
    rust: "#dea584",
    scala: "#c22d40",
    scss: "#c6538c",
    shell: "#89e051",
    swift: "#ffac45",
    typescript: "#2b7489",
    vue: "#2c3e50",
    yaml: "#cb171e",
    null: "#858585",
  };

  const getLanguageColor = (language) => {
    language = language ?? "null";
    return langs[language?.toLowerCase()] ?? "#FFF";
  };

  return (
    <div
      className="repositories-container"
      style={{ backgroundImage: `url(${bg}` }}
    >
      <main>
        {isFetching ? (
          <Loader local={true} />
        ) : (
          <>
            <UserProfile user={user} />
            <RepositoryList repos={repos} getLanguageColor={getLanguageColor} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Repositories;
