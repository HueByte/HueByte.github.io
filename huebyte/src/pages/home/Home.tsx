import { lazy, Suspense, useCallback, useLayoutEffect, useState } from "react";
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

  // The scene is rebuilt from scratch every time this page mounts (it is disposed on leave, so
  // other pages never pay for it). Until its first frame is up the canvas stays transparent
  // over the CSS sky, then fades in, so coming back from another page never pops.
  const [sceneReady, setSceneReady] = useState(false);
  const onSceneReady = useCallback(() => {
    setSceneReady(true);
    dismissBootScreen();
  }, []);

  return (
    <section className="home">
      <Suspense fallback={null}>
        <DreamScene
          className={"home__scene" + (sceneReady ? " home__scene--ready" : "")}
          onReady={onSceneReady}
        />
      </Suspense>
      <p className="home__wip">Work in progress</p>
      <div className="home__hero">
        <h1 className="visually-hidden">{siteConfig.name}</h1>
        <AvatarOrbit />
      </div>
    </section>
  );
}
