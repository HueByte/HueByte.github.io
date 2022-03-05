import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/homepage/Homepage";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default ClientRoutes;
