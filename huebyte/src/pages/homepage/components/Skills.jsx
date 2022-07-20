import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AiFillFire } from "react-icons/ai";

const Skills = ({}) => {
  const [isPerformingAnimation, setIsPerformingAnimation] = useState(false);
  const skills = useRef();

  useEffect(() => {
    skills.current = Array.prototype.slice.call(
      document.getElementsByClassName("skill")
    );
  }, []);

  const onMouseEnter = async () => {
    setIsPerformingAnimation(true);
    for (let i in skills.current) {
      skills.current[i].classList.add("stackHover");
      await sleep(15);
    }
    setIsPerformingAnimation(false);
  };

  const onMouseLeave = async () => {
    for (let i in skills.current) {
      skills.current[i].classList.remove("stackHover");
      await sleep(20);
    }
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  return (
    <section className="swamp">
      <div className="skills-container" id="skillContainer">
        <div
          className="skills-title"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <AiFillFire /> Stack
        </div>
        <div className="line"></div>
        <div className="skills-content">
          <div className={`skill`}>
            <i class="devicon-dot-net-plain colored"></i>
            <div className="blocky">.NET</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i class="devicon-html5-plain colored"></i>
            <div className="blocky">HTML</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i class="devicon-css3-plain colored"></i>
            <div className="blocky">CSS</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i class="devicon-react-original colored"></i>
            <div className="blocky">React</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i class="devicon-javascript-plain colored"></i>
            <div className="blocky">JavaScript</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i class="devicon-nodejs-plain colored"></i>
            <div className="blocky">NodeJS</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i class="devicon-typescript-plain colored"></i>
            <div className="blocky">TypeScript</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i class="devicon-microsoftsqlserver-plain-wordmark colored"></i>
            <div className="blocky">MSSQL</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i class="devicon-python-plain colored"></i>
            <div className="blocky">Python</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i class="devicon-vuejs-plain colored"></i>
            <div className="blocky">Vue</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i class="devicon-git-plain colored"></i>
            <div className="blocky">Git</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i class="devicon-bash-plain"></i>
            <div className="blocky">Bash</div>
            <div className="blocky-connector"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
