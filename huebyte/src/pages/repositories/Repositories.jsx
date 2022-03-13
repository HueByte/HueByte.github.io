import React, { useEffect, useState } from "react";
import Footer from "../../core/Footer/Footer";
import Loader from "../../core/loader/Loader";
import "./Repositories.scss";
import topo from "../../assets/topography.svg";
import {
  RiGitBranchLine,
  RiGitRepositoryFill,
  RiUserFollowLine,
} from "react-icons/ri";
import { FaStar } from "react-icons/fa";

const Repositories = () => {
  const [repos, setRepos] = useState([{}]);
  const [user, setUser] = useState({});
  const langs = {
    "c#": "#af36ff",
    scss: "#ff36c6",
    html: "#ff5917",
    javascript: "#ffdf6b",
    css: "#00fbff",
  };

  useEffect(async () => {
    var data = await fetch("https://api.github.com/users/huebyte/repos").then(
      (response) => response.json()
    );

    var user = await fetch("https://api.github.com/users/huebyte").then(
      (response) => response.json()
    );

    setRepos(
      data.sort((a, b) => {
        return b.stargazers_count - a.stargazers_count;
      })
    );

    console.log(data);

    setUser(user);
  }, []);

  const getLanguageColor = (language) => {
    let result = langs[language?.toLowerCase()] ?? "#FFF";
    console.log(language, result);
    return result;
  };

  return (
    <div className="projects-container">
      <main>
        <div className="user">
          <div className="avatar">
            <img src="https://github.com/huebyte.png" alt="huebyte" />
          </div>
          {user ? (
            <div className="user-info">
              <div className="name">🍧 {user.login} 🍧</div>
              <div className="bio">{user.bio}</div>
              <div className="field">
                <div className="key">
                  <RiGitRepositoryFill />
                  Repositories:~ ${" "}
                </div>
                <div className="value">{user.public_repos}</div>
              </div>
              <div className="field">
                <div className="key">
                  <RiUserFollowLine />
                  Followers:~ ${" "}
                </div>
                <div className="value">{user.followers}</div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="repositories">
          <div className="title">HueByte@Repositories:~ $</div>
          {repos.length > 0 ? (
            repos?.map((data) => (
              <div
                className="repository-container"
                style={{ backgroundImage: `url(${topo})` }}
              >
                <div className="name">
                  <RiGitBranchLine /> {data.name}
                </div>
                <div className="description">{data.description}</div>
                <div className="info-container">
                  <div className="item">
                    <div className="key">Main Language</div>
                    <div
                      className="value"
                      style={{
                        color: getLanguageColor(data.language),
                        fontSize: "1.1em",
                      }}
                    >
                      {data.language ?? "null"}
                    </div>
                  </div>
                  <div className="item">
                    <div className="key">Created Date</div>
                    <div className="value">
                      {new Date(data.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="item">
                    <div className="key">
                      <FaStar />
                    </div>
                    <div className="value">{data.stargazers_count}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Loader />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Repositories;
