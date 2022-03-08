import React from "react";
import { Outlet } from "react-router-dom";

const ProjectLayout = () => {
  return (
    <div className="div">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ProjectLayout;
