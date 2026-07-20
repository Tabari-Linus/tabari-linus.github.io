import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CONFIG } from "../config";
import { loadManifest } from "../lib/content";
import { fetchGithubStats, type GithubStats } from "../lib/github-public";
import type { Manifest } from "../types";
import ProjectCard from "../components/ProjectCard";
import PostRow from "../components/PostRow";
import Reveal from "../components/Reveal";
import Typewriter from "../components/Typewriter";

const SKILLS = [
  "Java", "Spring Boot", "Spring Cloud", "Kafka", "PostgreSQL", "PostGIS",
  "Docker", "AWS ECS", "REST APIs", "JWT", "Spring Security",
  "Python", "FastAPI", "Django", "TensorFlow", "OpenCV",
  "Git", "GitHub Actions", "Kubernetes", "Redis", "WebSocket",
];

const ROLES = ["Software Engineer", "Backend Developer", "Tutor"];

export default function Home() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [stats, setStats] = useState<GithubStats | null>(null);

  useEffect(() => {
    loadManifest().then(setManifest);
    fetchGithubStats().then(setStats);
  }, []);

  const featured = (manifest?.projects ?? [])
    .filter((p) => p.featured)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .slice(0, 3);
  const posts = (manifest?.posts ?? []).slice(0, 3);

  return (
    <>
      {/* HERO — full viewport, animated glow, terminal-inspired */}
      <section className="relative overflow-hidden">
        {/* Grid noise pattern */}
        <div className="absolute inset-0 grid-noise pointer-events-none opacity-30" />
        {/* Gradient orb */}
        <div
          className="hero-glow"
          style={{ background: "var(--color-mint)", width: 600, height: 600, top: -200, right: -150 }}
        />

        <div className="container-narrow relative min-h-[85vh] flex flex-col justify-center pt-20 pb-16">
          <p className="eyebrow mb-6">
            <span className="font-mono">$ whoami</span>
          </p>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-body leading-[1.02]">
            Linus <span className="text-mint">Tabari</span>.
          </h1>

          <p className="mt-8 text-xl sm:text-2xl text-soft font-mono">
            <Typewriter words={ROLES} className="text-mint" />
            <span className="text-mute">  ·  {CONFIG.siteLocation}</span>
          </p>

          <p className="mt-8 text-lg sm:text-xl text-body max-w-2xl leading-relaxed">
            I build the quiet infrastructure behind scalable products —
            Spring Boot services, python FastAPI, Django, that stay standing when parts of them fall over.
            <span className="text-soft"> Before that, I taught 1,300+ students to write their first algorithms and start their journeys into programming.</span>
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/projects" className="btn-primary">
              See my work
              <span aria-hidden>→</span>
            </Link>
            <a href={`mailto:${CONFIG.socials.email}`} className="btn-secondary">
              Get in touch
            </a>
          </div>

          {/* Quick stats bar */}
          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-8">
            <Stat label="Students taught" value="1,300+" />
            <Stat label="Users served" value="10K+" />
            <Stat label="Public repos" value={stats ? String(stats.publicRepos) : "—"} />
            <Stat label="Years shipping" value="4+" />
          </div>
        </div>
      </section>

      {/* SKILLS MARQUEE */}
      <Reveal className="border-y border-line py-6 overflow-hidden bg-surface/40">
        <div className="marquee-track">
          {[...SKILLS, ...SKILLS].map((s, i) => (
            <span
              key={i}
              className="font-mono text-sm text-soft mx-6 whitespace-nowrap flex items-center gap-6"
            >
              {s}
              <span className="text-mint">◆</span>
            </span>
          ))}
        </div>
      </Reveal>

      {/* ABOUT */}
      <Reveal>
        <section className="container-narrow py-24">
          <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
            <div>
              <p className="eyebrow mb-4">About</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-body tracking-tight">
                The short version.
              </h2>
            </div>
            <div className="text-body text-lg space-y-5 leading-relaxed">
              <p>
                I'm a Software engineer constantly learning a build products for clients and self. I finished an MPhil in Computer
                Science at KNUST and spent a couple of years teaching over 1,300 undergraduates the shape of a well-written
                algorithm.
              </p>
              <p className="text-soft">
                I care about systems that stay standing when parts of them fall over — clear service boundaries,
                honest failure modes, and the small architectural decisions that let a team ship on a Tuesday afternoon
                without holding their breath.
              </p>
              <p className="text-soft">
                Outside of work: leading the KNUST IoT Hub, mentoring at hackathons, and occasionally writing about what I'm learning.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* FEATURED WORK */}
      <Reveal>
        <section className="container-narrow py-24">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-4">Selected work</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-body tracking-tight">
                Systems I've built.
              </h2>
            </div>
            <Link
              to="/projects"
              className="font-mono text-sm text-mint hover:underline"
            >
              All projects →
            </Link>
          </div>
          {featured.length === 0 ? (
            <p className="text-soft">
              Case studies are being written — everything lives on{" "}
              <a href={CONFIG.socials.github} className="text-mint underline">GitHub</a> meanwhile.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((p, i) => <ProjectCard key={p.slug} p={p} index={i} />)}
            </div>
          )}
        </section>
      </Reveal>

      {/* WRITING */}
      {posts.length > 0 && (
        <Reveal>
          <section className="container-narrow py-24 border-t border-line">
            <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
              <div>
                <p className="eyebrow mb-4">Notes</p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-body tracking-tight">
                  Recent writing.
                </h2>
              </div>
              <Link to="/blog" className="font-mono text-sm text-mint hover:underline">
                All posts →
              </Link>
            </div>
            <div>{posts.map((p) => <PostRow key={p.slug} post={p} />)}</div>
          </section>
        </Reveal>
      )}

      {/* CTA */}
      <Reveal>
        <section className="container-narrow py-32 text-center border-t border-line">
          <p className="eyebrow mb-6 justify-center">Say hi</p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-body tracking-tight max-w-2xl mx-auto">
            Have a backend problem worth solving?
          </h2>
          <p className="mt-6 text-soft text-lg max-w-lg mx-auto">
            I'm open to backend engineering roles and thoughtful fintech problems.
          </p>
          <a
            href={`mailto:${CONFIG.socials.email}`}
            className="btn-primary mt-10 text-lg"
          >
            {CONFIG.socials.email}
            <span aria-hidden>→</span>
          </a>
        </section>
      </Reveal>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-3xl sm:text-4xl font-bold text-body tracking-tight">{value}</p>
      <p className="font-mono text-xs uppercase tracking-wider text-mute mt-1">{label}</p>
    </div>
  );
}
