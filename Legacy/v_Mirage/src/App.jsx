import { BrowserRouter } from "react-router-dom";
import ClientRoutes from "./router/Routes";
import { Suspense, useState, useEffect } from "react";
import Loader from "./core/loader/Loader";
import "./App.scss";

// The site is served under a sub-path (see `base` in vite.config.js), so the
// router has to be told about the same prefix. All routes stay written as "/".
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const preloadedImages = ["https://github.com/huebyte.png"];

    cacheImages(preloadedImages);
  }, []);

  const cacheImages = async (preloadSources) => {
    const promises = await preloadSources.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();

        img.src = src;
        img.onload = resolve();
        img.onerror = reject();
      });
    });

    await Promise.all(promises);
    setIsLoading(false);
  };
  return (
    <BrowserRouter basename={basename}>
      <Suspense fallback={<Loader />}>
        {isLoading ? <Loader /> : <ClientRoutes />}
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
