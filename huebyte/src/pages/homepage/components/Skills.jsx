import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { AiFillFire } from "react-icons/ai";

const Skills = ({}) => {
  const skills = useRef();
  let element = useRef();
  const langs = [
    { name: ".NET", icon: "devicon-dot-net-plain colored" },
    { name: "C#", icon: "devicon-csharp-plain colored" },
    { name: "HTML", icon: "devicon-html5-plain colored" },
    { name: "CSS", icon: "devicon-css3-plain colored" },
    { name: "React", icon: "devicon-react-original colored" },
    { name: "JavaScript", icon: "devicon-javascript-plain colored" },
    { name: "NodeJS", icon: "devicon-nodejs-plain colored" },
    { name: "TypeScript", icon: "devicon-typescript-plain colored" },
    {
      name: "MSSQL",
      icon: "devicon-microsoftsqlserver-plain-wordmark colored",
    },
    { name: "Python", icon: "devicon-python-plain colored" },
    { name: "Vue", icon: "devicon-vuejs-plain colored" },
    { name: "Git", icon: "devicon-git-plain colored" },
    { name: "Bash", icon: "devicon-bash-plain" },
  ];

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

    if (!isMobile()) {
      element.current = document.getElementById("skillContainer");
      observer.observe(element.current);
    }

    return () => {
      if (!isMobile()) observer.unobserve(element.current);
    };
  }, []);

  const onMouseEnter = async () => {
    for (let i in skills.current) {
      requestAnimationFrame(async () => {
        skills.current[i].classList.add("stackHover");
      });
      await sleep(15);
    }
  };

  const onMouseLeave = async () => {
    for (let i in skills.current) {
      requestAnimationFrame(async () => {
        skills.current[i].classList.remove("stackHover");
      });
      await sleep(20);
    }
  };

  const isMobile = () => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    )
      return true;

    return false;
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
          {langs.map((item, index) => (
            <div className="skill" key={index}>
              <i className={item.icon}></i>
              <div className="blocky">{item.name}</div>
              <div className="blocky-connector"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
