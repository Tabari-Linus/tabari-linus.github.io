import { Link } from "react-router-dom";
import type { ProjectMeta } from "../types";

export default function ProjectCard({ p }: { p: ProjectMeta }) {
  return (
    <Link
      to={`/projects/${p.slug}`}
      className="group block p-6 rounded-xl border border-rule dark:border-rule-dk bg-paper-2/40 dark:bg-paper-2-dk/40 hover:border-brass dark:hover:border-brass transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-15px_rgba(184,122,61,0.4)]"
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="font-display text-2xl italic text-ink dark:text-ink-dk group-hover:text-brass-deep dark:group-hover:text-brass transition-colors">
          {p.title}
        </h3>
        {p.featured && <span className="eyebrow shrink-0 pt-2">Featured</span>}
      </div>
      <p className="text-ink-soft dark:text-ink-soft-dk mb-4 leading-relaxed">{p.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        {p.stack.slice(0, 5).map((t) => (
          <span key={t} className="chip">{t}</span>
        ))}
        {p.stack.length > 5 && <span className="chip">+{p.stack.length - 5}</span>}
      </div>
    </Link>
  );
}
