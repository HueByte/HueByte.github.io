import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
// The landing page is what almost every visitor sees first, so it ships in the main bundle.
import Home from "@/pages/home/Home";

// Everything else is lazy: each page becomes its own chunk, loaded on first visit.
const About = lazy(() => import("@/pages/about/About"));
const Articles = lazy(() => import("@/pages/articles/Articles"));
const Article = lazy(() => import("@/pages/articles/Article"));
const NotFound = lazy(() => import("@/pages/not-found/NotFound"));

export default function AppRoutes() {
  return (
    <Layout>
      {(location) => (
        <Routes location={location}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/:slug" element={<Article />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </Layout>
  );
}
