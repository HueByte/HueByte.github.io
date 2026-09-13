import React from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Menu from "../core/menu/Menu";
import HomePage from "../pages/homepage/Homepage"; // as it's the main target always load it and just include it in main bundle

const Repositories = React.lazy(() =>
  import("../pages/repositories/Repositories")
);
const MyThingsSaver = React.lazy(() =>
  import("../pages/projects/MyThingsSaver/MyThingsSaver")
);
const ProjectLayout = React.lazy(() =>
  import("../core/ProjectLayout/ProjectLayout")
);

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectLayout />}>
          <Route index element={<Navigate to="/" />} />
          <Route path="MyThingsSaver" element={<MyThingsSaver />} />
        </Route>
        <Route path="repositories" element={<Repositories />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

const Main = () => {
  return (
    <>
      <Menu />
      <Outlet />
    </>
  );
};

export default ClientRoutes;
