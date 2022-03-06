import React from "react";
import "./Homepage.scss";
import "../../core/CoreStyles.scss";
import { AiFillGithub } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import layer1 from "../../assets/layer1.svg";
import layer2 from "../../assets/layer2.svg";
import layer3 from "../../assets/layer3.svg";
import layer4 from "../../assets/layer4.svg";
// import KUTE from "kute.js";
// import { useEffect } from "react";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className="intro">
        <div className="avatar">
          <img src="https://github.com/huebyte.png" alt="huebyte" />
        </div>
        <div className="buttons-container">
          <a
            href="https://discordapp.com/users/215556401467097088"
            target="_blank"
            className="basic-button button"
          >
            <FaDiscord />
            Discord
          </a>
          <a
            href="https://github.com/HueByte"
            target="_blank"
            className="basic-button button"
          >
            <AiFillGithub /> Github
          </a>
        </div>
        <div
          className="spacer-intro"
          style={{ backgroundImage: `url(${layer1}` }}
        ></div>
      </div>

      <section className="maron">
        <div className="content-container">
          <div className="whoami">
            <div className="title">
              <h1>whoami</h1>
            </div>
            <div className="text">
              <p>
                <strong>
                  Hello! On the internet I appear under the name Hue, as for now
                  20 years old professional Fullstack developer && Computer
                  Science student.
                </strong>
                <br />
              </p>
              <p>
                I'm passionate about coding and though I consider .NET as my
                main technology I'm always open for learning and mastering new
                ones!
                <br />
                My future goal is to work with Artificial Intelligence research.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div
        className="spacer-ver1"
        style={{ backgroundImage: `url(${layer2}` }}
      ></div>

      <section className="swamp">
        <div className="skills-container">
          <div className="title">
            <h1>Skills</h1>
          </div>
          <div className="skills">
            <div className="item">
              <div className="text">.NET</div>
              <div className="bar">
                <div className="progress" style={{ width: "100%" }}></div>
              </div>
            </div>
            <div className="item">
              <div className="text">ASP.NET</div>
              <div className="bar">
                <div className="progress" style={{ width: "100%" }}></div>
              </div>
            </div>
            <div className="item">
              <div className="text">HTML & CSS</div>
              <div className="bar">
                <div className="progress" style={{ width: "90%" }}></div>
              </div>
            </div>
            <div className="item">
              <div className="text">React</div>
              <div className="bar">
                <div className="progress" style={{ width: "85%" }}></div>
              </div>
            </div>
            <div className="item">
              <div className="text">JavaScript</div>
              <div className="bar">
                <div className="progress" style={{ width: "80%" }}></div>
              </div>
            </div>
            <div className="item">
              <div className="text">NodeJS</div>
              <div className="bar">
                <div className="progress" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div className="item">
              <div className="text">TypeScript</div>
              <div className="bar">
                <div className="progress" style={{ width: "70%" }}></div>
              </div>
            </div>
            <div className="item">
              <div className="text">Blazor</div>
              <div className="bar">
                <div className="progress" style={{ width: "70%" }}></div>
              </div>
            </div>
            <div className="item">
              <div className="text">SQL</div>
              <div className="bar">
                <div className="progress" style={{ width: "70%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className="spacer-ver1"
        style={{ backgroundImage: `url(${layer3}` }}
      ></div>

      <section className="swamp">
        <div className="projects">
          <div className="title">
            <h1>Personal Projects</h1>
          </div>
          <div className="projects-container">
            <a
              href="https://github.com/HueByte/Huppy"
              target="_blank"
              className="item"
            >
              <div className="icon">
                <img
                  src="https://i.pinimg.com/564x/ff/c1/59/ffc1594020481a2e64f285f6b4d7ea06.jpg"
                  alt="huppy"
                />
              </div>
              <div className="background"></div>
              <div className="title">
                <h2>Huppy</h2>
              </div>
              <div className="description">
                Discord bot where I'm using my experience from ASP.NET to reach
                its full potential and performance.
              </div>
            </a>
            <a
              href="https://huebyte.github.io/MyThingsSaver/"
              target="_blank"
              className="item"
            >
              <div className="icon">
                <img
                  src="https://raw.githubusercontent.com/HueByte/MyThingsSaver/master/backend/App/client/public/favicon.png"
                  alt="huppy"
                />
              </div>
              <div className="background"></div>
              <div className="title">
                <h2>My Things Saver</h2>
              </div>
              <div className="description">
                Application for saving your things! Modern and comfortable UI
                with a powerful markdown editor. Also an easily configurable and
                self-hostable app on windows, Linux and MacOS
              </div>
            </a>
            <a
              href="https://huebyte.github.io/PrintIt3D/"
              target="_blank"
              className="item"
            >
              <div className="icon">
                <img
                  src="https://huebyte.github.io/PrintIt3D/logo.png"
                  alt="huppy"
                />
              </div>
              <div className="background"></div>
              <div className="title">
                <h2>Print it 3D</h2>
              </div>
              <div className="description">
                Website I've made for university project about imaginary
                business. I'm quite happy with the result (Desktop Only)
              </div>
            </a>
            <a
              href="https://github.com/HueByte/HueBot-Public"
              target="_blank"
              className="item"
            >
              <div className="icon">
                <img
                  src="https://camo.githubusercontent.com/9ccc5063ed331c7a045ed05b7c37d9764228bb5ec6744571ad5bc8c469c7d356/68747470733a2f2f692e70696e696d672e636f6d2f6f726967696e616c732f30632f36372f35612f30633637356138653130363134373864326237623231623333303039333434342e676966"
                  alt="huppy"
                />
              </div>
              <div className="background"></div>
              <div className="title">
                <h2>HueBot</h2>
              </div>
              <div className="description">
                One of my first bigger projects, bot made for fun with quite a
                few random ideas
              </div>
            </a>
            <a
              href="https://github.com/HueByte/CapitalCloud"
              target="_blank"
              className="item"
            >
              <div className="icon">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Circle-icons-cloud.svg/2048px-Circle-icons-cloud.svg.png"
                  alt="huppy"
                />
              </div>
              <div className="background"></div>
              <div className="title">
                <h2>Capital Cloud</h2>
              </div>
              <div className="description">
                Project I've used for discovering SignalR technology &
                implemented chat feature
              </div>
            </a>
          </div>
        </div>
      </section>

      <div className="footer">
        <div
          className="spacer-ver2"
          style={{ backgroundImage: `url(${layer4}` }}
        ></div>
        <div className="content"> © Copyright 2022 by HueByte</div>
      </div>
    </div>
  );
};

export default HomePage;
