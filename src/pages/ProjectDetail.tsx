import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadProject } from "../lib/content";
import Markdown from "../components/Markdown";
import KenteRule from "../components/KenteRule";

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const [state, setState] = useState<{ meta: any; body: string } | null | "missing">(null);

  useEffect(() => {
    loadProject(slug).then(setState).catch(() => setState("missing"));
  }, [slug]);

  if (state === null) return <div className="max-w-3xl mx-auto px-6 py-24 text-ink-soft">Loading…</div>;
  if (state === "missing")
    return (
      <div className="max-w-3xl mx-auto px-6 py-24">
        <p className="eyebrow mb-3">Not found</p>
        <h1 className="font-display italic text-4xl">This project isn't here.</h1>
        <Link to="/projects" className="mt-6 inline-block text-brass-deep dark:text-brass underline">← All projects</Link>
      </div>
    );

  const { meta, body } = state;
  return (
    <article className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <Link to="/projects" className="eyebrow hover:text-brass-deep dark:hover:text-brass">← Projects</Link>
      <header className="mt-6">
        <h1 className="font-display text-4xl sm:text-5xl italic text-ink dark:text-ink-dk leading-tight">
          {meta.title}
        </h1>
        {meta.summary && (
          <p className="mt-4 text-lg text-ink-soft dark:text-ink-soft-dk">{meta.summary}</p>
        )}
        <div className="mt-6 flex flex-wrap gap-1.5">
          {(meta.stack ?? []).map((t: string) => <span key={t} className="chip">{t}</span>)}
        </div>
        <div className="mt-4 flex gap-4">
          {meta.repo && (
            <a href={meta.repo.startsWith("http") ? meta.repo : `https://github.com/${meta.repo}`}
               className="text-sm text-brass-deep dark:text-brass underline">Source</a>
          )}
          {meta.demo && <a href={meta.demo} className="text-sm text-brass-deep dark:text-brass underline">Live demo</a>}
        </div>
      </header>
      <KenteRule className="my-8" />
      <Markdown>{body}</Markdown>
    </article>
  );
}
