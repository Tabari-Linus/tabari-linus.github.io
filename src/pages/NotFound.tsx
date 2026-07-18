import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display italic text-5xl mb-4">This page wandered off.</h1>
      <Link to="/" className="text-brass-deep dark:text-brass underline">Take me home →</Link>
    </div>
  );
}
