import { useState } from "react";
import type { IconType } from "react-icons";
import { FaAws, FaJava } from "react-icons/fa6";
import {
  SiAngular, SiApachekafka, SiBootstrap, SiCplusplus, SiCss, SiDjango, SiDocker,
  SiFastapi, SiFigma, SiFirebase, SiGit, SiGithubactions, SiHtml5, SiJavascript,
  SiJsonwebtokens, SiJupyter, SiMui, SiNumpy, SiPandas, SiPostgresql, SiPython,
  SiReact, SiRedis, SiSpring, SiSpringboot, SiSpringsecurity, SiStreamlit,
  SiTailwindcss, SiTensorflow, SiTypescript, SiOpencv,
} from "react-icons/si";
import { TbApi, TbChartLine, TbCode, TbDatabase, TbLambda, TbPresentationAnalytics } from "react-icons/tb";
import Reveal from "../components/Reveal";
import ResumeExplorer from "../components/ResumeExplorer";
import ResumeModal from "../components/ResumeModal";
import { CV } from "../data/cv";
import { CONFIG } from "../config";

const RESUME_URL = "/cv.pdf"; // Drop your PDF at public/cv.pdf

const SKILL_ICONS: Record<string, IconType> = {
  Java: FaJava,
  Python: SiPython,
  JavaScript: SiJavascript,
  SQL: TbDatabase,
  "C++": SiCplusplus,

  "Spring Boot": SiSpringboot,
  "Spring Cloud": SiSpring,
  "Spring Security": SiSpringsecurity,
  FastAPI: SiFastapi,
  Django: SiDjango,
  REST: TbApi,
  JWT: SiJsonwebtokens,
  Kafka: SiApachekafka,

  HTML: SiHtml5,
  CSS: SiCss,
  Bootstrap: SiBootstrap,
  "Material UI": SiMui,
  React: SiReact,
  Typescript: SiTypescript,
  Angular: SiAngular,

  PostgreSQL: SiPostgresql,
  Redis: SiRedis,
  TensorFlow: SiTensorflow,
  OpenCV: SiOpencv,
  Pandas: SiPandas,
  NumPy: SiNumpy,
  "Power BI": TbPresentationAnalytics,
  Jupyter: SiJupyter,

  Docker: SiDocker,
  "AWS ECS": FaAws,
  S3: FaAws,
  Lambda: TbLambda,
  "GitHub Actions": SiGithubactions,
  Git: SiGit,
  Firebase: SiFirebase,
  PostGIS: SiPostgresql,

  "Tailwind CSS": SiTailwindcss,
  Figma: SiFigma,
  Streamlit: SiStreamlit,
  Matplotlib: TbChartLine,
};

export default function About() {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="container-narrow pt-20 pb-16 sm:pt-28 sm:pb-20">
        <p className="eyebrow mb-5">About</p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-body leading-[1.05] max-w-4xl">
          {CV.headline}
        </h1>
        <div className="mt-8 grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <div className="max-w-2xl space-y-5 text-lg text-body leading-relaxed">
            {CV.bio.map((p, i) => (
              <p key={i} className={i === 0 ? "text-body" : "text-soft"}>{p}</p>
            ))}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setResumeOpen(true)} className="btn-primary">
              View résumé ↗
            </button>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <Reveal>
        <section className="container-narrow py-20 border-t border-line">
          <div className="grid md:grid-cols-[1fr_2fr] gap-12">
            <div>
              <p className="eyebrow mb-4">Tech stack</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-body tracking-tight">
                Tools I reach for.
              </h2>
              <p className="mt-4 text-soft leading-relaxed">
                Backend-first, with enough of everything else to be dangerous. If a project needs it and it's the right tool, I'll pick it up.
              </p>
            </div>
            <div className="space-y-8">
              {CV.techStack.map((group) => (
                <div key={group.group}>
                  <p className="font-mono text-xs uppercase tracking-wider text-mint mb-3">
                    {group.group}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((t) => {
                      const Icon = SKILL_ICONS[t] ?? TbCode;
                      return (
                        <span key={t} className="chip">
                          <Icon aria-hidden size={13} />
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Work timeline (condensed) */}
      <Reveal>
        <section className="container-narrow py-20 border-t border-line">
          <div className="grid md:grid-cols-[1fr_2fr] gap-12">
            <div>
              <p className="eyebrow mb-4">Experience</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-body tracking-tight">
                Where I've done the work.
              </h2>
              <p className="mt-4 text-soft leading-relaxed">
                Explorer my resume — schools, volunteering, awards, certificates.
              </p>
            </div>
            <ol className="relative border-l border-line ml-2 space-y-8 py-1">
              {CV.work.slice(0, 5).map((w, i) => (
                <li key={i} className="pl-6 relative">
                  <span className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-mint ring-4 ring-base" />
                  <p className="font-mono text-xs text-mute">{w.period}</p>
                  <p className="font-medium text-body mt-1 text-lg">
                    {w.role} <span className="text-soft">· {w.org}</span>
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-soft list-disc pl-4">
                    {w.points.map((pt, j) => <li key={j}>{pt}</li>)}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </Reveal>

      {/* Resume Explorer */}
      <Reveal>
        <section className="container-narrow py-20 border-t border-line">
          <div className="mb-14 text-center">
            <p className="eyebrow justify-center mb-4">Résumé · deck of cards</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-body tracking-tight">
              A short story, told in cards.
            </h2>
            <p className="mt-4 text-soft max-w-xl mx-auto leading-relaxed">
              Click any card in the deck to bring it forward. For the full detail — dates, courses, everything — preview it from the résumé card.
            </p>
          </div>
          <ResumeExplorer resumeUrl={RESUME_URL} />
        </section>
      </Reveal>

      {/* Contact tail */}
      <Reveal>
        <section className="container-narrow py-24 text-center border-t border-line">
          <p className="eyebrow justify-center mb-6">Say hello</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-body tracking-tight">
            Let's talk.
          </h2>
          <a href={`mailto:${CONFIG.socials.email}`} className="btn-primary mt-8">
            {CONFIG.socials.email} →
          </a>
        </section>
      </Reveal>

      <ResumeModal resumeUrl={RESUME_URL} open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
