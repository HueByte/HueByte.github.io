import { Outlet } from "react-router-dom";
import BlobBackdrop from "@/components/BlobBackdrop/BlobBackdrop";
import Nav from "@/components/Nav/Nav";

// Shared frame around every page. Footer belongs here once it exists.
export default function Layout() {
  return (
    <div className="app-shell">
      <Nav />
      <BlobBackdrop />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
