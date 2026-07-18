import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadProject } from "../lib/content";
import Markdown from "../components/Markdown";

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const [state, setState] = useState<{ meta: any; body: string } | null | "missing">(null);

  useEffect(() => {
    loadProject(slug).then(setState).catch(() => setState("missing"));
  }, [slug]);

  if (state === null) return <div className="container-narrow py-24 text-soft">Loading…</div>;
  if (state === "missing")
    return (
      <div className="container-narrow py-24">
        <p className="eyebrow mb-4">404</p>
        <h1 className="font-display text-4xl font-bold text-body">This project isn't here.</h1>
        <Link to="/projects" className="mt-6 inline-block font-mono text-mint underline">← All projects</Link>
      </div>
    );

  const { meta, body } = state;
  const date = meta.date ? new Date(meta.date) : null;

  return (
    <article className="container-narrow py-16 sm:py-24 max-w-4xl">
      <Link to="/projects" className="font-mono text-sm text-mute hover:text-mint">← Work</Link>

      <header className="mt-8 pb-10 border-b border-line">
        <p className="eyebrow mb-5">Case study</p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-body tracking-tight leading-[1.05]">
          {meta.title}
        </h1>
        {meta.summary && <p className="mt-6 text-xl text-soft leading-relaxed">{meta.summary}</p>}

        <div className="mt-6 flex flex-wrap gap-1.5">
          {(meta.stack ?? []).map((t: string) => <span key={t} className="chip">{t}</span>)}
        </div>

        <div className="mt-6 flex gap-5">
          {meta.repo && (
            <a
              href={meta.repo.startsWith("http") ? meta.repo : `https://github.com/${meta.repo}`}
              className="font-mono text-sm text-mint hover:underline flex items-center gap-1"
              target="_blank" rel="noreferrer"
            >
              Source ↗
            </a>
          )}
          {meta.demo && (
            <a
              href={meta.demo}
              className="font-mono text-sm text-mint hover:underline flex items-center gap-1"
              target="_blank" rel="noreferrer"
            >
              Live demo ↗
            </a>
          )}
          {date && (
            <span className="font-mono text-sm text-mute">
              {date.toLocaleDateString("en-US", { year: "numeric", month: "short" })}
            </span>
          )}
        </div>
      </header>

      <div className="mt-12">
        <Markdown>{body}</Markdown>
      </div>
    </article>
  );
}
