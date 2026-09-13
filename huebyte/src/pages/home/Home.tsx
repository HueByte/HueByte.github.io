import { lazy, Suspense } from "react";
import { siteConfig } from "@/lib/site";
import AvatarOrbit from "./components/AvatarOrbit";
import "./Home.scss";

// three.js is the bulk of the bundle; the avatar and links paint first and the field fades in behind them.
const DreamScene = lazy(() => import("./components/DreamScene"));

export default function Home() {
  return (
    <section className="home">
      <Suspense fallback={null}>
        <DreamScene className="home__scene" />
      </Suspense>
      <div className="home__hero">
        <h1 className="visually-hidden">{siteConfig.name}</h1>
        <AvatarOrbit />
      </div>
    </section>
  );
}
