import { useEffect, useState } from "react";
import { loadManifest } from "../lib/content";
import type { Manifest } from "../types";
import PostRow from "../components/PostRow";

export default function Blog() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  useEffect(() => { loadManifest().then(setManifest); }, []);
  const posts = manifest?.posts ?? [];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <header className="mb-8">
        <p className="eyebrow mb-3">Writing</p>
        <h1 className="font-display text-5xl sm:text-6xl italic text-ink dark:text-ink-dk">From the desk.</h1>
        <p className="mt-4 text-ink-soft dark:text-ink-soft-dk">
          Notes on backend engineering, distributed systems, and teaching people to code.
        </p>
      </header>
      {posts.length === 0 ? (
        <p className="text-ink-soft dark:text-ink-soft-dk mt-8">First post coming soon.</p>
      ) : (
        <div>{posts.map((p) => <PostRow key={p.slug} post={p} />)}</div>
      )}
    </div>
  );
}
