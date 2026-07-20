import { useState, useMemo } from "react";
import { CV } from "../data/cv";

type CardKey =
  | "about" | "academic" | "work" | "volunteering"
  | "achievements" | "certificates" | "resume";

/**
 * Résumé Explorer — a physical card deck.
 * All cards are visible in a fanned arrangement. The clicked card animates
 * to the front. Each card holds a SUMMARY, not the full CV data — the full
 * detail lives in the downloadable PDF (on the Résumé card).
 */
export default function ResumeExplorer({ resumeUrl }: { resumeUrl: string }) {
  const CARDS = useMemo(() => buildCards(), []);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = CARDS[activeIndex];

  return (
    <div>
      {/* The deck stage */}
      <div
        className="relative mx-auto flex items-center justify-center"
        style={{ height: 460, maxWidth: 720 }}
      >
        {CARDS.map((card, i) => {
          const dist = i - activeIndex;
          const abs = Math.abs(dist);
          const isFront = dist === 0;

          // Fanned deck geometry
          const rot = dist * 5;                      // deg
          const tx = dist * 44;                      // px
          const ty = abs * 6;                        // slight drop for back cards
          const scale = Math.max(0.86, 1 - abs * 0.045);
          const zIndex = 20 - abs;
          const opacity = abs > 3 ? 0 : 1;
          const blur = abs > 0 ? `blur(${Math.min(abs * 0.4, 1.2)}px)` : "none";

          return (
            <button
              key={card.key}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Show ${card.label} card`}
              aria-current={isFront ? "true" : undefined}
              tabIndex={abs > 3 ? -1 : 0}
              className="absolute left-1/2 top-0 -translate-x-1/2 rounded-2xl border transition-all duration-500 ease-out text-left will-change-transform"
              style={{
                width: "min(90vw, 380px)",
                height: 420,
                transform: `translate(-50%, ${ty}px) translateX(${tx}px) rotate(${rot}deg) scale(${scale})`,
                zIndex,
                opacity,
                filter: blur,
                cursor: isFront ? "default" : "pointer",
                background: isFront
                  ? "linear-gradient(160deg, var(--color-bg-2), var(--color-bg-1))"
                  : "var(--color-bg-1)",
                borderColor: isFront ? "var(--color-mint)" : "var(--color-line)",
                boxShadow: isFront
                  ? "0 30px 80px -30px rgba(52,211,153,0.25), 0 8px 30px -12px rgba(0,0,0,0.5)"
                  : "0 6px 20px -8px rgba(0,0,0,0.4)",
              }}
            >
              <CardBody card={card} isFront={isFront} resumeUrl={resumeUrl} />
            </button>
          );
        })}
      </div>

      {/* Dot nav / labels — makes non-adjacent cards reachable on mobile */}
      <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
        {CARDS.map((c, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={c.key}
              onClick={() => setActiveIndex(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                isActive
                  ? "bg-mint text-black border-mint"
                  : "border-line text-mute hover:border-mint hover:text-mint"
              }`}
              aria-current={isActive ? "true" : undefined}
            >
              {String(i + 1).padStart(2, "0")} · {c.label}
            </button>
          );
        })}
      </div>

      {/* Screen-reader-only current announcement */}
      <p className="sr-only" aria-live="polite">Showing {active.label}</p>
    </div>
  );
}

/* ------------------------------ Card content ------------------------------ */

type Card = {
  key: CardKey;
  label: string;
  eyebrow: string;
  title: string;
  summary: string;
  meta?: string;
};

function buildCards(): Card[] {
  return [
    {
      key: "about",
      label: "About",
      eyebrow: "Card · 01",
      title: "Who I am, in short.",
      summary:
        "Software engineer building scalable backends in Java and Python. Teacher of 1,300+ students. Based in Kumasi, working across Ghana and beyond.",
      meta: "Based in Kumasi, Ghana",
    },
    {
      key: "academic",
      label: "Academic",
      eyebrow: "Card · 02",
      title: "Where I studied.",
      summary:
        "MPhil (2025) and BSc in Computer Science from KNUST, with additional applied data-analysis training at Blossom Academy.",
      meta: `${CV.education.length} programs`,
    },
    {
      key: "work",
      label: "Work",
      eyebrow: "Card · 03",
      title: "What I've been doing.",
      summary:
        "Backend engineer at AmaliTech Ghana. Prior stints span backend graduate training, teaching over 1,300 students, and applied research on agricultural supply chains.",
      meta: `${CV.work.length} roles`,
    },
    {
      key: "volunteering",
      label: "Volunteering",
      eyebrow: "Card · 04",
      title: "Communities I've led.",
      summary:
        "Led KNUST's Computer Science Society and the campus IoT Hub. Facilitated mobile-dev bootcamps, hackathons, and ML sessions with GDSC.",
      meta: `${CV.volunteer.length} groups`,
    },
    {
      key: "achievements",
      label: "Achievements",
      eyebrow: "Card · 05",
      title: "A few things I'm proud of.",
      summary:
        "Bronze at the International Process Optimisation Challenge (Tunisia, 2023), NGDA Academian (2024), and first place at RISE Robotics (2018) — among others.",
      meta: `${CV.achievements.length} awards`,
    },
    {
      key: "certificates",
      label: "Certificates",
      eyebrow: "Card · 06",
      title: "Continuing to sharpen.",
      summary:
        "Certifications spanning Spring Boot & Security, Machine Learning with Python, Google Data Analytics, and Django development.",
      meta: `${CV.certificates.length} certs`,
    },
    {
      key: "resume",
      label: "Résumé",
      eyebrow: "Card · 07",
      title: "The full document.",
      summary:
        "Everything above — dates, roles, courses, awards — in one PDF. Pick your action on the right.",
    },
  ];
}

function CardBody({
  card,
  isFront,
  resumeUrl,
}: {
  card: Card;
  isFront: boolean;
  resumeUrl: string;
}) {
  return (
    <div className="h-full p-7 flex flex-col">
      <div className="flex items-start justify-between">
        <p className="font-mono text-xs uppercase tracking-wider text-mint">
          {card.eyebrow}
        </p>
        {card.meta && (
          <span className="font-mono text-[0.7rem] text-mute">{card.meta}</span>
        )}
      </div>

      <h3
        className="mt-6 font-display text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-body"
      >
        {card.title}
      </h3>

      <p className="mt-4 text-soft leading-relaxed text-base flex-1">
        {card.summary}
      </p>

      {/* Résumé-only actions — the "small button aside the resume card" */}
      {card.key === "resume" && isFront && (
        <div className="mt-4 flex gap-2 flex-wrap">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-line text-body hover:border-mint hover:text-mint transition-colors text-sm font-mono"
          >
            View résumé <span aria-hidden>↗</span>
          </a>
          <a
            href={resumeUrl}
            download
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-mint text-black hover:opacity-90 transition-opacity text-sm font-mono font-semibold"
          >
            Download PDF <span aria-hidden>↓</span>
          </a>
        </div>
      )}

      <div className="mt-auto pt-4 flex items-center justify-between text-xs">
        <span className="font-mono text-mute">
          {isFront ? "◆ front of deck" : "click to bring forward"}
        </span>
      </div>
    </div>
  );
}
