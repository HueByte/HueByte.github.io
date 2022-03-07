import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const Skills = ({}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = new IntersectionObserver((entries) => {
    entries[0].isIntersecting
      ? setIsIntersecting(true)
      : setIsIntersecting(false);
  });

  useEffect(() => {
    let element = document.querySelector(".skills");
    observer.observe(element);

    return () => observer.unobserve(element);
  }, []);

  return (
    <section className="swamp">
      <div className="skills-container">
        <div className="title">
          <h1>Skills</h1>
        </div>
        <div className="skills">
          <div className="item">
            <div className="text">.NET</div>
            <div className="bar">
              <div
                className={`progress${
                  isIntersecting ? " enter-animation" : ""
                }`}
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
          <div className="item">
            <div className="text">ASP.NET</div>
            <div className="bar">
              <div
                className={`progress${
                  isIntersecting ? " enter-animation" : ""
                }`}
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
          <div className="item">
            <div className="text">HTML & CSS</div>
            <div className="bar">
              <div
                className={`progress${
                  isIntersecting ? " enter-animation" : ""
                }`}
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
          <div className="item">
            <div className="text">React</div>
            <div className="bar">
              <div
                className={`progress${
                  isIntersecting ? " enter-animation" : ""
                }`}
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>
          <div className="item">
            <div className="text">JavaScript</div>
            <div className="bar">
              <div
                className={`progress${
                  isIntersecting ? " enter-animation" : ""
                }`}
                style={{ width: "80%" }}
              ></div>
            </div>
          </div>
          <div className="item">
            <div className="text">NodeJS</div>
            <div className="bar">
              <div
                className={`progress${
                  isIntersecting ? " enter-animation" : ""
                }`}
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
          <div className="item">
            <div className="text">TypeScript</div>
            <div className="bar">
              <div
                className={`progress${
                  isIntersecting ? " enter-animation" : ""
                }`}
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
          <div className="item">
            <div className="text">Blazor</div>
            <div className="bar">
              <div
                className={`progress${
                  isIntersecting ? " enter-animation" : ""
                }`}
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
          <div className="item">
            <div className="text">Vue</div>
            <div className="bar">
              <div
                className={`progress${
                  isIntersecting ? " enter-animation" : ""
                }`}
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
          <div className="item">
            <div className="text">SQL</div>
            <div className="bar">
              <div
                className={`progress${
                  isIntersecting ? " enter-animation" : ""
                }`}
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
