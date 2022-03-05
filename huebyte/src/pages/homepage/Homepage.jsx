import React from "react";
import "./Homepage.scss";
import "../../core/CoreStyles.scss";
import { AiFillGithub } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import layer1 from "../../assets/layer1.svg";
import layer2 from "../../assets/layer2.svg";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className="intro">
        <div className="avatar">
          <img src="https://github.com/huebyte.png" alt="huebyte" />
        </div>
        <div className="buttons-container">
          <div className="basic-button button">
            <FaDiscord />
            Discord
          </div>
          <div className="basic-button button">
            <AiFillGithub /> Github
          </div>
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
                  I'm Hue, as for now 20 years old Fullstack developer &&
                  Computer Science student.
                </strong>
                <br />
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
        <div className="projects">
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
          </div>
        </div>
      </section>

      <div className="div">
        <h1>something</h1>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis sit
        similique tempora consequuntur velit quisquam fugiat suscipit qui
        expedita accusamus autem temporibus, iusto voluptas illo earum, fugit
        ipsa quas sunt.
      </div>
      <div className="div">
        <h1>gallery</h1>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque,
        consectetur voluptatem vel magni possimus ullam similique harum alias
        impedit sed itaque provident repellat delectus ipsum obcaecati sit iure,
        quod accusantium.
      </div>
      <div className="footer">footer</div>
    </div>
  );
};

export default HomePage;
