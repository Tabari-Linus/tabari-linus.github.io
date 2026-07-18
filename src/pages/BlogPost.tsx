import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadPost, estimateReadingMinutes } from "../lib/content";
import Markdown from "../components/Markdown";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const [state, setState] = useState<{ meta: any; body: string } | null | "missing">(null);

  useEffect(() => {
    loadPost(slug).then(setState).catch(() => setState("missing"));
  }, [slug]);

  if (state === null) return <div className="container-narrow py-24 text-soft">Loading…</div>;
  if (state === "missing")
    return (
      <div className="container-narrow py-24">
        <p className="eyebrow mb-4">404</p>
        <h1 className="font-display text-4xl font-bold text-body">This post isn't here.</h1>
        <Link to="/blog" className="mt-6 inline-block font-mono text-mint underline">← All posts</Link>
      </div>
    );

  const { meta, body } = state;
  const readMin = estimateReadingMinutes(body);
  const date = meta.date ? new Date(meta.date) : null;

  return (
    <article className="container-narrow py-16 sm:py-24 max-w-3xl">
      <Link to="/blog" className="font-mono text-sm text-mute hover:text-mint">← Writing</Link>

      <header className="mt-8 pb-10 border-b border-line">
        <p className="eyebrow mb-5">
          {date && date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          {date && " · "}
          {readMin} min read
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-body tracking-tight leading-[1.05]">
          {meta.title}
        </h1>
        {meta.tags && meta.tags.length > 0 && (
          <div className="mt-6 flex gap-1.5">
            {meta.tags.map((t: string) => <span key={t} className="chip">{t}</span>)}
          </div>
        )}
      </header>

      <div className="mt-12">
        <Markdown>{body}</Markdown>
      </div>
    </article>
  );
}
