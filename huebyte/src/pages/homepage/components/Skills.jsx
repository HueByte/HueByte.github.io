import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { AiFillFire } from "react-icons/ai";

const Skills = ({}) => {
  const skills = useRef();
  let element = document.getElementById("skillContainer");

  const observer = new IntersectionObserver(async (entry) => {
    if (entry[0].isIntersecting) {
      await sleep(700);
      await onMouseEnter();
      await onMouseLeave();
    }
  });

  useEffect(() => {
    skills.current = Array.prototype.slice.call(
      document.getElementsByClassName("skill")
    );

    let element = document.getElementById("skillContainer");
    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  const onMouseEnter = async () => {
    for (let i in skills.current) {
      skills.current[i].classList.add("stackHover");
      await sleep(15);
    }
  };

  const onMouseLeave = async () => {
    for (let i in skills.current) {
      skills.current[i].classList.remove("stackHover");
      await sleep(20);
    }
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  return (
    <section id="skill-container" style={{ position: "relative" }}>
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
            <i className="devicon-dot-net-plain colored"></i>
            <div className="blocky">.NET</div>
            <div className="blocky-connector"></div>
          </div>
          <div className={`skill`}>
            <i className="devicon-csharp-plain colored"></i>
            <div className="blocky">C#</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i className="devicon-html5-plain colored"></i>
            <div className="blocky">HTML</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i className="devicon-css3-plain colored"></i>
            <div className="blocky">CSS</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i className="devicon-react-original colored"></i>
            <div className="blocky">React</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i className="devicon-javascript-plain colored"></i>
            <div className="blocky">JavaScript</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i className="devicon-nodejs-plain colored"></i>
            <div className="blocky">NodeJS</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i className="devicon-typescript-plain colored"></i>
            <div className="blocky">TypeScript</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i className="devicon-microsoftsqlserver-plain-wordmark colored"></i>
            <div className="blocky">MSSQL</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i className="devicon-python-plain colored"></i>
            <div className="blocky">Python</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i className="devicon-vuejs-plain colored"></i>
            <div className="blocky">Vue</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i className="devicon-git-plain colored"></i>
            <div className="blocky">Git</div>
            <div className="blocky-connector"></div>
          </div>
          <div className="skill">
            <i className="devicon-bash-plain"></i>
            <div className="blocky">Bash</div>
            <div className="blocky-connector"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
