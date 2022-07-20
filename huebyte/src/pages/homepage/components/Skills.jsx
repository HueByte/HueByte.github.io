import React from "react";
import { useState } from "react";

const Skills = ({}) => {
  return (
    <section className="swamp">
      <div className="skills-container">
        <div className="skills-title">Stack</div>
        <div className="line"></div>
        <div className="skills-content">
          <div className="skill">
            <i class="devicon-dotnetcore-plain colored"></i>
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
        </div>
      </div>
    </section>
  );
};

export default Skills;
