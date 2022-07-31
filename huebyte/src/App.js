import { BrowserRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import ClientRoutes from "./router/Routes";
import { Suspense } from "react";
import Loader from "./core/loader/Loader";
import "./App.scss";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const history = createBrowserHistory();
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
    <BrowserRouter history={history}>
      <Suspense fallback={<Loader />}>
        {isLoading ? <Loader /> : <ClientRoutes />}
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
