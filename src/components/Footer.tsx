import { CONFIG } from "../config";

export default function Footer() {
  return (
    <footer className="border-t border-rule dark:border-rule-dk mt-24">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-wrap gap-4 items-center justify-between text-sm text-ink-soft dark:text-ink-soft-dk">
        <p>© {new Date().getFullYear()} {CONFIG.siteTitle} · {CONFIG.siteLocation}</p>
        <div className="flex gap-5">
          <a href={CONFIG.socials.github} className="hover:text-brass-deep dark:hover:text-brass">GitHub</a>
          <a href={CONFIG.socials.linkedin} className="hover:text-brass-deep dark:hover:text-brass">LinkedIn</a>
          <a href={`mailto:${CONFIG.socials.email}`} className="hover:text-brass-deep dark:hover:text-brass">Email</a>
        </div>
      </div>
    </footer>
  );
}
