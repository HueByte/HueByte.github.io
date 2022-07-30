import { BrowserRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import ClientRoutes from "./router/Routes";
import { Suspense } from "react";
import Loader from "./core/loader/Loader";
import "./App.scss";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

function App() {
  const history = createBrowserHistory();
  const [isLoading, setIsLoading] = useState(true);
  const cursor = useRef();

  useEffect(() => {
    const preloadedImages = ["https://github.com/huebyte.png"];

    cacheImages(preloadedImages);

    cursor.current = document.querySelector(".cursor");

    document.addEventListener("mousemove", cursorMove);

    document.addEventListener("click", cursorClick);

    return () => {
      document.removeEventListener("mousemove", cursorMove);
      document.removeEventListener("click", cursorClick);
    };
  }, []);

  const cursorMove = (event) => {
    cursor.current.setAttribute(
      "style",
      "top: " + (event.pageY - 10) + "px; left: " + (event.pageX - 10) + "px;"
    );
  };

  const cursorClick = () => {
    cursor.current.classList.add("expand");
    setTimeout(() => {
      cursor.current.classList.remove("expand");
    }, 500);
  };

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
        <div class="cursor"></div>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
