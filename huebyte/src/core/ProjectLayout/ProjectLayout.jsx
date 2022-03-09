import React from "react";
import { Outlet } from "react-router-dom";
import "./ProjectLayout.scss";
import Footer from "../Footer/Footer";
import Menu from "../menu/Menu";

const ProjectLayout = () => {
  return (
    <>
      <div className="main-container">
        <Menu />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProjectLayout;
