import { useEffect, useState, useMemo } from "react";
import { loadManifest } from "../lib/content";
import type { Manifest } from "../types";
import PostRow from "../components/PostRow";
import Reveal from "../components/Reveal";

export default function Blog() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  useEffect(() => { loadManifest().then(setManifest); }, []);
  const posts = manifest?.posts ?? [];
  const tags = useMemo(() => Array.from(new Set(posts.flatMap((p) => p.tags ?? []))), [posts]);
  const filtered = tag ? posts.filter((p) => p.tags?.includes(tag)) : posts;

  return (
    <div className="container-narrow py-20 sm:py-28 max-w-3xl">
      <Reveal>
        <header className="mb-12">
          <p className="eyebrow mb-5">Writing</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-body tracking-tight leading-[1.05]">
            Notes.
          </h1>
          <p className="mt-6 text-lg text-soft">
            On Software engineering, distributed systems, AI and teaching people to code.
          </p>
        </header>

        {tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setTag(null)}
              className={`chip ${!tag ? "border-mint text-mint" : ""}`}
            >
              All
            </button>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t === tag ? null : t)}
                className={`chip ${t === tag ? "border-mint text-mint" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </Reveal>

      {filtered.length === 0 ? (
        <p className="text-soft mt-8">Nothing here yet.</p>
      ) : (
        <div>{filtered.map((p) => <PostRow key={p.slug} post={p} />)}</div>
      )}
    </div>
  );
}
