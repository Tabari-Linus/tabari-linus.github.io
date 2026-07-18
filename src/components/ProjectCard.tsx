import { Link } from "react-router-dom";
import type { ProjectMeta } from "../types";

export default function ProjectCard({ p, index }: { p: ProjectMeta; index?: number }) {
  return (
    <Link
      to={`/projects/${p.slug}`}
      className="card-lift group block bg-surface border border-line rounded-xl p-7 hover:bg-elevated"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="font-mono text-xs text-mute">
          {typeof index === "number" ? String(index + 1).padStart(2, "0") : ""}
        </span>
        <span className="font-mono text-xs text-mute group-hover:text-mint transition-colors">
          ↗
        </span>
      </div>
      <h3 className="font-display text-2xl font-semibold text-body mb-3 tracking-tight group-hover:text-mint transition-colors">
        {p.title}
      </h3>
      <p className="text-soft leading-relaxed mb-5 line-clamp-3">{p.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        {p.stack.slice(0, 4).map((t) => <span key={t} className="chip">{t}</span>)}
        {p.stack.length > 4 && <span className="chip">+{p.stack.length - 4}</span>}
      </div>
    </Link>
  );
}
