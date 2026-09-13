import "./Loader.scss";

export default function Loader() {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__ring" aria-hidden="true" />
      <span className="visually-hidden">Loading</span>
    </div>
  );
}
