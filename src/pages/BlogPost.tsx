import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadPost, estimateReadingMinutes } from "../lib/content";
import Markdown from "../components/Markdown";
import KenteRule from "../components/KenteRule";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const [state, setState] = useState<{ meta: any; body: string } | null | "missing">(null);

  useEffect(() => {
    loadPost(slug).then(setState).catch(() => setState("missing"));
  }, [slug]);

  if (state === null) return <div className="max-w-3xl mx-auto px-6 py-24 text-ink-soft">Loading…</div>;
  if (state === "missing")
    return (
      <div className="max-w-3xl mx-auto px-6 py-24">
        <p className="eyebrow mb-3">Not found</p>
        <h1 className="font-display italic text-4xl">This post isn't here.</h1>
        <Link to="/blog" className="mt-6 inline-block text-brass-deep dark:text-brass underline">← All posts</Link>
      </div>
    );

  const { meta, body } = state;
  const readMin = estimateReadingMinutes(body);
  const date = meta.date ? new Date(meta.date) : null;

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <Link to="/blog" className="eyebrow hover:text-brass-deep dark:hover:text-brass">← Writing</Link>
      <header className="mt-6">
        <p className="eyebrow">
          {date && <time>{date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>}
          {date && " · "}
          {readMin} min read
        </p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl italic text-ink dark:text-ink-dk leading-tight">
          {meta.title}
        </h1>
        {meta.tags && meta.tags.length > 0 && (
          <div className="mt-4 flex gap-1.5">
            {meta.tags.map((t: string) => <span key={t} className="chip">{t}</span>)}
          </div>
        )}
      </header>
      <KenteRule className="my-8" />
      <Markdown>{body}</Markdown>
    </article>
  );
}
