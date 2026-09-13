import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
// The landing page is what almost every visitor sees first, so it ships in the main bundle.
import Home from "@/pages/home/Home";

// Everything else is lazy: each page becomes its own chunk, loaded on first visit.
const NotFound = lazy(() => import("@/pages/not-found/NotFound"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
