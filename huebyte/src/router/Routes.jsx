import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "../pages/homepage/Homepage";

const MyThingsSaver = React.lazy(() =>
  import("../pages/projects/MyThingsSaver")
);
const ProjectLayout = React.lazy(() =>
  import("../core/ProjectLayout/ProjectLayout")
);

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="projects" element={<ProjectLayout />}>
        <Route index element={<Navigate to="/" />} />
        <Route path="MyThingsSaver" element={<MyThingsSaver />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ClientRoutes;
