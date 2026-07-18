import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CONFIG } from "../config";
import { loadManifest } from "../lib/content";
import type { Manifest } from "../types";
import KenteRule from "../components/KenteRule";
import ProjectCard from "../components/ProjectCard";
import PostRow from "../components/PostRow";

export default function Home() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  useEffect(() => { loadManifest().then(setManifest); }, []);

  const featured = (manifest?.projects ?? [])
    .filter((p) => p.featured)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .slice(0, 3);
  const posts = (manifest?.posts ?? []).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero — first-person, warm; kente warp accent on the left */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-20 grid grid-cols-[3px_1fr] gap-6 sm:gap-10">
        <div className="kente-warp" aria-hidden />
        <div>
          <p className="eyebrow mb-4">Backend engineer · Kumasi, Ghana</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight text-ink dark:text-ink-dk">
            Hello — I'm <span className="italic text-brass-deep dark:text-brass">Linus</span>.
          </h1>
          <p className="mt-6 text-lg sm:text-xl leading-relaxed text-ink-soft dark:text-ink-soft-dk max-w-2xl">
            {CONFIG.tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center px-5 py-2.5 rounded-md bg-ink text-paper dark:bg-brass dark:text-ink font-medium hover:opacity-90 transition-opacity"
            >
              See my work →
            </Link>
            <a
              href={`mailto:${CONFIG.socials.email}`}
              className="inline-flex items-center px-5 py-2.5 rounded-md border border-rule dark:border-rule-dk hover:border-brass dark:hover:border-brass transition-colors"
            >
              Say hello
            </a>
          </div>
        </div>
      </section>

      <KenteRule />

      {/* About — brief, personable */}
      <section className="py-12 grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16">
        <div>
          <p className="eyebrow mb-3">About</p>
          <h2 className="font-display italic text-3xl text-ink dark:text-ink-dk">A short version.</h2>
        </div>
        <div className="text-ink-soft dark:text-ink-soft-dk space-y-4 leading-relaxed max-w-xl">
          <p>
            I'm a backend engineer at <span className="text-ink dark:text-ink-dk">AmaliTech Ghana</span>, where I build
            Spring Boot services for financial applications. Before that I finished an MPhil in Computer Science at
            KNUST and spent a couple of years teaching over 1,300 undergraduates the shape of a well-written algorithm.
          </p>
          <p>
            I care about systems that stay standing when parts of them fall over — clear service boundaries, honest
            failure modes, and the small architectural decisions that let a team ship on a Tuesday afternoon without
            holding their breath.
          </p>
          <p>
            Outside work: leading the KNUST IoT Hub chapter, mentoring students on their first hackathon, and
            occasionally writing about what I'm learning.
          </p>
        </div>
      </section>

      <KenteRule />

      {/* Featured work */}
      <section className="py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow mb-3">Selected work</p>
            <h2 className="font-display italic text-3xl text-ink dark:text-ink-dk">Things I've built.</h2>
          </div>
          <Link to="/projects" className="text-sm text-brass-deep dark:text-brass hover:underline">
            All projects →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-ink-soft dark:text-ink-soft-dk">
            Case studies are being written — everything lives on{" "}
            <a href={CONFIG.socials.github} className="text-brass-deep dark:text-brass underline">GitHub</a> in the meantime.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((p) => <ProjectCard key={p.slug} p={p} />)}
          </div>
        )}
      </section>

      {posts.length > 0 && (
        <>
          <KenteRule />
          <section className="py-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="eyebrow mb-3">From the desk</p>
                <h2 className="font-display italic text-3xl text-ink dark:text-ink-dk">Recent writing.</h2>
              </div>
              <Link to="/blog" className="text-sm text-brass-deep dark:text-brass hover:underline">
                All posts →
              </Link>
            </div>
            <div>
              {posts.map((p) => <PostRow key={p.slug} post={p} />)}
            </div>
          </section>
        </>
      )}

      <KenteRule />

      <section className="py-16 text-center">
        <p className="eyebrow mb-4">Get in touch</p>
        <h2 className="font-display italic text-4xl sm:text-5xl text-ink dark:text-ink-dk">
          Want to build something together?
        </h2>
        <p className="mt-4 text-ink-soft dark:text-ink-soft-dk max-w-lg mx-auto">
          I'm open to backend roles and thoughtful fintech problems. Fastest way to reach me is email.
        </p>
        <a
          href={`mailto:${CONFIG.socials.email}`}
          className="mt-6 inline-block font-mono text-brass-deep dark:text-brass underline underline-offset-4"
        >
          {CONFIG.socials.email}
        </a>
      </section>
    </div>
  );
}
