import { useEffect, useState } from "react";
import { loadManifest } from "../lib/content";
import type { Manifest } from "../types";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";

export default function Projects() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  useEffect(() => { loadManifest().then(setManifest); }, []);
  const projects = (manifest?.projects ?? []).sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99) || b.date.localeCompare(a.date),
  );

  return (
    <div className="container-narrow py-20 sm:py-28">
      <Reveal>
        <header className="mb-14 max-w-3xl">
          <p className="eyebrow mb-5">Work</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-body tracking-tight leading-[1.05]">
            Projects.
          </h1>
          <p className="mt-6 text-lg text-soft">
            Systems I've designed and shipped — with the architecture decisions and trade-offs behind each.
            Every project has a written write-up because the decisions are the interesting part.
          </p>
        </header>
      </Reveal>

      {projects.length === 0 ? (
        <p className="text-soft">No projects published yet.</p>
      ) : (
        <Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((p, i) => <ProjectCard key={p.slug} p={p} index={i} />)}
          </div>
        </Reveal>
      )}
    </div>
  );
}
