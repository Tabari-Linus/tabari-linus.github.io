import { useEffect, useState } from "react";
import { loadManifest } from "../lib/content";
import type { Manifest } from "../types";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  useEffect(() => { loadManifest().then(setManifest); }, []);

  const projects = (manifest?.projects ?? []).sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99) || b.date.localeCompare(a.date),
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <header className="mb-12">
        <p className="eyebrow mb-3">Projects</p>
        <h1 className="font-display text-5xl sm:text-6xl italic text-ink dark:text-ink-dk">Case studies.</h1>
        <p className="mt-4 text-ink-soft dark:text-ink-soft-dk max-w-2xl">
          A selection of systems I've designed and shipped — with the architecture decisions and trade-offs behind each.
        </p>
      </header>
      {projects.length === 0 ? (
        <p className="text-ink-soft dark:text-ink-soft-dk">No projects published yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((p) => <ProjectCard key={p.slug} p={p} />)}
        </div>
      )}
    </div>
  );
}
