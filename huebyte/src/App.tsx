import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import Loader from "@/components/Loader/Loader";
import AppRoutes from "@/router/routes";

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}
