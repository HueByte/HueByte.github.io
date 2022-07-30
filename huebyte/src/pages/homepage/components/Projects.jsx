import React from "react";

const Projects = () => {
  return (
    <section>
      <div className="projects">
        <div className="projects-title">
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
                loading="lazy"
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
            href="https://github.com/HueByte/MyThingsSaver"
            target="_blank"
            className="item"
          >
            <div className="icon">
              <img
                src="https://raw.githubusercontent.com/HueByte/MyThingsSaver/master/backend/App/client/public/favicon.png"
                alt="huppy"
                loading="lazy"
              />
            </div>
            <div className="background"></div>
            <div className="title">
              <h2>My Things Saver</h2>
            </div>
            <div className="description">
              Modern and comfortable application with a powerful markdown
              editor.
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
                loading="lazy"
              />
            </div>
            <div className="background"></div>
            <div className="title">
              <h2>Print it 3D</h2>
            </div>
            <div className="description">
              Website I've made for university project about imaginary business.
              I'm quite happy with the result <br />
              (Desktop Only)
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
                loading="lazy"
              />
            </div>
            <div className="background"></div>
            <div className="title">
              <h2>HueBot</h2>
            </div>
            <div className="description">
              One of my first bigger projects, bot made for fun with quite a few
              random ideas
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
                loading="lazy"
              />
            </div>
            <div className="background"></div>
            <div className="title">
              <h2>Capital Cloud</h2>
            </div>
            <div className="description">
              Project I've used for discovering SignalR technology & with chat
              feature
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
