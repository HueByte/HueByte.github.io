import { BrowserRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import ClientRoutes from "./router/Routes";
import { Suspense } from "react";
import Loader from "./core/loader/Loader";
import "./App.scss";

function App() {
  const history = createBrowserHistory();
  return (
    <BrowserRouter history={history}>
      <Suspense fallback={<Loader />}>
        <ClientRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
