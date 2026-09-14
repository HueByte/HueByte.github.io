import { lazy, Suspense, useLayoutEffect } from "react";
import { claimBootScreen, dismissBootScreen } from "@/lib/boot";
import { siteConfig } from "@/lib/site";
import AvatarOrbit from "./components/AvatarOrbit";
import "./Home.scss";

// three.js is the bulk of the bundle; the boot screen covers the page until the field has
// drawn its first frame, so the two appear together rather than one popping in after the other.
const DreamScene = lazy(() => import("./components/DreamScene"));

export default function Home() {
  // Before the first paint, so the failsafe knows this page will dismiss the screen itself.
  useLayoutEffect(claimBootScreen, []);

  return (
    <section className="home">
      <Suspense fallback={null}>
        <DreamScene className="home__scene" onReady={dismissBootScreen} />
      </Suspense>
      <p className="home__wip">Work in progress</p>
      <div className="home__hero">
        <h1 className="visually-hidden">{siteConfig.name}</h1>
        <AvatarOrbit />
      </div>
    </section>
  );
}
