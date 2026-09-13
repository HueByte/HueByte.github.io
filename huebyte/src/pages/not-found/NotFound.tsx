import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="not-found">
      <h1>404</h1>
      <p>There is nothing here.</p>
      <Link to="/">Back home</Link>
    </section>
  );
}
