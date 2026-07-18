import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="container-narrow py-32 text-center">
      <p className="eyebrow justify-center mb-4">404</p>
      <h1 className="font-display text-6xl font-bold text-body mb-4 tracking-tight">Not found.</h1>
      <p className="text-soft mb-8">This page wandered off.</p>
      <Link to="/" className="btn-primary">← Back home</Link>
    </div>
  );
}
