import React from "react";
import { Outlet } from "react-router-dom";
import "./ProjectLayout.scss";
import Footer from "../Footer/Footer";

const ProjectLayout = () => {
  return (
    <>
      <div className="main-container">
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProjectLayout;
