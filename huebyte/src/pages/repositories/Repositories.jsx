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
    "c#": "#af36ff",
    scss: "#ff36c6",
    html: "#ff5917",
    javascript: "#ffdf6b",
    typescript: "#0096ed",
    css: "#00fbff",
    null: "#ff00a2",
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
